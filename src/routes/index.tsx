import { hot } from "react-hot-loader/root"
import React, { Suspense } from "react"
import { Provider, useSelector } from "react-redux"
import {
  HashRouter as Router, Switch, useLocation, Route,
} from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"

import "@Src/global"
import { Pwa } from "@Src/global/pwa"
import store, { State } from "@Src/store/index"

import { Loading } from "@Src/components/Fallback"
import { PageContainer } from "@Src/components/PageContainer"
import { transitionClassNameMap } from "@Src/components/Transitions"

const Home = React.lazy(() => import(/* webpackChunkName: "Home" */"@Src/pages/Home"))
const NotFound = React.lazy(() => import(/* webpackChunkName: "NotFound" */"@Src/pages/NotFound"))
const Device = React.lazy(() => import(/* webpackChunkName: "Device" */"@Src/pages/Device"))
const RandomColor = React.lazy(() => import(/* webpackChunkName: "RandomColor" */"@Src/pages/RandomColor"))

function Contents() {
  const location = useLocation()
  const { transitionType } = useSelector((state: State) => state.globalSettings)

  // 为了给页面切换带上 transition, 不得不把 TransitionGroup 和 Route 放在同一个组件里
  // 否则会出现诸如 transition 不生效 或 生效多(两)次 的 bug
  return <TransitionGroup component={null}>
    <CSSTransition
      timeout={500}
      classNames={transitionClassNameMap[transitionType]}
      key={location.pathname}
      unmountOnExit
    >
      <Switch location={location}>
        <Route exact sensitive path="/device">
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <Device />
            </Suspense>
          </PageContainer>
        </Route>
        <Route exact sensitive path="/random-color">
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <RandomColor />
            </Suspense>
          </PageContainer>
        </Route>
        <Route exact sensitive path="/">
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </PageContainer>
        </Route>
        <Route path="*">
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          </PageContainer>
        </Route>
      </Switch>
    </CSSTransition>
  </TransitionGroup>
}

function AppRoute() {
  return <Provider store={store}>
    <Pwa />
    <Router>
      <Contents />
    </Router>
  </Provider>
}

export default hot(AppRoute)
