import axios from 'axios';
import { ApiClientInterface } from './client';

const API_BASE = '/api/v1';

function getHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('todolist_auth_token_v1');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const httpClient: ApiClientInterface = {
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('todolist_auth_user_v1');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getCurrentToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('todolist_auth_token_v1');
  },

  async login(credentials) {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    const { token, user } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('todolist_auth_token_v1', token);
      localStorage.setItem('todolist_auth_user_v1', JSON.stringify(user));
    }
    return { token, user };
  },

  async register(credentials) {
    const res = await axios.post(`${API_BASE}/auth/register`, credentials);
    const { token, user } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('todolist_auth_token_v1', token);
      localStorage.setItem('todolist_auth_user_v1', JSON.stringify(user));
    }
    return { token, user };
  },

  async loginAsDemoGuest() {
    const res = await axios.post(`${API_BASE}/auth/login`, { isDemo: true });
    const { token, user } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('todolist_auth_token_v1', token);
      localStorage.setItem('todolist_auth_user_v1', JSON.stringify(user));
    }
    return { token, user };
  },

  async logout() {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { headers: getHeaders() });
    } catch {
      // Ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('todolist_auth_token_v1');
        localStorage.removeItem('todolist_auth_user_v1');
      }
    }
  },

  async getTodos(filters) {
    const res = await axios.get(`${API_BASE}/todos`, {
      params: filters,
      headers: getHeaders(),
    });
    return res.data;
  },

  async getTodoById(id) {
    const res = await axios.get(`${API_BASE}/todos/${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async createTodo(input) {
    const res = await axios.post(`${API_BASE}/todos`, input, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async updateTodo(id, input) {
    const res = await axios.put(`${API_BASE}/todos/${id}`, input, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async patchTodo(id, patch) {
    const res = await axios.patch(`${API_BASE}/todos/${id}`, patch, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async deleteTodo(id) {
    const res = await axios.delete(`${API_BASE}/todos/${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async batchOperation(input) {
    const res = await axios.post(`${API_BASE}/todos/batch`, input, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async getCategories() {
    const res = await axios.get(`${API_BASE}/categories`, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async createCategory(input) {
    const res = await axios.post(`${API_BASE}/categories`, input, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async deleteCategory(id) {
    const res = await axios.delete(`${API_BASE}/categories/${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  },

  async getStats() {
    const res = await axios.get(`${API_BASE}/stats`, {
      headers: getHeaders(),
    });
    return res.data;
  },
};
