import { defineStore, acceptHMRUpdate } from 'pinia';
import type { PaymentMethod, PaymentMethodFilterCriteria } from '@/types/payment-method.types';
import { PaymentMethodsService } from '@/services/payment-methods.service';

interface PaymentMethodsState {
  rawPaymentMethods: PaymentMethod[];
  filters: PaymentMethodFilterCriteria;
  isLoading: boolean;
  error: string | null;
  updatingId: string | null;
}

// Administra el estado global, sincronización reactiva y control de carga de métodos de pago.
export const usePaymentMethodsStore = defineStore('paymentMethods', {
  state: (): PaymentMethodsState => ({
    rawPaymentMethods: [],
    filters: {},
    isLoading: false,
    error: null,
    updatingId: null,
  }),

  getters: {
    // Calcula la lista visible aplicando los criterios de búsqueda de forma reactiva.
    paymentMethods: (state): PaymentMethod[] => {
      let result = state.rawPaymentMethods;

      if (state.filters.name) {
        const query = state.filters.name.trim().toLowerCase();
        result = result.filter((item) => item.name.toLowerCase().includes(query));
      }

      if (state.filters.type) {
        result = result.filter((item) => item.type === state.filters.type);
      }

      if (state.filters.active) {
        result = result.filter((item) => item.active === state.filters.active);
      }

      return result;
    },

    allPaymentMethods: (state): PaymentMethod[] => state.rawPaymentMethods,
    totalCount: (state): number => state.rawPaymentMethods.length,
    activeCount: (state): number => state.rawPaymentMethods.filter((item) => item.active).length,
  },

  actions: {
    // Sincroniza la lista de métodos de pago desde la fuente de datos asíncrona.
    async fetchPaymentMethods(): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await PaymentMethodsService.getAll();
        this.rawPaymentMethods = data;
      } catch (err: unknown) {
        this.error =
          err instanceof Error ? err.message : 'Error desconocido al cargar los métodos de pago.';
      } finally {
        this.isLoading = false;
      }
    },

    // Actualiza reactivamente el estado activo de un método sin requerir recargas de página.
    async toggleStatus(id: string): Promise<boolean> {
      this.updatingId = id;
      this.error = null;

      try {
        const updated = await PaymentMethodsService.toggleStatus(id);

        // Actualiza el elemento exacto dentro del array  para activar la reactividad.
        const targetIndex = this.rawPaymentMethods.findIndex((item) => item.id === id);
        if (targetIndex !== -1) {
          this.rawPaymentMethods[targetIndex] = updated;
        }

        return true;
      } catch (err: unknown) {
        this.error =
          err instanceof Error
            ? err.message
            : 'No fue posible conmutar el estado del método de pago.';
        return false;
      } finally {
        this.updatingId = null;
      }
    },

    // Aplica criterios de filtrado sobre el listado actual.
    applyFilters(criteria: PaymentMethodFilterCriteria): void {
      this.filters = { ...criteria };
    },

    // Restaura el listado completo eliminando todos los filtros activos.
    clearFilters(): void {
      this.filters = {};
    },

    clearError(): void {
      this.error = null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePaymentMethodsStore, import.meta.hot));
}
