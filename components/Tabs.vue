<script setup lang="ts">
const emit = defineEmits<{ click: [number] }>()
defineProps<{ names: string[] }>()

const selectedIndex = ref(0)
const handleClick = (index: number) => {
  selectedIndex.value = index
  emit('click', selectedIndex.value)
}
</script>
<template>
  <div class="flex gap-3 flex-wrap">
    <Action
      v-for="(name, index) in names"
      :key="name"
      :class="[{ '!bg-black text-white': selectedIndex === index }]"
      button
      secondary
      @click="handleClick(index)"
    >
      {{ name }}
    </Action>
  </div>
</template>
