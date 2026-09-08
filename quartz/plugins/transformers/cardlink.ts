import yaml from "js-yaml"
import { Code, Html, Root } from "mdast"
import { SKIP, visit } from "unist-util-visit"
import cardLinkStyle from "../../styles/cardlink.scss"
import { QuartzTransformerPlugin } from "../types"

export interface CardLinkOptions {
  /** Fenced-code language emitted by Obsidian Auto Card Link. */
  language: string
  /** Open card destinations in a new browser tab. */
  openInNewTab: boolean
}

const defaultOptions: CardLinkOptions = {
  language: "cardlink",
  openInNewTab: true,
}

type CardLinkData = {
  url: string
  title?: string
  description?: string
  host?: string
  favicon?: string
  image?: string
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined

const asWebUrl = (value: unknown): string | undefined => {
  const candidate = asString(value)
  if (candidate === undefined) return undefined

  try {
    const url = new URL(candidate)
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined
  } catch {
    return undefined
  }
}

const parseCardLink = (node: Code): CardLinkData | undefined => {
  let parsed: unknown
  try {
    parsed = yaml.load(node.value, { schema: yaml.JSON_SCHEMA })
  } catch {
    return undefined
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return undefined
  const data = parsed as Record<string, unknown>
  const url = asWebUrl(data.url)
  if (url === undefined) return undefined

  let inferredHost: string
  try {
    inferredHost = new URL(url).hostname
  } catch {
    return undefined
  }

  return {
    url,
    title: asString(data.title),
    description: asString(data.description),
    host: asString(data.host) ?? inferredHost,
    favicon: asWebUrl(data.favicon),
    image: asWebUrl(data.image),
  }
}

const renderCardLink = (card: CardLinkData, openInNewTab: boolean): string => {
  const title = card.title ?? card.host ?? card.url
  const target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ""
  const image = card.image
    ? `<span class="auto-card-link-media" aria-hidden="true"><img src="${escapeHtml(card.image)}" alt="" loading="lazy" decoding="async"></span>`
    : ""
  const description = card.description
    ? `<span class="auto-card-link-description">${escapeHtml(card.description)}</span>`
    : ""
  const favicon = card.favicon
    ? `<img class="auto-card-link-favicon" src="${escapeHtml(card.favicon)}" alt="" loading="lazy" decoding="async">`
    : ""
  const host = card.host
    ? `<span class="auto-card-link-host">${favicon}<span>${escapeHtml(card.host)}</span></span>`
    : ""

  return `<a class="auto-card-link" href="${escapeHtml(card.url)}" aria-label="${escapeHtml(title)}" data-no-popover${target}><span class="auto-card-link-card">${image}<span class="auto-card-link-body"><span class="auto-card-link-title">${escapeHtml(title)}</span>${description}${host}</span></span></a>`
}

/**
 * Render Obsidian Auto Card Link's `cardlink` YAML fences as link previews.
 * Invalid cards intentionally remain ordinary code blocks so content is never lost.
 */
export const CardLink: QuartzTransformerPlugin<Partial<CardLinkOptions>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "CardLink",
    markdownPlugins() {
      return [
        () => (tree: Root) => {
          visit(tree, "code", (node, index, parent) => {
            if (node.lang?.toLowerCase() !== opts.language.toLowerCase()) return

            const card = parseCardLink(node)
            if (card === undefined || index === undefined || parent === undefined) return

            const html: Html = {
              type: "html",
              value: renderCardLink(card, opts.openInNewTab),
            }
            parent.children[index] = html
            return SKIP
          })
        },
      ]
    },
    externalResources() {
      return {
        css: [{ content: cardLinkStyle, inline: true }],
      }
    },
  }
}
