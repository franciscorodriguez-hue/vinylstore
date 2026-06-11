# VinylStore — Catálogo Web de Vinilos

## Cómo usar

Esta es una web estática — no necesitás servidor ni instalación. Funciona en cualquier navegador.

### Archivos incluidos
- `index.html` — la aplicación completa
- `catalog.json` — el catálogo de 1577 discos

### Para publicar en internet (opciones gratuitas)

**Opción 1: GitHub Pages (recomendado)**
1. Creá una cuenta en github.com
2. Creá un repositorio nuevo (público)
3. Subí los dos archivos (index.html + catalog.json)
4. Andá a Settings → Pages → Source: main branch
5. Tu URL será: `https://[tu-usuario].github.io/[nombre-repo]`

**Opción 2: Netlify (más fácil)**
1. Andá a netlify.com
2. Arrastrá la carpeta entera al área "Drop your files here"
3. En segundos tenés una URL pública

**Opción 3: Vercel**
1. Andá a vercel.com
2. Importá desde GitHub o subí los archivos
3. Deploy automático

---

## Configuración inicial (después de publicar)

1. Abrí la web en el navegador
2. Hacé clic en **⚙ Admin**
3. Contraseña por defecto: **admin123**
4. Andá a la pestaña **Configuración**
5. Ingresá el número de WhatsApp (formato: `5491123456789`)
6. Cambiá el nombre de la tienda si querés
7. Cambiá la contraseña de admin
8. Guardá

---

## Para el distribuidor

Una vez configurado el WhatsApp, los clientes pueden:
1. Navegar el catálogo con filtros por sello y búsqueda
2. Ver info de cada disco y agregar al carrito
3. Ajustar cantidades
4. Al finalizar → se abre WhatsApp con el pedido detallado listo para enviar

El distribuidor recibe el pedido por WhatsApp y responde como prefiera.

---

## Panel de administración

- **Catálogo**: editar precio, stock, artista, título de cualquier disco; agregar discos nuevos; eliminar
- **Pedidos**: ver historial de pedidos generados (guardados localmente en el navegador del cliente)
- **Configuración**: cambiar WhatsApp, nombre de tienda, contraseña

### Notas técnicas
- Los cambios del admin se guardan en el `localStorage` del navegador donde se usa el admin
- Si el distribuidor cambia de dispositivo, los cambios no se sincronizan automáticamente
- Para una solución con base de datos real, se necesita un backend (Firebase, Supabase, etc.)

---

## Agregar fotos a los discos

Actualmente los discos sin foto muestran un ícono de vinilo animado.

Para agregar fotos, en el panel Admin → Catálogo, editá el campo URL imagen de cada disco con la URL pública de la portada (podés buscarlas en Discogs, MusicBrainz, etc.).

---

¿Consultas? Configurá y compartí el link con tus clientes.
