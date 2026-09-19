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

export async function apiPost<T = unknown>(path: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(getApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error((errData as { detail?: string; message?: string }).detail || (errData as { detail?: string; message?: string }).message || `HTTP error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T = unknown>(path: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(getApiUrl(path), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error((errData as { detail?: string; message?: string }).detail || (errData as { detail?: string; message?: string }).message || `HTTP error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

