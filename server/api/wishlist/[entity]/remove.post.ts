import { removeEntity } from '~/server/utils/entity'

export default defineEventHandler(async (event) => {
  return await removeEntity(
    event,
    event.context.params?.entity,
    await readBody(event),
  )
})
