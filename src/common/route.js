import React, { createElement } from 'react'
import { Spin } from 'antd'
import Loadable from 'react-loadable'
import pathToRegexp from 'path-to-regexp'
import { getMenu } from './menu'

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

// 动态加载组件, model
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
            // 为所有的 component 传入 routeData
            routeData: getRouteDataCache(app),
          })
      })
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />
    },
  })
}

function getFlatMenuData(menus) {
  let keys = {}
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item }
      keys = { ...keys, ...getFlatMenuData(item.children) }
    } else {
      keys[item.path] = { ...item }
    }
  })
  return keys
}

function findMenuKey(menuData, path) {
  const menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(key))
  if (menuKey == null) {
    if (path === '/') {
      return null
    }
    const lastIdx = path.lastIndexOf('/')
    if (lastIdx < 0) {
      return null
    }
    if (lastIdx === 0) {
      return findMenuKey(menuData, '/')
    }
    // 如果没有, 使用父级的配置
    return findMenuKey(menuData, path.substr(0, lastIdx))
  }
  return menuKey
}

export const getRoute = app => {
  const routeConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'notice'], () => import('../layouts/BasicLayout')),
    },
    '/audit/report': {
      component: dynamicWrapper(app, [], () => import('../routes/Reporter')),
    },
    '/manage/admin-new': {
      component: dynamicWrapper(app, [], () => import('../routes/CreateAdmin')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
  }

  const menuData = getFlatMenuData(getMenu())

  const routeData = {}

  Object.keys(routeConfig).forEach(path => {
    let menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(`${key}`))
    const inherited = menuKey == null
    if (menuKey === null) {
      menuKey = findMenuKey(menuData, path)
    }
    let menuItem = {}

    if (menuKey) {
      menuItem = menuData[menuKey]
    }

    let route = routeConfig[path]

    route = {
      ...route,
      name: route.name || menuItem.name,
      authority: route.authority || menuItem.authority,
      inherited,
    }

    routeData[path] = route
  })

  return routeData
}
