export function generatePathUrl(name: string, maxLength = 50): string {
  if (!name) return "";

  let pathUrl = name.toLowerCase().replace(/[\s\W_]+/g, "-");
  
  pathUrl = pathUrl.replace(/^-+|-+$/g, "");

  if (pathUrl.length > maxLength) {
    const lastDash = pathUrl.lastIndexOf("-", maxLength);
    if (lastDash > 0) {
      pathUrl = pathUrl.substring(0, lastDash);
    } else {
      pathUrl = pathUrl.substring(0, maxLength);
    }
  }

  return pathUrl;
}
