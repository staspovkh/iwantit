<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

defineEmits<{ remove: []; edit: [] }>()
const props = defineProps<{
  item: WishlistItem
  actions?: boolean
  preload?: boolean
}>()

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
    :class="[
      'bg-white border rounded-2xl transition-shadow duration-300',
      'shadow-2xl shadow-black/10 hover:shadow-black/30 ',
    ]"
  >
    <div class="relative">
      <Action
        v-if="item.picture?.[0]"
        class="w-full rounded-t-2xl overflow-hidden"
        :to="item.link"
        :title="item.name"
      >
        <Image
          class="flex-1 aspect-square"
          :src="item.picture[0]"
          :alt="item.name"
          :preload="preload"
        />
      </Action>
      <Icon :name="icon" class="absolute top-2 right-2 text-orange-500" />
    </div>
    <div class="p-4">
      <div class="flex items-start justify-between gap-2">
        <Action class="font-semibold text-base/normal mr-auto" :to="item.link">
          {{ item.name }}
        </Action>
        <Action
          v-if="actions"
          icon="ic:outline-delete-forever"
          title="Remove"
          @click="$emit('remove')"
        />
        <Action
          v-if="actions"
          icon="ic:outline-edit"
          title="Edit"
          @click="$emit('edit')"
        />
      </div>
      <p v-if="item.price" class="mt-2 font-semibold text-red-700">
        {{ Number(item.price) }} {{ item.currency }}
      </p>
      <p v-if="item.description" class="mt-2 text-sm text-black/60">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>
