import React, { createElement } from 'react'
import { Spin } from 'antd'
import Loadable from 'react-loadable'

let routerDataCache

const getRouteDataCache = app => {
  if (!routerDataCache) {
    routerDataCache = getRoute(app)
  }
  return routerDataCache
}

const modelNotExisted = (app, model) => {
  return (
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
      return namespace === model.substring(model.lastIndexOf('/') + 1)
    })
  )
}

const dynamicWrapper = (app, models, component) => {
  // 动态 require model
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default)
    }
  })

  return Loadable({
    loader: () => {
      return component().then(raw => {
        const Component = raw.default || raw
        return props =>
          createElement(Component, {
            ...props,
            routerData: getRouteDataCache(app),
          })
      })
    },
    loading: () => {
      return <Spin size="large" />
    },
  })
}

export const getRoute = app => {
  const routeConfig = {
    '/': {
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    },
  }

  const routeData = {}

  Object.keys(routeConfig).forEach(path => {
    let route = routeConfig[path]

    route = {
      ...route,
      name: route.name,
    }

    routeData[path] = route
  })

  return routeData
}
