import React, { Component } from 'react';
import { Avatar } from 'antd';
import styles from './index.scss';

export default class Header extends Component {

    render() {
        return (
            <div className={styles.header}>
                <Avatar size="small" src="https://blog-1252181333.cossh.myqcloud.com/blog/avatar.png" />
            </div>
        )
    }
}
