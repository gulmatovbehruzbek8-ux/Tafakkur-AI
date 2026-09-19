/**
 * Central API configuration for Tafakkur AI.
 * Resolves to NEXT_PUBLIC_API_URL if explicitly provided,
 * otherwise defaults to same-origin '' so all native Next.js API route handlers
 * work seamlessly on Vercel and locally without external dependencies.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL.replace(/\/$/, '')}${cleanPath}`;
}
