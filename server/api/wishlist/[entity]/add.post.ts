import { addEntity } from '~/server/utils/entity'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body.tag) {
    body.tag = body.tag?.filter(Boolean)
    if (body.tag?.length) {
      const { payload: savedTags } = await getEntities(event, 'tag', {
        filters: [['name', 'in', body.tag]],
      })
      const newTagNames = body.tag.filter(
        (tagName: string) => !savedTags?.some((tag) => tag.name === tagName),
      )
      if (newTagNames.length) {
        const { payload: newTags } = await addEntity(
          event,
          'tag',
          newTagNames.map((name: string) => ({ name })),
        )
        savedTags.push(...newTags)
      }
      body.tag = savedTags.map((tag: { id: string }) => tag.id)
    } else {
      body.tag = undefined
    }
  }
  return await addEntity(event, event.context.params?.entity, body)
})
