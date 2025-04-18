import { z } from 'zod'
import { entityTables, entityTypeSchema } from '~/types/entities'

const bodySchema = z.object({
  list: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    }),
  ),
})

export default defineEventHandler(async (event) => {
  const entity = entityTypeSchema.parse(event.context.params?.entity)
  const { list } = await readValidatedBody(event, bodySchema.parse)

  const { error } = await event.context.supabase.client
    .from(entityTables[entity])
    .upsert(list)

  if (error) {
    return {
      ok: false,
    }
  }

  return {
    ok: true,
  }
})
