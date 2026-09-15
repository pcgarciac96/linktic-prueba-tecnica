import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from '@/stores/auth.store';

export default defineRouter(({ store }) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  // Restaura la sesión persistida antes de resolver la navegación inicial.
  const authStore = useAuthStore(store);
  authStore.restoreSession();

  // Controla el acceso a rutas protegidas y públicas según el estado de sesión.
  Router.beforeEach((to, _from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = authStore.isAuthenticated;

    // Evita que usuarios no autenticados ingresen a secciones privadas.
    if (requiresAuth && !isAuthenticated) {
      next({ path: '/login', query: { redirect: to.fullPath } });
      return;
    }

    // Evita que usuarios con sesión activa vuelvan a loguearse.
    if (to.path === '/login' && isAuthenticated) {
      next({ path: '/payment-methods' });
      return;
    }

    next();
  });

  return Router;
});
