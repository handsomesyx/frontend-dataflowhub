import './index.css';

import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import shanchu from '../../assets/delete.svg';
import xiugai from '../../assets/xiugai.svg';
export default function PoliceStation() {
  interface DataType {
    key: string;
    name: string;
    phone: string;
    ID_card: string;
  }
  const [visitInfo, setVisitInfo] = useState(false);
  const [addPolice, setAddPolice] = useState(false);
  const [addPoliceStation, setAddPoliceStation] = useState(false);
  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '身份证',
      dataIndex: 'ID_card',
      key: 'ID_card',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>详情</a>
          <span>|</span>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      phone: '15567834569',
      ID_card: '231235197805147856',
    },
    {
      key: '2',
      name: 'Jim Green',
      phone: '17765483425',
      ID_card: '37142319970812093454',
    },
    {
      key: '3',
      name: 'Joe Black',
      phone: '小赵',
      ID_card: '李华',
    },
  ];
  const VisitInfo_handleOk = () => {
    setVisitInfo(false);
  };

  const VisitInfo_handleCancel = () => {
    setVisitInfo(false);
  };
  const AddPolice_handleOk = () => {
    setAddPolice(false);
  };

  const AddPolice_handleCancel = () => {
    setAddPolice(false);
  };
  const AddPoliceStation_handleOk = () => {
    setAddPoliceStation(false);
  };

  const AddPoliceStation_handleCancel = () => {
    setAddPoliceStation(false);
  };
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
              <Col>
                <Select
                  showSearch
                  placeholder="请选择村或者社区"
                  style={{ width: '180px' }}
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
        <Button
          type="primary"
          style={{
            background: '#0757CB',
          }}
          onClick={() => {
            setAddPoliceStation(true);
          }}
        >
          + 添加派出所
        </Button>
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
              <span className="CardContentHead">派出所名称：</span>
              <span className="CardContentContent">
                1234567890qwertyuiopasdfghjklzxcvbnm
              </span>
            </div>
            <div className="CardContentRow">
              <span className="CardContentHead">所长名称：</span>
              <span className="CardContentContent">
                1234567890qwertyuiopasdfghjklzxcvbnm
              </span>
            </div>
            <div className="CardContentRow">
              <span className="CardContentHead">警员数量：</span>
              <span className="CardContentContent">23</span>
              <span
                style={{
                  color: '#0B62DF',
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  setVisitInfo(true);
                }}
              >
                查看具体信息
              </span>
              <span
                style={{
                  color: '#0B62DF',
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  setAddPolice(true);
                }}
              >
                增加警员
              </span>
            </div>
          </div>
        </Card>
      </Row>
      <Modal
        title="警员信息"
        open={visitInfo}
        onOk={VisitInfo_handleOk}
        onCancel={VisitInfo_handleCancel}
        okText="确认"
        cancelText="取消"
        width="60vw"
      >
        <Table style={{ paddingTop: '1vh' }} columns={columns} dataSource={data} />
      </Modal>
      <Modal
        title="增加警员"
        open={addPolice}
        onOk={AddPolice_handleOk}
        onCancel={AddPolice_handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Modal
        title="增加派出所"
        open={addPoliceStation}
        onOk={AddPoliceStation_handleOk}
        onCancel={AddPoliceStation_handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}
