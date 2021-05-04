import React, { Suspense } from "react"

import { Loading } from "@Src/components/Fallback"

const RandomColor = React.lazy(() => import(/* webpackChunkName: "RandomColor" */"@Src/pages/RandomColor"))

export default function RandomColorRoute() {
  return <Suspense fallback={<Loading />}>
    <RandomColor />
  </Suspense>
}
