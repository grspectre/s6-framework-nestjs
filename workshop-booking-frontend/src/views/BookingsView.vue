<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Мои записи</h1>

    <div v-if="loading" class="text-center py-12 text-gray-500">Загрузка...</div>

    <div v-else-if="store.myBookings.length === 0" class="text-center py-12">
      <p class="text-gray-400 text-lg">У вас пока нет записей</p>
      <RouterLink to="/workshops" class="text-indigo-600 hover:underline mt-2 inline-block">
        Посмотреть мастер-классы →
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <BookingCard
        v-for="booking in store.myBookings"
        :key="booking.id"
        :booking="booking"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BookingCard from '../components/BookingCard.vue';
import { useWorkshopsStore } from '../stores/workshops.store';

const store = useWorkshopsStore();
const loading = ref(true);

onMounted(async () => {
  try {
    await store.fetchMyBookings();
  } finally {
    loading.value = false;
  }
});

async function handleCancel(bookingId: number) {
  if (confirm('Отменить бронирование?')) {
    await store.cancelBooking(bookingId);
  }
}
</script>