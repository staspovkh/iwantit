<script setup lang="ts"></script>
<template>
  <div>
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto p-6 flex items-center gap-4">
        <Action class="mr-auto" to="/" icon="ic:outline-home" title="Home" />
        <ClientOnly>
          <UserLogin />
        </ClientOnly>
      </div>
    </header>
    <div class="max-w-7xl mx-auto p-6">
      <div class="bg-white rounded-xl p-4 shadow-md">
        <slot />
      </div>
    </div>
  </div>
</template>
