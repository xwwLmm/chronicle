import React from "react";
import { routerRedux, Route, Switch } from "dva/router";
// import BasicLayout from './layouts/BasicLayout';
import { getRoute } from './common/route';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
    const routeData = getRoute(app);
    const BasicLayout = routeData['/'].component;
    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={BasicLayout} />
            </Switch>
        </ConnectedRouter>
    );
}

export default RouterConfig;
