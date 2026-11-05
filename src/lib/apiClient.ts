// src/lib/apiClient.ts

export interface ApiResponse<T> {
  readonly data: T | null;
  readonly error: string | null;
  readonly status: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';

export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as T;
    return { data, error: null, status: res.status };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { data: null, error: errorMessage, status: 0 };
  }
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    const url = new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = (await res.json()) as T;
    return { data, error: null, status: res.status };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { data: null, error: errorMessage, status: 0 };
  }
}

export async function apiPatch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as T;
    return { data, error: null, status: res.status };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { data: null, error: errorMessage, status: 0 };
  }
}
