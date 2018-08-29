import React from 'react';
import { Layout } from 'antd';
import InnerHeader from '../components/Header';
import InnerFooter from '../components/Footer';

const { Content, Header, Footer } = Layout;

export default class BasicLayout extends React.PureComponent {
    
    render() {
        return (
            <div>
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <InnerHeader />
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
            </div>
        )
    }
}
