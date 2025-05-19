<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

defineEmits<{
  details: []
  remove: []
  edit: []
  complete: [boolean]
  'reserve:add': []
  'reserve:remove': []
}>()
defineProps<{
  item: WishlistItem
  actions?: boolean
  preload?: boolean
}>()
const showDetails = ref(false)
const openDetails = () => {
  showDetails.value = true
}
const closeDetails = () => {
  showDetails.value = false
}
</script>
<template>
  <Tile
    :title="item.name"
    :image="item.picture?.[0]"
    :preload="preload"
    :disabled="Boolean(item.completed || item.reserve)"
    @details="openDetails()"
  >
    <template #image>
      <WishlistItemStatus :item="item" class="absolute top-3 left-3" />
      <WishlistItemLevel :item="item" class="absolute bottom-3 right-3" />
    </template>
    <template v-if="actions" #actions>
      <Action
        icon="ic:outline-edit"
        :title="$t('global.edit')"
        @click="$emit('edit')"
      />
      <Action
        :icon="
          item.completed ? 'ic:outline-unpublished' : 'ic:outline-check-circle'
        "
        :title="$t(item.completed ? 'global.unpublish' : 'global.publish')"
        @click="$emit('complete', !item.completed)"
      />
      <Action
        icon="ic:outline-delete-forever"
        :title="$t('global.remove')"
        @click="$emit('remove')"
      />
    </template>
    <template #title>
      <Action
        class="-my-0.5 ml-auto"
        icon="ic:outline-shopping-cart"
        :title="$t('global.details')"
        @click="openDetails()"
      />
    </template>
    <p v-if="item.price" class="mt-1 font-bold">
      {{ Number(item.price) }} {{ item.currency }}
    </p>
    <WishlistItemModal
      :item="item"
      :open="showDetails"
      :actions="actions"
      @close="closeDetails()"
      @remove="$emit('remove')"
      @edit="$emit('edit')"
      @complete="$emit('complete', $event)"
      @reserve:add="$emit('reserve:add')"
      @reserve:remove="$emit('reserve:remove')"
    />
  </Tile>
</template>
