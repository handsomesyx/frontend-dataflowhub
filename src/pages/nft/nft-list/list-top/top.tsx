import './index.less';

import { RightOutlined } from '@ant-design/icons';
import { Button, Form, Select, Space } from 'antd';
import { useState } from 'react';

export default function Top() {
  const [form] = Form.useForm();
  const [propertyState, setPropertyState] = useState<String>('');
  const handleSearch = () => {
    setPropertyState(form.getFieldValue('propertyState'));
    console.log(propertyState);
  };
  const reset = () => {
    setPropertyState('');
  };
  return (
    <div className="nft-list-top">
      {/* <Breadcrumb separator=">">
        <Breadcrumb.Item>卖家</Breadcrumb.Item>
        <Breadcrumb.Item>NFT列表</Breadcrumb.Item>
      </Breadcrumb> */}
      {/* <div className="nft-create-nft-first">
        <div style={{ color: 'gray' }}>
          卖家 <RightOutlined />
        </div>
        <div style={{ paddingLeft: '6px' }}>NFT列表</div>
      </div> */}
      {/* <div className="nft-create-top-second">NFT列表</div> */}

      <div className="nft-create-nft-first">
        <div style={{ color: 'gray' }}>
          NFT <RightOutlined />
        </div>
        <div style={{ paddingLeft: '6px' }}>创建NFT</div>
      </div>

      <Form form={form} className="nft-create-top-second">
        {/* <Row justify="start" gutter={8} align="middle"> */}
        {/* <Form.Item> */}
        <span>NFT列表</span>
        {/* </Form.Item> */}
        <Space style={{ marginLeft: '65%' }}>
          <Form.Item style={{ width: '70px' }}> 资产状态：</Form.Item>
          <Form.Item name="propertyState">
            <Select
              defaultValue="created"
              // onChange={handleChange}
              style={{ width: '184px' }}
              options={[
                { value: 'created', label: '已创建' },
                { value: 'audited', label: '待审核' },
                { value: 'published', label: '已发布' },
                { value: 'saled', label: '已卖出' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button style={{ width: '66px' }} onClick={reset}>
              重置
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: '66px' }}
              type="primary"
              htmlType="submit"
              onClick={handleSearch}
            >
              查询
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
}
