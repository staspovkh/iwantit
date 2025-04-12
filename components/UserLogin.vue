<script setup lang="ts">
import type { GoogleSignInButton } from 'vue3-google-signin'
const { user, login, logout } = useUser()
</script>
<template>
  <div class="flex items-center gap-4">
    <template v-if="user">
      <UserTile :user="user" />
      <button
        class="cursor-pointer hover:text-blue-500"
        title="Logout"
        @click="logout()"
      >
        <Icon name="ic:outline-logout" width="24" height="24" />
      </button>
    </template>
    <template v-else>
      <GoogleSignInButton
        class="absolute opacity-0 pointer-events-none"
        one-tap
        auto-select
        text="signin"
        size="small"
        @success="login($event.credential)"
      />

      <button
        class="cursor-pointer hover:text-blue-500"
        title="Login"
        @click="login()"
      >
        <Icon name="ic:outline-login" width="24" height="24" />
      </button>
    </template>
  </div>
</template>
