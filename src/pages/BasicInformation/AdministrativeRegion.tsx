import { useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Cascader,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tree
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import React, { useState } from 'react';

import { FindManyArea, FindManyGrid } from '@/apis';

import wanggeyuan from '../../assets/wanggeyuan_bianji.svg';

interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
  commit: string;
  police: string;
}


const treeData: DataNode[] = [
  {
    title: '漠河市',
    key: '0-0',
    children: [
      {
        title: '古莲镇',
        key: '0-0-0',
        children: [
          { title: '夏明村', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '牛牛镇',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
      {
        title: '古莲镇',
        key: '0-0-3',
        children: [
          { title: '夏明村', key: '0-0-3-0' },
          { title: '0-0-3-1', key: '0-0-3-1' },
          { title: '0-0-3-2', key: '0-0-3-2' },
        ],
      },
      {
        title: '牛牛镇',
        key: '0-0-4',
        children: [
          { title: '0-0-4-0', key: '0-0-4-0' },
          { title: '0-0-4-1', key: '0-0-4-1' },
          { title: '0-0-4-2', key: '0-0-4-2' },
        ],
      },
    ],
  },
];

const columns: ColumnsType<DataType> = [
  {
    title: '网格名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '网格员名称',
    dataIndex: 'age',
    key: 'age',
    render: (text) => <a style={{ color: 'black' }}>{text}
      <Image src={wanggeyuan}
        preview={false} /></a>
  },
  {
    title: '所属网格长',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '所属社区主任',
    dataIndex: 'commit',
    key: 'commit',
  },
  {
    title: '所属民警',
    dataIndex: 'police',
    key: 'police',
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
    age: '小赵',
    address: '李华',
    commit: '小文',
    police: '小王',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: '李三',
    address: '王涛',
    commit: '小文',
    police: '小王',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: '王武',
    address: '李丽',
    commit: '小文',
    police: '小王',
  },
];

const AdministrativeRegion: React.FC = () => {
  const { Option } = Select;
  const [open, setOpen] = useState(false);
  // const [form] = Form.useForm();
  const [formSubmit] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    formSubmit.resetFields();
  };
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([
    '0-0-0',
    '0-0-1',
  ]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const { data: Areadata } = useQuery(FindManyArea, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      take: 10,
      skip: 0,
    }
  });
  const { data: Griddata } = useQuery(FindManyGrid, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      take: 10,
      skip: 0,
    }
  });
  console.log(Areadata);
  console.log('Griddata', Griddata);


  return (
    <>
      <Row gutter={16}>
        <Col span={4}>
          <Card
            title={
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: 'MicrosoftYaHeiUI',
                  color: '#000000',
                  lineHeight: '24px',
                }}
              >
                行政区域
              </div>
            }
            bordered={false}
          >
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </Card>
        </Col>
        <Col
          style={{ backgroundColor: 'white', borderRadius: '4px' }}
          span={20}
        >
          <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            marginTop: '2vh', marginLeft: '1vw'
          }}>
            <div
              style={{
                fontSize: '16px',
                fontFamily: 'MicrosoftYaHeiUI',
                color: '#000000',
                lineHeight: '24px',

              }}
            >
              网格区域
            </div>
            <Row
              justify={'end'}
              style={{ marginRight: '1vw', columnGap: '20px' }}
            >
              <Space>
                <Button>网格长</Button>
                <Button>民警</Button>
                <Button>派出所</Button>
                <Button
                  style={{
                    background: '#0757CB',
                    color: '#FFFFFF',
                  }}
                  onClick={showDrawer}
                >
                  + 添加网格
                </Button>
                <Drawer
                  size={'default'}
                  title="添加网络"
                  placement="right"
                  onClose={onClose}
                  open={open}
                  footer={
                    <Row justify={'end'}>
                      <Space>
                        <Button onClick={() => {
                          setOpen(false);
                          formSubmit.resetFields();
                        }}>取消</Button>
                        <Button style={{ background: '#0757CB', color: 'white' }}>确认</Button>
                      </Space>
                    </Row>
                  }
                >
                  <Form
                    style={{ width: '100%' }}
                    layout="vertical"
                    form={formSubmit}>
                    <Form.Item
                      name="username"
                      label="网格名称"
                      rules={[{ required: true, message: '请输入网格名称', }]}
                    >
                      <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item
                      name="name"
                      label="所属行政区域"
                      rules={[{ required: true, message: '请选择所属行政区域' }]}
                    >
                      <Cascader
                        options={[
                          {
                            value: 'zhejiang',
                            label: 'Zhejiang',
                            children: [{
                              value: 'hangzhou', label: 'Hangzhou', children: [
                                { value: '夏明村', label: '夏明村' },
                                { value: '0-0-0-1', label: '0-0-0-1' },
                                { value: '0-0-0-2', label: '0-0-0-2' },
                              ],
                            }],
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name="select-multiple"
                      label="所属派出所"
                      rules={[{
                        required: true,
                        message: '请选择所属派出所',
                        type: 'array'
                      }]}
                    >
                      <Select mode="multiple" placeholder="请选择所属派出所">
                        <Option value="red">Red</Option>
                        <Option value="green">Green</Option>
                        <Option value="blue">Blue</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="police"
                      label="所属民警"
                      rules={[{ required: true, message: '请选择所属民警' }]}>
                      <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="commit"
                      label="所属社区"
                      rules={[{ required: true, message: '请选择所属社区' }]}>
                      <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="leader"
                      label="所属网格长"
                    >
                      <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="people"
                      label="所属网格员"
                      rules={[{ required: true, message: '请输入所属网格员' }]}>
                      <Input placeholder='请输入' />
                    </Form.Item>
                  </Form>

                </Drawer>
              </Space>
            </Row>
          </div>
          <Table style={{ paddingTop: '1vh' }} columns={columns} dataSource={data} />
        </Col>
      </Row>
    </>
  );
};

export default AdministrativeRegion;

