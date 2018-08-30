import React from "react";
import { routerRedux, Route, Switch } from "dva/router";
import BasicLayout from './layouts/BasicLayout';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={BasicLayout} />
            </Switch>
        </ConnectedRouter>
    );
}

export default RouterConfig;
