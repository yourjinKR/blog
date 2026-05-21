import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

function getOrder(data: QuartzPluginData): number | undefined {
  const rawOrder = data.frontmatter?.order
  const order =
    rawOrder === undefined || rawOrder === null || rawOrder === "" ? NaN : Number(rawOrder)
  return Number.isFinite(order) ? order : undefined
}

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byOrderAndFolderFirst(cfg: GlobalConfiguration): SortFn {
  const fallback = byDateAndAlphabeticalFolderFirst(cfg)

  return (f1, f2) => {
    const order1 = getOrder(f1)
    const order2 = getOrder(f2)

    if (order1 !== undefined && order2 !== undefined && order1 !== order2) {
      return order1 - order2
    } else if (order1 !== undefined && order2 === undefined) {
      return -1
    } else if (order1 === undefined && order2 !== undefined) {
      return 1
    }

    return fallback(f1, f2)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []

        return (
          <li class="section-li">
            <div class="section">
              <p class="meta">
                {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
              </p>
              <div class="desc">
                <h3>
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    {title}
                  </a>
                </h3>
              </div>
              <ul class="tags">
                {tags.map((tag) => (
                  <li>
                    <a
                      class="internal tag-link"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
