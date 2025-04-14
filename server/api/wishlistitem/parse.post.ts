import { z } from 'zod'
import type { HTMLElement } from 'node-html-parser'
import { parse } from 'node-html-parser'

const bodySchema = z.object({
  url: z.string(),
})

const payloadSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  picture: z.string().optional(),
  price: z.string().optional(),
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

const getName = (html: HTMLElement, data?: Record<string, any>) => {
  return data?.name ?? data?.title ?? getMetaContent(html, 'og:title')
}
const getDescription = (html: HTMLElement, data?: Record<string, any>) => {
  return data?.description ?? getMetaContent(html, 'og:description')
}
const getImage = (html: HTMLElement, data?: Record<string, any>) => {
  return (
    data?.image ??
    data?.thumbnailUrl ??
    getMetaContent(html, 'og:image') ??
    getMetaContent(html, 'twitter:image') ??
    getMetaContent(html, 'image')
  )
}
const getPrice = (html: HTMLElement, data?: Record<string, any>) => {
  return (
    data?.offers?.[0]?.price ??
    data?.offers?.price ??
    getMetaContent(html, 'product:price:amount') ??
    getMetaContent(html, 'product:price') ??
    getMetaContent(html, 'og:price:amount') ??
    getMetaContent(html, 'og:price')
  )
}
const getCurrency = (html: HTMLElement, data?: Record<string, any>) => {
  return (
    data?.offers?.[0]?.priceCurrency ??
    data?.offers?.priceCurrency ??
    getMetaContent(html, 'product:price:currency') ??
    getMetaContent(html, 'product:currency') ??
    getMetaContent(html, 'og:price:currency') ??
    getMetaContent(html, 'og:currency')
  )
}
const getBrand = (html: HTMLElement, data?: Record<string, any>) => {
  return (
    data?.brand?.name ??
    data?.brand ??
    getMetaContent(html, 'product:brand') ??
    getMetaContent(html, 'og:brand') ??
    getMetaContent(html, 'twitter:brand') ??
    getMetaContent(html, 'brand')
  )
}

export default defineEventHandler(async (event) => {
  const { url } = await readValidatedBody(event, bodySchema.parse)
  const result = await $fetch(url)
  if (typeof result === 'string') {
    const html = parse(result)
    const data = html
      .querySelectorAll('script[type="application/ld+json"]')
      ?.map((el) => jsonParse(el.innerHTML))
      .find((item) => item['@type'] === 'Product')

    const payload = payloadSchema.parse({
      name: getName(html, data),
      description: getDescription(html, data),
      picture: getImage(html, data),
      price: getPrice(html, data),
      currency: getCurrency(html, data),
      brand: getBrand(html, data),
      link: url,
    })

    return {
      ok: true,
      payload,
    }
  }
  return {
    ok: false,
    payload: null,
  }
})
