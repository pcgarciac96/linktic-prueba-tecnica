<template>
  <q-page class="q-pa-lg">
    <!-- Encabezado del módulo -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none text-grey-9">Métodos de pago</h1>
        <p class="text-body2 text-grey-7 q-mt-xs q-mb-none">
          Consulta y gestiona el estado operativo de los métodos de pago disponibles.
        </p>
      </div>

      <!-- creacion de -->
      <div>
        <q-btn color="primary" icon="add" label="Nuevo método" unelevated disable> </q-btn>
      </div>
    </div>

    <div v-if="paymentMethodsStore.error" class="q-mb-md">
      <q-banner dense rounded class="bg-red-1 text-negative border-negative">
        <template #avatar>
          <q-icon name="warning" color="negative" size="md" />
        </template>
        <div class="text-subtitle2 text-weight-medium">
          {{ paymentMethodsStore.error }}
        </div>
        <template #action>
          <q-btn
            flat
            dense
            color="negative"
            label="Reintentar"
            icon="refresh"
            :loading="paymentMethodsStore.isLoading"
            @click="paymentMethodsStore.fetchPaymentMethods()"
          />
        </template>
      </q-banner>
    </div>

    <!-- Tabla principal de métodos de pago -->
    <q-card flat bordered class="bg-white shadow-1">
      <q-table
        flat
        :rows="paymentMethodsStore.paymentMethods"
        :columns="columns"
        row-key="id"
        :loading="paymentMethodsStore.isLoading"
        :pagination="initialPagination"
        class="payment-methods-table"
      >
        <!-- Slot de carga personalizado -->
        <template #loading>
          <q-inner-loading showing color="primary">
            <q-spinner-dots size="50px" color="primary" />
            <span class="text-primary text-weight-medium q-mt-sm">Cargando métodos de pago...</span>
          </q-inner-loading>
        </template>

        <!-- Columna Nombre -->
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="text-weight-bold text-grey-9">{{ props.row.name }}</div>
            <div class="text-caption text-grey-6 ellipsis" style="max-width: 320px">
              {{ props.row.description }}
            </div>
          </q-td>
        </template>

        <!-- Columna Tipo con etiqueta descriptiva e icono -->
        <template #body-cell-type="props">
          <q-td :props="props">
            <q-chip
              dense
              color="blue-1"
              text-color="primary"
              :icon="getTypeIcon(props.row.type)"
              class="text-weight-medium q-px-sm"
            >
              {{ getTypeLabel(props.row.type) }}
            </q-chip>
          </q-td>
        </template>

        <!-- Columna Estado con distintivo visual -->
        <template #body-cell-status="props">
          <q-td :props="props" align="center">
            <q-badge
              :color="props.row.active ? 'positive' : 'grey-6'"
              :label="props.row.active ? 'Activo' : 'Inactivo'"
              class="q-px-sm q-py-xs text-weight-bold"
            />
          </q-td>
        </template>

        <!-- Columna Fecha de creación con formato legible -->
        <template #body-cell-createdAt="props">
          <q-td :props="props">
            <div class="text-body2 text-grey-8">{{ formatDate(props.row.createdAt) }}</div>
          </q-td>
        </template>

        <!-- Columna Acciones con conmutador de estado reactivo -->
        <template #body-cell-actions="props">
          <q-td :props="props" align="center">
            <q-toggle
              :model-value="props.row.active"
              color="positive"
              dense
              :disable="
                paymentMethodsStore.isLoading || paymentMethodsStore.updatingId === props.row.id
              "
              @update:model-value="() => handleToggleStatus(props.row.id)"
            >
              <q-tooltip anchor="top middle" self="bottom middle">
                {{ props.row.active ? 'Desactivar método' : 'Activar método' }}
              </q-tooltip>
            </q-toggle>
          </q-td>
        </template>

        <!-- Slot para estado vacío -->
        <template #no-data>
          <div class="full-width column items-center justify-center q-py-xl text-grey-6">
            <q-icon name="payments" size="64px" color="grey-4" class="q-mb-sm" />
            <div class="text-h6 text-weight-medium text-grey-8">
              No hay métodos de pago registrados
            </div>
            <div class="text-body2 text-grey-6">
              Actualmente no existen registros para visualizar en este módulo.
            </div>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import type { PaymentMethodType } from '@/types/payment-method.types';
import {
  PAYMENT_METHOD_TYPE_LABELS,
  PAYMENT_METHOD_TYPE_ICONS,
} from '@/types/payment-method.types';
import { usePaymentMethodsStore } from '@/stores/payment-methods.store';
import { formatDate } from '@/utils/date-formatter';

const paymentMethodsStore = usePaymentMethodsStore();

const initialPagination = {
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
};

const columns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'active',
    align: 'center',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Fecha de creación',
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'id',
    align: 'center',
  },
];

// Transforma el identificador de tipo a su representación amigable para el usuario.
function getTypeLabel(type: PaymentMethodType): string {
  return PAYMENT_METHOD_TYPE_LABELS[type] || type;
}

function getTypeIcon(type: PaymentMethodType): string {
  return PAYMENT_METHOD_TYPE_ICONS[type] || 'payment';
}

// Delega la conmutación de estado a Pinia garantizando reactividad inmediata sin recargas.
async function handleToggleStatus(id: string): Promise<void> {
  await paymentMethodsStore.toggleStatus(id);
}

// Carga asíncrona de los métodos de pago al montar el componente.
onMounted(async () => {
  await paymentMethodsStore.fetchPaymentMethods();
});
</script>

<style scoped lang="scss">
.border-negative {
  border: 1px solid rgba(193, 0, 21, 0.2);
}

.payment-methods-table {
  border-radius: 8px;
}
</style>
