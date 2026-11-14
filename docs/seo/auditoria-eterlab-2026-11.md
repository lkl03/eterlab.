# Auditoría SEO + GEO de eterlab. · noviembre 2026

Sitio: https://eterlab.co · Repo: `lkl03/eterlab.` · Fecha de medición: 13.11.2026
Método: HTML sin JavaScript (curl con User-Agent de Googlebot y de bots de IA) sobre producción, Lighthouse 12, 17 prompts en ChatGPT, Gemini y Claude (los de marca, dos veces), SERP de Google y comparación técnica con 6 estudios. La evidencia cruda está en [`evidencia/`](evidencia/LEEME.md) y la tabla de prompts en [`geo-prompts-2026-11.csv`](geo-prompts-2026-11.csv).

Convención: **hecho** = medido y con evidencia; **hipótesis** = interpretación que hay que confirmar; **no medido** = sin acceso, con cómo obtenerlo.

---

## Resumen ejecutivo

eterlab.co está bien construido para un rastreador: todo el texto se renderiza en el servidor, cada caso tiene URL, canonical y título propios, el sitemap ya incluye Lippia y los bots de IA no están bloqueados. El problema no es técnico, es de **visibilidad y de entidad**:

1. **Fuera de la conversación de categoría.** En los 30 prompts de categoría y de contratación ("agencia de desarrollo web a medida en Argentina", "a quién contrato para rehacer la web de mi negocio"…) eterlab. no apareció **ni una vez** en ninguna de las tres IA. En Google tampoco está en la primera página de las 4 búsquedas de categoría medidas.
2. **Entidad ambigua.** "eterlab" comparte nombre con eter·lab (capacitación automotriz, eterlab.com.ar, que le gana el #1 en Google), ETERlab (laboratorio de plantas en España), el sello EterLab, EtherLab, ETHERLAB S.A.S., eterlab.app y un sitio noruego de préstamos en eterlab.com. Con el nombre solo, **Claude no encontró eterlab.co en 0 de 6 corridas** y Gemini, en una, describió un "estudio Web3 y metaverso" que no existe.
3. **Sin prueba de terceros.** Las tres IA dicen lo mismo con otras palabras: "no hay reseñas", "no aparece en Clutch ni GoodFirms", "poca información independiente". Los estudios que sí recomiendan salen de esos directorios, de Awwwards, del directorio de partners de Vercel o de páginas por rubro.
4. **El sitio no dice quién, dónde ni qué.** No nombra a nadie, no dice Argentina ni Buenos Aires (solo se infiere del +54 9 11), no lista servicios y no menciona Next.js. Gemini lo resumió así: "operan de forma reservada, sin publicar nombres".

Cuando la IA sí encuentra el sitio (con "eterlab agencia web" o "eterlab.co"), lo describe **bien**: estudio argentino de diseño y desarrollo, casos 2026, productos propios, contacto. El contenido es citable; falta que lo puedan encontrar y que haya fuentes externas que lo confirmen.

El PR arregla lo técnico que estaba mal y suma las señales de entidad que se pueden poner sin inventar nada: dejar de bloquear `/_next/` en robots.txt, un solo dominio canónico, metadata en español y sin duplicados, `lastmod` reales, JSON-LD validado, `/llms.txt` y un enlace interno real en los casos. Lo que más mueve la aguja (contenido de servicios y "quiénes somos", ubicación, perfiles en directorios, reseñas) es decisión y trabajo de Luca y está en la hoja de ruta.

### Puntaje general (1–100)

**Antes: 30/100. Con el PR, una vez reindexado: ~40/100** (estimación).

| Componente | Peso | Antes | Con el PR | Base |
|---|---|---|---|---|
| Base técnica (rastreo, indexación, metadata, datos estructurados, velocidad) | 25 % | 15 | 20 | áreas técnicas de abajo |
| Marca y entidad (Google con "eterlab", IA con el nombre) | 25 % | 12 | 15 | #2 en Google; 25/33 respuestas de marca correctas, Claude 0/6 sin calificador |
| Visibilidad de categoría (Google + IA) | 35 % | 1 | 2 | 0/30 en IA, fuera del top 10 en Google |
| Autoridad externa (directorios, reseñas, menciones) | 15 % | 2 | 3 | sin perfiles ni reseñas |

Lo que lleva de 40 a 70+ no es código: páginas de servicios y por rubro, perfiles en directorios con reseñas y menciones externas (ver hoja de ruta).

### Puntaje por área (1–10)

| Área | Antes | Con el PR | Por qué |
|---|---|---|---|
| SEO técnico (rastreo, indexación, canonicals) | 6 | 8 | SSR, canonicals y sitemap bien; robots bloqueaba `/_next/`, `lastmod` falsos, solo ~4 URL indexadas (eso no lo arregla el PR, lo destraba). |
| Metadata on-page | 5 | 8 | Títulos y descripciones únicos, pero en inglés con `lang="es"` y título duplicado en /work. |
| Datos estructurados | 1 | 8 | No había ninguno. Ahora Organization, WebSite, CreativeWork y BreadcrumbList, validados. |
| Contenido y arquitectura | 4 | 4 | Home de ~490 palabras con H1 "eterlab.", sin páginas de servicios, "quiénes somos", proceso ni FAQ; casos cortos de ~280 palabras. No cambia en el PR (copy). |
| Performance (CWV de laboratorio) | 6 | 6 | Lippia 94 móvil; home 50 y JINETES 65 en móvil por JS (shader three.js + animaciones). Desktop 88–99. CLS ≈ 0. |
| GEO: entidad y citabilidad | 4 | 6 | ChatGPT la reconoce; Gemini casi siempre; Claude no con el nombre solo. `llms.txt` y JSON-LD con `sameAs` ayudan a desambiguar. |
| GEO: visibilidad de categoría | 1 | 1 | 0/30 en prompts de categoría y contratación. Depende de contenido y autoridad. |
| Autoridad y presencia externa | 2 | 2 | Sin directorios ni reseñas; Instagram con 60 seguidores; LinkedIn no medido. |

---

## Hallazgos priorizados

Impacto: alto / medio / bajo sobre visibilidad o contactos. Esfuerzo: S (horas), M (días), L (semanas).

### Crítico

**C1 · eterlab. no aparece en ninguna respuesta de categoría ni de contratación** — hecho
- ChatGPT 0/10, Gemini 0/10, Claude 0/10 (P06–P15). Google: fuera de la primera página en "agencia de desarrollo web a medida argentina", "estudio de diseño web buenos aires", "diseño web para pymes argentina" y "desarrollo web next.js argentina".
- Quién aparece y por qué (hipótesis basada en las fuentes citadas): Claude arma sus listas desde Clutch, GoodFirms, DesignRush, Awwwards y el directorio de partners de Vercel; ChatGPT desde los sitios de cada agencia y las fichas de Google Maps con reseñas (Grupo Vansur ★4,9, Intway ★5…); Gemini nombra agencias con mucha huella (VOX, Indicius, DHNN, SAC Fly, basement.studio) casi siempre sin fuentes. En los prompts por rubro ganan sitios con una página por rubro: "Estudio Pixel Web" con casos gastronómicos y "SEO gastronómico", "DDS Web" con "20 sitios web reales de estudios jurídicos".
- Impacto alto · esfuerzo L. Arreglo: páginas de servicios y por rubro con los casos que ya existen, perfiles en directorios, reseñas (ver hoja de ruta).

**C2 · Entidad ambigua: con el nombre solo, Claude no encuentra eterlab.co y Gemini se confundió una vez** — hecho
- "¿Qué es eterlab.?", "¿Quién está detrás de eterlab?" y "What is eterlab?", dos corridas cada uno: ChatGPT 6/6 correcto; Gemini 5/6 (en P01-1 inventó "Eter Studio / Web3 y Metaverso" sin fuentes); Claude 0/6 (devuelve ETERlab de España, el sello EterLab y EtherLab).
- Con un calificador ("eterlab agencia web", "eterlab.co opiniones", "eterlab vs otras agencias") las tres la encuentran y la describen bien (Claude 5/5).
- Homónimos registrados: eter·lab / eterlab.com.ar (capacitación automotriz de Eter Insumos Gráficos, #1 en Google para "eterlab"), ETERlab (CBGP, España), Eter Lab (sello, Medellín, Bandcamp), EtherLab (etherlab.org, automatización), EtherLab (etherlab.com.ar, seguridad electrónica), Etherlab (etherlab.io, VR), ETHERLAB S.A.S. (sociedad argentina), eterlab.app (app de macOS), Instagram @eterlab ("Éter", otra cuenta), LinkedIn `company/eterlab` ("ÉTER", otra empresa) y **eterlab.com** (sitio noruego de préstamos de otro dueño).
- Impacto alto · esfuerzo M. En el PR: JSON-LD Organization con `sameAs` a Instagram, LinkedIn y TikTok, `alternateName`, y `/llms.txt`. Fuera del PR: que el sitio diga quién lo hace y desde dónde, y usar siempre "eterlab." + descriptor ("eterlab. — estudio de diseño y desarrollo web").

### Alto

**A1 · robots.txt bloqueaba `/_next/`** — hecho · **arreglado en el PR**
- `Disallow: /_next/` impide a Googlebot bajar el CSS/JS con el que renderiza y todas las imágenes servidas por `next/image` (`/_next/image?url=…`): los posters y capturas de los casos no podían indexarse en Google Imágenes. Impacto medio-alto · esfuerzo S.

**A2 · Google tiene solo ~4 URL indexadas** — hecho (con sesión de Google, puede variar)
- `site:eterlab.co` → `/`, `/work/jinetes`, `/work/bioprotece3d`, `/work/warriors-sport-arg` (este con el título viejo). Faltan `/work`, `/work/lippia`, `/work/bioprotece`, `/work/kivnon-sas`, `/work/dvlegales`.
- Hipótesis: sitio nuevo con pocos enlaces externos y casos sin enlaces internos entre sí (ver M4). Confirmar en Search Console (no medido). Impacto alto · esfuerzo S (enviar sitemap e inspeccionar URL).

**A3 · No había datos estructurados** — hecho · **arreglado en el PR**
- Cero bloques JSON-LD en las 9 páginas. Ahora: Organization + WebSite en todas, CreativeWork + BreadcrumbList en cada caso. Validados contra el vocabulario de schema.org: 0 errores (`evidencia/verificacion-local/validador-schema-org-local.json`).

**A4 · El sitio no dice quién, dónde ni qué servicios** — hecho
- Texto visible sin JS: "Argentina" 0 veces en la home (solo en el resumen de JINETES), "Buenos Aires" 0, "desarrollo web" 0, "Next.js" 0, ningún nombre de persona, ninguna lista de servicios. H1 de la home: "eterlab.".
- Efecto medido: Gemini "operan de forma reservada"; ChatGPT saca el nombre de Luca y el tamaño del equipo de LinkedIn; Claude "no pude confirmar precios, tamaño real del equipo, año de fundación, stack". ChatGPT prioriza en P13 "companies that explicitly mention Next.js".
- **Ubicación: arreglada en el PR** (Luca lo aprobó): "Ciudad Autónoma de Buenos Aires, Argentina" debajo del copyright del footer, en el título y la descripción de la home, en el JSON-LD (`PostalAddress` a nivel ciudad) y en `/llms.txt`. Quedan servicios y quién está detrás (copy). Impacto alto · esfuerzo M.

**A5 · Sin perfiles en directorios ni reseñas de terceros** — hecho
- No hay perfil de eterlab. en Clutch, GoodFirms, Sortlist, DesignRush, Behance ni Workana, ni ficha de Google Business. Las tres IA lo marcan como la principal debilidad (P05, P16). Impacto alto · esfuerzo M.

**A6 · Performance móvil de la home: 50** — hecho (una corrida de laboratorio)
- Home móvil: LCP 4,8 s, TBT 2.370 ms, Speed Index 5,1 s. El LCP es el subtítulo del hero y el 86 % es "render delay": el texto existe en el HTML pero se pinta tarde, detrás del preloader y de la animación de opacidad, mientras un chunk de JS (el shader de three.js del hero, @react-three/fiber) ocupa 2,2 s de CPU.
- JINETES móvil: 65 (LCP 5,6 s, H1 en Playfair). Lippia móvil: 94. Desktop: 91 / 99 / 88.
- No se tocó en el PR porque cambia cómo se ve el hero. Recomendación: cargar el `<Canvas>` con `next/dynamic` (`ssr: false`) después del primer pintado, y que el subtítulo no arranque en `opacity: 0`. Impacto medio · esfuerzo S–M.

### Medio

**M1 · Metadata en inglés y título duplicado** — hecho · **arreglado en el PR**
- `<html lang="es">` y el contenido sale en español, pero todas las descripciones estaban en inglés. `/work` tenía de título "work – eterlab. – eterlab.". El título de la home era solo "eterlab.".

**M2 · `lastmod` del sitemap = hora del build** — hecho · **arreglado en el PR**
- Las 9 URL tenían `2026-10-31T01:59:59Z`. Ahora cada caso tiene `updatedAt` real (sacado de git) y la home y /work usan el más reciente.

**M3 · No había `/llms.txt`** — hecho · **arreglado en el PR** (respondía 404).

**M4 · Casos cortos sin enlaces internos en el HTML** — hecho · **arreglado en parte**
- En `/work/lippia` (y los otros casos con el layout corto) no había ningún `<a>` interno: el botón "Inicio" navegaba con JS. Ahora es un enlace real. Falta un "siguiente proyecto" en el layout corto, como ya tiene el largo (JINETES, Bioprotece): es UI, queda como recomendación.

**M5 · Casos cortos con poco texto y sin el rubro nombrado** — hecho
- Lippia ~280 palabras visibles; no dice "gastronomía". DV Legales no dice "abogados" ni "estudio jurídico" fuera del resumen. Ningún caso tiene resultados (antes/después, consultas, velocidad). Los competidores que ganan por rubro tienen esas palabras y números. Impacto medio · esfuerzo M.

**M6 · Los otros idiomas no son indexables** — hecho
- El cambio ES/EN es solo del lado del cliente (localStorage): el inglés nunca llega al HTML y no hay `hreflang`. Si interesa el mercado en inglés, hacen falta rutas `/en`. Impacto medio · esfuerzo M.

**M7 · `og.png` con un defecto visual** — hecho
- El texto "design & development" está montado sobre el logotipo. Se ve en cada link compartido de la home y de /work. Esfuerzo S (diseño).

**M8 · OG de los casos con dimensiones falsas** — hecho · **arreglado en el PR**
- Declaraban 1200×630 y los posters son 1280×800. Ahora se usa el poster sin declarar un tamaño falso.

**M9 · Repositorio público** — hecho
- `lkl03/eterlab.` es público y Claude lo citó como fuente ("según su repositorio público"). Expone el README del `/admin` (email de la service account de Google, IDs de cuentas publicitarias de Meta, setup interno). No es SEO, pero es una decisión para Luca.

**M10 · Contraste de color** — hecho
- Lighthouse marca contraste insuficiente en spans de la sección "por qué eterlab." y del footer (accesibilidad 96 en todas las páginas).

### Bajo

- **B1** · `www.eterlab.co` redirige con **307** (temporal); conviene 308 permanente desde Vercel. La bio de Instagram enlaza a `www`. — hecho
- **B2** · `/admin` ya responde `noindex, nofollow` y está en `Disallow`, pero hereda `canonical` a la home. Sin riesgo real (no está enlazado); no se tocó `app/admin/` por regla. — hecho
- **B3** · `eterlab.com` es de un tercero (préstamos, Noruega). Riesgo de confusión de usuarios y asistentes; sin acción técnica posible desde el sitio. — hecho
- **B4** · Un slug inexistente (`/work/no-existe`) responde 404 correcto pero con dos metas robots (noindex + index). Comportamiento de Next.js con `notFound()`. — hecho
- **B5** · LinkedIn: `company/eterlab` es de "ÉTER"; el de eterlab. es `company/eterlab-co`. Mantener ese slug en todos lados (el sitio ya lo hace). — hecho

---

## Qué entró en el PR

Rama `feat/seo-geo-audit`, un commit por área:

| Commit | Qué cambia | Archivos |
|---|---|---|
| `fix(seo): unify canonical origin on eterlab.co` | Un solo `SITE_URL` (fallback `https://eterlab.co`). El layout caía a `https://eterlab.com`, que es de otro dueño. | `lib/site.ts`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` |
| `fix(seo): stop blocking /_next/ and allow AI crawlers explicitly` | Saca `/_next/` del `Disallow`; grupo explícito para GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User y Google-Extended con las mismas reglas. | `app/robots.ts` |
| `fix(seo): Spanish, unique titles and descriptions; correct OG images` | Títulos y descripciones en español, sin el duplicado de /work, OG con el poster real, slug inexistente en `noindex`. | `lib/site.ts`, `app/layout.tsx`, `app/work/layout.tsx`, `app/work/[slug]/page.tsx` |
| `fix(seo): real lastmod dates in sitemap.xml` | Campo `updatedAt` por caso; `lastmod` reales. | `lib/work.ts`, `app/sitemap.ts` |
| `feat(seo): JSON-LD for the studio, the site and each case study` | Organization, WebSite, CreativeWork y BreadcrumbList renderizados en el servidor. | `lib/structured-data.ts`, `components/seo/JsonLd.tsx`, `app/layout.tsx`, `app/work/[slug]/page.tsx` |
| `feat(geo): serve /llms.txt` | Mapa en texto para asistentes, generado desde `lib/i18n` y `lib/work`. | `app/llms.txt/route.ts` |
| `fix(seo): make the "Inicio" back button a real link` | `<a href="/">` en /work y en los casos cortos (mismo componente `Button`, mismo aspecto). | `app/work/page.tsx`, `components/work/WorkPageClient.tsx` |
| `feat: show the studio's location under the footer copyright` | "Ciudad Autónoma de Buenos Aires, Argentina" (EN: "Buenos Aires, Argentina") en un `<address>` debajo del copyright. Aprobado por Luca. | `lib/i18n.ts`, `components/Footer.tsx` |
| `fix(build): self-host Karla instead of fetching it from Google Fonts` | El build de Vercel de esta rama falló en `next/font/google`: Google devolvió URLs `fonts.gstatic.com/l/font?kit=…&skey=…` que Turbopack (Next 16.1.6) no parsea. `main` habría fallado igual en su próximo deploy. Ahora Karla (mismo archivo variable, licencia OFL) se sirve desde `app/fonts` con `next/font/local`. | `app/layout.tsx`, `app/fonts/` |
| `feat(seo): add the studio's city to metadata, JSON-LD and llms.txt` | Título y descripción de la home "en Buenos Aires", `PostalAddress` a nivel ciudad en Organization, ubicación en `/llms.txt`. | `lib/site.ts`, `lib/structured-data.ts`, `app/llms.txt/route.ts` |
| `docs(seo): …` | Este informe, la tabla de prompts y la evidencia. | `docs/seo/` |

No se tocó `next.config.ts`, `app/admin/`, `app/api/`, `scripts/`, variables de entorno ni los archivos sueltos de la raíz. No se cambió copy de marketing ni diseño, salvo la línea de ubicación del footer que pidió Luca.

**Verificación:** `npx tsc --noEmit` ✔ · `npm run build` ✔ · `npm run lint` ✘ con 9 errores **que ya están en `main`** (set-state-in-effect, no-explicit-any, ban-ts-comment, use-memo en `app/page.tsx`, `Navbar`, `Navbar-copy`, `Preloader`, `useActiveSection`, y los `setLang` de `app/work/page.tsx` y `WorkPageClient`); la rama no agrega ninguno (comprobado corriendo eslint sobre las versiones de `origin/main`). HTML del build servido con `next start` y revisado con curl; JSON-LD validado contra el vocabulario de schema.org.

---

## Qué decide Luca

1. **Decir quién.** La ubicación ya está (aprobada y en el PR). Falta decidir si el sitio nombra a quién dirige el estudio; si sí, se suma al copy, a `llms.txt` y al JSON-LD (`founder`). Es lo que queda de C2 y A4.
2. **Páginas de servicios y por rubro** (diseño y desarrollo web a medida, rediseño, dashboards, SEO/GEO; gastronomía, estudios jurídicos, salud/industria) usando los casos que ya existen.
3. **Directorios y reseñas:** crear perfiles en Clutch, GoodFirms, Sortlist y DesignRush, y la ficha de Google Business (si hay domicilio que se pueda mostrar), y pedir reseñas a JINETES, Lippia, Bioprotece, KIVNON, DV Legales y Warriors.
4. **Repo público:** ¿se deja público? (M9).
5. **Hero de la home:** ¿se puede diferir el shader de three.js y sacar el `opacity: 0` inicial del subtítulo? (A6).
6. **Inglés:** ¿vale la pena tener `/en` indexable? (M6).
7. **`og.png`:** corregir la superposición (M7).
8. **Redirect de `www`:** pasarlo a permanente en Vercel (B1). Es configuración de producción, no se tocó.

---

## Hoja de ruta

### 0–30 días
- Mergear el PR y verificar en producción: `robots.txt`, `sitemap.xml`, `/llms.txt`, JSON-LD en Rich Results Test sobre `/` y `/work/jinetes`.
- Search Console: enviar `sitemap.xml`, pedir indexación de `/work` y de los 5 casos que faltan (A2), revisar "Páginas" y "Mejoras".
- Decidir los puntos 1, 3 y 4 de arriba. Con el punto 1, sumar el responsable a una sección "estudio".
- Abrir perfiles en Clutch, GoodFirms, Sortlist y DesignRush con los 7 casos, el link a eterlab.co y el mismo nombre "eterlab.". Pedir 3–5 reseñas.
- Corregir `og.png` y el redirect de `www`.

### 30–90 días
- Página `/servicios` (o secciones en la home) y una página por rubro con 2–3 casos cada una, y una FAQ visible (con `FAQPage` solo si la FAQ está en la página).
- Ampliar los casos cortos (Lippia, KIVNON, DV Legales, Warriors, Bioprotece3D) al formato largo: problema, qué se hizo, stack (Next.js), resultado medible, y el rubro nombrado. Agregar "siguiente proyecto" en el layout corto.
- Performance de la home (A6) y de JINETES (fuente del H1).
- Si interesa el mercado en inglés, rutas `/en` con `hreflang`.
- Repetir la batería GEO y la SERP a las 4 y a las 12 semanas con los mismos prompts (`geo-prompts-2026-11.csv`).

---

## KPIs y línea base (13.11.2026)

| KPI | Línea base | Objetivo 90 días | Cómo se mide |
|---|---|---|---|
| URL indexadas en Google | ~4 de 9 (`site:`) | 9 de 9 | Search Console › Páginas |
| Posición para "eterlab" | #2 (detrás de eterlab.com.ar) | #1 | SERP en incógnito |
| Prompts de marca con eterlab.co correcta | ChatGPT 11/11 · Gemini 9/11 · Claude 5/11 | Claude ≥ 9/11, Gemini 11/11 | Repetir P01–P05 y P16 ×2 |
| "¿Qué es eterlab.?" sin calificador | ChatGPT 6/6 · Gemini 5/6 · Claude 0/6 | Claude ≥ 4/6 | P01, P03, P04 ×2 |
| Prompts de categoría / contratación con eterlab. | 0/30 | ≥ 3/30 | P06–P15 |
| Perfiles en directorios con reseñas | 0 | 3 perfiles, ≥ 5 reseñas | Manual |
| Lighthouse móvil home / JINETES / Lippia | 50 / 65 / 94 | ≥ 75 / ≥ 80 / ≥ 90 | Lighthouse o PageSpeed Insights |
| Bloques JSON-LD válidos | 0 | 2 por página, 4 por caso | Rich Results Test |
| Clics e impresiones orgánicas | no medido | — | Search Console |
| Visitas y contactos desde orgánico e IA | no medido | — | Vercel Analytics (referrers chatgpt.com, gemini.google.com, claude.ai) |

---

## Lo que no se pudo medir

- **Search Console** (impresiones, clics, cobertura real, Core Web Vitals de campo): no hay acceso desde esta sesión. Cómo: Search Console › propiedad de dominio `eterlab.co`.
- **Vercel Analytics** (tráfico, referrers de IA): no se consultó en esta sesión (la auditoría usó Vercel solo en lectura para dominios). Cómo: dashboard de Vercel › Analytics › Referrers.
- **Volúmenes de búsqueda**: sin herramienta de keywords. Cómo: Google Keyword Planner o Search Console tras 4 semanas.
- **Backlinks**: no hay herramienta conectada. Cómo: Search Console › Enlaces, o Ahrefs/Semrush.
- **LinkedIn y TikTok de eterlab.**: LinkedIn pide login; TikTok no se revisó.
- **Variables de entorno de producción**: la tool de Vercel no tiene permiso para leerlas (403). Que `NEXT_PUBLIC_SITE_URL` vale `https://eterlab.co` se infiere del canonical que emite producción.
- **DHNN y Grupo Vansur** en la comparativa: certificado TLS vencido o interceptado en esta máquina (el README menciona el antivirus AVG).
- **CWV de campo**: Lighthouse es de laboratorio y de una sola corrida; los números pueden variar ±10 puntos.
- Las respuestas de IA varían entre corridas y con la ubicación; ChatGPT se midió sin sesión y Gemini/Claude con la sesión de Luca en modo temporal/incógnito.

---

## Método y competencia

**SEO técnico:** curl a producción con User-Agent de Googlebot y de 7 bots de IA; cabeceras y redirecciones de `eterlab.co`, `www`, `http` y `eterlab.com`; estado de 19 rutas; extracción de head, H1–H3, imágenes, enlaces y texto visible sin JS. Dominio confirmado en Vercel (proyecto `eterlab.`: único dominio de producción `eterlab.co`; `eterlab.vercel.app` → 308 a `eterlab.co`).

**GEO:** 17 prompts (14 en español, 3 en inglés): 5 de marca + reputación, 8 de categoría, 2 de contratación, 1 de homónimo. Marca, dos corridas por plataforma. 66 respuestas registradas.

| Tipo | ChatGPT | Gemini | Claude |
|---|---|---|---|
| Marca (P01–P05, P16) | 11/11 | 9/11 | 5/11 |
| Categoría (P06–P13) | 0/8 | 0/8 | 0/8 |
| Contratación (P14–P15) | 0/2 | 0/2 | 0/2 |

Competidores más nombrados: basement.studio, Indicius, DHNN, VOX Diseño Web, estudio/nk, 10Pines, Aerolab, Point Web, SAC Solutions/SAC Fly, Grupo Vansur, Tupaca, Revolt, Seonet.

### Comparativa técnica (13.11.2026, home sin JS)

| Sitio | Palabras sin JS | JSON-LD | Ubicación en el texto | Servicios | Clientes/premios/reseñas | FAQ | Blog | Dónde aparece |
|---|---|---|---|---|---|---|---|---|
| **eterlab.co** (antes del PR) | 491 | ninguno | no | no | casos | no | no | Marca en ChatGPT/Gemini |
| basement.studio | 418 | Organization, ProfessionalService, Service, OfferCatalog, PostalAddress | no | sí (`/services`) | showcase | no | sí | Claude (Vercel Expert), Gemini |
| nk.studio (estudio/nk) | 1.130 | Organization, Person, BreadcrumbList, Speakable, PostalAddress | sí | sí | `/awards`, `/clients` | `/faqs` | `/insights` | Claude (Awwwards), Gemini |
| indicius.com | 292 | ninguno | sí | sí | sí | no | sí | Gemini, Claude (DesignRush) |
| vox-web.com.ar | 2.849 | Organization, FAQPage | sí | sí, por rubro (`/desarrollo-web-para-estudios`) | `/clientes` | sí | sí (incluye "cómo aparecer en ChatGPT y Gemini") | Google #1 pymes, Gemini |
| dhnn.com · grupovansur.com.ar | no medido (TLS) | | | | | | | ChatGPT, Gemini |

Patrón: los que aparecen tienen al menos dos de estas cosas: páginas de servicios o por rubro, ubicación explícita, premios o directorios de terceros, y contenido editorial. eterlab. tiene mejor base técnica que varios (SSR, casos con URL propia, ahora JSON-LD) pero ninguna de esas señales.
