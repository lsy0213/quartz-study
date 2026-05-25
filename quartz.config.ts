import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "siy 的学习指挥台",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "lsy0213.github.io/quartz-study",
    ignorePatterns: [
      "private",
      "templates",
      ".obsidian",
      ".trash",
      "**/_private*",      // 任何位置以 _private 开头的文件夹都不发布
      "CAD自动提取",        // 暂时不发布(整理好后删掉这一行即可)
      "学习总览.md",        // 内部维护的总览(由 study-plan 技能更新),公开版用 index.md
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "LXGW WenKai TC",
        body: "Noto Sans SC",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#fdfaf4",          // 米黄底色,温暖不刺眼
          lightgray: "#e8e0d2",      // 边框,与底色协调
          gray: "#a89c8a",           // 次要文字
          darkgray: "#3c3a36",       // 正文
          dark: "#1f1d1a",           // 标题
          secondary: "#8b5a3c",      // 主题色:复古棕红 (链接/强调)
          tertiary: "#c97b5a",       // 辅助色:暖橘 (悬停/活动)
          highlight: "rgba(201, 123, 90, 0.12)",  // wikilink 卡片背景
          textHighlight: "#f5d76e88",             // 文字高亮
        },
        darkMode: {
          light: "#1a1a1f",
          lightgray: "#2e2e36",
          gray: "#6b6b75",
          darkgray: "#d8d3c5",
          dark: "#f5f0e6",
          secondary: "#d4a574",      // 暖金色
          tertiary: "#e8b896",
          highlight: "rgba(212, 165, 116, 0.15)",
          textHighlight: "#d4a57466",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
