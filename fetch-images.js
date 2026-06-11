const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, 'catalog.json');
const DELAY_MS = 1000;
const SAVE_EVERY = 50;
const USER_AGENT = 'VinylStore/1.0 (contact@vinylstore.com)';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCoverImage(artist, title) {
  // Step 1: search MusicBrainz for the release MBID
  const query = `artist:${artist} release:${title}`;
  const mbUrl = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=1`;

  const mbRes = await fetch(mbUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!mbRes.ok) {
    if (mbRes.status === 503 || mbRes.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(`MB HTTP ${mbRes.status}`);
  }

  const mbData = await mbRes.json();
  const mbid = mbData.releases?.[0]?.id;
  if (!mbid) return null;

  // Step 2: fetch front cover from Cover Art Archive (redirects to image)
  const caaUrl = `https://coverartarchive.org/release/${mbid}/front-250`;
  const caaRes = await fetch(caaUrl, { headers: { 'User-Agent': USER_AGENT } });

  // 404 = no artwork for this release
  if (caaRes.status === 404) return null;
  if (!caaRes.ok) throw new Error(`CAA HTTP ${caaRes.status}`);

  // The final URL after redirect is the actual image URL
  return caaRes.url;
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  const total = catalog.length;
  const pending = catalog.filter(d => !d.img);

  console.log(`Total: ${total} | Ya con imagen: ${total - pending.length} | Pendientes: ${pending.length}`);

  if (pending.length === 0) {
    console.log('Todos los discos ya tienen imagen.');
    return;
  }

  let fetched = 0;
  let sinceLastSave = 0;

  for (let i = 0; i < catalog.length; i++) {
    const disc = catalog[i];
    if (disc.img) continue;

    const processed = total - pending.length + fetched + 1;
    const label = `${processed}/${total} — ${disc.artist} - ${disc.title}`;

    let img = null;
    try {
      img = await fetchCoverImage(disc.artist, disc.title);
      if (img) disc.img = img;
    } catch (err) {
      if (err.message === 'RATE_LIMIT') {
        console.log('\nRate limit alcanzado, esperando 10s...');
        await sleep(10000);
        i--; // retry
        continue;
      }
      // other errors: skip silently
    }

    console.log(img ? `✓ ${label} → imagen encontrada` : `✗ ${label} → sin imagen`);

    fetched++;
    sinceLastSave++;

    if (sinceLastSave >= SAVE_EVERY) {
      fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
      sinceLastSave = 0;
    }

    await sleep(DELAY_MS);
  }

  // final save
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));

  const withImage = catalog.filter(d => d.img).length;
  console.log(`\n\nListo. Discos con imagen: ${withImage}/${total}`);
}

main().catch(err => {
  console.error('\nError fatal:', err.message);
  process.exit(1);
});
