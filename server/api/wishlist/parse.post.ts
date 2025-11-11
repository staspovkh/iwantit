import { z } from 'zod'
import type { HTMLElement } from 'node-html-parser'
import { parse } from 'node-html-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MetaRecord = Record<string, any>

const bodySchema = z.object({
  url: z.string(),
})

const payloadSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  picture: z.array(z.string()).optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  brand: z.string().optional(),
  link: z.string().optional(),
})

const jsonParse = (data: string, fallback = {}) => {
  try {
    return JSON.parse(data)
  } catch {
    return fallback
  }
}

const getMetaContent = (html: HTMLElement, property: string) => {
  return html
    .querySelector(`meta[property="${property}"]`)
    ?.getAttribute('content')
}

const getItemProp = (html: HTMLElement, property: string) => {
  const itemProp = html.querySelector(
    `[itemtype="https://schema.org/Product"] [itemprop="${property}"]`,
  )
  return itemProp?.getAttribute('content') ?? itemProp?.textContent
}

const getName = (html: HTMLElement, data?: MetaRecord) => {
  return (
    data?.name ??
    data?.title ??
    getMetaContent(html, 'og:title') ??
    getItemProp(html, 'name')
  )
}
const getDescription = (html: HTMLElement, data?: MetaRecord) => {
  const description =
    data?.description ?? getMetaContent(html, 'og:description')
  if (typeof description === 'string') {
    const match = RegExp(/([^.!?]*[.!?]){1,3}/).exec(description)
    return match ? match[0].trim() : description.trim()
  }

  return undefined
}
const getImage = (html: HTMLElement, data?: MetaRecord) => {
  return (
    getMetaContent(html, 'og:image') ??
    getMetaContent(html, 'twitter:image') ??
    getMetaContent(html, 'image') ??
    data?.image ??
    data?.thumbnailUrl ??
    getItemProp(html, 'image')
  )
}
const getPrice = (html: HTMLElement, data?: MetaRecord) => {
  const price =
    data?.offers?.[0]?.price ??
    data?.offers?.price ??
    getMetaContent(html, 'product:price:amount') ??
    getMetaContent(html, 'product:price') ??
    getMetaContent(html, 'og:price:amount') ??
    getMetaContent(html, 'og:price') ??
    getItemProp(html, 'price')
  return price ? Number(price) : undefined
}
const getCurrency = (html: HTMLElement, data?: MetaRecord) => {
  return (
    data?.offers?.[0]?.priceCurrency ??
    data?.offers?.priceCurrency ??
    getMetaContent(html, 'product:price:currency') ??
    getMetaContent(html, 'product:currency') ??
    getMetaContent(html, 'og:price:currency') ??
    getMetaContent(html, 'og:currency') ??
    getItemProp(html, 'priceCurrency')
  )
}
const getBrand = (html: HTMLElement, data?: MetaRecord) => {
  return (
    data?.brand?.name ??
    data?.brand ??
    getMetaContent(html, 'product:brand') ??
    getMetaContent(html, 'og:brand') ??
    getMetaContent(html, 'twitter:brand') ??
    getMetaContent(html, 'brand') ??
    getItemProp(html, 'brand')
  )
}

const parsePageHTML = (result?: string) => {
  const html = parse(result ?? '', {
    parseNoneClosedTags: true,
  })
  const data = html
    .querySelectorAll('script[type="application/ld+json"]')
    ?.map((el) => jsonParse(el.innerHTML))
    .find((item) =>
      Array.isArray(item['@type'])
        ? item['@type'].includes('Product')
        : item['@type'] === 'Product',
    )

  const image = getImage(html, data)

  return payloadSchema.parse({
    name: getName(html, data),
    description: getDescription(html, data),
    picture: image ? [image] : undefined,
    price: getPrice(html, data),
    currency: getCurrency(html, data),
    brand: getBrand(html, data),
  })
}

const fetchPageHTML = async (url: string) => {
  let result
  try {
    result = await $fetch(url)
  } catch {
    //
  }
  return result as string | undefined
}

const scrapPageHTML = async (url: string) => {
  try {
    const { page } = await hubBrowser()
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    const result = await page.content()
    return result
  } catch (err) {
    console.error('Hub browser failed, falling back to fetch', err)
  }

  return undefined
}

export default defineEventHandler(async (event) => {
  const { url } = await readValidatedBody(event, bodySchema.parse)

  const handlers = [fetchPageHTML, scrapPageHTML]

  while (handlers.length) {
    const handler = handlers.shift()
    if (handler) {
      const result = await handler(url)
      const payload = parsePageHTML(result)

      if (Object.values(payload).some((value) => value)) {
        return {
          ok: true,
          payload,
          result,
        }
      }
    }
  }

  return {
    ok: false,
    payload: null,
  }
})
