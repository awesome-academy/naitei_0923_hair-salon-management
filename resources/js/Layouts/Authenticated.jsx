import React, { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Select, Button, Badge } from 'antd';
import { LangProvider, useLang } from '../Context/LangContext';
import {
    ShopOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    FileTextOutlined,
    ProjectOutlined,
    CalendarOutlined,
    UserOutlined,
    ExperimentOutlined,
    AppstoreOutlined,
    NotificationOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { router } from '@inertiajs/react';
import { Inertia } from "@inertiajs/inertia";

const { Header, Content, Sider } = Layout;

export default function Authenticated({ auth, children, ...props }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { lang, changeLocale } = useLang();
    const [selectedLocale, setSelectedLocale] = useState(lang.getLocale());
    const [collapsed, setCollapsed] = useState(false);
    const authName = `${auth.user.first_name} ${auth.user.last_name}`;
    const systemRole = auth.user.system_role;

    const superAdminNavbarIems = [
        {
            key: 'registrations.index',
            icon: <FileTextOutlined />,
            label: lang.get('strings.Registrations')
        }, {
            key: 'salons.index',
            icon: <ShopOutlined />,
            label: lang.get('strings.Salon')
        }, {
            key: 'users.index',
            icon: <UserOutlined />,
            label: lang.get('strings.User')
        }
    ];

    const salonManagerNavbarItem = [
        {
            key: 'dashboard',
            icon: <ProjectOutlined />,
            label: lang.get('strings.Dashboard')
        }, {
            key: 'customers.index',
            icon: <UserOutlined />,
            label: lang.get('strings.Customers')
        }, {
            key: 'orders.index',
            icon: <CalendarOutlined />,
            label: lang.get('strings.Order')
        }, {
            key: 'staffs.index',
            icon: <UserOutlined />,
            label: lang.get('strings.Staff')
        }, {
            key: 'products.index',
            icon: <ExperimentOutlined />,
            label: lang.get('strings.Product')
        }, {
            key: 'categories.index',
            icon: <AppstoreOutlined />,
            label: lang.get('strings.Categories')
        }, {
            key: 'notifications.index',
            icon:  <Badge count={props.notificationNumber}><NotificationOutlined /></Badge>,
            label: lang.get('strings.Notification')
        } 
    ];

    const staffNavbarItems = [
        {
            key: 'customers.index',
            icon: <UserOutlined />,
            label: lang.get('strings.Customers')
        }, {
            key: 'orders.index',
            icon: <CalendarOutlined />,
            label: lang.get('strings.Order')
        }, {
            key: 'notifications.index',
            icon:  <Badge count={props.notificationNumber}><NotificationOutlined /></Badge>,
            label: lang.get('strings.Notification')
        } 
    ]

    const navbarItem = systemRole === 'super admin' ? superAdminNavbarIems : (auth.user.salon_role === 'manager' ? salonManagerNavbarItem : staffNavbarItems);

    const handleChange = (value) => {
        localStorage.removeItem("locale");
        localStorage.setItem("locale", value);

        setSelectedLocale(value);
        changeLocale(value);

        Inertia.get(route('locale', { lang: value } ));
    };

    return (
        <LangProvider>
            <Layout hasSider>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        paddingTop: 70
                    }}
                    theme="light"
                    trigger={null} collapsible collapsed={collapsed}
                >
                    <div className="demo-logo-vertical"></div>
                    <Menu theme="light" mode="inline" items={navbarItem} onSelect={({ item, key }) => { router.get(route(key)); }} />
                </Sider>
                <Layout
                    className="site-layout"
                    style={{
                        marginLeft: collapsed ? '80px' : '200px',
                        transition: 'margin-left 0.3s',
                        height: '100vh',
                    }}
                >
                    <Header
                        style={{
                            paddingRight: 30,
                            paddingLeft: 0,
                            background: '#fff',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {authName}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')} method="get" as="button">
                                            {lang.get('strings.Profile')}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            {lang.get('strings.Logout')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    {lang.get('strings.Dashboard')}
                                </ResponsiveNavLink>
                            </div>

                            <div className="pt-4 pb-1 border-t border-gray-200">
                                <div className="px-4">
                                    <div className="font-medium text-base text-gray-800">{auth.user.name}</div>
                                    <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        {lang.get('strings.Logout')}
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: '#fff',
                            overflow: 'scroll',
                        }}
                    >
                        <main>{children}</main>
                    </Content>
                    <footer className="bg-white shadow dark:bg-gray-200 fixed bottom-0 left-0 z-20 w-full">
                        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                                <Select
                                    defaultValue="English"
                                    style={{
                                        width: 120,
                                    }}
                                    value={selectedLocale}
                                    onChange={handleChange}
                                    options={[
                                        {
                                            value: 'en',
                                            label: 'English',
                                        },
                                        {
                                            value: 'vi',
                                            label: 'Tiếng Việt',
                                        },
                                    ]}
                                />
                            </span>
                        </div>
                    </footer>
                </Layout>
            </Layout>
        </LangProvider>
    );
}
