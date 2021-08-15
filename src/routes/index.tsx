import { hot } from 'react-hot-loader/root'
import React, { Suspense } from 'react'
import { Provider, useSelector } from 'react-redux'
import {
  BrowserRouter as Router, Switch, useLocation, Route,
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import '@Src/global'
import { Pwa } from '@Src/global/pwa'
import store, { State } from '@Src/store/index'

import { Loading } from '@Src/components/Fallback'
import { PageContainer } from '@Src/components/PageContainer'
import { transitionClassNameMap } from '@Src/components/Transitions'

const Home = React.lazy(() => import(/* webpackChunkName: 'Home' */'@Src/pages/Home'))
const Signin = React.lazy(() => import(/* webpackChunkName: 'Signin' */'@Src/pages/Signin'))
const NotFound = React.lazy(() => import(/* webpackChunkName: 'NotFound' */'@Src/pages/NotFound'))
const GroupChatRoom = React.lazy(() => import(/* webpackChunkName: 'GroupChatRoom' */'@Src/pages/ChatRoom/pages/group'))
const UserChatRoom = React.lazy(() => import(/* webpackChunkName: 'UserChatRoom' */'@Src/pages/ChatRoom/pages/user'))

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
        <Route exact sensitive path='/chatRoom/group/:groupId'>
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <GroupChatRoom />
            </Suspense>
          </PageContainer>
        </Route>
        <Route exact sensitive path='/chatRoom/user/:userId'>
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <UserChatRoom />
            </Suspense>
          </PageContainer>
        </Route>
        <Route exact sensitive path='/signin'>
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <Signin />
            </Suspense>
          </PageContainer>
        </Route>
        <Route exact sensitive path='/'>
          <PageContainer>
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </PageContainer>
        </Route>
        <Route path='*'>
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
