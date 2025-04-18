import { getEntities } from '~/server/utils/entity'

export default defineEventHandler(async (event) => {
  return getEntities(event, event.context.params?.entity)
})
