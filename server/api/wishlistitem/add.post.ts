import { z } from 'zod'

const bodySchema = z.object({
  wishlist: z.string(),
  id: z.string().optional(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  picture: z.array(z.string()).nullish(),
  price: z.number().nullish(),
  currency: z.string().nullish(),
  brand: z.string().nullish(),
  link: z.string().nullish(),
  tag: z.array(z.string()).nullish(),
})

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export default defineEventHandler(async (event) => {
  const { id, ...item } = await readValidatedBody(event, bodySchema.parse)

  if (Object.keys(item).length) {
    if (item.tag?.length) {
      const { data: savedTags } = await event.context.supabase.client
        .from('wishlist_tag')
        .select('id, name')
        .eq('user', event.context.supabase.user.id)
        .in('name', item.tag)
      const newTagNames = item.tag.filter(
        (tagName) =>
          !savedTags?.some((tag: { name: string }) => tag.name === tagName),
      )
      if (newTagNames.length) {
        const { data: newTags } = await event.context.supabase.client
          .from('wishlist_tag')
          .insert(newTagNames.map((name) => ({ name })))
          .select()
        savedTags.push(...newTags)
      }
      item.tag = savedTags.map((tag: { id: string }) => tag.id)
    }
    let result
    if (id) {
      result = await event.context.supabase.client
        .from('wishlist_item')
        .update(item)
        .eq('id', id)
    } else {
      result = await event.context.supabase.client
        .from('wishlist_item')
        .insert(item)
    }
    if (result.error) {
      return {
        ok: false,
      }
    }
  }

  return {
    ok: true,
  }
})
