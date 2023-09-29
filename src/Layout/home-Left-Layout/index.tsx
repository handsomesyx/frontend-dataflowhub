import { DollarOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Link, Outlet } from 'react-router-dom';

// 首页左侧导航（一级导航、二级导航）：注意Link标签与Router路由之间的对应关系
const items: MenuProps['items'] = [
  {
    label: (
      <Link to={'index'}>
        <span>首页</span>
      </Link>
    ),
    key: 'index',
    icon: <HomeOutlined />,
  },
  {
    label: 'NFT',
    key: 'newsTable',
    icon: <DollarOutlined />,
    children: [
      {
        label: (
          <Link to={'nft-list'}>
            <span>NFT列表</span>
          </Link>
        ),
        key: 'nft-list',
      },
      {
        label: (
          <Link to={'create-nft'}>
            <span>创建NFT</span>
          </Link>
        ),
        key: 'create-nft',
      },
    ],
  },
  {
    label: '订单',
    key: 'orders',
    icon: <FileTextOutlined />,
    children: [
      {
        label: (
          <Link to={'orders-list'}>
            <span>订单列表</span>
          </Link>
        ),
        key: 'orders-list',
      },
      {
        label: (
          <Link to={'property-detail'}>
            <span>资产详情</span>
          </Link>
        ),
        key: 'property-detail',
      },
    ],
  },
];
export default function HomeLeftLayout() {
  return (
    <>
      <div className="home-left-container">
        <Layout className="home-left" style={{ width: '95%' }}>
          <Sider className="left-sider">
            <Menu className="left-sider-menu" mode="inline" items={items}></Menu>
          </Sider>
          <Content className="left-content">
            <Outlet />
          </Content>
        </Layout>
      </div>
    </>
  );
}
