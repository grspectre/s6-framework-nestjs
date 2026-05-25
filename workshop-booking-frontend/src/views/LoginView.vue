<template>
  <div class="max-w-md mx-auto mt-16">
    <div class="bg-white rounded-2xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Вход в систему</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Логин</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {{ loading ? 'Входим...' : 'Войти' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        Нет аккаунта?
        <RouterLink to="/register" class="text-indigo-600 hover:underline">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({ username: '', password: '' });
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login(form.value.username, form.value.password);
    router.push('/workshops');
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Ошибка входа. Проверьте данные.';
  } finally {
    loading.value = false;
  }
}
</script>