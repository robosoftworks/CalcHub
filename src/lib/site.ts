/** Public site origin — used for absolute SEO URLs (canonical, og, JSON-LD). */
export const SITE_URL = "https://calchub.app";

export const absUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
