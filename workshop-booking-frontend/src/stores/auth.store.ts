import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('access_token'));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(username: string, password: string) {
    const { data } = await api.post('/auth/login', { username, password });
    token.value = data.access;
    user.value = data.user;
    localStorage.setItem('access_token', data.access);
  }

  async function register(payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  }

  async function fetchMe() {
    if (!token.value) return;
    try {
      const { data } = await api.get('/auth/me');
      user.value = data;
    } catch {
      logout();
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('access_token');
  }

  return { user, token, isAuthenticated, isAdmin, login, register, fetchMe, logout };
});