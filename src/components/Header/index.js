import React, { Component } from 'react'
import Debounce from 'lodash-decorators/debounce'
import { Avatar, Icon } from 'antd'
import styles from './index.less'

export default class Header extends Component {
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

  render() {
    return (
      <div className={styles.header}>
        {this.renderTrigger(this.props)}
        <Avatar size="small" src="https://blog-1252181333.cossh.myqcloud.com/blog/avatar.png" />
      </div>
    )
  }
}
