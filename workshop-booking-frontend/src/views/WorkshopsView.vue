<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Мастер-классы</h1>
      <button
        v-if="authStore.isAdmin"
        @click="showCreateForm = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
      >
        + Добавить
      </button>
    </div>

    <!-- Форма создания (только для admin) -->
    <div v-if="showCreateForm" class="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Новый мастер-класс</h2>
      <form @submit.prevent="handleCreate" class="grid grid-cols-2 gap-4">
        <input v-model="newWorkshop.title" placeholder="Название" required
          class="col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <textarea v-model="newWorkshop.description" placeholder="Описание" required rows="3"
          class="col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input v-model="newWorkshop.instructor" placeholder="Инструктор" required
          class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input v-model="newWorkshop.location" placeholder="Место" required
          class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input v-model="newWorkshop.date" type="datetime-local" required
          class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input v-model.number="newWorkshop.maxParticipants" type="number" min="1" placeholder="Мест" required
          class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

        <p v-if="createError" class="col-span-2 text-red-500 text-sm">{{ createError }}</p>

        <div class="col-span-2 flex gap-3">
          <button type="submit" :disabled="creating"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50">
            {{ creating ? 'Создаём...' : 'Создать' }}
          </button>
          <button type="button" @click="showCreateForm = false"
            class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            Отмена
          </button>
        </div>
      </form>
    </div>

    <!-- Загрузка -->
    <div v-if="store.loading" class="text-center py-12 text-gray-500">Загрузка...</div>

    <!-- Список мастер-классов -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WorkshopCard
        v-for="workshop in store.workshops"
        :key="workshop.id"
        :workshop="workshop"
        :isAdmin="authStore.isAdmin"
        @delete="handleDelete"
      />
    </div>

    <p v-if="!store.loading && store.workshops.length === 0"
      class="text-center py-12 text-gray-400 text-lg">
      Мастер-классов пока нет
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WorkshopCard from '../components/WorkshopCard.vue';
import { useWorkshopsStore } from '../stores/workshops.store';
import { useAuthStore } from '../stores/auth.store';

const store = useWorkshopsStore();
const authStore = useAuthStore();
const showCreateForm = ref(false);
const creating = ref(false);
const createError = ref('');

const newWorkshop = ref({
  title: '', description: '', instructor: '',
  date: '', location: '', maxParticipants: 10,
});

onMounted(() => store.fetchWorkshops());

async function handleCreate() {
  createError.value = '';
  creating.value = true;
  try {
    const payload = {
      ...newWorkshop.value,
      date: new Date(newWorkshop.value.date).toISOString(),
    };
    await store.createWorkshop(payload as any);
    showCreateForm.value = false;
    newWorkshop.value = { title: '', description: '', instructor: '', date: '', location: '', maxParticipants: 10 };
  } catch (e: any) {
    createError.value = e.response?.data?.message ?? 'Ошибка создания.';
  } finally {
    creating.value = false;
  }
}

async function handleDelete(id: number) {
  if (confirm('Удалить мастер-класс?')) {
    await store.deleteWorkshop(id);
  }
}
</script>