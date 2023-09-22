import '../index.less';

import { Input, Layout, Radio } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
const { Search } = Input;
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
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ display: 'flex', background: 'black', width: '50%' }}>
              {/* 最左侧logo放置区域 */}
              <div className="top-home-logo">LOGO</div>
              {/* 标题：‘数据要素流通平台’ */}
              <div className="top-home-title">
                <b>数据要素流通平台</b>
              </div>
            </div>
            <div style={{ display: 'flex', background: 'black', width: '50%' }}>
              {/* 顶部搜索框 */}
              <div className="top-home-search">
                <Search
                  placeholder="input search text"
                  enterButton
                  className="custom-search"
                />
              </div>
              {/* 连接钱包区域 */}
              <div className="top-home-button">
                <Radio.Group>
                  <Radio.Button value="large">连接钱包</Radio.Button>
                  <Radio.Button value="default">口</Radio.Button>
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
