import React, { Component } from 'react'
import Debounce from 'lodash-decorators/debounce'
import { Avatar, Icon, Dropdown, Spin, Menu, Tag } from 'antd'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import Notice from '../Notice'
import styles from './index.less'

export default class Header extends Component {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel()
  }

  getNoticeList = notices => {
    if (!notices || notices.length === 0) {
      return {}
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice }
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow()
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id
      }

      if (newNotice.status && newNotice.extra) {
        const color = {
          todo: '#909399',
          processing: '#108ee9', // 处理
          urgent: '#f50', // 加急
          doing: '#E6A23C', // 正在做
        }[newNotice.status]

        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        )
      }
      return newNotice
    })
    return groupBy(newNotices, 'type')
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

  renderUserMenu = ({onMenuClick}) => (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
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

  renderRight = () => {
    const {
      user,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      notices,
    } = this.props
    const noticeList = this.getNoticeList(notices.list)
    const menu = this.renderUserMenu({onMenuClick});
    return (
      <div className={styles.right}>
        <Notice
          className={styles.action}
          count={user.notifyCount}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          popupAlign={{ offset: [20, -16] }}
        >
          <Notice.Tab
            list={noticeList.message}
            type="message"
            title="消息"
            emptyText="你已读完所有消息"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
          <Notice.Tab
            list={noticeList.notice}
            type="notice"
            title="通知"
            emptyText="你已查看所有通知"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
          <Notice.Tab
            list={noticeList.todo}
            type="todo"
            title="待办"
            emptyText="无待办"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
        </Notice>
        {user.name ? (
          <Dropdown overlay={menu}>
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
        {this.renderRight()}
      </div>
    )
  }
}
