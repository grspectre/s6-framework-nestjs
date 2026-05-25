import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/login', component: () => import('../views/LoginView.vue') },
    { path: '/register', component: () => import('../views/RegisterView.vue') },
    { path: '/workshops', component: () => import('../views/WorkshopsView.vue') },
    { path: '/workshops/:id', component: () => import('../views/WorkshopDetailView.vue') },
    {
      path: '/bookings',
      component: () => import('../views/BookingsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Защита маршрутов
router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login';
  }
});

export default router;