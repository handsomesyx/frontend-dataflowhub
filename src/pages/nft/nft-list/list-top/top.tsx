import { Breadcrumb, Button, Form, Row, Select, Space } from 'antd';
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
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>卖家</Breadcrumb.Item>
        <Breadcrumb.Item>NFT列表</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Form form={form}>
          <Row justify="start" gutter={8} align="middle">
            <Form.Item>
              <div style={{ fontSize: '20px', marginLeft: '10px' }}>NFT列表</div>
            </Form.Item>

            <Space style={{ paddingLeft: '1000px' }}>
              <Form.Item name="propertyState">
                资产状态：
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
          </Row>
        </Form>
      </div>
    </div>
  );
}
