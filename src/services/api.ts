const API_BASE_URL = "https://management-backend-hrlt.onrender.com";

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(email: string, password: string) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(firstName: string, lastName: string, email: string, password: string) {
    return this.request("/signup", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
  }

  async logout() {
    return this.request("/logout", {
      method: "POST",
    });
  }

  async getProducts(filters?: any) {
    return this.request("/products/get-by-filter", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async getProductStats() {
    return this.request("/products/stats");
  }

  async createProduct(productData: any) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: any) {
    return this.request(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/products/${productId}`, {
      method: "DELETE",
    });
  }

  async bulkCreateProducts(products: any[]) {
    return this.request("/products/bulk", {
      method: "POST",
      body: JSON.stringify({ products }),
    });
  }

  async validateProducts(products: any[]) {
    return this.request("/upload/products", {
      method: "POST",
      body: JSON.stringify({ products }),
    });
  }
}

export default new ApiService();
