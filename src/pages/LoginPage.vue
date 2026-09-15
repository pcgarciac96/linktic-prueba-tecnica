<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="login-page flex flex-center q-pa-md">
        <q-card class="login-card shadow-4 q-pa-lg">
          <q-card-section class="text-center q-pb-none">
            <q-avatar size="64px" font-size="36px" color="primary" text-color="white">
              <q-icon name="payments" />
            </q-avatar>
            <h1 class="text-h5 text-weight-bold q-mt-md q-mb-xs text-primary">Iniciar Sesión</h1>
            <p class="text-body2 text-grey-7">Gestión de Métodos de Pago</p>
          </q-card-section>

          <!-- Feedback visual de error ante credenciales incorrectas -->
          <q-card-section v-if="authStore.error" class="q-pt-sm q-pb-none">
            <q-banner dense rounded class="bg-red-1 text-negative border-negative">
              <template #avatar>
                <q-icon name="error" color="negative" />
              </template>
              <div class="text-caption text-weight-medium">{{ authStore.error }}</div>
            </q-banner>
          </q-card-section>

          <q-card-section class="q-pt-md">
            <q-form class="q-gutter-md" @submit.prevent="handleSubmit">
              <q-input
                v-model="email"
                outlined
                type="email"
                label="Correo electrónico *"
                placeholder="ejemplo@correo.com"
                lazy-rules
                :rules="[
                  (val: string) =>
                    (Boolean(val) && val.trim().length > 0) || 'El correo es obligatorio',
                  (val: string) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Formato de correo no válido',
                ]"
                :disable="authStore.isLoading"
                autocomplete="email"
                @update:model-value="onFieldChange"
              >
                <template #prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>

              <q-input
                v-model="password"
                outlined
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña *"
                lazy-rules
                :rules="[
                  (val: string) =>
                    (Boolean(val) && val.length > 0) || 'La contraseña es obligatoria',
                ]"
                :disable="authStore.isLoading"
                autocomplete="current-password"
                @update:model-value="onFieldChange"
              >
                <template #prepend>
                  <q-icon name="lock" />
                </template>
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <div class="q-pt-sm">
                <q-btn
                  label="Iniciar sesión"
                  type="submit"
                  color="primary"
                  class="full-width text-weight-bold"
                  size="lg"
                  unelevated
                  :loading="authStore.isLoading"
                >
                  <template #loading>
                    <q-spinner-dots class="on-left" />
                    <span>Autenticando...</span>
                  </template>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

// Limpia posibles mensajes residuales al montar la pantalla de autenticacion.
onMounted(() => {
  authStore.clearError();
});

function onFieldChange(): void {
  if (authStore.error) {
    authStore.clearError();
  }
}

// Cvalidación de credenciales con la store y redirecciona.
async function handleSubmit(): Promise<void> {
  const isSuccess = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (isSuccess) {
    const redirectTarget =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/payment-methods';
    await router.push(redirectTarget);
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  background: #ffffff;
}

.border-negative {
  border: 1px solid rgba(193, 0, 21, 0.2);
}
</style>
