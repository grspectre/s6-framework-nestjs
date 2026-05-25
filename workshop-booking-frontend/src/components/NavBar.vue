<template>
  <nav class="bg-indigo-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <RouterLink to="/" class="text-xl font-bold tracking-tight">
        🎨 WorkshopBooking
      </RouterLink>

      <div class="flex items-center gap-4">
        <RouterLink to="/workshops" class="hover:text-indigo-200 transition">
          Мастер-классы
        </RouterLink>

        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/bookings" class="hover:text-indigo-200 transition">
            Мои записи
          </RouterLink>
          <span class="text-indigo-200 text-sm">
            {{ authStore.user?.username }}
            <span v-if="authStore.isAdmin" class="ml-1 bg-yellow-400 text-black text-xs px-1 rounded">
              admin
            </span>
          </span>
          <button
            @click="authStore.logout(); router.push('/login')"
            class="bg-indigo-800 hover:bg-indigo-900 px-3 py-1 rounded transition text-sm"
          >
            Выйти
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login" class="hover:text-indigo-200 transition">Войти</RouterLink>
          <RouterLink
            to="/register"
            class="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-50 transition text-sm font-medium"
          >
            Регистрация
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
</script>