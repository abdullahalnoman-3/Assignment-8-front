const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function fetchApi<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers = {}, ...rest } = options;

  const resolvedToken =
    token ??
    (typeof window !== 'undefined' ? localStorage.getItem('kindnet_token') : null);

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
    ...headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: requestHeaders,
    ...rest,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export default fetchApi;

