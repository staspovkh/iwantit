<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'
defineProps<{ item: WishlistItem }>()
</script>
<template>
  <div
    v-if="item.completed || item.reserve"
    :class="[
      'flex items-center gap-1 px-2 py-1 rounded-lg text-xs',
      {
        'bg-green-200 text-green-800': item.completed,
        'bg-orange-200 text-orange-800': !item.completed,
      },
    ]"
  >
    <Icon
      v-if="item.completed"
      name="ic:outline-check"
      class="text-green-600"
      size="16"
    />
    {{ $t(item.completed ? 'global.completed' : 'global.reserved') }}
  </div>
</template>
