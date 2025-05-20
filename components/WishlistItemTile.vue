<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

defineEmits<{
  details: []
  remove: []
  edit: []
  complete: [boolean]
  reserve: [boolean]
}>()
defineProps<{
  item: WishlistItem
  actions?: boolean
  preload?: boolean
}>()

const { checkReservation } = useReservation()

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
        v-if="item.reserve"
        icon="ic:baseline-undo"
        :title="$t('global.unreserve')"
        @click="$emit('reserve:remove')"
      />
      <Action
        :icon="
          item.completed ? 'ic:outline-unpublished' : 'ic:outline-check-circle'
        "
        :title="$t(item.completed ? 'global.unpublish' : 'global.publish')"
        @click="$emit('complete', !item.completed)"
      />
      <Action
        icon="ic:outline-edit"
        :title="$t('global.edit')"
        @click="$emit('edit')"
      />
      <Action
        icon="ic:outline-delete-forever"
        :title="$t('global.remove')"
        @click="$emit('remove')"
      />
    </template>
    <p v-if="item.price" class="mt-1 font-bold">
      {{ Number(item.price) }} {{ item.currency }}
    </p>
    <div class="grid grid-flow-col auto-cols-fr gap-3 mt-2">
      <Action
        v-if="!item.reserve && !item.completed"
        button
        secondary
        small
        @click="$emit('reserve', true)"
      >
        {{ $t('global.reserve') }}
      </Action>
      <Action
        v-else-if="checkReservation(item.id)"
        button
        secondary
        small
        @click="$emit('reserve', false)"
      >
        {{ $t('global.unreserve') }}
      </Action>
      <Action :to="item.link" button small>
        {{ $t('global.buy') }}
        <Icon name="ic:outline-open-in-new" size="16" />
      </Action>
    </div>
    <WishlistItemModal
      :item="item"
      :open="showDetails"
      :actions="actions"
      @close="closeDetails()"
      @remove="$emit('remove')"
      @edit="$emit('edit')"
      @complete="$emit('complete', $event)"
      @reserve="$emit('reserve', $event)"
    />
  </Tile>
</template>
