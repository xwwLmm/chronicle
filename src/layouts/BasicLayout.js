import React from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import InnerHeader from '../components/Header';
import InnerFooter from '../components/Footer';
import SiderMenu from '../components/SiderMenu';
import logo from '@/assets/logo.png';

const { Content, Header, Footer } = Layout;

@connect(({ layout = {} }) => ({
    collapsed: layout.collapsed
}))
export default class BasicLayout extends React.PureComponent {

    handleMenuCollapse = collapsed => {
        const { dispatch } = this.props;
        dispatch({
            type: 'layout/changeLayoutCollapsed',
            payload: collapsed,
        });
    }

    renderSiderMenu = ({ collapsed }) => (
        <SiderMenu
            logo={logo}
            collapsed={collapsed}
            onCollapse={this.handleMenuCollapse}
        />
    )

    renderLayout = ({ collapsed }) => (
        <Layout>
            {this.renderSiderMenu(this.props)}
            <Layout>
                <Header style={{ padding: 0 }}>
                    <InnerHeader 
                        collapsed={collapsed}
                        onCollapse={this.handleMenuCollapse}
                    />
                </Header>
                <Content style={{ margin: '24px 24px 0', height: '100%' }}>
                    <div style={{background: '#fff', padding: '200px 0'}}>
                        由于权限原因
                        此处动态注入 router
                    </div>
                </Content>
                <Footer>
                    <InnerFooter />
                </Footer>
            </Layout>
        </Layout>
    )
    
    render() {
        return (
            <div>
                {this.renderLayout(this.props)}
            </div>
        )
    }
}
