<script setup lang="ts">
import type { WishlistItem } from '~/types/entities'

const defaultModel = {
  link: '',
  name: '',
  description: '',
  picture: '',
  price: '',
  currency: '',
  tag: [],
  level: '0',
}

const item2Form = (item?: Partial<WishlistItem>) => {
  const result = entityToForm<Omit<WishlistItem, 'id'>>(item)
  result.picture = item?.picture?.[0] || ''
  return result
}

const emit = defineEmits<{ submitted: [Partial<WishlistItem>] }>()
const props = defineProps<{ item?: WishlistItem }>()

const { model, updateModel } = useEntityForm<typeof defaultModel>(
  defaultModel,
  computed(() => item2Form(props.item)),
)
const { tags, getTags } = useTags()

const fieldsExt = computed(() => ({
  tag: {
    options: tags.value.map((tag) => ({
      label: tag.name ?? tag.id,
      value: tag.name ?? tag.id,
    })),
  },
}))

const itemLoading = ref(false)

const updateModelFromUrl = async (url: string) => {
  itemLoading.value = true
  const item = await parseWishlistItem(url)
  if (item) {
    updateModel(item2Form(item))
  }
  itemLoading.value = false
}

const submitForm = (data: typeof defaultModel) => {
  const formData = {
    ...data,
    picture: data.picture ? [data.picture] : undefined,
    price: data.price ? Number(data.price) : undefined,
    level: data.level ? Number(data.level) : undefined,
  }
  emit('submitted', formData)
}

onMounted(() => {
  getTags()
})
</script>
<template>
  <div>
    <Form
      :class="[
        'transition-opacity duration-300',
        {
          'opacity-30 pointer-events-none': itemLoading,
        },
      ]"
      :model="model"
      :fields-ext="fieldsExt"
      name="wishlist-item"
      button-label="global.save"
      @submitted="submitForm($event as typeof defaultModel)"
    >
      <template #link-action>
        <Action
          icon="ic:outline-refresh"
          :title="$t('global.parse')"
          :disabled="!model.link"
          @click="updateModelFromUrl(model.link)"
        />
      </template>
    </Form>
  </div>
</template>
