import React, { Component } from 'react'
import Debounce from 'lodash-decorators/debounce'
import { Avatar, Icon, Dropdown, Spin, Menu } from 'antd'
import Notice from '../Notice'
import styles from './index.less'

export default class Header extends Component {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel()
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props
    onCollapse(!collapsed)
    this.triggerResizeEvent()
  }

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, false)
    window.dispatchEvent(event)
  }

  renderTrigger = ({ collapsed }) => (
    <Icon
      className={styles.trigger}
      type={collapsed ? 'menu-unfold' : 'menu-fold'}
      onClick={this.toggle}
    />
  )

  renderUserMenu = () => (
    <Menu className={styles.menu} selectedKeys={[]}>
      <Menu.Item disabled>
        <Icon type="user" />
        个人中心
      </Menu.Item>
      <Menu.Item disabled>
        <Icon type="setting" />
        设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" disabled>
        <Icon type="logout" />
        退出登录
      </Menu.Item>
    </Menu>
  )

  renderRight = props => {
    const { user, collapsed, logo, onNoticeVisibleChange, onMenuClick, onNoticeClear } = this.props
    return (
      <div className={styles.right}>
        <Notice
          className={styles.action}
          count={1}
          onPopupVisibleChange={onNoticeVisibleChange}
          popupAlign={{ offset: [20, -16] }}
        >
          <Notice.Tab
            title="消息"
            emptyText="您已读完所有消息"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
        </Notice>
        {user.name ? (
          <Dropdown overlay={this.renderUserMenu()}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={user.avatar} />
              <span className={styles.name}>{user.name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8 }} />
        )}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.header}>
        {this.renderTrigger(this.props)}
        {this.renderRight(this.props)}
      </div>
    )
  }
}
