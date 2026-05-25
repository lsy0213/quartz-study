// 点击特效:点击页面任意位置,飘出鼓励的小字/emoji
// 循环使用一组词条,每次随机一个

const WORDS = [
  "加油!",
  "继续~",
  "学习",
  "💚",
  "✨",
  "♡",
  "🌱",
  "📚",
  "好棒",
  "GO!",
  "🎉",
]

let bound = false

function handleClick(e: MouseEvent) {
  // 跳过看板娘区域的点击
  const target = e.target as HTMLElement
  if (target && (target.closest("#oml2d") || target.closest(".waifu"))) {
    return
  }

  const span = document.createElement("span")
  span.className = "click-effect"
  span.textContent = WORDS[Math.floor(Math.random() * WORDS.length)]
  span.style.left = e.clientX + "px"
  span.style.top = e.clientY + "px"
  document.body.appendChild(span)

  // 1.4s 后清理 (与 CSS 动画时长一致)
  setTimeout(() => span.remove(), 1400)
}

document.addEventListener("nav", () => {
  // 只绑定一次 (绑在 document 上,SPA 导航不影响)
  if (bound) return
  bound = true
  document.addEventListener("click", handleClick)
})
