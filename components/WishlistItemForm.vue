<script setup lang="ts">
import type { WishlistItemData } from '~/types'

defineEmits<{ submitted: [WishlistItemData] }>()
const props = defineProps<{ item?: WishlistItemData }>()

const { parseItem } = useWishlist('')

const itemLoading = ref(false)
const itemUrl = ref('')
const itemModel = reactive<WishlistItemData>({
  link: '',
  name: '',
  description: '',
  picture: '',
  price: '',
  currency: '',
})

const updateModel = (newItem: Partial<WishlistItemData>) => {
  itemUrl.value = newItem.link || ''
  itemModel.link = newItem.link ?? itemModel.link
  itemModel.name = newItem.name ?? itemModel.name
  itemModel.description = newItem.description ?? itemModel.description
  itemModel.picture = newItem.picture ?? itemModel.picture
  itemModel.price = newItem.price ?? itemModel.price
  itemModel.currency = newItem.currency ?? itemModel.currency
}

const updateModelFromUrl = async (url: string) => {
  itemLoading.value = true
  const item = await parseItem(url)
  if (item) {
    updateModel(item)
  }
  itemLoading.value = false
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
      @submitted="$emit('submitted', $event as WishlistItemData)"
    />
  </div>
</template>
