<script setup lang="ts">
const { user } = useUser()
</script>
<template>
  <div>
    <NuxtLoadingIndicator />
    <ClientOnly v-if="user">
      <header id="siteHeader" class="bg-white shadow-md">
        <div class="max-w-[90rem] mx-auto p-6 flex items-center gap-4">
          <Action
            class="mr-auto"
            to="/"
            icon="ic:outline-home"
            :title="$t('global.home')"
          />
          <UserLogin />
        </div>
      </header>
    </ClientOnly>
    <div class="max-w-[90rem] mx-auto px-4 py-12">
      <slot />
    </div>
  </div>
</template>
