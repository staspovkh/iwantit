import { addEntity } from '~/server/utils/entity'

export default defineEventHandler(async (event) => {
  return await addEntity(event, 'item', await readBody(event), true)
})
