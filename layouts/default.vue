<script setup lang="ts">
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
          <UserLogin />
        </ClientOnly>
      </div>
    </header>
    <div class="max-w-7xl mx-auto p-6">
      <slot />
    </div>
  </div>
</template>
