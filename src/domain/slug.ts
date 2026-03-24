/**
 * Generate a URL-safe slug from a project name.
 * Lowercases, replaces non-alphanumeric with hyphens, trims/collapses hyphens.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
