<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'
const { checkReservation } = useReservation()

defineEmits<{
  close: []
  remove: []
  edit: []
  complete: [boolean]
  reserve: [boolean]
}>()
defineProps<{
  item: WishlistItem
  open?: boolean
  actions?: boolean
}>()
</script>
<template>
  <Modal :open="open" medium sticky @close="$emit('close')">
    <div class="md:grid md:grid-cols-2 -m-4 -mt-14 text-base">
      <div class="relative aspect-square md:aspect-auto md:flex">
        <Image class="w-full" :src="item.picture?.[0]" :alt="item.name" />
        <WishlistItemStatus :item="item" class="absolute top-3 left-3" />
        <WishlistItemLevel :item="item" class="absolute bottom-3 right-3" />
      </div>
      <div class="md:flex flex-col p-5 text-sm">
        <div>
          <h1 class="font-bold text-lg/6 mr-8">{{ item.name }}</h1>
          <p v-if="item.price" class="mt-2">
            {{ Number(item.price) }} {{ item.currency }}
          </p>
          <p v-if="item.description" class="mt-2 text-black/60">
            {{ item.description }}
          </p>
        </div>
        <div class="grid gap-2 mt-auto pt-4">
          <Action
            v-if="!item.reserve && !item.completed"
            button
            secondary
            @click="$emit('reserve', true)"
          >
            {{ $t('global.reserve') }}
          </Action>
          <Action
            v-else-if="checkReservation(item.id)"
            button
            secondary
            @click="$emit('reserve', false)"
          >
            {{ $t('global.unreserve') }}
          </Action>
          <Action :to="item.link" button>
            {{ $t('global.buy') }}
            <Icon name="ic:outline-open-in-new" />
          </Action>
        </div>
      </div>
    </div>
  </Modal>
</template>
