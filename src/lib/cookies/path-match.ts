export function computeDefaultPath(sourcePathname: string): string {
  if (!sourcePathname.startsWith("/")) return "/";

  const lastSlash = sourcePathname.lastIndexOf("/");
  if (lastSlash <= 0) return "/";

  // Includes the trailing slash: the effective path is the containing
  // directory of the request path, not the request path itself.
  return sourcePathname.slice(0, lastSlash + 1);
}

export function pathMatches(cookiePath: string, requestPath: string): boolean {
  if (requestPath === cookiePath) return true;
  if (!requestPath.startsWith(cookiePath)) return false;
  if (cookiePath.endsWith("/")) return true;
  return requestPath[cookiePath.length] === "/";
}
