import { DollarOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Link, Outlet } from 'react-router-dom';
const items: MenuProps['items'] = [
  {
    label: (
      <Link to={'home-page'}>
        <span>首页</span>
      </Link>
    ),
    key: 'home-page',
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
    ],
  },
];
export default function HomeLeftLayout() {
  return (
    <>
      <div className="home-left-container">
        <Layout className="home-secretary">
          <Sider className="secretary-sider">
            <Menu className="secretary-sider-menu" mode="inline" items={items}></Menu>
          </Sider>
          <Content className="secretary-content">
            <Outlet />
          </Content>
        </Layout>
      </div>
    </>
  );
}
