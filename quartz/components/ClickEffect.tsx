import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/clickeffect.inline"

const ClickEffect: QuartzComponent = () => {
  return <></>
}

ClickEffect.afterDOMLoaded = script

export default (() => ClickEffect) satisfies QuartzComponentConstructor
