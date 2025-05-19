<script setup lang="ts">
defineEmits<{
  details: []
}>()
defineProps<{
  title?: string | null
  image?: string | null
  link?: string | null
  preload?: boolean
  disabled?: boolean
}>()
</script>
<template>
  <div>
    <div class="relative">
      <Action
        class="w-full bg-white rounded-xl overflow-hidden"
        :title="title"
        :to="link"
        @click="$emit('details')"
      >
        <Image
          :class="[
            'flex-1 aspect-square',
            {
              'opacity-50 grayscale': disabled,
            },
          ]"
          :src="image"
          :alt="title"
          :preload="preload"
        />
      </Action>
      <slot name="image" />
      <div
        v-if="$slots.actions"
        class="absolute top-0 right-0 flex items-start gap-2 p-3 bg-white rounded-tr-xl rounded-bl-xl"
      >
        <slot name="actions" />
      </div>
    </div>
    <div class="mt-3 text-sm">
      <div v-if="title" class="flex items-start gap-2">
        <Action :to="link" @click="$emit('details')">
          {{ title }}
        </Action>
        <slot name="title" />
      </div>
      <slot />
    </div>
  </div>
</template>
