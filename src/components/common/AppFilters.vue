<template>
  <q-card flat bordered class="q-pa-md q-mb-md bg-white app-filters-card">
    <q-form ref="formRef" @submit.prevent="handleSearch">
      <div class="row q-col-gutter-md items-center">
        <div
          v-for="field in fields"
          :key="field.name"
          :class="field.colClass || 'col-12 col-sm-6 col-md-4'"
        >
          <q-input
            v-if="field.type === 'text'"
            :model-value="(formValues[field.name] as string) ?? ''"
            outlined
            dense
            clearable
            :label="field.label"
            :placeholder="field.placeholder"
            :rules="getFieldRules(field)"
            lazy-rules
            @update:model-value="(val) => (formValues[field.name] = val)"
          />

          <q-select
            v-else-if="field.type === 'select'"
            :model-value="formValues[field.name]"
            outlined
            dense
            clearable
            emit-value
            map-options
            :label="field.label"
            :options="field.options || []"
            :rules="getFieldRules(field)"
            lazy-rules
            @update:model-value="(val) => (formValues[field.name] = val)"
          />
        </div>

        <div class="col-12 col-md-auto q-ml-auto">
          <div class="row q-gutter-sm justify-end">
            <q-btn
              type="button"
              flat
              color="grey-7"
              icon="clear"
              label="Limpiar"
              no-caps
              @click="handleClear"
            />
            <q-btn type="submit" color="primary" icon="search" label="Buscar" unelevated no-caps />
          </div>
        </div>
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { QForm } from 'quasar';
import type { FilterField, FilterValues } from '@/types/filter.types';

interface Props {
  fields: FilterField[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'search', filters: FilterValues): void;
  (e: 'clear'): void;
}>();

const formRef = ref<QForm | null>(null);

// Mantiene el estado reactivo interno de los campos sin alterar el componente padre.
const formValues = reactive<Record<string, string | number | boolean | null>>({});

watch(
  () => props.fields,
  (newFields) => {
    newFields.forEach((field) => {
      if (!(field.name in formValues)) {
        formValues[field.name] = null;
      }
    });
  },
  { immediate: true },
);

function getFieldRules(field: FilterField) {
  if (!field.required) {
    return [];
  }

  return [
    (val: unknown) => {
      const isFilled =
        typeof val === 'string' ? val.trim().length > 0 : val !== null && val !== undefined;
      return isFilled || `${field.label} es obligatorio`;
    },
  ];
}

async function handleSearch(): Promise<void> {
  if (!formRef.value) {
    return;
  }

  const isValid = await formRef.value.validate();
  if (!isValid) {
    return;
  }

  const activeFilters: FilterValues = {};
  for (const [key, val] of Object.entries(formValues)) {
    if (val !== null && val !== undefined) {
      activeFilters[key] = val;
    }
  }

  emit('search', activeFilters);
}

// Restaura los valores iniciales y limpia los estados de error de validación visual.
function handleClear(): void {
  props.fields.forEach((field) => {
    formValues[field.name] = null;
  });

  if (formRef.value) {
    formRef.value.resetValidation();
  }

  emit('clear');
}
</script>

<style scoped lang="scss">
.app-filters-card {
  border-radius: 8px;
}
</style>
