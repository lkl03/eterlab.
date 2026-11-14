/**
 * Canonical origin of the public site. Production sets NEXT_PUBLIC_SITE_URL;
 * the fallback is the only production domain on Vercel (eterlab.co).
 * eterlab.com belongs to an unrelated third party — never use it here.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://eterlab.co").replace(/\/+$/, "");

/** Home <title> and default description (Spanish: the site renders in es first). */
export const SITE_TITLE = "eterlab. — estudio de diseño y desarrollo web en Buenos Aires";
export const SITE_DESCRIPTION =
  "Estudio de diseño y desarrollo web en Buenos Aires: sitios a medida, rebranding, dashboards y productos digitales. Trabajos para JINETES, Lippia, Bioprotece y KIVNON SAS.";

/** Where the studio is based (also shown in the footer). City level only — no street address. */
export const SITE_LOCATION = {
  locality: "Ciudad Autónoma de Buenos Aires",
  country: "AR",
  countryName: "Argentina",
} as const;

export const SITE = {
  name: "eterlab",
  // TODO: cambiá este email por el real.
  email: "contact.eterlab@gmail.com",
  links: {
    promptea: "https://promptea.me",
  },
} as const;
