import { DollarOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Link, Outlet } from 'react-router-dom';
const items: MenuProps['items'] = [
  {
    label: (
      <Link to={'management'}>
        <span>首页</span>
      </Link>
    ),
    key: 'management',
    icon: <HomeOutlined />,
  },
  {
    label: 'NFT',
    key: 'newsTable',
    icon: <DollarOutlined />,
    children: [
      {
        label: (
          <Link to={'signal-question'}>
            <span>NFT列表</span>
          </Link>
        ),
        key: 'signal-question',
      },
      {
        label: (
          <Link to={'multiple-question'}>
            <span>创建NFT</span>
          </Link>
        ),
        key: 'multiple-question',
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
          <Link to={'multiple-question'}>
            <span>订单列表</span>
          </Link>
        ),
        key: 'multiple-question',
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
