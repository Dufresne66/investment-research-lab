export function withBase(pathname = "/") {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const cleanPath = pathname.replace(/^\/+/, "");
  return cleanPath ? `${base}${cleanPath}` : base;
}
