import { getSession } from 'next-auth/react';
import { API_BASE_URL } from '@/lib/config';

/**
 * Base authenticated fetch wrapper for Client Components.
 * Automatically attaches the NextAuth Bearer token to requests.
 */
export const fetchWrapper = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const session = await getSession();
  const token = session?.accessToken;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure JSON content type for body-bearing requests if not set
  if (
    !headers.has('Content-Type') &&
    options.body &&
    typeof options.body === 'string'
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const maxRetries = 3;
  const timeoutLimit = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log('fetchWithRetry:', url, attempt, maxRetries);
    try {
      return await fetch(url, {
        ...options,
        headers,
      });
    } catch (err: unknown) {
      const errorObj = err as { code?: string; cause?: { code?: string } };
      const isConnReset =
        errorObj?.code === 'ECONNRESET' ||
        errorObj?.cause?.code === 'ECONNRESET';

      const isLastAttempt = attempt === maxRetries;

      // If not ECONNRESET or max retries, throw "Unreachable" error
      if (!isConnReset || isLastAttempt) {
        throw new Error('Unreachable');
      }

      // Delay (backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, timeoutLimit * attempt),
      );
    }
  }

  throw new Error('Unreachable');
};

/**
 * API Utility methods for use inside Client Components.
 * Do NOT use these inside Server Components (use getServerSession + native fetch instead).
 */
export const apiClient = {
  get: (endpoint: string, options?: RequestInit) =>
    fetchWrapper(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: (endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: (endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    fetchWrapper(endpoint, { ...options, method: 'DELETE' }),

  postImage: (endpoint: string, body: FormData, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: 'POST',
      body,
    }),
};

// Create and export the globally configured client
// export const { GET, POST, PUT, DELETE, PATCH } = createClient<paths>({
//   baseUrl: API_BASE_URL,
//   fetch: fetchWrapper,
// });

// Helper function for fetch with retry
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 3,
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err: unknown) {
      const error = err as { code?: string; cause?: { code?: string } };
      const isLastAttempt = attempt === maxRetries;
      const isConnReset =
        error.code === 'ECONNRESET' || error.cause?.code === 'ECONNRESET';

      if (isLastAttempt || !isConnReset) {
        throw new Error('Unreachable');
      }

      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }

  throw new Error('Unreachable');
}
