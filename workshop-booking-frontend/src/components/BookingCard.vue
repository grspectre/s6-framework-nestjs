<template>
  <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-semibold text-gray-800 text-lg">{{ booking.workshop.title }}</h3>
        <p class="text-gray-500 text-sm">{{ booking.workshop.instructor }}</p>
      </div>
      <span v-if="booking.workshop.isPast"
        class="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
        Прошёл
      </span>
    </div>

    <div class="text-sm text-gray-500 space-y-1">
      <p>📅 {{ formatDate(booking.workshop.date) }}</p>
      <p>📍 {{ booking.workshop.location }}</p>
      <p>🕒 Забронировано: {{ formatDate(booking.createdAt) }}</p>
    </div>

    <div class="flex gap-2 mt-auto">
      <RouterLink :to="`/workshops/${booking.workshop.id}`"
        class="flex-1 text-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm transition">
        Подробнее
      </RouterLink>
      <button
        v-if="!booking.workshop.isPast"
        @click="$emit('cancel', booking.id)"
        class="border border-red-400 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition"
      >
        Отменить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking } from '../stores/workshops.store';

defineProps<{ booking: Booking }>();
defineEmits<{ (e: 'cancel', id: number): void }>();

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
</script>