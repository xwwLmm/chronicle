/**
 * 检查用户的权限是否可以进入该路由
 * 有权限: 渲染路由
 * 无权限: 重定向 redirectPath
 */
import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Authorized from './Authorized'

export default class AuthorizedRoute extends Component {
  render() {
    const { component: Component, render, authority, redirectPath, ...rest } = this.props
    return (
      <Authorized
        authority={authority} // 当前路由的权限
        noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
      >
        <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
      </Authorized>
    )
  }
}
