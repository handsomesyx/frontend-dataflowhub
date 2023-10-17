import './index.less';

import { ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Image,
  Row,
  Space,
  Tag,
  Timeline,
} from 'antd';

export default function PropertyDetail() {
  return (
    <div className="detail-container">
      {/* 上半部分：头部导航 */}
      <div className="nft-detail-top">
        <div className="nft-detail-top-first">
          <div style={{ color: 'gray' }}>
            NFT <RightOutlined />
          </div>
          <div style={{ color: 'gray' }}>
            订单列表 <RightOutlined />
          </div>
          <div style={{ paddingLeft: '6px' }}>资产详情</div>
        </div>

        <div className="nft-detail-top-second">资产详情</div>
      </div>
      <div className="nft-detail-bottom">
        {/* 基本信息 */}
        <div className="basic-information">
          <span className="title-style">基本信息</span>
          <Divider className="divider-style" />
          <Row gutter={16}>
            <Col span={6} flex={'auto'}>
              <Image
                style={{ maxWidth: '90%' }}
                src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
              ></Image>
            </Col>
            {/* <div style={{ display: 'flex' }}> */}

            <Col span={18}>
              <div style={{ fontSize: '16px' }}>
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
                        style={{ marginLeft: '80%' }}
                      >
                        待审核
                      </Tag>
                    </ConfigProvider>
                  </div>

                  <div className="product-name">产品名称_123456</div>

                  <div className="liltitle-style">拥有者</div>

                  <div className="product-info">
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                      商品信息
                    </div>
                    <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                      <div>合约地址：0x49B3b4e875e83FA6e956670Ee0e05A47a0Ce4894</div>
                      <div>链上标识：155355</div>
                      <div>产品描述： 产品描述字段信息</div>
                    </Space>
                  </div>

                  <div className="eth-style">
                    0.22ETH{' '}
                    <span style={{ fontWeight: 'normal', fontSize: '0.8em' }}>
                      ￥346.78
                    </span>
                    <Button type="primary" style={{ marginLeft: '72%' }}>
                      审核
                    </Button>
                  </div>
                </Space>
              </div>
            </Col>

            {/* </div> */}
          </Row>
        </div>

        {/* 销售记录 */}
        <div className="sale-records">
          <span className="title-style">销售记录</span>
          <Divider className="divider-style" />
          <div style={{ height: '90%', overflow: 'scroll' }}>
            <Timeline
              style={{ height: '100%' }}
              items={[
                {
                  children: '2023-09-28 销售字段描述',
                  style: { fontSize: '1rem', height: '22%' },
                },
                {
                  children: '2023-09-19 销售字段描述',
                  style: { fontSize: '1rem', height: '22%' },
                },
                {
                  children: '2023-09-15 销售字段描述',
                  style: { fontSize: '1rem', height: '22%' },
                },
                {
                  children: '2023-09-09 销售字段描述',
                  style: { fontSize: '1rem', height: '22%' },
                },
              ]}
            />
          </div>
        </div>

        {/* 资产描述 */}
        <div className="property-description">
          <span className="title-style">资产描述</span>
          <Divider className="divider-style" />
          <div>资产描述信息</div>
        </div>
      </div>
    </div>
  );
}
