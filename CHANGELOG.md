# CHANGELOG.md — Rediseño aquaproc.com (24-10-2026)

## Antes / después

| Métrica | Antes | Después |
|---|---|---|
| Peso primera carga (desktop) | **1.043 KB** HTML (760 KB br) + 9 fuentes Google | **178 KB** en total (HTML 33 KB, CSS 29 KB, JS 11 KB, 4 AVIF 46 KB, 2 fuentes 59 KB) |
| Imágenes | 6 PNG en base64 dentro del HTML | AVIF + WebP + PNG de respaldo, `width/height`, `loading="lazy"`, `preload` del LCP |
| LCP (local) | ~716 ms | **~140 ms** |
| CLS | no medido | **0,000** |
| Peticiones a terceros al cargar | Google Fonts (1 CSS + 9 woff2) | Solo Plausible (1 script, sin cookies) |
| Páginas legales | 0 (enlace a `#`) | 3: aviso legal, privacidad, cookies (+ redirects cortos) |
| RGPD en formulario | Checkbox sin texto ni enlace | Texto completo (responsable, finalidad, derechos) + enlace real |
| Antispam | Nada | Honeypot + tiempo mínimo de 3 s |
| Validación | `required` nativo | Por campo, al salir del campo; mensajes de error; `aria-invalid`; estados enviando / éxito / error con `aria-live` |
| Datos estructurados | 0 | LocalBusiness + 5 Product + FAQPage |
| Open Graph / Twitter | No | Sí, con imagen 1200×630 |
| robots / sitemap / favicon / manifest | 404 | Sí |
| Calculadora de ahorro | Botón que iba al formulario | Real: garrafas/semana × precio × 52, actualización en vivo, supuestos visibles |
| Prueba social | Nada | Bloque con 3 tarjetas + fila de logos (placeholders marcados) |
| FAQ "zonas" | No respondía | "Toda España, principalmente Cataluña" |
| CTAs | 6 etiquetas distintas | Una: "Solicita tu demo gratuita" (secundarios "… ›") |
| Objetivos táctiles < 44 px | 20 | 0 (salvo enlaces dentro de texto corrido) |
| `prefers-reduced-motion` | No | Sí: sin animaciones; reveal instantáneo |
| Modo oscuro | Bloqueado (`light only`) | Automático según el sistema |
| Teclado | Menú sin `aria-expanded`, FAQ no accesible | Skip-link, menú con Esc y foco, FAQ con `details/summary` nativos |
| Tipografía | Fraunces + Outfit (9 pesos) | SF Pro en Apple / Inter en el resto, 2 pesos |
| Estética | Degradados, sombras verdes, glass card, badges flotantes | Blanco / #f5f5f7 / negro, acento #0071e3, píldoras, producto centrado a pantalla completa |

## Estructura del proyecto

```
index.html            landing
css/style.css         sistema de diseño
js/main.js            nav, reveal, calculadora, formulario, analítica
img/                  *.avif / *.webp / *.png, favicons, og.jpg
fonts/                Inter 400/600 (woff, subconjunto latino, licencia OFL)
legal/                aviso-legal.html, privacidad.html, cookies.html
netlify.toml          cabeceras (CSP, caché), redirects /privacidad → /legal/…
robots.txt sitemap.xml site.webmanifest favicon.ico
AUDIT.md PLAN.md CHANGELOG.md
```

Despliegue: en Netlify, "Add new site → Import from Git" apuntando a este repo, sin comando de build, directorio de publicación `.`. O arrastrar la carpeta en Netlify Drop.

## Segunda pasada de auditoría (sobre el resultado)

Comprobado en Chromium a 1280 px y 375 px, modo claro y oscuro, con y sin reduced-motion:

- Sin overflow horizontal en ninguna anchura.
- Todas las imágenes cargan (AVIF) y tienen `alt` (vacío en las decorativas).
- Todos los campos con `<label>`; jerarquía H1 → H2 → H3 correcta; landmarks header/nav/main/footer; primer Tab = "Saltar al contenido".
- Contrastes: texto secundario 5,07:1 sobre blanco y 4,66:1 sobre gris; blanco sobre azul 4,70:1; en negro 5,8:1 / 6,96:1. Todo AA.
- Validación del formulario: envío vacío marca 4 errores y enfoca el primero; teléfono "12" y CP "080" dan error; email opcional.
- Calculadora: 6 garrafas × 2,50 € → 780 € / 7.800 € / 312 garrafas.
- Menú móvil: abre, cierra con Esc y devuelve el foco al botón.
- JSON-LD válido. Consola sin errores propios (el único aviso es el bloqueo del script de Plausible en el entorno de pruebas).

### Puntos débiles que quedan (autocrítica)

1. **Resolución de las fotos de producto**: las originales son de 149–568 px de ancho; a pantalla completa (hasta 520 px de alto en desktop) se ven ligeramente blandas, sobre todo Hydriva Mini. Es la mejora visual más importante pendiente y depende de ti (ver abajo).
2. **El logo en modo oscuro se vuelve blanco por filtro CSS** (silueta). Funciona, pero un SVG del logo con variante clara sería lo correcto.
3. **La calculadora no resta el coste de filtros ni del equipo** porque no tengo los datos; muestra el gasto en garrafas, no el ahorro neto. El texto lo dice claramente, pero el titular "Calcula lo que te cuestan las garrafas" es menos potente que "Calcula tu ahorro".
4. **"Instalación profesional incluida en la visita"** y **"Certificación CE"** se han conservado de la web anterior sin verificar; si no son ciertas para todos los equipos, hay que retirarlas.
5. **El rango 1–2 / 2–5 personas** en la comparativa es una deducción a partir de los caudales y del texto anterior ("hogares de 2 a 5 personas"); el de Hydriva Mini (1–2) lo he inferido yo. Confírmalo.
6. **Plausible** está referenciado pero no habrá datos hasta que crees el sitio en plausible.io (9 €/mes) o decidas GA4. Con GA4 hay que añadir banner de cookies y actualizar la política.
7. **CSP en `netlify.toml`**: es estricta (`script-src 'self' plausible.io`). Si añades cualquier script externo (GA4, chat, Meta Pixel), hay que ampliarla o la página lo bloqueará en silencio.
8. **Formspree**: sigue siendo el destino. Gratis permite 50 envíos/mes; si lo superas, o cambia a Make (1 constante en `js/main.js`) o pasa a un plan de pago. El email que recibe los envíos es el que esté configurado en tu cuenta de Formspree, no lo controlo desde aquí.
9. No he podido ejecutar axe-core (sin acceso a npm en este entorno); las comprobaciones de accesibilidad son manuales y por script propio.
10. La web anterior tenía un bloque "¿No sabes cuál elegir? Hablar con un asesor". Lo he fundido en el CTA único; si notas que faltan leads de gente indecisa, se puede recuperar como enlace secundario bajo la comparativa.

## Pendiente de tu parte

| Qué | Dónde | Marcado como |
|---|---|---|
| Razón social, NIF, dirección, email | `index.html` (footer y texto RGPD), `legal/*.html` | `[RELLENAR …]` en amarillo |
| Localidad del titular (fuero) | `legal/aviso-legal.html` | `[RELLENAR localidad del titular]` |
| 3 testimonios reales con nombre y localidad (y permiso) | `index.html` sección `#opiniones` | `[TESTIMONIO PENDIENTE]` |
| Logo de Aquaresa (con su autorización) | `index.html` sección `#opiniones` | `[LOGO AQUARESA]` |
| Precio o política de precios | `index.html` FAQ "¿Cuánto cuesta un equipo?" y comentario `TODO` en la calculadora | `[RELLENAR]` / `TODO` |
| Confirmar "instalación incluida", "certificación CE", "mantenimiento" | `index.html` comparativa y FAQ | — |
| Capacidad de filtro de Hydriva Pro | `index.html` comparativa ("Consultar") | — |
| Fotos de producto a 1.200 px o más, fondo transparente | `img/` (sustituir y regenerar AVIF/WebP: `python3` + Pillow, o cualquier conversor) | — |
| Cuenta de Plausible (o GA4) | `index.html` `<head>` | comentario |
| Destino del formulario si no es Formspree | `js/main.js` `FORM_ENDPOINT` + `netlify.toml` CSP + `legal/privacidad.html` | comentario |
| Subir el repo a GitHub y conectarlo a Netlify (o Netlify Drop) | — | — |
| Fijar `lastmod` en `sitemap.xml` cuando publiques | `sitemap.xml` | — |
