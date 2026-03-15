import { config } from "../config/config.js";

class ApiService {
  async request(endpoint, options = {}) {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  getServerList() {
    return this.request("/getServerList");
  }
}

export const apiService = new ApiService();