<script setup lang="ts"></script>
<template>
  <div>
    <NuxtLoadingIndicator />
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto p-6 flex items-center gap-4">
        <Action class="mr-auto" to="/" icon="ic:outline-home" title="Home" />
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
