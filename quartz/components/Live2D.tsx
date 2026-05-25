import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/live2d.inline"

const Live2D: QuartzComponent = () => {
  // Widget 通过 JS 动态注入 DOM,这里只占位,真正的工作在 afterDOMLoaded 脚本里
  return <></>
}

Live2D.afterDOMLoaded = script

export default (() => Live2D) satisfies QuartzComponentConstructor
