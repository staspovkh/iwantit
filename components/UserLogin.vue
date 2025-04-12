<script setup lang="ts">
import type { GoogleSignInButton } from 'vue3-google-signin'
const { user, login, logout } = useUser()
</script>
<template>
  <div class="flex items-center gap-4">
    <template v-if="user">
      <UserTile :user="user" />
      <Action icon="ic:outline-logout" title="Logout" @click="logout()" />
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
      <Action icon="ic:outline-login" title="Login" @click="login()" />
    </template>
  </div>
</template>
