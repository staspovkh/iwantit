<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'
const props = defineProps<{ item: WishlistItem }>()
const icon = computed(() => {
  switch (props.item.level) {
    case 1:
      return 'ic:baseline-sentiment-satisfied-alt'
    case 2:
      return 'ic:baseline-sentiment-very-satisfied'
    default:
      return 'ic:baseline-sentiment-satisfied'
  }
})
</script>
<template>
  <div
    class="absolute bottom-3 right-3 p-1 bg-white rounded-full text-orange-500"
    :title="$t(`wishlist.level.${item.level ?? '0'}`)"
  >
    <Icon :name="icon" :size="32" />
  </div>
</template>
