import { defineStore, acceptHMRUpdate } from 'pinia';
import type { AuthResponse, LoginCredentials, SessionData, User } from '@/types/auth.types';
import { AuthService } from '@/services/auth.service';

const SESSION_STORAGE_KEY = 'auth_session';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Gestiona el estado global de autenticación, control de sesión y persistencia local.
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.user && state.token),
    currentUser: (state): User | null => state.user,
  },

  actions: {
    // Permite mantener la sesión activa al recargar la aplicación recuperando datos mínimos.
    restoreSession(): void {
      try {
        const persisted = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!persisted) {
          return;
        }

        const session: SessionData = JSON.parse(persisted);
        if (session.user && session.token) {
          this.user = session.user;
          this.token = session.token;
        }
      } catch {
        // Limpia el almacenamiento si la sesión persistida contiene un formato inválido.
        this.clearPersistedSession();
      }
    },

    // autenticación asíncrona y la actualización del estado de sesión.
    async login(credentials: LoginCredentials): Promise<boolean> {
      this.isLoading = true;
      this.error = null;

      try {
        const response: AuthResponse = await AuthService.login(credentials);
        this.user = response.user;
        this.token = response.token;

        // Guarda la información necesaria para identificar la sesión.
        this.persistSession({ user: response.user, token: response.token });
        return true;
      } catch (err: unknown) {
        this.error =
          err instanceof Error ? err.message : 'Ocurrió un error inesperado al iniciar sesión.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Quita el estado de autenticación y remueve la persistencia local.
    logout(): void {
      this.user = null;
      this.token = null;
      this.error = null;
      this.clearPersistedSession();
    },

    clearError(): void {
      this.error = null;
    },

    // serpaa la interacción con localStorage para evitar accesos dispersos en componentes.
    persistSession(session: SessionData): void {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    },

    clearPersistedSession(): void {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
