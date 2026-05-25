<template>
  <div class="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col">
    <!-- Шапка карточки -->
    <div class="bg-indigo-600 px-5 py-4 text-white">
      <div class="flex justify-between items-start">
        <h3 class="font-semibold text-lg leading-tight">{{ workshop.title }}</h3>
        <span v-if="workshop.isPast"
          class="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full ml-2 shrink-0">
          Прошёл
        </span>
      </div>
      <p class="text-indigo-200 text-sm mt-1">{{ workshop.instructor }}</p>
    </div>

    <!-- Тело карточки -->
    <div class="p-5 flex-1 flex flex-col gap-3">
      <p class="text-gray-600 text-sm line-clamp-2">{{ workshop.description }}</p>

      <div class="text-sm text-gray-500 space-y-1">
        <p>📅 {{ formatDate(workshop.date) }}</p>
        <p>📍 {{ workshop.location }}</p>
        <p>
          👥
          <span :class="workshop.availableSpots === 0 ? 'text-red-500' : 'text-green-600'" class="font-medium">
            {{ workshop.availableSpots }} / {{ workshop.maxParticipants }} мест
          </span>
        </p>
      </div>

      <div class="mt-auto flex gap-2">
        <RouterLink :to="`/workshops/${workshop.id}`"
          class="flex-1 text-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm transition">
          Подробнее
        </RouterLink>
        <button
          v-if="isAdmin"
          @click="$emit('delete', workshop.id)"
          class="border border-red-400 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Workshop } from '../stores/workshops.store';

defineProps<{ workshop: Workshop; isAdmin: boolean }>();
defineEmits<{ (e: 'delete', id: number): void }>();

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
</script>