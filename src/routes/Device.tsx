import React, { Suspense } from "react"

import { Loading } from "@Src/components/Fallback"

const Device = React.lazy(() => import(/* webpackChunkName: "Device" */"@Src/pages/Device"))

export default function DeviceRoute() {
  return <Suspense fallback={<Loading />}>
    <Device />
  </Suspense>
}
