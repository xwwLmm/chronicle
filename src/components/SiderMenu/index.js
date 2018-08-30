import React, { PureComponent } from 'react'
import { Layout, Menu, Icon } from 'antd'
import classNames from 'classnames'
import pathToRegexp from 'path-to-regexp'
import { Link } from 'dva/router'
import styles from './index.less'
import { urlToList } from '@/utils'

const { Sider } = Layout
const { SubMenu } = Menu

//   icon: 'setting',
//   icon: 'http://demo.com/icon.png'
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0) {
      return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />
    }
    return <Icon type={icon} />
  }
}

/**
 * 展开 menu list 数据, 递归获取所有 item 的 path
 * @param {*} menu menuData [{ path: '/a/b' }]
 * @returns {Array} [ path ]
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path)
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children))
    }
    return keys
  }, [])

/**
 * 用 menu 的 path 去匹配当前的路径
 * @param {Array} flatMenuKeys 展开的 path key
 * @param {Array} paths urlToList 转换的 path: ['/a', '/a/b', '/a/b/c']
 * @returns 匹配成功的 path 数组
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  )

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props)
    this.flatMenuKeys = getFlatMenuKeys(props.menuData || [])
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props
    if (nextProps.location.pathname !== location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      })
    }
  }

  /**
   * 获取当前被选中的 menu
   */
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname))
  }

  convertPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/')
    }
  }

  getMenuItemPath = item => {
    const itemPath = this.convertPath(item.path)
    const icon = getIcon(item.icon)
    const { target, name } = item
    // http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      )
    }
    const { location, onCollapse } = this.props
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={undefined}
      >
        {icon}
        <span>{name}</span>
      </Link>
    )
  }

  /**
   * 获取默认展开的路径
   * 用当前 pathname 匹配 menu key
   * @param {*} props
   */
  getDefaultCollapsedSubMenus(props) {
    const {
      location: { pathname },
    } = props || this.props
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname))
  }

  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children)
      // 当无子菜单时 不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        )
      }
      return null
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
    }
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return []
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const ItemDom = this.getSubMenuOrItem(item)
        return ItemDom
      })
      .filter(item => item)
  }

  isMainMenu = key => {
    const { menuData } = this.props
    return menuData.some(item => key && (item.key === key || item.path === key))
  }

  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1]
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    })
  }

  renderMenu = ({ theme, menuProps, selectedKeys, menuData }) => {
    return (
      <Menu
        key="Menu"
        mode="inline"
        theme={theme}
        {...menuProps}
        selectedKeys={selectedKeys}
        onOpenChange={this.handleOpenChange}
        style={{ padding: '16px 0', width: '100%' }}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    )
  }

  render() {
    const { collapsed, onCollapse, logo, menuData } = this.props
    const { openKeys } = this.state
    const theme = 'light'
    const siderClass = classNames(styles.sider, {
      [styles.light]: theme === 'light',
    })

    const menuProps = collapsed ? {} : { openKeys }

    let selectedKeys = this.getSelectedMenuKeys()
    // 匹配失败, 获取父级的 path
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]]
    }

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        width={256}
        className={siderClass}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>Sun Reaver</h1>
          </Link>
        </div>
        {this.renderMenu({
          theme,
          menuProps,
          selectedKeys,
          menuData,
        })}
      </Sider>
    )
  }
}
