<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

defineEmits<{ remove: []; edit: [] }>()
defineProps<{ item: WishlistItem; actions?: boolean }>()
</script>
<template>
  <div
    :class="[
      'bg-white border rounded-2xl transition-shadow duration-300',
      'shadow-2xl shadow-black/10 hover:shadow-black/30 ',
    ]"
  >
    <Action
      v-if="item.picture?.[0]"
      class="w-full aspect-square rounded-t-2xl overflow-hidden"
      :to="item.link"
      :title="item.name"
      target="_blank"
      rel="noopener noreferrer"
    >
      <NuxtImg class="w-full h-full object-cover" :src="item.picture[0]" />
    </Action>
    <div class="p-4">
      <div class="flex items-start justify-between gap-2">
        <Action
          class="font-semibold text-base/normal mr-auto"
          :to="item.link"
          target="_blank"
          rel="noopener noreferrer"
        >
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
