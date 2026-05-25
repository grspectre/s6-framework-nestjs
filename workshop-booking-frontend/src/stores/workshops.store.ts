import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';

export interface Workshop {
  id: number;
  title: string;
  description: string;
  instructor: string;
  date: string;
  location: string;
  maxParticipants: number;
  availableSpots: number;
  isPast: boolean;
}

export interface Booking {
  id: number;
  createdAt: string;
  workshop: Workshop;
}

export const useWorkshopsStore = defineStore('workshops', () => {
  const workshops = ref<Workshop[]>([]);
  const myBookings = ref<Booking[]>([]);
  const loading = ref(false);

  async function fetchWorkshops() {
    loading.value = true;
    try {
      const { data } = await api.get('/workshops');
      workshops.value = data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchWorkshop(id: number): Promise<Workshop> {
    const { data } = await api.get(`/workshops/${id}`);
    return data;
  }

  async function createWorkshop(payload: Omit<Workshop, 'id' | 'availableSpots' | 'isPast'>) {
    const { data } = await api.post('/workshops', payload);
    workshops.value.push(data);
    return data;
  }

  async function deleteWorkshop(id: number) {
    await api.delete(`/workshops/${id}`);
    workshops.value = workshops.value.filter((w) => w.id !== id);
  }

  async function fetchMyBookings() {
    const { data } = await api.get('/bookings');
    myBookings.value = data;
  }

  async function createBooking(workshopId: number) {
    const { data } = await api.post('/bookings', { workshopId });
    myBookings.value.unshift(data);
    return data;
  }

  async function cancelBooking(bookingId: number) {
    await api.delete(`/bookings/${bookingId}`);
    myBookings.value = myBookings.value.filter((b) => b.id !== bookingId);
  }

  return {
    workshops,
    myBookings,
    loading,
    fetchWorkshops,
    fetchWorkshop,
    createWorkshop,
    deleteWorkshop,
    fetchMyBookings,
    createBooking,
    cancelBooking,
  };
});