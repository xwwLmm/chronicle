import React, { PureComponent } from "react";
import { Layout, Menu, Icon } from "antd";
import classNames from "classnames";
import { Link } from "dva/router";
import styles from "./index.less";

const { Sider } = Layout;
const { SubMenu } = Menu;

//   icon: 'setting',
//   icon: 'http://demo.com/icon.png'
const getIcon = icon => {
    if (typeof icon === "string") {
        if (icon.indexOf("http") === 0) {
            return (
                <img
                    src={icon}
                    alt="icon"
                    className={`${styles.icon} sider-menu-item-img`}
                />
            );
        }
        return <Icon type={icon} />;
    }
};

export default class SiderMenu extends PureComponent {
    render() {
        const { collapsed, onCollapse, logo } = this.props;
        const theme = "light";
        const siderClass = classNames(styles.sider, {
            [styles.light]: theme === "light"
        });
        const menuProps = {};

        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                // onCollapse={onCollapse}
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
            </Sider>
        );
    }
}
