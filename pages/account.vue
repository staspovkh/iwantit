<script setup lang="ts">
const { user } = useUser()
watch(user, () => {
  if (!user.value) {
    const localePath = useLocalePath()
    return navigateTo(localePath({ name: 'index' }))
  }
})

definePageMeta({
  keepalive: true,
  middleware: ['auth'],
})
</script>
<template>
  <div>
    <NuxtPage />
  </div>
</template>
