<script setup lang="ts">
import type { GoogleSignInButton } from 'vue3-google-signin'
const { loggedIn, user, login, logout } = useUser()
</script>
<template>
  <div>
    <header class="flex items-center justify-center p-4">
      <div v-if="loggedIn && user">
        <UserTile :user="user">
          <button
            class="cursor-pointer underline text-blue-500"
            @click="() => logout()"
          >
            Logout
          </button>
        </UserTile>
      </div>
      <div v-else>
        <GoogleSignInButton
          one-tap
          auto-select
          text="signin"
          @success="login($event)"
        />
      </div>
    </header>
    <slot />
  </div>
</template>
