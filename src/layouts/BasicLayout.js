import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { connect } from 'dva'
import InnerHeader from '../components/Header'
import InnerFooter from '../components/Footer'
import SiderMenu from '../components/SiderMenu'
import { getMenu } from '../common/menu'
import { getRoutes } from '@/utils'
import logo from '@/assets/logo.png'
import { Switch, Redirect, Route } from 'dva/router'

const { Content, Header, Footer } = Layout

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

@connect(({ layout = {}, user }) => ({
  collapsed: layout.collapsed,
  user: user.current,
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

  renderSiderMenu = ({ collapsed, location }) => (
    <SiderMenu
      logo={logo}
      collapsed={collapsed}
      onCollapse={this.handleMenuCollapse}
      location={location}
      menuData={getMenu()}
    />
  )

  renderInnerHeader = ({ collapsed, user }) => (
    <InnerHeader collapsed={collapsed} onCollapse={this.handleMenuCollapse} user={user} />
  )

  renderLayout = ({ collapsed, routeData, match }) => (
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
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                redirectPath="/exception/403"
              />
            ))}
          </Switch>
        </Content>
        <Footer>
          <InnerFooter />
        </Footer>
      </Layout>
    </Layout>
  )

  render() {
    return <div>{this.renderLayout(this.props)}</div>
  }
}
