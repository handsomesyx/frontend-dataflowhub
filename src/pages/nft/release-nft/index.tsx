import './index.less';

import { RightOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { Button, DatePicker, Form, Image, Input, Radio } from 'antd';
import { useState } from 'react';

import testImage from '../../../../public/test.jpeg';

// 发布NFT
function ReleaseNFT() {
  // 根据选择不同销售方式变化表单展示
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  return (
    <div className="release-nft-container">
      {/* 上半部分：筛选 */}
      <div className="release-nft-top">
        <div className="release-nft-top-first">
          <div style={{ color: 'gray' }}>
            {' '}
            NFT <RightOutlined /> 创建NFT <RightOutlined />
          </div>
          <div style={{ paddingLeft: '6px' }}>发布数据资产</div>
        </div>
        <div className="release-nft-top-second">发布数据资产</div>
      </div>
      {/* 下半部分：NFT列表的展示 */}
      <div className="release-nft-bottom">
        <Image width={200} src={testImage} />
        <div className="release-nft-bottom-info">
          <div className="release-nft-bottom-info-select">
            <span>
              <span style={{ color: 'red' }}>* </span>
              销售方式
            </span>
          </div>
          <div className="release-nft-bottom-info-change">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>固定价格</Radio>
              <Radio value={2}>定时拍卖</Radio>
            </Radio.Group>
          </div>
          <div style={{ paddingTop: '20px' }}>
            <Form
              name="time_related_controls"
              style={{ width: 450 }}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              {value === 2 ? (
                <Form.Item
                  name="date-time-picker"
                  label="截止时间"
                  rules={[{ required: true }]}
                >
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item name="expense" label="费用" rules={[{ required: true }]}>
                <Input placeholder="创作者收入" disabled />
                <Input placeholder="平台佣金" style={{ marginTop: 16 }} disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  发布
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReleaseNFT;
