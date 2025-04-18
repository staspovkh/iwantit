<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

type WishlistItemForm = Omit<
  WishlistItem,
  'id' | 'picture' | 'price' | 'tag'
> & {
  picture?: string
  price?: string
  tag?: string
}

const item2Form = (item: Partial<WishlistItem>): Partial<WishlistItemForm> => ({
  ...item,
  picture: item.picture?.[0],
  price: typeof item.price === 'number' ? String(item.price) : undefined,
  tag: item.tag?.filter(Boolean).join(', '),
})

const emit = defineEmits<{ submitted: [Partial<WishlistItem>] }>()
const props = defineProps<{ item?: WishlistItem }>()

const { model, updateModel } = useEntityForm<WishlistItemForm>(
  {
    link: '',
    name: '',
    description: '',
    picture: '',
    price: '',
    currency: '',
    tag: '',
  },
  computed(() => props.item && item2Form(props.item)),
)

const itemLoading = ref(false)
const itemUrl = ref(toRef(props, 'item').value?.link || '')

const updateModelFromUrl = async (url: string) => {
  itemLoading.value = true
  const item = await parseWishlistItem(url)
  if (item) {
    updateModel(item2Form(item))
  }
  itemLoading.value = false
}

const submitForm = (data: WishlistItemForm) => {
  const formData = {
    ...data,
    picture: data.picture ? [data.picture] : undefined,
    price: data.price ? Number(data.price) : undefined,
    tag: data.tag?.split(',').map((tag) => tag.trim()),
  }
  emit('submitted', formData)
}
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
      :model="model"
      name="wishlist-item"
      :button-label="item ? 'update wishlist item' : 'add wishlist item'"
      @submitted="submitForm"
    />
  </div>
</template>
