import React from "react"

import { useRandomSoftColors } from "xiaoming-hooks"

import Styles from "./index.module.less"

function RandomElem() {
  const [backgroundColor, color] = useRandomSoftColors()

  return <div className={Styles.colorItem} style={{
    backgroundColor,
    color,
  }}>
    <div>bgColor: {backgroundColor}</div>
    <div>__color: {color}</div>
  </div>
}

function RandomColor() {
  return <>
    <h2 className={Styles.title}>随机背景色及相应适宜文本颜色</h2>
    <div className={Styles.wrapper}>
      {
        new Array(1000).fill(0).map((_, i) => <RandomElem key={i} />)
      }
    </div>
  </>
}

export default RandomColor
