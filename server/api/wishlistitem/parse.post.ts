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
  price: z.string().or(z.number()).optional(),
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

const getName = (html: HTMLElement, data?: Record<string, any>) => {
  return (
    data?.name ??
    data?.title ??
    getMetaContent(html, 'og:title') ??
    getItemProp(html, 'name')
  )
}
const getDescription = (html: HTMLElement, data?: Record<string, any>) => {
  const description =
    data?.description ?? getMetaContent(html, 'og:description')
  if (description) {
    const match = description.match(/([^.!?]*[.!?]){1,3}/)
    return match ? match[0].trim() : description.trim()
  }

  return undefined
}
const getImage = (html: HTMLElement, data?: Record<string, any>) => {
  return (
    getMetaContent(html, 'og:image') ??
    getMetaContent(html, 'twitter:image') ??
    getMetaContent(html, 'image') ??
    data?.image ??
    data?.thumbnailUrl ??
    getItemProp(html, 'image')
  )
}
const getPrice = (html: HTMLElement, data?: Record<string, any>) => {
  const price =
    data?.offers?.[0]?.price ??
    data?.offers?.price ??
    getMetaContent(html, 'product:price:amount') ??
    getMetaContent(html, 'product:price') ??
    getMetaContent(html, 'og:price:amount') ??
    getMetaContent(html, 'og:price') ??
    getItemProp(html, 'price')
  return price ? String(price) : undefined
}
const getCurrency = (html: HTMLElement, data?: Record<string, any>) => {
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
const getBrand = (html: HTMLElement, data?: Record<string, any>) => {
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

const fetchPageHTML = async (url: string) => {
  let result
  try {
    result = await $fetch(url)
  } catch {
    result = null
  }
  return result
}

const scrapPageHTML = async (url: string) => {
  const { page } = await hubBrowser()
  await page.goto(url, { waitUntil: 'networkidle0' })
  const result = await page.content()
  return result
}

export default defineEventHandler(async (event) => {
  const { url } = await readValidatedBody(event, bodySchema.parse)
  const result = (await fetchPageHTML(url)) ?? (await scrapPageHTML(url))
  if (typeof result === 'string') {
    const html = parse(result)
    const data = html
      .querySelectorAll('script[type="application/ld+json"]')
      ?.map((el) => jsonParse(el.innerHTML))
      .find((item) =>
        Array.isArray(item['@type'])
          ? item['@type'].includes('Product')
          : item['@type'] === 'Product',
      )

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
      result,
    }
  }
  return {
    ok: false,
    payload: null,
  }
})
