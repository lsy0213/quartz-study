// Live2D 看板娘 - 固定初音未来模型 + 跨页面持久化
// 基于 oh-my-live2d (更现代的封装,支持指定单一模型)
// Miku 模型来源: npm 包 live2d-widget-model-miku

const OML2D_CDN = "https://cdn.jsdelivr.net/npm/oh-my-live2d@latest/dist/index.min.js"
const MIKU_MODEL = "https://cdn.jsdelivr.net/npm/live2d-widget-model-miku@1.0.5/assets/miku.model.json"

let scriptLoaded = false
let widgetInitialized = false

function initWidget() {
  // @ts-ignore - OML2D 由 oh-my-live2d 注入到 window
  if (typeof OML2D === "undefined") return
  if (widgetInitialized) return
  widgetInitialized = true

  // @ts-ignore
  OML2D.loadOml2d({
    // 模型: 固定为 Miku
    models: [
      {
        path: MIKU_MODEL,
        scale: 0.16,
        position: [0, 60],
        stageStyle: { width: 280, height: 320 },
      },
    ],
    // 浮动位置: 左下角
    dockedPosition: "left",
    docked: false,
    // 移动端隐藏 (避免挡住内容)
    mobileDisplay: false,
    // 关闭欢迎语 toast 防止打扰
    tips: {
      idleTips: {
        message: ["今天也要加油学习哦~", "记得多复习闪卡！", "保持节奏，每天前进一点点。"],
        duration: 5000,
        interval: 30000,
      },
      welcomeTips: {
        message: { daytime: "欢迎回来", night: "夜深了,注意休息" },
      },
    },
    // 工具栏: 仅保留隐藏按钮
    menus: {
      disable: false,
      items: ["Hidden"],
    },
    // Logo/品牌信息隐藏,更干净
    statusBar: { disable: true },
    // 父容器: 挂到 documentElement 而不是 body, SPA 导航时不被清除
    parentElement: document.documentElement,
  })
}

function loadOml2dScript() {
  if (scriptLoaded) return
  scriptLoaded = true

  const script = document.createElement("script")
  script.src = OML2D_CDN
  script.async = true
  script.onload = initWidget
  script.onerror = () => {
    console.warn("[Live2D] 加载失败,可能是 CDN 暂时不可用")
    scriptLoaded = false
  }
  document.head.appendChild(script)
}

document.addEventListener("nav", () => {
  // 首次进入:加载脚本
  if (!scriptLoaded) {
    loadOml2dScript()
    return
  }
  // 后续 SPA 导航:确保 widget 仍然存在
  // 如果 oh-my-live2d 创建的元素被 Quartz 移除,尝试重新挂载
  // @ts-ignore
  if (typeof OML2D !== "undefined" && !document.getElementById("oml2d")) {
    widgetInitialized = false
    initWidget()
  }
})
