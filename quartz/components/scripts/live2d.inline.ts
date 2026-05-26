// Live2D 看板娘 - 精美装扮模型 + 手动拖拽 + 位置记忆
// 基于 oh-my-live2d

const OML2D_CDN = "https://cdn.jsdelivr.net/npm/oh-my-live2d@latest/dist/index.min.js"

// ============================================================
//  Cubism 4 官方示例模型 (https://github.com/Live2D/CubismWebSamples)
//  这些是 Live2D 官方免费发布的高质量模型,与 oh-my-live2d 完全兼容
// ============================================================
const SAMPLE_BASE =
  "https://cdn.jsdelivr.net/gh/Live2D/CubismWebSamples@master/Samples/Resources"

const MODELS = [
  {
    name: "Hiyori - 双马尾水手服少女",
    path: `${SAMPLE_BASE}/Hiyori/Hiyori.model3.json`,
    scale: 0.18,
    position: [0, 100] as [number, number],
  },
  // 其它官方模型 - 取消注释来切换:
  // {
  //   name: "Haru - 学院风长发少女 (官方)",
  //   path: `${SAMPLE_BASE}/Haru/Haru.model3.json`,
  //   scale: 0.16, position: [0, 80] as [number, number],
  // },
  // {
  //   name: "Mao - 猫耳少女",
  //   path: `${SAMPLE_BASE}/Mao/Mao.model3.json`,
  //   scale: 0.16, position: [0, 80] as [number, number],
  // },
  // {
  //   name: "Natori - 和风少女",
  //   path: `${SAMPLE_BASE}/Natori/Natori.model3.json`,
  //   scale: 0.16, position: [0, 80] as [number, number],
  // },
  // {
  //   name: "Mark - 男生 (供参考)",
  //   path: `${SAMPLE_BASE}/Mark/Mark.model3.json`,
  //   scale: 0.16, position: [0, 80] as [number, number],
  // },
]

const POS_STORAGE_KEY = "live2d-position"

let scriptLoaded = false
let widgetInitialized = false
let dragSetupDone = false

function setupDrag() {
  if (dragSetupDone) return

  // oh-my-live2d 异步挂载,需要轮询等容器出现
  const findContainer = (): HTMLElement | null => {
    return (
      document.querySelector("#oml2d-stage") ||
      document.querySelector(".oml2d-stage") ||
      document.querySelector("#oml2d") ||
      document.querySelector(".oml2d") ||
      document.querySelector("[data-oml2d-container]")
    ) as HTMLElement | null
  }

  let attempts = 0
  const tryAttach = () => {
    const container = findContainer()
    if (!container) {
      attempts++
      if (attempts < 40) setTimeout(tryAttach, 250)
      return
    }

    dragSetupDone = true

    // 恢复保存的位置
    try {
      const saved = localStorage.getItem(POS_STORAGE_KEY)
      if (saved) {
        const pos = JSON.parse(saved)
        container.style.left = pos.left + "px"
        container.style.top = pos.top + "px"
        container.style.bottom = "auto"
        container.style.right = "auto"
      }
    } catch (_) {}

    // 鼠标样式提示可拖
    container.style.cursor = "grab"
    container.style.transition = "none"

    let isDragging = false
    let startMouseX = 0
    let startMouseY = 0
    let startElemX = 0
    let startElemY = 0

    container.addEventListener("mousedown", (e: MouseEvent) => {
      // 点工具按钮、菜单、tip 气泡时不拖
      const target = e.target as HTMLElement
      if (target.tagName === "BUTTON" || target.closest("button")) return
      if (target.closest(".oml2d-menus") || target.closest(".oml2d-tips")) return

      isDragging = true
      const rect = container.getBoundingClientRect()
      startMouseX = e.clientX
      startMouseY = e.clientY
      startElemX = rect.left
      startElemY = rect.top
      container.style.cursor = "grabbing"
      container.style.userSelect = "none"
      e.preventDefault()
    })

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - startMouseX
      const dy = e.clientY - startMouseY
      const newLeft = Math.max(0, Math.min(window.innerWidth - 50, startElemX + dx))
      const newTop = Math.max(0, Math.min(window.innerHeight - 50, startElemY + dy))
      container.style.left = newLeft + "px"
      container.style.top = newTop + "px"
      container.style.bottom = "auto"
      container.style.right = "auto"
    })

    document.addEventListener("mouseup", () => {
      if (!isDragging) return
      isDragging = false
      container.style.cursor = "grab"
      container.style.userSelect = ""
      // 保存位置
      const rect = container.getBoundingClientRect()
      try {
        localStorage.setItem(
          POS_STORAGE_KEY,
          JSON.stringify({ left: rect.left, top: rect.top }),
        )
      } catch (_) {}
    })
  }
  tryAttach()
}

function initWidget() {
  // @ts-ignore
  if (typeof OML2D === "undefined") return
  if (widgetInitialized) return
  widgetInitialized = true

  // @ts-ignore
  OML2D.loadOml2d({
    models: MODELS,
    dockedPosition: "left",
    docked: false,
    sayHello: false,
    stageStyle: {
      width: 320,
      height: 400,
    },
    mobileDisplay: false,
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
    parentElement: document.documentElement,
  })

  // 等 widget 渲染后绑定拖拽
  setTimeout(setupDrag, 800)
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
  if (!scriptLoaded) {
    loadOml2dScript()
    return
  }
  // SPA 导航:若 widget DOM 被清除则重建
  // @ts-ignore
  if (typeof OML2D !== "undefined") {
    const exists =
      document.querySelector("#oml2d-stage") ||
      document.querySelector(".oml2d-stage") ||
      document.querySelector("#oml2d")
    if (!exists) {
      widgetInitialized = false
      dragSetupDone = false
      initWidget()
    }
  }
})
