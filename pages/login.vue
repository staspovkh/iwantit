<script setup lang="ts">
const { user } = useUser()

definePageMeta({
  keepalive: true,
  middleware: defineNuxtRouteMiddleware(async () => {
    const { user } = useUser()
    if (user.value) {
      const localePath = useLocalePath()
      return navigateTo(localePath({ name: 'account' }))
    }
  }),
})

watch(user, () => {
  if (user.value) {
    const localePath = useLocalePath()
    return navigateTo(localePath({ name: 'account' }))
  }
})
</script>
<template>
  <div>
    <ClientOnly>
      <UserLogin v-if="!user" class="justify-center" />
    </ClientOnly>
  </div>
</template>
