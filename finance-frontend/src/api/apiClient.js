const API_BASE_URL = "https://localhost:7012/api";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { ...(options.headers ?? {}) };

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });
}
