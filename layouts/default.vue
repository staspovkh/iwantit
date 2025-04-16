<script setup lang="ts"></script>
<template>
  <div>
    <NuxtLoadingIndicator />
    <header id="siteHeader" class="bg-white shadow-md">
      <div class="max-w-[90rem] mx-auto p-6 flex items-center gap-4">
        <Action class="mr-auto" to="/" icon="ic:outline-home" title="Home" />
        <ClientOnly>
          <UserLogin />
        </ClientOnly>
      </div>
    </header>
    <div class="max-w-[90rem] mx-auto px-4 py-6">
      <slot />
    </div>
  </div>
</template>
