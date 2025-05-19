<script setup lang="ts">
import type { WishlistTag } from '~/types/entities'

const { user } = useUser()
const { loading, tags, getTags, addTag, removeTag, sortTags } = useTags()

const modalOpen = ref(false)
const tagToEdit = ref<WishlistTag | undefined>()

const openModal = (tag?: WishlistTag) => {
  modalOpen.value = true
  tagToEdit.value = tag
}

const closeModal = () => {
  modalOpen.value = false
  tagToEdit.value = undefined
}

const submitModal = async (item: Partial<WishlistTag>) => {
  await addTag({
    ...item,
    id: tagToEdit.value?.id,
  })
  closeModal()
}

watch(user, () => getTags())
onMounted(() => {
  getTags()
})

const sortingMode = ref(false)
const sortingEl = ref<HTMLElement | null>(null)
const sortingItems = ref<WishlistTag[]>([])

const toggleSorting = (enable?: boolean) => {
  if (enable ?? !sortingMode.value) {
    sortingItems.value = [...(tags.value ?? [])]
    sortingMode.value = true
    if (sortingItems.value.length) {
      nextTick(() => {
        useSortable(sortingEl, sortingItems, {
          ghostClass: 'opacity-50',
          chosenClass: '',
          animation: 300,
        })
      })
    }
  } else {
    sortTags(sortingItems.value)
    nextTick(() => {
      sortingMode.value = false
      sortingItems.value = []
    })
  }
}

definePageMeta({
  keepalive: true,
  middleware: ['auth'],
})
</script>
<template>
  <div>
    <WishlistLayout
      v-if="user"
      :title="$t('account.tags.title')"
      :loading="loading"
    >
      <template #actions>
        <Action
          :class="[
            'rounded-sm',
            {
              'bg-black text-white hover:bg-blue-500 hover:text-white':
                sortingMode,
            },
          ]"
          :disabled="tags.length < 2"
          icon="ic:outline-repeat"
          :title="$t('tags.sort')"
          @click="toggleSorting()"
        />
        <Action
          icon="ic:outline-plus"
          :title="$t('tags.add')"
          @click="openModal()"
        />
      </template>
      <ul
        v-if="tags.length"
        ref="sortingEl"
        class="flex flex-wrap justify-center gap-4 mt-4"
      >
        <li
          v-for="tag in sortingMode ? sortingItems : tags"
          :key="tag.id"
          :class="[
            'tile flex items-center justify-between gap-1 font-bold',
            {
              'cursor-pointer': sortingMode,
            },
          ]"
        >
          <span class="mr-auto pl-1 pr-2">{{ tag.name }}</span>
          <Action
            icon="ic:outline-delete-forever"
            :title="$t('tags.remove')"
            :disabled="sortingMode"
            @click="!sortingMode && removeTag(tag.id)"
          />
          <Action
            icon="ic:outline-edit"
            :title="$t('tags.edit')"
            :disabled="sortingMode"
            @click="!sortingMode && openModal(tag)"
          />
        </li>
      </ul>
      <Modal
        :title="tagToEdit ? 'tags.edit' : 'tags.add'"
        :open="modalOpen"
        @close="modalOpen = false"
      >
        <WishlistTagForm :tag="tagToEdit" @submitted="submitModal($event)" />
      </Modal>
    </WishlistLayout>
  </div>
</template>
