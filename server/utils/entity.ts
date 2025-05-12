import { z } from 'zod'
import type { H3Event } from 'h3'
import type { EntityType } from '~/types/entities'
import {
  entityPayloadSchema,
  entityTables,
  entityTypeSchema,
} from '~/types/entities'

const getEntitySchema = (type: EntityType) =>
  entityPayloadSchema.shape[type].element

const getAllBodySchema = z.object({
  ids: z.array(z.string()).optional(),
  filters: z
    .array(z.tuple([z.string(), z.enum(['in', 'eq']), z.unknown()]))
    .optional(),
})

export const getEntities = async (
  event: H3Event,
  type?: string,
  body?: unknown,
) => {
  const { ids, filters } = getAllBodySchema.parse(body ?? {})
  const entityType = entityTypeSchema.parse(type)
  const entitySchema = getEntitySchema(entityType)
  const keys = Object.keys(entitySchema.shape).join(', ')
  const query = event.context.supabase.client
    .from(entityTables[entityType])
    .select(keys)
    .order('order', { ascending: true })
    .order('created_at', { ascending: false })

  if (ids?.length) {
    query.in('id', ids)
  } else {
    query.eq('user', event.context.supabase?.user?.id)
  }

  for (const filter of filters ?? []) {
    const [filterKey, operator, value] = filter
    query[operator](filterKey, value)
  }

  const { data, error } = await query

  if (!error && data) {
    return {
      ok: true,
      payload: z.array(entitySchema).safeParse(data).data ?? [],
    }
  }

  return {
    ok: false,
    payload: [],
  }
}

const getBodySchema = z.object({
  id: z.string(),
  children: z.array(entityTypeSchema).optional(),
})

export const getEntity = async (
  event: H3Event,
  type?: string,
  body?: unknown,
) => {
  const { id, children } = getBodySchema.parse(body)
  const entityType = entityTypeSchema.parse(type)
  const entitySchema = getEntitySchema(entityType)
  const entityKeys = Object.keys(entitySchema.shape)

  const childrenData = (children ?? []).map((type) => ({
    type,
    table: entityTables[type],
    keys: Object.keys(getEntitySchema(type).shape),
  }))

  for (const child of childrenData) {
    entityKeys.push(`${child.table} (${child.keys.join(', ')})`)
  }

  const query = event.context.supabase.client
    .from(entityTables[entityType])
    .select(entityKeys.join(', '))
    .eq('id', id)

  for (const child of childrenData) {
    query
      .order('order', { ascending: true, referencedTable: child.table })
      .order('created_at', {
        ascending: false,
        referencedTable: child.table,
      })
  }

  const { data, error } = await query.single()

  if (
    !error &&
    (data?.public || data.user === event.context.supabase.user?.id)
  ) {
    const { data: parsedData } = entitySchema
      .merge(entityPayloadSchema.partial())
      .safeParse({
        ...data,
        ...childrenData.reduce(
          (acc, child) => ({
            ...acc,
            [child.type]: data[child.table],
          }),
          {},
        ),
      })
    return {
      ok: Boolean(parsedData),
      payload: parsedData,
    }
  }
  return {
    ok: false,
    payload: null,
  }
}

const addBodySchema = z.object({
  id: z.string().optional(),
})

const addDataValid = (data: { id?: string }) => {
  return Object.keys(data).length > (data.id ? 1 : 0)
}

export const addEntity = async (
  event: H3Event,
  type?: string,
  body?: unknown,
) => {
  const entityType = entityTypeSchema.parse(type)
  const entitySchema = getEntitySchema(entityType).merge(addBodySchema)
  const bodySchema = entitySchema.or(z.array(entitySchema))
  const data = bodySchema.parse(body)

  if (
    Array.isArray(data)
      ? data.length && data.every(addDataValid)
      : addDataValid(data)
  ) {
    let result
    if ('id' in data && data.id) {
      const { id, ...rest } = data
      result = await event.context.supabase.client
        .from(entityTables[entityType])
        .update(rest)
        .eq('id', id)
        .eq('user', event.context.supabase.user.id)
        .select()
    } else {
      result = await event.context.supabase.client
        .from(entityTables[entityType])
        .insert(data)
        .select()
    }
    if (!result.error && result.data) {
      return {
        ok: true,
        payload: Array.isArray(result.data) ? result.data : [result.data],
      }
    }
  }

  return {
    ok: false,
    payload: null,
  }
}

const removeBodySchema = z.object({
  id: z.string(),
})

export const removeEntity = async (
  event: H3Event,
  type?: string,
  body?: unknown,
) => {
  const entityType = entityTypeSchema.parse(type)
  const { id } = removeBodySchema.parse(body)

  const { error } = await event.context.supabase.client
    .from(entityTables[entityType])
    .delete()
    .eq('user', event.context.supabase.user.id)
    .eq('id', id)

  if (error) {
    return {
      ok: false,
    }
  }

  return {
    ok: true,
  }
}
