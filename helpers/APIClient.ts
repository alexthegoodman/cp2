import { cpDomainwp, protocol } from "@/def/urls";

export class APIClient {
  token: string | null = null;
  baseUrl: string = "/api";

  constructor() {}

  setupClient(token: string | null) {
    this.token = token;
    return this;
  }

  async request(endpoint: string, options: any = {}) {
    const { method = "GET", body, params } = options;

    let url = `${this.baseUrl}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: any = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(protocol + cpDomainwp + url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async get(endpoint: string, params?: any, options: any = {}) {
    return this.request(endpoint, { method: "GET", params, ...options });
  }

  async post(endpoint: string, body?: any, options: any = {}) {
    return this.request(endpoint, { method: "POST", body, ...options });
  }

  async put(endpoint: string, body?: any, options: any = {}) {
    return this.request(endpoint, { method: "PUT", body, ...options });
  }

  async delete(endpoint: string, options: any = {}) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }
}

const apiClient = new APIClient();
export default apiClient;
