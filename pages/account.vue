<script setup lang="ts">
definePageMeta({
  keepalive: true,
  middleware: defineNuxtRouteMiddleware(async () => {
    const { user } = useUser()
    if (!user.value) {
      return navigateTo({ name: 'index' })
    }
  }),
})
</script>
<template>
  <div>
    <NuxtPage />
  </div>
</template>
