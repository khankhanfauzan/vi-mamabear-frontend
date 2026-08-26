import { getSession } from "next-auth/react";
import { API_BASE_URL } from "@/lib/config";

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
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure JSON content type for body-bearing requests if not set
  if (
    !headers.has("Content-Type") &&
    options.body &&
    typeof options.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * API Utility methods for use inside Client Components.
 * Do NOT use these inside Server Components (use getServerSession + native fetch instead).
 */
export const apiClient = {
  get: (endpoint: string, options?: RequestInit) =>
    fetchWrapper(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: (endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: (endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    fetchWrapper(endpoint, { ...options, method: "DELETE" }),

  postImage: (endpoint: string, body: FormData, options?: RequestInit) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "POST",
      body,
    }),
};

// Create and export the globally configured client
// export const { GET, POST, PUT, DELETE, PATCH } = createClient<paths>({
//   baseUrl: API_BASE_URL,
//   fetch: fetchWrapper,
// });
