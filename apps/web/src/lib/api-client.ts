const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type ApiRequestOptions = RequestInit & {
  organizationId?: string;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { organizationId, headers, ...init } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(organizationId ? { 'x-organization-id': organizationId } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message;
    throw new Error(
      Array.isArray(message) ? message[0] : (message ?? 'Something went wrong'),
    );
  }

  return response.json() as Promise<T>;
}
