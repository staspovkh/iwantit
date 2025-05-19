<script setup lang="ts">
import type { User } from '~/types'

defineProps<{ user: User }>()
</script>
<template>
  <Action
    :to="`/account`"
    class="grid grid-cols-[1.5rem_1fr] items-center gap-2"
  >
    <Image
      class="w-6 h-6 rounded-full bg-amber-100"
      :src="user.picture"
      sizes="sm:24"
    />
    <span class="font-semibold text-base/normal">
      {{ user.name || user.email }}
    </span>
  </Action>
</template>
