# AUDIT.md — aquaproc.com (estado previo al rediseño)

**Fecha:** 24-10-2026 · **Método:** lectura del DOM/CSS/JS en vivo, medidas de rendimiento en navegador, prueba a 375 px y 1280 px, comprobación de rutas (`/robots.txt`, `/sitemap.xml`, `/favicon.ico`, legales).

## Stack detectado

| Elemento | Valor |
|---|---|
| Hosting | **Netlify** (cabecera `server: Netlify`, 404 de Netlify) |
| Código | **Un único `index.html`** escrito a mano: CSS inline (22,6 KB), JS inline (2,9 KB), sin framework ni build |
| Peso | **1.043 KB** de HTML (760 KB comprimido con Brotli). El 95 % son **6 imágenes PNG en base64** incrustadas (logo ×2, 5 productos) |
| Fuentes | Google Fonts: **Fraunces** (4 pesos) + **Outfit** (5 pesos) = 9 ficheros de fuente, render-blocking |
| Formulario | **Formspree** (`xbdvjgle`), envío por `fetch` |
| Analítica | Ninguna |
| Repo | No hay repositorio accesible; se trabaja desde el sitio publicado |

---

## CRÍTICO

| # | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| C1 | **"Política de privacidad" enlaza a `#`** y no existe ninguna página legal (`/privacidad` → 404). Se pide consentimiento sobre un texto que no existe. | checkbox `#privacidad` → `<a href="#">` | Incumplimiento RGPD/LSSI; el usuario desconfía justo en el momento de enviar |
| C2 | **Sin aviso legal ni política de cookies**; sin identificación del titular (NIF, dirección, email) en ningún sitio | footer solo tiene "© 2026 Aquaproc · Distribuidor oficial Aquaresa" | Obligatorio por LSSI art. 10; resta credibilidad a una empresa que entra en tu casa |
| C3 | **Formulario sin texto informativo RGPD** (responsable, finalidad, derechos), sin honeypot, sin validación en cliente más allá de `required` | campos: Nombre, Teléfono, Población/CP, Email, checkbox | Spam en Formspree; sin base legal clara del tratamiento |
| C4 | **1 MB de HTML por las imágenes en base64**: el navegador tiene que descargar y parsear todo el documento antes de pintar nada, y `loading="lazy"` no sirve de nada en data-URIs | `transferSize` 760 KB, `decodedBodySize` 1.043 KB | LCP/FCP y Core Web Vitals en móvil 4G; penaliza SEO y rebote |

## ALTO

| # | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| A1 | **Cero prueba social**: ni testimonios, ni reseñas, ni logos, ni "X instalaciones" | — | Es el bloque que más conversión aporta en servicios a domicilio |
| A2 | **Sin precio ni rango orientativo** en ninguno de los 5 productos | — | El visitante no sabe si está en 300 € o 3.000 €; parte se va sin preguntar |
| A3 | **"Calcular mi ahorro" lleva al formulario**, no calcula nada | `<a href="#demo">Calcular mi ahorro</a>` | Promesa rota; pierde el gancho de la sección de ahorro |
| A4 | **Cifras de ahorro sin fuente ni supuesto**: "≈ 850 €", "−800 €", "Hasta 800 €" (tres cifras distintas para lo mismo) | hero-stats, compare, save-highlight | Inconsistencia resta credibilidad |
| A5 | **FAQ "¿En qué zonas trabajáis?" no responde** ("escríbenos y te confirmamos") | faq-item 5 | Es la pregunta #1 antes de pedir una visita a domicilio |
| A6 | **Sin SEO técnico**: sin Open Graph/Twitter, sin canonical, sin JSON-LD (LocalBusiness/Product/FAQPage), sin `robots.txt`, sin `sitemap.xml`, sin favicon | solo `<title>` y `description` | Compartir en WhatsApp muestra tarjeta vacía; invisible para rich results |
| A7 | **`color-scheme: light only`** + `section{background:#fff}` como "blindaje" | `:root{color-scheme:light only}` | Síntoma de que el diseño no controla sus colores; impide un modo oscuro bien hecho |
| A8 | **Jerarquía de CTAs difusa**: 11 enlaces a `#demo` con 6 etiquetas distintas ("Demo gratuita", "Solicitar mi demo gratis", "Pedir información", "Solicitar demo", "Hablar con un asesor", "Calcular mi ahorro", "Confirmar y solicitar visita") + botón WhatsApp flotante + WhatsApp + teléfono en la misma sección | DOM | Diluye la acción principal; el usuario no sabe cuál es "la" acción |
| A9 | **Estado del formulario insuficiente**: solo texto bajo el botón, no se anuncia a lectores de pantalla (sin `aria-live`), sin errores por campo, y "Enviando..." no bloquea el doble envío de forma fiable | JS inline | Dudas en el momento clave; errores silenciosos |

## MEDIO

| # | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| M1 | **9 ficheros de fuente de Google** (2 familias × 4-5 pesos) bloqueando render; sin `preload`; sin `font-display` controlado localmente | `<link>` a fonts.googleapis | ~100-300 ms de FOUT/FOIT; dependencia de terceros (RGPD: IP a Google) |
| M2 | **Dirección visual dispersa**: 4 degradados radiales/lineales distintos, verde brillante `#3fe089` como acento + azul + navy, sombras de color verde, "glass card", badges flotando con animación infinita | CSS hero, `.floaty`, `.badge-pill`, `wapulse` | Estética "plantilla SaaS 2023"; no transmite premium |
| M3 | **Animaciones sin `prefers-reduced-motion`**: `float1` infinito, `wapulse` infinito, reveal con `translateY` | CSS | Accesibilidad (vestibular) y CPU en móvil |
| M4 | **Contraste**: texto muted `#5b7088` sobre `#f6fafc`/`#fbfdfe` ≈ 4,6:1 (justo); botón primario `#091d34` sobre `#3fe089` OK; `.compare-row .old` `#aab8c6` sobre blanco = **2,3:1** (falla AA) | cálculo | Legibilidad |
| M5 | **Tamaños táctiles < 44 px** en móvil: filtros de producto (39 px), enlaces del footer (19 px), botón menú (40×42) | medición a 375 px | Toques fallidos en móvil |
| M6 | **Nav móvil**: `max-height` animado (jank), sin `aria-expanded`, sin cierre con Esc, sin bloqueo de foco; el CTA de nav desaparece en el menú plegado | CSS/JS | Accesibilidad por teclado |
| M7 | **Filtros de producto** (`Todos / Ósmosis / Ozono / Profesional`) para 5 productos: añaden interacción sin valor y ocultan contenido a Google si el usuario filtra | `.filters` | Fricción innecesaria |
| M8 | **Trust strip con afirmaciones no verificadas en la web**: "Certificación CE", "Mantenimiento incluido" | `.trust` | Si "mantenimiento incluido" no es cierto para todos los equipos, es reclamación potencial |
| M9 | **Acordeón FAQ** con `max-height` inline y sin `aria-expanded`/`aria-controls`; no es navegable con lector de pantalla | JS | a11y |
| M10 | **Imágenes**: PNG sin `width/height` (CLS), 165-584 px de ancho (se ven borrosas en Retina a 185 px de alto ×2), sin AVIF/WebP, sin `srcset` | `naturalWidth` | Calidad visual del producto, que es el protagonista |
| M11 | **Teléfono del dueño expuesto** 3 veces + wa.me: correcto para conversión, pero sin evento de analítica no se puede medir | — | No se sabe qué canal convierte |
| M12 | **Hero visual es una "tarjeta de cristal" con TDS 380→12** sin contexto ni fuente, con dos pills flotantes animadas | `.glass-card` | Decorativo; no enseña el producto real |

## BAJO

| # | Hallazgo |
|---|---|
| B1 | Dos copias del logo en base64 (header y footer) = 137 KB duplicados |
| B2 | `html{scroll-behavior:smooth}` sin respetar reduced-motion |
| B3 | Botón flotante de WhatsApp tapa el CTA del formulario en móvil (bottom-right) y pulsa infinitamente |
| B4 | Microcopy con exclamaciones ("¡Gracias!") y emojis implícitos en tono; inconsistente con un tono premium |
| B5 | `<a href="#inicio" class="logo">` con `aria-label` pero el `<img>` ya tiene `alt="Aquaproc"` (nombre duplicado para lectores) |
| B6 | Sin `lang` en elementos en otro idioma, sin `<meta name="theme-color">` para dark, sin `apple-touch-icon` |
| B7 | `transition-delay` inline escrito por JS (`i%3*0.08`) genera orden de aparición arbitrario en móvil (una columna) |
| B8 | 404 por defecto de Netlify en inglés |

---

## Lo que SÍ funciona (conservar)

- Oferta clara desde el hero: **demo gratuita a domicilio, sin compromiso**.
- Tono de voz: cercano, afirmativo, sin tecnicismos ("Adiós al plástico", "Agua de manantial en casa").
- Flujo "Cómo funciona" en 4 pasos; FAQ con 4 respuestas buenas.
- Specs reales por producto (caudal, capacidad, filtración, ppb de hidrógeno) — base perfecta para la "fila de cifras" estilo Apple.
- Imágenes de producto **ya tienen fondo transparente** (RGBA): sirven sobre `#f5f5f7` y sobre negro sin recortar.
- WhatsApp como canal principal + teléfono + formulario: tres puertas de entrada, correcto para el público.
- Sin overflow horizontal a 375 px; la rejilla colapsa bien.

## Métricas de referencia (antes)

| Métrica | Valor (desktop, caché caliente de Netlify) |
|---|---|
| HTML transferido | 760 KB (br) / 1.043 KB decodificado |
| Peticiones externas | 1 CSS de Google Fonts + 9 woff2 |
| LCP | ~716 ms (H1; el hero no tiene imagen) |
| DOMContentLoaded | ~910 ms |
| Overflow a 375 px | No |
| Objetivos táctiles < 44 px | 20 elementos |
| Páginas legales | 0 de 3 |
| Datos estructurados | 0 |
