<script setup lang="ts">
const { user, login, logout } = useUser()
</script>
<template>
  <div>
    <header class="shadow-md">
      <div class="max-w-7xl mx-auto p-6 flex items-center gap-4">
        <NuxtLink
          class="cursor-pointer hover:text-blue-500 mr-auto"
          to="/"
          title="Home"
        >
          <Icon name="ic:outline-home" width="24" height="24" />
        </NuxtLink>
        <ClientOnly>
          <template v-if="user">
            <UserTile :user="user" />
            <button
              class="cursor-pointer hover:text-blue-500"
              title="Logout"
              @click="() => logout()"
            >
              <Icon name="ic:outline-logout" width="24" height="24" />
            </button>
          </template>
          <template v-else>
            <button
              class="cursor-pointer hover:text-blue-500"
              title="Login"
              @click="() => login()"
            >
              <Icon name="ic:outline-login" width="24" height="24" />
            </button>
          </template>
        </ClientOnly>
      </div>
    </header>
    <div class="max-w-7xl mx-auto p-6">
      <slot />
    </div>
  </div>
</template>
