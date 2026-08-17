import { Button, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { BellOutlined, DashboardOutlined, LeftOutlined, ProductOutlined, RightOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Logo from '../components/Logo';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Header, Content, Footer, Sider } = Layout;

const header: MenuProps['items'] = [
    {
        key: "bell",
        icon: <BellOutlined />,
    },
    {
        key: "setting",
        icon: <SettingOutlined />,
    },
];

const sider: MenuProps['items'] = [
    {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
    },
    {
        key: "users",
        icon: <UserOutlined />,
        label: "Users",
    },
    {
        key: "products",
        icon: <ProductOutlined />,
        label: "Products",
    },
];

export const DashboardLayout = () => {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <div>
            <Layout style={{ minHeight: "100vh" }}>
                <Header className='flex items-center justify-between'>
                    <Logo />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={header}
                    />
                </Header>
                <div>
                    <Layout
                        style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
                    >
                        <Sider
                            collapsible
                            collapsed={collapsed}
                            onCollapse={setCollapsed}
                            style={{
                                background: colorBgContainer,
                                padding: '24px 0',
                                minHeight: 600
                            }}
                            width={200}
                            trigger={null}
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: "100%",
                                    height: 48,
                                    display: 'flex',
                                    justifyContent: collapsed ? "center" : "space-between",
                                    flexDirection: "row-reverse",
                                }}
                            >
                                {collapsed ? "" : <div style={{ flex: 1 }}>Menu</div>}
                            </Button>
                            <Menu
                                mode="inline"
                                style={{ height: '100%' }}
                                items={sider}
                                onClick={({ key }) => navigate(key)}
                            />
                        </Sider>
                        <Layout style={{ padding: '24px 24px 0' }}>
                            <Content
                                style={{
                                    padding: 24,
                                    minHeight: 400,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <Outlet />
                            </Content>
                        </Layout>
                    </Layout>
                </div>
                <Footer
                    style={{
                        textAlign: "center"
                    }}
                >
                    Nhat Design ©{new Date().getFullYear()} Created by Nhat
                </Footer>
            </Layout>
        </div>
    )
}
