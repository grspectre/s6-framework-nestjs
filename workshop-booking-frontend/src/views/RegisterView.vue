<template>
  <div class="max-w-md mx-auto mt-16">
    <div class="bg-white rounded-2xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Регистрация</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input v-model="form.firstName" type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
            <input v-model="form.lastName" type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Логин</label>
          <input v-model="form.username" type="text" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль (мин. 8 символов)</label>
          <input v-model="form.password" type="password" required minlength="8"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>

        <button type="submit" :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
          {{ loading ? 'Регистрируем...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        Уже есть аккаунт?
        <RouterLink to="/login" class="text-indigo-600 hover:underline">Войти</RouterLink>
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

const form = ref({
  username: '', email: '', password: '', firstName: '', lastName: '',
});
const error = ref('');
const success = ref('');
const loading = ref(false);

async function handleRegister() {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    await authStore.register(form.value);
    success.value = 'Регистрация прошла успешно! Перенаправляем...';
    setTimeout(() => router.push('/login'), 1500);
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Ошибка регистрации.';
  } finally {
    loading.value = false;
  }
}
</script>