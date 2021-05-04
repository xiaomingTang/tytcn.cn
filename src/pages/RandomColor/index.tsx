import React from "react"

import { randomSoftColors } from "@Src/utils"

import Styles from "./index.module.less"

function RandomElem() {
  const [backgroundColor, color] = randomSoftColors()

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
    <h2 className={Styles.title}>文字皆为背景色值</h2>
    <div className={Styles.wrapper}>
      {
        new Array(1000).fill(0).map((_, i) => <RandomElem key={i} />)
      }
    </div>
  </>
}

export default RandomColor
