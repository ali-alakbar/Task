const API = process.env.RAILS_API_URL?.replace(/\/$/, "");
const KEY = process.env.ASSISTANT_API_KEY;

export async function rails(path: string, init: RequestInit = {}) {
  if (!API || !KEY) throw new Error("Server API is not configured");
  const response = await fetch(API + path, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + KEY,
      ...(init.headers || {})
    }
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || data?.message || "API request failed");
  return data;
}
