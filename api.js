// API configuration
const API_URL = 'https://api.memoricat.com/api';

// API helper functions
const api = {
  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Set default headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth methods
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // Course methods
  async getCourses() {
    const response = await fetch(`${API_URL}/courses`, {
      headers: this.getHeaders()
    });
    return response.json();
  },

  async getCourse(id) {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }
};