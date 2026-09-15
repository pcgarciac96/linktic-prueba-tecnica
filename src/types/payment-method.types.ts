export type PaymentMethodType = 'CARD' | 'TRANSFER' | 'CASH' | 'WALLET';

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  description: string;
  active: boolean;
  createdAt: string;
}

export const PAYMENT_METHOD_TYPE_LABELS: Record<PaymentMethodType, string> = {
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  CASH: 'Efectivo',
  WALLET: 'Billetera digital',
};

// Asigna íconos visuales de Quasar.
export const PAYMENT_METHOD_TYPE_ICONS: Record<PaymentMethodType, string> = {
  CARD: 'credit_card',
  TRANSFER: 'account_balance',
  CASH: 'payments',
  WALLET: 'account_balance_wallet',
};
