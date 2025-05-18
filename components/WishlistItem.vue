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
  <div>
    <div class="relative">
      <Action
        class="w-full bg-white rounded-xl overflow-hidden"
        :title="item.name"
        @click="openDetails()"
      >
        <Image
          :class="[
            'flex-1 aspect-square',
            {
              'opacity-50 grayscale': item.completed || item.reserve,
            },
          ]"
          :src="item.picture?.[0]"
          :alt="item.name"
          :preload="preload"
        />
      </Action>
      <WishlistItemStatus :item="item" class="absolute top-3 left-3" />
      <WishlistItemLevel :item="item" class="absolute bottom-3 right-3" />
      <div
        v-if="actions"
        class="absolute top-0 right-0 flex items-start gap-2 p-3 bg-white rounded-tr-xl rounded-bl-xl"
      >
        <Action
          icon="ic:outline-edit"
          :title="$t('global.edit')"
          @click="$emit('edit')"
        />
        <Action
          :icon="
            item.completed
              ? 'ic:outline-unpublished'
              : 'ic:outline-check-circle'
          "
          :title="$t(item.completed ? 'global.unpublish' : 'global.publish')"
          @click="$emit('complete', !item.completed)"
        />
        <Action
          icon="ic:outline-delete-forever"
          :title="$t('global.remove')"
          @click="$emit('remove')"
        />
      </div>
    </div>
    <div class="mt-3 text-sm">
      <div class="flex items-start gap-2">
        <h2 @click="openDetails()">
          {{ item.name }}
        </h2>
        <Action
          class="-my-0.5 ml-auto"
          icon="ic:outline-shopping-cart"
          :title="$t('global.details')"
          @click="openDetails()"
        />
      </div>
      <div>
        <p v-if="item.price" class="mt-1 font-bold">
          {{ Number(item.price) }} {{ item.currency }}
        </p>
      </div>
    </div>
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
  </div>
</template>
