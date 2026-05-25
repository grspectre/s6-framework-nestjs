<template>
  <div class="text-center py-16">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">
      Добро пожаловать в <span class="text-indigo-600">WorkshopBooking</span>
    </h1>
    <p class="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
      Записывайтесь на мастер-классы, следите за своими бронями и не пропускайте интересные события.
    </p>
    <div class="flex justify-center gap-4">
      <RouterLink to="/workshops"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition">
        Смотреть мастер-классы
      </RouterLink>
      <RouterLink v-if="!authStore.isAuthenticated" to="/register"
        class="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl font-medium transition">
        Зарегистрироваться
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';
const authStore = useAuthStore();
</script>