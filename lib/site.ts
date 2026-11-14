/**
 * Canonical origin of the public site. Production sets NEXT_PUBLIC_SITE_URL;
 * the fallback is the only production domain on Vercel (eterlab.co).
 * eterlab.com belongs to an unrelated third party — never use it here.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://eterlab.co").replace(/\/+$/, "");

export const SITE = {
  name: "eterlab",
  // TODO: cambiá este email por el real.
  email: "contact.eterlab@gmail.com",
  links: {
    promptea: "https://promptea.me",
  },
} as const;
