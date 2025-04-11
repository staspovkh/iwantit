<script setup lang="ts">
import type { User } from '~/types'

defineProps<{ user: User }>()
</script>
<template>
  <div class="grid grid-cols-[4rem_1fr] items-center gap-4">
    <NuxtImg class="w-16 h-16 rounded-full bg-amber-100" :src="user.picture" />
    <div>
      <p class="font-bold tracking-wide text-lg">{{ user.name }}</p>
      <slot />
    </div>
  </div>
</template>
