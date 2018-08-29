import React from 'react';
import { Layout } from 'antd';
import InnerHeader from '../components/Header';

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
                        content
                    </Content>
                    <Footer>
                        footer
                    </Footer>
                </Layout>
            </div>
        )
    }
}
