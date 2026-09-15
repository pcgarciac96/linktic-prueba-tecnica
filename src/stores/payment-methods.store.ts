import { defineStore, acceptHMRUpdate } from 'pinia';
import type { PaymentMethod } from '@/types/payment-method.types';
import { PaymentMethodsService } from '@/services/payment-methods.service';

interface PaymentMethodsState {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  updatingId: string | null;
}

// Administra el estado global, sincronización reactiva y control de carga de métodos de pago.
export const usePaymentMethodsStore = defineStore('paymentMethods', {
  state: (): PaymentMethodsState => ({
    paymentMethods: [],
    isLoading: false,
    error: null,
    updatingId: null,
  }),

  getters: {
    allPaymentMethods: (state): PaymentMethod[] => state.paymentMethods,
    totalCount: (state): number => state.paymentMethods.length,
    activeCount: (state): number => state.paymentMethods.filter((item) => item.active).length,
  },

  actions: {
    // Sincroniza la lista de métodos de pago desde la fuente de datos asíncrona.
    async fetchPaymentMethods(): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await PaymentMethodsService.getAll();
        this.paymentMethods = data;
      } catch (err: unknown) {
        this.error =
          err instanceof Error
            ? err.message
            : 'Error desconocido al cargar los métodos de pago.';
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

        // Actualiza el elemento exacto dentro del array para activar la reactividad de Vue.
        const targetIndex = this.paymentMethods.findIndex((item) => item.id === id);
        if (targetIndex !== -1) {
          this.paymentMethods[targetIndex] = updated;
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

    clearError(): void {
      this.error = null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePaymentMethodsStore, import.meta.hot));
}
