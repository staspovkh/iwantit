<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

defineEmits<{
  remove: []
  edit: []
  complete: [boolean]
  'reserve:add': []
  'reserve:remove': []
}>()
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
      'flex flex-col',
      'bg-white border rounded-2xl transition-shadow duration-300',
      'shadow-2xl shadow-black/10 hover:shadow-black/30 ',
    ]"
  >
    <div
      :class="[
        'relative',
        {
          'opacity-40': item.completed,
        },
      ]"
    >
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
        <Action
          :class="[
            'font-semibold text-base/normal mr-auto',
            { 'opacity-40': item.completed },
          ]"
          :to="item.link"
        >
          {{ item.name }}
        </Action>
        <template v-if="actions">
          <Action
            :disabled="item.completed"
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
        </template>
      </div>
      <div
        :class="[
          {
            'opacity-40': item.completed,
          },
        ]"
      >
        <p v-if="item.price" class="mt-2 font-semibold text-red-700">
          {{ Number(item.price) }} {{ item.currency }}
        </p>
        <p v-if="item.description" class="mt-2 text-sm text-black/60">
          {{ item.description }}
        </p>
      </div>
    </div>
    <div
      class="min-h-18 flex items-center justify-center p-4 pt-2 mt-auto font-bold"
    >
      <template v-if="item.completed">{{ $t('global.completed') }}</template>
      <template v-else-if="item.reserve">
        <span>{{ $t('global.reserved') }}</span>
        <Action
          v-if="actions"
          class="ml-auto"
          icon="ic:outline-delete-forever"
          :title="$t('global.unreserve')"
          @click="$emit('reserve:remove')"
        />
      </template>
      <Action
        v-else
        class="w-full"
        button
        secondary
        @click="$emit('reserve:add')"
      >
        {{ $t('global.reserve') }}
      </Action>
    </div>
  </div>
</template>
