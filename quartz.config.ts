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
          light: "#fcfdfc",          // 几乎纯白,带极轻冷调
          lightgray: "#e4ebe6",      // 边框/分隔线
          gray: "#9aa8a0",           // 次要文字
          darkgray: "#3a443e",       // 正文
          dark: "#1a201c",           // 标题
          secondary: "#3f8a6b",      // 主题色:清新深绿 (链接/强调)
          tertiary: "#7cc4a3",       // 辅助色:嫩绿 (悬停/装饰)
          highlight: "rgba(124, 196, 163, 0.13)",  // 淡绿色背景填充
          textHighlight: "#b8f0c688",              // 荧光绿高亮
        },
        darkMode: {
          light: "#161a17",
          lightgray: "#2a302c",
          gray: "#6a756f",
          darkgray: "#d4dcd7",
          dark: "#f0f4f1",
          secondary: "#8fd1ad",      // 柔和绿
          tertiary: "#a8d8be",
          highlight: "rgba(143, 209, 173, 0.13)",
          textHighlight: "#8fd1ad55",
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
