import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import AiNotice from "./quartz/components/AiNotice"
import { FileTrieNode } from "./quartz/util/fileTrie"

const sortByOrder = (a: FileTrieNode, b: FileTrieNode) => {
  const rawA = a.data?.order as unknown
  const rawB = b.data?.order as unknown
  const parsedA = rawA === undefined || rawA === null || rawA === "" ? 999 : Number(rawA)
  const parsedB = rawB === undefined || rawB === null || rawB === "" ? 999 : Number(rawB)
  const orderA = Number.isFinite(parsedA) ? parsedA : 999
  const orderB = Number.isFinite(parsedB) ? parsedB : 999

  const orderDiff = orderA - orderB
  if (orderDiff !== 0) {
    return orderDiff
  }

  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "yourjinKR/blog",
        repoId: "R_kgDOSiHDYw",
        category: "Q&A",
        categoryId: "DIC_kwDOSiHDY84DIHUK",
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        inputPosition: "bottom",
        themeUrl: "https://giscus.app/themes",
        lightTheme: "light",
        darkTheme: "dark",
        lang: "ko",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),

    Component.ConditionalRender({
      component: AiNotice(),
      condition: (page) => page.fileData.frontmatter?.ai == true,
    })
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => {
        return node.displayName !== "Excalidraw"
      },
      sortFn: sortByOrder,
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => {
        // 리스트에 숨길 폴더명 입력
        return node.displayName !== "Excalidraw"
      },
      sortFn: sortByOrder,
    }),
  ],
  right: [],
}
