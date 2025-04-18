import { getEntity } from '~/server/utils/entity'

export default defineEventHandler(async (event) => {
  return await getEntity(
    event,
    event.context.params?.entity,
    await readBody(event),
  )
})
