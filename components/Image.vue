<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    src?: string | null
    srcset?: string
    sizes?: string
    format?: string
    alt?: string | null
    preload?: boolean
    loading?: 'lazy' | 'eager'
    width?: string | number
    height?: string | number
    fetchpriority?: 'high' | 'low' | 'auto'
    wrapperTag?: string
  }>(),
  {
    alt: '',
    loading: 'lazy',
    wrapperTag: 'span',
  },
)

const errorLoading = ref(false)
const noImage = '/images/noimage.svg'

const handleError = () => {
  errorLoading.value = true
}

const imageRef = ref()

watch(
  () => props.src,
  () => {
    imageRef.value?.$el.removeAttribute('data-error')
    errorLoading.value = false
  },
)

onMounted(() => {
  if (imageRef.value?.$el.getAttribute('data-error')) {
    handleError()
  }
})
</script>
<template>
  <component :is="wrapperTag" class="block overflow-hidden">
    <NuxtImg
      ref="imageRef"
      :class="['block w-full h-full object-cover']"
      :src="errorLoading ? noImage : src || noImage"
      :sizes="sizes"
      :format="format"
      :alt="alt ?? ''"
      :width="width"
      :height="height"
      :loading="loading"
      :preload="fetchpriority ? { fetchPriority: fetchpriority } : preload"
      :fetchpriority="fetchpriority ? fetchpriority : undefined"
      @error="handleError"
    />
    <slot />
  </component>
</template>
