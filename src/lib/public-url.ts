/** Prefix public assets when the site is built for GitHub Pages. */
export function publicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
