<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './stores/auth.store';

const authStore = useAuthStore();
onMounted(() => authStore.fetchMe());
</script>