import React from "react"
import { Link } from "react-router-dom"
import { Divider } from "antd"
import { useTranslation } from "react-i18next"

import { useRandomSoftColors } from "@Src/utils"
import SwitchLang from "@Src/components/SwitchLang"
import SwitchTransitionType from "@Src/components/SwitchTransitionType"
import { Footer } from "@Src/components/Footer"

import Styles from "./index.module.less"

function Home() {
  const { t } = useTranslation()
  const [backgroundColor, color] = useRandomSoftColors()

  return <div key="Home" style={{ padding: "10px" }}>
    <p style={{
      padding: ".5em 1em",
      fontSize: "2em",
      color,
      backgroundColor,
    }}>this is <strong>Home page</strong></p>
    <p>go to <Link to="/device">My Device</Link></p>
    <p>go to <Link to="/not-exist-path">not-exist-path</Link></p>
    <p>variable from process.env: process.env.APP_NAME is: {process.env.APP_NAME}</p>

    <Divider>Redux</Divider>
    <p>{t("declaration")} <SwitchLang /></p>
    <p>页面切换动画: <SwitchTransitionType /></p>
    <Footer />
  </div>
}

export default Home
