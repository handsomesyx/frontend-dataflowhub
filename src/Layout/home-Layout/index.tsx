import '../index.less';

import { WalletOutlined } from '@ant-design/icons';
import { Input, Layout, Radio } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

import top_search from '/top_search.png';
import top_wo from '/top_wo.png';

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
                <span style={{ fontWeight: 'bold' }}>数据要素流通平台</span>
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
                <Radio.Group>
                  <Radio.Button value="large">
                    <WalletOutlined style={{ position: 'relative', right: '3px' }} />
                    连接钱包
                  </Radio.Button>
                  <Radio.Button value="default">
                    <img
                      className="top_wo"
                      src={top_wo}
                      style={{ position: 'relative', top: '3px' }}
                    />
                  </Radio.Button>
                </Radio.Group>
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
