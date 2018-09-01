import React from 'react'
import PropTypes from 'prop-types'
import { Layout, message } from 'antd'
import { connect } from 'dva'
import InnerHeader from '../components/Header'
import InnerFooter from '../components/Footer'
import SiderMenu from '../components/SiderMenu'
import { getMenu } from '../common/menu'
import { getRoutes } from '@/utils'
import Authorized from '../components/Authorized/utils/Authorized'
import NotFound from '../routes/Exception/404'
import logo from '@/assets/logo.png'
import { Switch, Redirect, Route } from 'dva/router'

const { Content, Header, Footer } = Layout
const { AuthorizedRoute, check } = Authorized

/**
 * 根据菜单取得每个 menu item 的重定向地址
 */
const redirectData = []
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      })
      item.children.forEach(children => {
        getRedirect(children)
      })
    }
  }
}
getMenu().forEach(getRedirect)

@connect(({ layout = {}, user, notice }) => ({
  collapsed: layout.collapsed,
  user: user.current,
  notices: notice,
}))
export default class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }

  getChildContext() {
    const { location } = this.props
    return {
      location,
    }
  }

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props
    dispatch({
      type: 'layout/changeLayoutCollapsed',
      payload: collapsed,
    })
  }

  handleNoticeClear = type => {
    message.success(`清空了${type}`)

    const { dispatch } = this.props

    dispatch({
      type: 'notice/clearNotices',
      payload: type,
    })
  }
  
  getBaseRedirect = () => {
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href)

    const redirect = urlParams.searchParams.get('redirect')
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect')
      window.history.replaceState(null, 'redirect', urlParams.href)
    } else {
      const { routeData } = this.props
      // 获取 routeData 中第一个有权限的路由
      const authorizedPath = Object.keys(routeData).find(
        item => check(routeData[item].authority, item) && item !== '/'
      )
      return authorizedPath
    }
    return redirect
  }

  renderSiderMenu = ({ collapsed, location }) => (
    <SiderMenu
      logo={logo}
      collapsed={collapsed}
      onCollapse={this.handleMenuCollapse}
      location={location}
      menuData={getMenu()}
    />
  )

  renderInnerHeader = ({ collapsed, user, notices }) => (
    <InnerHeader
      collapsed={collapsed}
      onCollapse={this.handleMenuCollapse}
      user={user}
      notices={notices}
      onMenuClick={() => {}}
      onNoticeClear={this.handleNoticeClear}
    />
  )

  renderLayout = ({ collapsed, routeData, match, baseRedirect }) => (
    <Layout>
      {this.renderSiderMenu(this.props)}
      <Layout>
        <Header style={{ padding: 0 }}>{this.renderInnerHeader(this.props)}</Header>
        <Content style={{ margin: '24px 24px 0', height: '100%' }}>
          <Switch>
            {redirectData.map(item => (
              <Redirect key={item.from} exact from={item.from} to={item.to} />
            ))}
            {getRoutes(match.path, routeData).map(item => (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
              />
            ))}
            <Redirect exact from="/" to={baseRedirect} />
            <Route render={NotFound} />
          </Switch>
        </Content>
        <Footer>
          <InnerFooter />
        </Footer>
      </Layout>
    </Layout>
  )

  render() {
    const baseRedirect = this.getBaseRedirect()

    return (
      <div>
        {this.renderLayout({
          ...this.props,
          baseRedirect,
        })}
      </div>
    )
  }
}
