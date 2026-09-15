<template>
  <q-card class="payment-method-form-card">
    <q-card-section class="row items-center justify-between q-pb-none">
      <div class="text-h6 text-weight-bold text-primary">
        {{ isEditMode ? 'Editar Método de Pago' : 'Nuevo Método de Pago' }}
      </div>
      <q-btn flat round dense icon="close" :disable="loading" @click="$emit('cancel')" />
    </q-card-section>

    <q-separator class="q-my-sm" />

    <q-form ref="formRef" class="q-gutter-y-md q-pa-md" @submit.prevent="handleSubmit">
      <q-input
        v-model="formData.name"
        outlined
        dense
        label="Nombre del método *"
        placeholder="Ej. Visa Débito Corporativa"
        :rules="[
          (val: string) => (Boolean(val) && val.trim().length > 0) || 'El nombre es obligatorio',
        ]"
        lazy-rules
        :disable="loading"
        autofocus
      >
        <template #prepend>
          <q-icon name="payments" />
        </template>
      </q-input>

      <q-select
        v-model="formData.type"
        outlined
        dense
        emit-value
        map-options
        label="Tipo de método *"
        :options="typeOptions"
        :rules="[(val: unknown) => Boolean(val) || 'Debe seleccionar un tipo de método']"
        lazy-rules
        :disable="loading"
      >
        <template #prepend>
          <q-icon name="category" />
        </template>
      </q-select>

      <!-- Campo Descripción -->
      <q-input
        v-model="formData.description"
        outlined
        dense
        type="textarea"
        rows="3"
        label="Descripción (opcional)"
        placeholder="Información adicional sobre las condiciones o alcance del método..."
        :disable="loading"
      >
        <template #prepend>
          <q-icon name="notes" />
        </template>
      </q-input>

      <q-card-actions align="right" class="q-px-none q-pt-md">
        <q-btn
          type="button"
          flat
          label="Cancelar"
          color="grey-7"
          no-caps
          :disable="loading"
          @click="$emit('cancel')"
        />
        <q-btn
          type="submit"
          color="primary"
          unelevated
          no-caps
          :label="isEditMode ? 'Guardar cambios' : 'Crear método'"
          :loading="loading"
        >
          <template #loading>
            <q-spinner-dots class="on-left" />
            <span>{{ isEditMode ? 'Guardando...' : 'Creando...' }}</span>
          </template>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { QForm } from 'quasar';
import type { PaymentMethod, PaymentMethodType } from '@/types/payment-method.types';
import { PAYMENT_METHOD_TYPE_LABELS } from '@/types/payment-method.types';

interface Props {
  paymentMethod?: PaymentMethod | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  paymentMethod: null,
  loading: false,
});

const emit = defineEmits<{
  (
    e: 'save',
    payload: {
      id?: string | undefined;
      name: string;
      type: PaymentMethodType;
      description?: string | undefined;
    },
  ): void;
  (e: 'cancel'): void;
}>();

const formRef = ref<QForm | null>(null);

// Permite reutilizar el formulario para creación y edición determinando el modo por las props.
const isEditMode = computed(() => Boolean(props.paymentMethod && props.paymentMethod.id));

const typeOptions: { label: string; value: PaymentMethodType }[] = [
  { label: PAYMENT_METHOD_TYPE_LABELS.CARD, value: 'CARD' },
  { label: PAYMENT_METHOD_TYPE_LABELS.TRANSFER, value: 'TRANSFER' },
  { label: PAYMENT_METHOD_TYPE_LABELS.CASH, value: 'CASH' },
  { label: PAYMENT_METHOD_TYPE_LABELS.WALLET, value: 'WALLET' },
];

// Evita modificar directamente los datos recibidos mediante props aislando el estado local.
const formData = reactive<{
  name: string;
  type: PaymentMethodType | null;
  description: string;
}>({
  name: '',
  type: null,
  description: '',
});

watch(
  () => props.paymentMethod,
  (current) => {
    if (current && !isEditMode.value) {
      formData.name = current.name;
      formData.type = current.type;
      formData.description = current.description || '';
    } else {
      formData.name = '';
      formData.type = null;
      formData.description = '';
    }
    formRef.value?.resetValidation();
  },
  { immediate: true },
);

// Valida y emite los datos hacia el componente padre sin interactuar con la persistencia.
async function handleSubmit(): Promise<void> {
  if (!formRef.value) {
    return;
  }

  const isValid = await formRef.value.validate();
  if (!isValid || !formData.type) {
    return;
  }

  emit('save', {
    id: props.paymentMethod?.id,
    name: formData.name.trim(),
    type: formData.type,
    description: formData.description ? formData.description.trim() : '',
  });
}
</script>

<style scoped lang="scss">
.payment-method-form-card {
  width: 100%;
  max-width: 520px;
  border-radius: 8px;
}
</style>
