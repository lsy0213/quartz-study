// Live2D 看板娘加载脚本
// 基于 stevenjoezhang/live2d-widget
// 在所有页面的左下角显示一个可切换的动漫角色

const LIVE2D_BASE = "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest"
const MODEL_CDN = "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/"

let initialized = false

function loadLive2D() {
  // 注入 CSS
  if (!document.querySelector('link[data-live2d="css"]')) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `${LIVE2D_BASE}/waifu.min.css`
    link.setAttribute("data-live2d", "css")
    document.head.appendChild(link)
  }

  // 顺序加载: 先 tips, 再 live2d core
  const tipsScript = document.createElement("script")
  tipsScript.src = `${LIVE2D_BASE}/waifu-tips.js`
  tipsScript.setAttribute("data-live2d", "tips")

  const coreScript = document.createElement("script")
  coreScript.src = `${LIVE2D_BASE}/live2d.min.js`
  coreScript.setAttribute("data-live2d", "core")

  let loaded = 0
  const tryInit = () => {
    loaded++
    if (loaded < 2) return
    // 两个脚本都加载完才初始化
    // @ts-ignore - initWidget 由 waifu-tips.js 注入到 window
    if (typeof initWidget !== "undefined") {
      // @ts-ignore
      initWidget({
        waifuPath: `${LIVE2D_BASE}/waifu-tips.json`,
        cdnPath: MODEL_CDN,
      })
    }
  }

  tipsScript.onload = tryInit
  coreScript.onload = tryInit

  document.body.appendChild(tipsScript)
  document.body.appendChild(coreScript)
}

document.addEventListener("nav", () => {
  if (initialized) {
    // SPA 导航时,检查 widget DOM 是否还在;不在则重建
    if (!document.getElementById("waifu")) {
      // 清理可能残留的 tips 容器并重新初始化
      // @ts-ignore
      if (typeof initWidget !== "undefined") {
        // @ts-ignore
        initWidget({
          waifuPath: `${LIVE2D_BASE}/waifu-tips.json`,
          cdnPath: MODEL_CDN,
        })
      }
    }
    return
  }
  initialized = true
  loadLive2D()
})
