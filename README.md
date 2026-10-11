This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin (`/admin`)

Panel interno que muestra la **Client Checklist** (Google Sheet) como dashboard. Solo lectura: los cambios se hacen en el Sheet y el panel los toma en vivo (caché de 60 s; el botón de actualizar fuerza la lectura).

**Login** — mismo esquema que el admin de nodo: email autorizado + PIN + código de Google Authenticator (TOTP), con "recordar este dispositivo 30 días". Sesión de 8 h en cookie httpOnly firmada. Rate limit de 10 intentos / 15 min por IP (en memoria, por instancia).

**Datos** — una service account de Google Cloud (`checklist-reader@eterlab-admin-lkl.iam.gserviceaccount.com`, proyecto `eterlab-admin-lkl`) lee el Sheet con scope `spreadsheets.readonly`. El Sheet sigue privado: solo hay que compartirlo con ese email como **Lector**. Las columnas se reconocen por nombre de encabezado, así que se pueden reordenar o agregar columnas sin romper el panel.

| Variable | Qué es |
| --- | --- |
| `ADMIN_ALLOWED_EMAILS` | emails autorizados, separados por coma |
| `ADMIN_SESSION_SECRET` | clave HMAC de las cookies + salt del PIN (cambiarla invalida PIN y sesiones) |
| `ADMIN_PIN_HASH` | `scrypt(PIN, ADMIN_SESSION_SECRET)` en hex |
| `ADMIN_TOTP_SECRET` | secreto base32 de Google Authenticator |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON de la key de la service account (crudo o base64) |
| `CLIENTS_SHEET_ID` / `CLIENTS_SHEET_RANGE` | opcionales; por defecto la Client Checklist, primera pestaña `A1:Z500` |

### Finanzas (`/admin?vista=finanzas`)

- **Ingresos recurrentes:** suscripciones de MercadoPago (`/preapproval/search`). Solo las `authorized` suman al MRR; el monto se normaliza a un mes según la frecuencia. ARR = MRR × 12. El producto sale del motivo de la suscripción ("nodo …" / "eterlab. …").
- **Ads:** campañas de Meta de las cuentas publicitarias de nodo, con el gasto del mes y el histórico. El producto sale del nombre de la campaña y, si no lo dice, de la cuenta. Se ocultan las campañas pausadas de hace más de un año que no gastaron nada en el mes.
- Cada moneda se muestra por separado, sin conversiones. Caché de 5 minutos, y si una fuente falla la otra se sigue mostrando.

| Variable | Qué es |
| --- | --- |
| `MP_ACCESS_TOKEN` | Access Token de producción de la app de MercadoPago `eterlab-admin` |
| `META_ADS_TOKEN` | token de un usuario del sistema del Business Manager de Nodo, con `ads_read` |
| `META_AD_ACCOUNT_IDS` | opcional; por defecto `287949821825872,2517150942110792` (nodo ARS y nodo USD) |
| `META_GRAPH_VERSION` | opcional; por defecto `v23.0` |

Setup local (escribe en `.env.local`, que está en `.gitignore`):

```bash
node scripts/admin-setup.mjs        # genera ADMIN_SESSION_SECRET + ADMIN_TOTP_SECRET y muestra la URI para Authenticator
node scripts/admin-setup.mjs --pin  # pide el PIN (oculto) y guarda ADMIN_PIN_HASH
```

En local, Node necesita el certificado de AVG para llegar a Google: `NODE_EXTRA_CA_CERTS=C:\Users\Luca\.gcloud-ca\cacert-combined.pem`.
