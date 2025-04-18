<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

const emit = defineEmits<{ submitted: [Partial<WishlistItem>] }>()
const props = defineProps<{ item?: WishlistItem }>()

const itemLoading = ref(false)
const itemUrl = ref('')
const itemModel = reactive({
  link: '',
  name: '',
  description: '',
  picture: '',
  price: '',
  currency: '',
  tag: '',
})

const updateModel = (newItem: Partial<WishlistItem>) => {
  itemUrl.value = newItem.link || ''
  itemModel.link = newItem.link ?? itemModel.link
  itemModel.name = newItem.name ?? itemModel.name
  itemModel.description = newItem.description ?? itemModel.description
  itemModel.picture = newItem.picture?.[0] ?? itemModel.picture
  itemModel.price = newItem.price?.toString() ?? itemModel.price
  itemModel.currency = newItem.currency ?? itemModel.currency
  itemModel.tag = newItem.tag?.filter(Boolean).join(', ') ?? itemModel.tag
}

const updateModelFromUrl = async (url: string) => {
  itemLoading.value = true
  const item = await parseWishlistItem(url)
  if (item) {
    updateModel(item)
  }
  itemLoading.value = false
}

const submitForm = (data: typeof itemModel) => {
  const formData = {
    ...data,
    link: itemUrl.value,
    picture: data.picture ? [data.picture] : undefined,
    price: data.price ? Number(data.price) : undefined,
    tag: data.tag.split(',').map((tag) => tag.trim()),
  }
  emit('submitted', formData)
}

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      updateModel(newItem)
    }
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <Input
      name="page-url"
      type="text"
      placeholder="Enter page URL"
      class="grid grid-cols-[1fr_1.5rem] gap-2 mb-6"
      :value="itemUrl"
      @update:value="itemUrl = String($event)"
    >
      <Action
        icon="ic:outline-refresh"
        title="Parse"
        :disabled="!itemUrl"
        @click="updateModelFromUrl(itemUrl)"
      />
    </Input>
    <Form
      :class="[
        'transition-opacity duration-300',
        {
          'opacity-30 pointer-events-none': itemLoading,
        },
      ]"
      :model="itemModel"
      name="wishlist-item"
      :button-label="item ? 'update wishlist item' : 'add wishlist item'"
      @submitted="submitForm($event as typeof itemModel)"
    />
  </div>
</template>
