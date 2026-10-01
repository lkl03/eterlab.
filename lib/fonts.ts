import { Playfair_Display } from "next/font/google";

/**
 * High-contrast display serif used where a client's own identity leads
 * (the JINETES spotlight and case study). Variable, so no `weight` list —
 * naming static weights can 404 on Google Fonts and fail the build.
 */
export const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
