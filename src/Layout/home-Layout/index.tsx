import '../index.less';

import { UserOutlined, UserSwitchOutlined, WalletOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Input, Layout, message } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

import top_search from '/top_search.png';
// 顶部按钮相关内容
// 点击连接钱包
const handleWalletConnect = () => {
  message.info('模拟连接钱包.');
};
// 点击切换钱包账号
const handleWalletChange: MenuProps['onClick'] = () => {
  message.info('模拟切换钱包账号.');
};
// 顶部切换账号的下拉菜单
const items: MenuProps['items'] = [
  {
    label: 'Profile',
    key: '1',
    icon: <UserSwitchOutlined />,
  },
];
const menuProps = {
  items,
  onClick: handleWalletChange,
};
export default function HomeLayout() {
  return (
    <div className="top-home-layout">
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            background: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', width: '98%' }}>
            <div style={{ display: 'flex', width: '50%' }}>
              {/* 最左侧logo放置区域 */}
              <div className="top-home-logo">
                <div className="top-logo-content">LOGO</div>
              </div>
              {/* 标题：‘数据要素流通平台’ */}
              <div className="top-home-title">
                <span style={{ fontWeight: 'bolder', fontSize: 'medium' }}>
                  数据要素流通平台
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', width: '50%', justifyContent: 'flex-end' }}>
              {/* 顶部搜索框 */}
              <div className="top-home-search">
                <Input
                  placeholder="Search Items, Collections, and Accounts"
                  prefix={<img className="top_search" src={top_search} />}
                  style={{ backgroundColor: '#f1f3f6', color: 'red' }}
                  // colorBgContainer="#f1f3f6"
                />
              </div>
              {/* 连接钱包区域 */}
              <div className="top-home-button">
                <Dropdown.Button
                  placement="bottom"
                  menu={menuProps}
                  onClick={handleWalletConnect}
                  icon={<UserOutlined />}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <WalletOutlined style={{ position: 'relative' }} />
                  连接钱包
                </Dropdown.Button>
              </div>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '16px ', minHeight: '85vh' }}>
          <div className="home-content-box" style={{ width: '100%' }}>
            <Content>
              <Outlet />
            </Content>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
