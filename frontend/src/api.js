// All API calls go through here.
// In development, React proxy forwards /api → localhost:3001
// In production, /api is served by the same Express server.

const BASE = "/api";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "API error");
  return data;
}

export const api = {
  // list — optionally pass { q, elements }
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.q)        qs.set("q", params.q);
    if (params.elements) qs.set("elements", params.elements.join(","));
    const query = qs.toString();
    return request("GET", `/entries${query ? "?" + query : ""}`);
  },

  // full single entry (includes xy_data)
  get: (id) => request("GET", `/entries/${id}`),

  // create one
  create: (entry) => request("POST", "/entries", entry),

  // bulk create
  bulk: (entries) => request("POST", "/entries/bulk", { entries }),

  // update
  update: (id, fields) => request("PUT", `/entries/${id}`, fields),

  // delete
  delete: (id) => request("DELETE", `/entries/${id}`),

  // health
  health: () => request("GET", "/health"),
};
