# PLAN.md — Rediseño aquaproc.com

Ismael dio el OK ("rediséñala y ya"), así que este plan se ejecuta sin esperar. Las decisiones que requerían datos suyos se resuelven con placeholders `TODO` / `[RELLENAR]` y se listan en `CHANGELOG.md`.

## Decisiones tomadas por mí (revisables)

| Tema | Decisión | Por qué |
|---|---|---|
| Destino del formulario | **Formspree (el mismo endpoint `xbdvjgle`)** | El brief dejó "[indica aquí]" sin rellenar; mantener el endpoint actual no rompe nada. Cambiar a Make/Sheets = cambiar 1 constante en `js/main.js` |
| Analítica | **Plausible** (script en `index.html`, dominio `aquaproc.com`) | Sin cookies → no obliga a banner de cookies ni a consentimiento previo. GA4 queda comentado como alternativa |
| Cookies | Sin cookies de terceros → **no hay banner**; la política de cookies lo explica | Menos fricción; legal mientras no se añada GA4/Meta Pixel |
| Fuente | `-apple-system, "SF Pro Text/Display"` en Apple; **Inter** (self-hosted, variable, 1 fichero) en el resto | Brief; elimina 9 peticiones a Google y la fuga de IP |
| Precio del equipo | **No se muestra**. Calculadora muestra solo ahorro; "desde X €" queda como `TODO` oculto | Brief: no inventar precios |
| Teléfono | Se mantiene **+34 638 42 91 89** en WhatsApp y tel: | Es el que hay en la web actual |
| Zonas | FAQ responde "**Toda España, principalmente Cataluña**" | Es el dato real del negocio (Aquaproc trabaja en toda España, sobre todo en Cataluña) |
| Hosting | Netlify (`netlify.toml` con cabeceras de caché y seguridad, redirects a legales) | Es donde ya está |
| Estructura | `index.html` + `css/` + `js/` + `img/` + `legal/*.html`; sin build | Netlify lo sirve tal cual; fácil de editar a mano |

## Priorización (impacto en conversión ÷ esfuerzo)

| Prio | Cambio | Impacto | Esfuerzo | Ratio |
|---|---|---|---|---|
| 1 | Páginas legales + enlace real + texto RGPD en formulario | Alto (confianza + legalidad) | Bajo | ★★★★★ |
| 2 | Un solo CTA primario ("Solicita tu demo gratuita") y jerarquía: primario = formulario/WhatsApp; secundario = "Más información ›" | Alto | Bajo | ★★★★★ |
| 3 | Imágenes a ficheros AVIF/WebP con `srcset`, `width/height`, lazy real | Alto (CWV, SEO) | Bajo | ★★★★★ |
| 4 | Bloque de prueba social (3 testimonios placeholder + fila de logos) | Alto | Bajo | ★★★★ |
| 5 | Calculadora de ahorro real (garrafas/semana × precio → €/año) | Alto (engagement, gancho) | Medio | ★★★★ |
| 6 | Formulario: validación por campo, estados, honeypot, aria-live | Medio-alto | Medio | ★★★★ |
| 7 | SEO: JSON-LD (LocalBusiness + Product×5 + FAQPage), OG/Twitter, canonical, robots, sitemap, favicon | Medio | Bajo | ★★★★ |
| 8 | FAQ "zonas" con respuesta real; añadir FAQ de precio/financiación como placeholder | Medio | Bajo | ★★★★ |
| 9 | Rediseño visual completo estilo Apple | Medio-alto (percepción premium) | Alto | ★★★ |
| 10 | Analítica Plausible + eventos (WhatsApp, llamada, formulario, calculadora) | Medio (medición) | Bajo | ★★★ |
| 11 | Accesibilidad: foco, 44 px, reduced-motion, nav móvil con aria | Medio | Medio | ★★★ |
| 12 | Comparativa "Comparar modelos" | Medio | Medio | ★★ |

## Dirección visual, sección por sección

Sistema base: fondo `#fff` / `#f5f5f7` / `#000` · texto `#1d1d1f` · secundario `#6e6e73` · acento `#0071e3` solo en enlaces y botón primario · titulares 600, tracking −0,02em, line-height 1,05 · cuerpo 17–21 px · contenido centrado, máx. 980 px · padding de sección 120–160 px desktop / 80 px móvil · tarjetas radio 18–28 px en `#f5f5f7` sin borde ni sombra · botones píldora `border-radius: 980px`, `12px 22px` · fade-up 600 ms `cubic-bezier(.25,.1,.25,1)` una vez, desactivado con `prefers-reduced-motion`.

| Sección | Antes | Después |
|---|---|---|
| **Nav** | 78 px, blanco 92 %, 5 enlaces 15 px, CTA verde grande, hamburguesa | **48 px**, `rgba(255,255,255,.72)` + `backdrop-filter: saturate(180%) blur(20px)`, logo 24 px alto, enlaces 12 px, CTA azul pequeño; en móvil menú desplegable a pantalla completa con `aria-expanded`, cierre con Esc |
| **Hero** | Grid 2 columnas, badge, h1 serif con "pura" en verde, 3 stats, tarjeta de cristal con pills flotantes | **Centrado, fondo blanco**: "Agua pura. Sin garrafas." (72 px), una frase, dos enlaces ("Solicita tu demo gratuita" botón + "Ver productos ›"), imagen de Hydriva grande y centrada debajo. Sin badges ni stats |
| **Trust strip** | 4 iconos verdes en franja gris | Se elimina. Las afirmaciones pasan a cada producto (CE) y a la FAQ (mantenimiento) |
| **Por qué cambiar** | 3 tarjetas con icono verde | Sección `#f5f5f7`: titular + 3 columnas de texto sin icono ni tarjeta (estilo "por qué" de Apple), cifra grande + etiqueta |
| **Productos** | Grid 3×2 de tarjetas con borde, filtros, tags "Más popular/Premium" | **3 secciones a pantalla completa**: Hydriva Mini (blanco), Hydriva (`#f5f5f7`), **Hydriva Pro (negro `#000`)**. Cada una: eyebrow "Hydriva Pro" · titular · una frase · imagen grande centrada · fila de 3-4 cifras grandes (48 px) con etiqueta · "Solicita tu demo gratuita" + "Más información ›" |
| **Más soluciones** | — | Hydrion + Smarto en 2 tarjetas `#f5f5f7` radio 28 px, imagen + nombre + frase + cifra clave + enlace |
| **Comparar modelos** | — | 3 columnas (Mini / Hydriva / Pro) sin bordes: imagen, nombre, cifra clave, filas de specs alineadas, CTA. Scroll horizontal en móvil con snap |
| **Ahorro** | Grid texto + tarjeta de comparación con cifras inconsistentes, botón "Calcular mi ahorro" → formulario | **Calculadora real** en `#f5f5f7`: dos controles (garrafas/semana, precio por garrafa, con valor por defecto editable) → cifra grande "≈ 830 € al año" en vivo + "en 10 años" + garrafas evitadas. Supuestos visibles bajo la cifra. Sin precio del equipo (TODO) |
| **Cómo funciona** | 4 pasos con círculos verdes | 4 pasos en fila, número en 48 px gris claro, título + frase; fondo blanco |
| **Prueba social** | — | `#f5f5f7`: 3 tarjetas de testimonio `[TESTIMONIO PENDIENTE]` (texto, nombre, localidad) + fila "Distribuidor oficial Aquaresa" con logo placeholder |
| **Demo (formulario)** | Caja con borde + 2 columnas + WhatsApp + tel + form | Fondo blanco, centrado máx. 580 px: titular "Solicita tu demo gratuita", frase, **formulario** (Nombre, Teléfono, Email, Código postal, consentimiento RGPD con texto completo y enlace real, honeypot), botón primario; debajo "o escríbenos por **WhatsApp** · llama al 638 42 91 89" como enlaces azules |
| **FAQ** | Acordeón con chevron verde | `<details>/<summary>` nativos (accesibles sin JS), fondo `#f5f5f7`, 7 preguntas incl. zonas real y precio placeholder; FAQPage en JSON-LD |
| **Footer** | 4 columnas gris, iconos | Texto 12 px `#6e6e73` sobre `#f5f5f7`, enlaces: Productos · Aviso legal · Privacidad · Cookies · Instagram · WhatsApp; línea con titular `[RELLENAR]` |
| **WhatsApp flotante** | Botón verde pulsante | Se mantiene como botón discreto negro/blanco sin pulso, oculto mientras el formulario está en pantalla; evento de analítica |

## Qué queda de tu parte (se repite en CHANGELOG.md)

- Datos del titular para legales: razón social, NIF, dirección, email.
- Precio "desde X €" por producto (o confirmar que no se muestra).
- 3 testimonios reales con nombre y localidad; permiso para usarlos.
- Confirmar "mantenimiento incluido" y "certificación CE" por producto.
- Fotos de producto a mayor resolución (las actuales son 165–584 px).
- Cuenta de Plausible (o decidir GA4) y, si cambias el destino del formulario, el webhook.
