import './index.css';

import { Button, Card, Col, Form, Image, Row, Select, Tooltip } from 'antd';
import React from 'react';

import shanchu from '../../assets/delete.svg';
import xiugai from '../../assets/xiugai.svg';

export default function Community() {
  return (
    <div>
      <div
        style={{
          marginLeft: '1vw',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Form>
          <Row gutter={16} style={{ columnGap: '20px' }}>
            <Form.Item>
              <Col>
                <Select
                  showSearch
                  style={{ width: '180px' }}
                  placeholder="请选择城市"
                  optionFilterProp="children"
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'tom',
                      label: 'Tom',
                    },
                  ]}
                />
              </Col>
            </Form.Item>
            <Form.Item>
              <Col>
                <Select
                  showSearch
                  style={{ width: '180px' }}
                  placeholder="请选择镇"
                  optionFilterProp="children"
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'tom',
                      label: 'Tom',
                    },
                  ]}
                />
              </Col>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  background: '#0757CB',
                  fontSize: '14px',
                  fontFamily: 'MicrosoftYaHei',
                }}
              >
                筛选
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
      <Row style={{ marginLeft: '0.5vw' }}>
        <Card
          style={{ width: 300 }}
          actions={[
            // eslint-disable-next-line react/jsx-key
            <Tooltip placement="bottom" title="修改">
              <a>
                <Image src={xiugai} preview={false} />
              </a>
            </Tooltip>,
            // eslint-disable-next-line react/jsx-key
            <Tooltip placement="bottom" title="删除">
              <a>
                <Image src={shanchu} preview={false} />
              </a>
            </Tooltip>,
          ]}
        >
          <div className="CardContent">
            <div className="CardContentRow">
              <span className="CardContentHead">社区名称：</span>
              <span className="CardContentContent">
                1234567890qwertyuiopasdfghjklzxcvbnm
              </span>
            </div>
            <div className="CardContentRow">
              <span className="CardContentHead">名称：</span>
              <span className="CardContentContent">
                1234567890qwertyuiopasdfghjklzxcvbnm
              </span>
            </div>
            <div className="CardContentRow">
              <span className="CardContentHead">行政区域：</span>
              <span className="CardContentContent">23</span>
            </div>
          </div>
        </Card>
      </Row>
    </div>
  );
}
