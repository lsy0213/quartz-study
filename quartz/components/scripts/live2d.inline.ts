// Live2D 看板娘 - 固定初音未来模型 + 跨页面持久化
// 基于 oh-my-live2d (更现代的封装,支持指定单一模型)
// Miku 模型来源: npm 包 live2d-widget-model-miku

const OML2D_CDN = "https://cdn.jsdelivr.net/npm/oh-my-live2d@latest/dist/index.min.js"

// ============================================================
//  模型库 — 想换哪一个,就把下面 MODELS 数组里的项重新排列/筛选
//  数组里所有模型会形成"切换队列",点 Live2D 的 ✨ 切换按钮可以循环换装
//  只想固定一个? 删掉其它,只保留一个即可
// ============================================================
const MODELS = [
  {
    name: "Miku - 初音未来",
    path: "https://cdn.jsdelivr.net/npm/live2d-widget-model-miku@1.0.5/assets/miku.model.json",
    scale: 0.24,
    position: [0, 40] as [number, number],
    draggable: true,           // 可拖动到任意位置
  },
  // 其它备选模型(默认注释掉,需要时打开)
  // {
  //   name: "Shizuku - 校园女孩",
  //   path: "https://cdn.jsdelivr.net/npm/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
  //   scale: 0.18, position: [0, 30] as [number, number],
  // },
  // {
  //   name: "Hibiki - 双马尾少女",
  //   path: "https://cdn.jsdelivr.net/npm/live2d-widget-model-hibiki@1.0.5/assets/hibiki.model.json",
  //   scale: 0.5, position: [0, 50] as [number, number],
  // },
  // {
  //   name: "Wanko - 柴犬",
  //   path: "https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json",
  //   scale: 0.6, position: [0, 80] as [number, number],
  // },
]

let scriptLoaded = false
let widgetInitialized = false

function initWidget() {
  // @ts-ignore - OML2D 由 oh-my-live2d 注入到 window
  if (typeof OML2D === "undefined") return
  if (widgetInitialized) return
  widgetInitialized = true

  // @ts-ignore
  OML2D.loadOml2d({
    // 模型清单 (顶部 MODELS 数组)
    models: MODELS,
    // 浮动位置: 左下角
    dockedPosition: "left",
    docked: false,
    // 舞台容器:缩小一点,避免挡住左侧文件列表
    sayHello: false,
    stageStyle: {
      width: 300,
      height: 380,
    },
    // 全局允许拖拽
    transitionTime: 300,
    // 移动端隐藏 (避免挡住内容)
    mobileDisplay: false,
    // 闲置鼓励语
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
