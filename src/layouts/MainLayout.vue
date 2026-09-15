<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-md">
        <q-icon name="payments" size="md" class="q-mr-sm" />

        <q-toolbar-title class="text-weight-bold"> Gestión de Métodos de Pago </q-toolbar-title>

        <div v-if="authStore.currentUser" class="row items-center q-gutter-sm">
          <q-chip
            color="primary-light"
            text-color="blue"
            icon="account_circle"
            class="gt-xs text-weight-medium"
          >
            {{ authStore.currentUser.name }}
          </q-chip>

          <q-btn
            flat
            dense
            no-caps
            icon="logout"
            label="Cerrar sesión"
            class="q-px-sm"
            @click="handleLogout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

async function handleLogout(): Promise<void> {
  authStore.logout();
  await router.push('/login');
}
</script>
