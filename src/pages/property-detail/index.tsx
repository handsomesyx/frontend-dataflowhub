import './index.less';

import { ClockCircleOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Divider,
  Image,
  Space,
  Tag,
  Timeline,
} from 'antd';

export default function PropertyDetail() {
  return (
    <div className="detail-container">
      {/* 上半部分：头部导航 */}
      <div className="detail-top">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>订单</Breadcrumb.Item>
          <Breadcrumb.Item>订单列表</Breadcrumb.Item>
          <Breadcrumb.Item>资产详情</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ fontSize: '18px', marginLeft: '10px' }}>资产详情</div>
      </div>

      {/* 基本信息 */}
      <div className="basic-information">
        <span className="title-style">基本信息</span>
        <Divider className="divider-style" />
        <div style={{ display: 'flex' }}>
          <div>
            <Image
              style={{ width: '360px', height: '310px' }}
              src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
            ></Image>
          </div>

          <div style={{ marginLeft: '24px' }}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <div className="liltitle-style">
                发行者
                <ConfigProvider
                  theme={{
                    token: {
                      borderRadiusSM: 14,
                      fontSize: 16,
                    },
                  }}
                >
                  <Tag
                    icon={<ClockCircleOutlined />}
                    color="#FF4D4F59"
                    style={{ marginLeft: '600px' }}
                  >
                    待审核
                  </Tag>
                </ConfigProvider>
              </div>

              <div className="product-name">产品名称_123456</div>

              <div className="liltitle-style">拥有者</div>

              <div className="product-info">
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>商品信息</div>
                <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                  <div>合约地址：0x49B3b4e875e83FA6e956670Ee0e05A47a0Ce4894</div>
                  <div>链上标识：155355</div>
                  <div>产品描述： 产品描述字段信息</div>
                </Space>
              </div>

              <div className="eth-style">
                0.22ETH{' '}
                <span style={{ fontWeight: 'normal', fontSize: '16px' }}>￥346.78</span>
                <Button type="primary" style={{ marginLeft: '550px' }}>
                  审核
                </Button>
              </div>
            </Space>
          </div>
        </div>
      </div>

      {/* 销售记录 */}
      <div className="sale-records">
        <span className="title-style">销售记录</span>
        <Divider className="divider-style" />
        <Timeline
          items={[
            {
              children: '2023-09-28 销售字段描述',
            },
            {
              children: '2023-09-19 销售字段描述',
            },
            {
              children: '2023-09-15 销售字段描述',
            },
            {
              children: '2023-09-09 销售字段描述',
            },
          ]}
        />
      </div>

      {/* 资产描述 */}
      <div className="property-description">
        <span className="title-style">资产描述</span>
        <Divider className="divider-style" />
        <div>资产描述信息</div>
      </div>
    </div>
  );
}
