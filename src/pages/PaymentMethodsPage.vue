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
        <q-btn
          color="primary"
          icon="add"
          label="Nuevo método"
          unelevated
          @click="handleOpenCreateDialog"
        >
          <q-tooltip anchor="top middle" self="bottom middle">
            Crear nuevo método de pago.
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Filtros genéricos -->
    <AppFilters :fields="filterFields" @search="handleSearch" @clear="handleClear" />

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
          <q-td :props="props" align="center" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="grey-7"
              :disable="
                paymentMethodsStore.isLoading || paymentMethodsStore.updatingId === props.row.id
              "
              @click="handleOpenEditDialog(props.row)"
            >
              <q-tooltip anchor="top middle" self="bottom middle"> Editar método </q-tooltip>
            </q-btn>

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
              No se encontraron registros que coincidan con los criterios de búsqueda.
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!--  modal reutilizable -->
    <q-dialog v-model="isDialogOpen" persistent>
      <PaymentMethodForm
        :payment-method="selectedPaymentMethod"
        :loading="paymentMethodsStore.isSubmitting"
        @save="handleSavePaymentMethod"
        @cancel="handleCloseDialog"
      />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import type { FilterField, FilterValues } from '@/types/filter.types';
import type {
  PaymentMethod,
  PaymentMethodFilterCriteria,
  PaymentMethodType,
  CreatePaymentMethodPayload,
  UpdatePaymentMethodPayload,
} from '@/types/payment-method.types';
import {
  PAYMENT_METHOD_TYPE_LABELS,
  PAYMENT_METHOD_TYPE_ICONS,
} from '@/types/payment-method.types';
import { usePaymentMethodsStore } from '@/stores/payment-methods.store';
import { formatDate } from '@/utils/date-formatter';
import AppFilters from '@/components/common/AppFilters.vue';
import PaymentMethodForm from '@/components/payment-methods/PaymentMethodForm.vue';

const $q = useQuasar();
const paymentMethodsStore = usePaymentMethodsStore();

const isDialogOpen = ref<boolean>(false);
const selectedPaymentMethod = ref<PaymentMethod | null>(null);

const initialPagination = {
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
};

// Declaración desacoplada de los campos de filtro requeridos para el módulo.
const filterFields: FilterField[] = [
  {
    name: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Buscar por nombre...',
    colClass: 'col-12 col-sm-6 col-md-4',
  },
  {
    name: 'type',
    label: 'Tipo',
    type: 'select',
    placeholder: 'Todos los tipos',
    options: [
      { label: 'Tarjeta', value: 'CARD' },
      { label: 'Transferencia', value: 'TRANSFER' },
      { label: 'Efectivo', value: 'CASH' },
      { label: 'Billetera digital', value: 'WALLET' },
    ],
    colClass: 'col-12 col-sm-6 col-md-4',
  },
  {
    name: 'active',
    label: 'Estado',
    type: 'select',
    placeholder: 'Todos los estados',
    options: [
      { label: 'Activo', value: true },
      { label: 'Inactivo', value: false },
    ],
    colClass: 'col-12 col-sm-6 col-md-4',
  },
];

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

// Delega al store la aplicación de los filtros emitidos por AppFilters.
function handleSearch(filters: FilterValues): void {
  const criteria: PaymentMethodFilterCriteria = {};
  if (typeof filters.name === 'string') {
    criteria.name = filters.name;
  }
  if (typeof filters.type === 'string') {
    criteria.type = filters.type as PaymentMethodType;
  }
  if (typeof filters.active === 'boolean') {
    criteria.active = filters.active;
  }
  paymentMethodsStore.applyFilters(criteria);
}

// Restablece el listado completo eliminando los criterios de búsqueda en el store.
function handleClear(): void {
  paymentMethodsStore.clearFilters();
}

function handleOpenCreateDialog(): void {
  selectedPaymentMethod.value = null;
  isDialogOpen.value = true;
}

function handleOpenEditDialog(row: PaymentMethod): void {
  selectedPaymentMethod.value = { ...row };
  isDialogOpen.value = true;
}

function handleCloseDialog(): void {
  isDialogOpen.value = false;
  selectedPaymentMethod.value = null;
}

async function handleSavePaymentMethod(payload: {
  id?: string | undefined;
  name: string;
  type: PaymentMethodType;
  description?: string | undefined;
}): Promise<void> {
  if (selectedPaymentMethod.value) {
    const updatePayload: UpdatePaymentMethodPayload = {
      name: payload.name,
      type: payload.type,
      description: payload.description,
    };
    const success = await paymentMethodsStore.updatePaymentMethod(
      selectedPaymentMethod.value.id,
      updatePayload,
    );

    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Método de pago actualizado exitosamente',
        position: 'top',
      });
      handleCloseDialog();
    } else {
      $q.notify({
        type: 'negative',
        message: paymentMethodsStore.error || 'Error al actualizar el método de pago',
        position: 'top',
      });
    }
  } else {
    const createPayload: CreatePaymentMethodPayload = {
      name: payload.name,
      type: payload.type,
      description: payload.description,
    };
    const success = await paymentMethodsStore.createPaymentMethod(createPayload);

    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Método de pago creado exitosamente',
        position: 'top',
      });
      handleCloseDialog();
    } else {
      $q.notify({
        type: 'negative',
        message: paymentMethodsStore.error || 'Error al crear el método de pago',
        position: 'top',
      });
    }
  }
}

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
