# Evidencia de la auditoría SEO + GEO de eterlab. (13.11.2026)

- `curl/`: lo que recibe un rastreador sin JavaScript en producción (User-Agent de Googlebot).
  - `redirecciones.txt`: eterlab.co, www, http y eterlab.com (este último es un sitio noruego de préstamos de otro dueño).
  - `status-por-ruta.txt`: código, peso y tipo de cada ruta pública, `/admin`, `/api`, 404, `/llms.txt` e imágenes.
  - `head-por-pagina.txt`: title, description, canonical, robots y OG de cada página.
  - `estructura-html.txt`: H1–H3, imágenes con alt, enlaces internos y externos de home, /work, JINETES y Lippia.
  - `bots-ia.txt`: respuesta a GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, Google-Extended, Googlebot y Bingbot.
  - `robots.txt`, `sitemap.xml`, `headers-home.txt` y el HTML de home, /work, JINETES y Lippia.
- `lighthouse/`: Lighthouse 12 en Chrome headless local (móvil con throttling simulado y desktop) sobre producción, una corrida por página. `resumen-lighthouse.txt` tiene puntajes, métricas, elemento LCP y auditorías bajo 0,9; los JSON completos están comprimidos (`.json.gz`).
- `geo/raw/`: lo registrado de cada respuesta de ChatGPT, Gemini y Claude (prompt, modo, si aparece eterlab., texto, competidores y fuentes visibles). La tabla consolidada es `../geo-prompts-2026-11.csv`.
  - ChatGPT: sin sesión iniciada, vía `chatgpt.com/?q=`.
  - Gemini: sesión de Luca (Plus) en **chat temporal** (no usa historial ni personalización guardada).
  - Claude: sesión de Luca en **modo incógnito** (sin historial ni memoria), Opus 5.5, búsqueda web automática.
  - Los textos están recortados; las fuentes son las visibles en la respuesta y la lista puede ser parcial.
- `competidores/comparativa-tecnica-2026-11-13.json`: home sin JS de eterlab.co y 6 estudios que nombran las IA o la SERP (palabras, tipos JSON-LD, ubicación, servicios, señales de terceros, FAQ, blog, enlaces internos). DHNN y Grupo Vansur fallaron por TLS en esta máquina.
- `serp/google-serp-2026-11-13.md`: SERP de marca y de categoría, `site:` y perfiles externos.
- `verificacion-local/`: el build de esta rama servido con `next start` sin `NEXT_PUBLIC_SITE_URL`: HTML de home, /work, JINETES y Lippia, `llms.txt` y `validador-schema-org-local.json` (cada bloque JSON-LD comparado con el vocabulario oficial de schema.org: tipos, propiedades válidas por tipo con herencia y campos que pide Google para Organization y BreadcrumbList).
