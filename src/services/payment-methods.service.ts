import type {
  PaymentMethod,
  CreatePaymentMethodPayload,
  UpdatePaymentMethodPayload,
} from '@/types/payment-method.types';
import { INITIAL_PAYMENT_METHODS_MOCK } from '@/mocks/payment-methods.mock';

// Simula las operaciones de una API REST manteniendo el estado en memoria durante la sesión.
export class PaymentMethodsService {
  private static readonly NETWORK_LATENCY_MS = 500;

  // Mantiene una copia mutable local para simular la persistencia en base de datos.
  private static mockDatabase: PaymentMethod[] = JSON.parse(
    JSON.stringify(INITIAL_PAYMENT_METHODS_MOCK),
  );

  // Permite inducir fallos de forma centralizada para verificar la robustez de la interfaz.
  private static shouldSimulateError = false;

  public static setSimulateError(enable: boolean): void {
    this.shouldSimulateError = enable;
  }

  // Simula la obtención de registros remotos mediante una petición asíncrona.
  public static async getAll(): Promise<PaymentMethod[]> {
    await new Promise((resolve) => setTimeout(resolve, this.NETWORK_LATENCY_MS));

    if (this.shouldSimulateError) {
      throw new Error('Error al sincronizar los métodos de pago con el servidor.');
    }

    return JSON.parse(JSON.stringify(this.mockDatabase));
  }

  // Simula una petición POST /api/payment-methods para crear un nuevo registro.
  public static async create(payload: CreatePaymentMethodPayload): Promise<PaymentMethod> {
    await new Promise((resolve) => setTimeout(resolve, this.NETWORK_LATENCY_MS));

    if (this.shouldSimulateError) {
      throw new Error('No fue posible crear el método de pago en el servidor.');
    }

    // Centraliza la generación de identificadores y metadatos fuera de la capa visual.
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      name: payload.name.trim(),
      type: payload.type,
      description: payload.description ? payload.description.trim() : '',
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.mockDatabase.unshift(newMethod);
    return JSON.parse(JSON.stringify(newMethod));
  }

  // Simula una petición PUT /api/payment-methods/:id para actualizar un registro existente.
  public static async update(
    id: string,
    payload: UpdatePaymentMethodPayload,
  ): Promise<PaymentMethod> {
    await new Promise((resolve) => setTimeout(resolve, this.NETWORK_LATENCY_MS));

    if (this.shouldSimulateError) {
      throw new Error('No fue posible actualizar la información del método de pago.');
    }

    const item = this.mockDatabase.find((method) => method.id === id);
    if (!item) {
      throw new Error(`El método de pago con ID "${id}" no existe.`);
    }

    // Actualiza únicamente los atributos editables garantizando la inmutabilidad de id, createdAt y active.
    item.name = payload.name.trim();
    item.type = payload.type;
    item.description = payload.description ? payload.description.trim() : '';

    return JSON.parse(JSON.stringify(item));
  }

  // Simula una petición PATCH /api/payment-methods/:id/status para conmutar el estado.
  public static async toggleStatus(id: string): Promise<PaymentMethod> {
    await new Promise((resolve) => setTimeout(resolve, this.NETWORK_LATENCY_MS));

    if (this.shouldSimulateError) {
      throw new Error('No fue posible actualizar el estado del método de pago.');
    }

    const item = this.mockDatabase.find((method) => method.id === id);
    if (!item) {
      throw new Error(`El método de pago con ID "${id}" no existe.`);
    }

    item.active = !item.active;
    return JSON.parse(JSON.stringify(item));
  }

  // Simula la eliminación asíncrona del registro en la base de datos en memoria.
  public static async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, this.NETWORK_LATENCY_MS));

    if (this.shouldSimulateError) {
      throw new Error('No fue posible eliminar el método de pago en el servidor.');
    }

    const index = this.mockDatabase.findIndex((method) => method.id === id);
    if (index === -1) {
      throw new Error(`El método de pago con ID "${id}" no existe.`);
    }

    this.mockDatabase.splice(index, 1);
    return true;
  }

  // Restablece el conjunto de datos a su estado original para propósitos de prueba.
  public static resetMockData(): void {
    this.mockDatabase = JSON.parse(JSON.stringify(INITIAL_PAYMENT_METHODS_MOCK));
    this.shouldSimulateError = false;
  }
}
