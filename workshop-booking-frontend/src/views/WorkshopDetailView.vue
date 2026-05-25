<template>
  <div class="max-w-2xl mx-auto">
    <div v-if="loading" class="text-center py-12 text-gray-500">Загрузка...</div>

    <div v-else-if="workshop" class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="bg-indigo-600 text-white px-8 py-6">
        <h1 class="text-2xl font-bold">{{ workshop.title }}</h1>
        <p class="text-indigo-200 mt-1">{{ workshop.instructor }}</p>
      </div>

      <div class="p-8 space-y-4">
        <p class="text-gray-700">{{ workshop.description }}</p>

        <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="font-medium text-gray-800">Дата и время</p>
            <p>{{ formatDate(workshop.date) }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="font-medium text-gray-800">Место</p>
            <p>{{ workshop.location }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="font-medium text-gray-800">Свободных мест</p>
            <p :class="workshop.availableSpots === 0 ? 'text-red-500' : 'text-green-600'" class="font-semibold">
              {{ workshop.availableSpots }} из {{ workshop.maxParticipants }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="font-medium text-gray-800">Статус</p>
            <p :class="workshop.isPast ? 'text-gray-400' : 'text-green-600'">
              {{ workshop.isPast ? 'Завершён' : 'Активен' }}
            </p>
          </div>
        </div>

        <p v-if="message" :class="messageClass" class="text-sm font-medium">{{ message }}</p>

        <div class="flex gap-3 pt-2">
          <button
            v-if="authStore.isAuthenticated && !workshop.isPast"
            @click="handleBook"
            :disabled="booking || workshop.availableSpots === 0"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {{ booking ? 'Записываем...' : 'Записаться' }}
          </button>
          <RouterLink v-if="!authStore.isAuthenticated" to="/login"
            class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Войдите, чтобы записаться
          </RouterLink>
          <RouterLink to="/workshops"
            class="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition">
            Назад
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkshopsStore, type Workshop } from '../stores/workshops.store';
import { useAuthStore } from '../stores/auth.store';

const route = useRoute();
const store = useWorkshopsStore();
const authStore = useAuthStore();

const workshop = ref<Workshop | null>(null);
const loading = ref(true);
const booking = ref(false);
const message = ref('');
const messageClass = ref('');

onMounted(async () => {
  try {
    workshop.value = await store.fetchWorkshop(Number(route.params.id));
  } finally {
    loading.value = false;
  }
});

async function handleBook() {
  booking.value = true;
  message.value = '';
  try {
    await store.createBooking(workshop.value!.id);
    message.value = '✅ Вы успешно записались!';
    messageClass.value = 'text-green-600';
    // Обновляем данные мастер-класса
    workshop.value = await store.fetchWorkshop(workshop.value!.id);
  } catch (e: any) {
    message.value = e.response?.data?.message ?? 'Ошибка при записи.';
    messageClass.value = 'text-red-500';
  } finally {
    booking.value = false;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
</script>