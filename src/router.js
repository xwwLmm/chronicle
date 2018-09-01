import React from 'react'
import { routerRedux, Switch } from 'dva/router'
import { getRoute } from './common/route'
import Authorized from './components/Authorized/utils/Authorized'

const { ConnectedRouter } = routerRedux
const { AuthorizedRoute } = Authorized

function RouterConfig({ history, app }) {
  const routeData = getRoute(app)
  const BasicLayout = routeData['/'].component
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <AuthorizedRoute
          path="/"
          render={props => <BasicLayout {...props} />}
          authority={['admin', 'user']}
        />
      </Switch>
    </ConnectedRouter>
  )
}

export default RouterConfig
