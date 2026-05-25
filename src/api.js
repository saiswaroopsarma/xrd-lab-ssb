async function request(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "API error");
  return data;
}

export const api = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.q)        qs.set("q", params.q);
    if (params.elements) qs.set("elements", params.elements.join(","));
    const query = qs.toString();
    return request("GET", `/entries${query ? "?" + query : ""}`);
  },
  get:    (id)      => request("GET",    `/entries/${id}`),
  create: (entry)   => request("POST",   "/entries", entry),
  bulk:   (entries) => request("POST",   "/bulk", { entries }),
  update: (id, f)   => request("PUT",    `/entries/${id}`, f),
  delete: (id)      => request("DELETE", `/entries/${id}`),
  health: ()        => request("GET",    "/health"),
};
