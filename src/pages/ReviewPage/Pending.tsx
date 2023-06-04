/* eslint-disable */
import React, { useState } from 'react';
import { Space, Table, Tag, Divider, Button, Modal, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ChangeWhat {
  key: React.Key;
  value: string;
  before: string;
  after: string;
}

const changecolumns: ColumnsType<ChangeWhat> = [
  {
    title: '变更属性',
    dataIndex: 'value',
  },
  {
    title: '变更前',
    dataIndex: 'before',
  },
  {
    title: '变更后',
    dataIndex: 'after',
  },
];

const changedata: ChangeWhat[] = [
  {
    key: '1',
    value: '姓名',
    before: '张大猫',
    after: '张小狗',
  },
  {
    key: '2',
    value: '年龄',
    before: '42',
    after: '88',
  },
  {
    key: '3',
    value: '家庭成员信息',
    before: 'wuwuuw',
    after: 'xxxxxxxxxxx',
  },
];

interface DataType {
  description: string;
  type: string;
  belong: string;
  creattime: string;
  emergency: string;
  key: string;
}
const App: React.FC = () => {

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('初次增加姓名“xxx”的群众');
  
    const showModal = () => {
      setOpen(true);
    };

  
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };

const whatcolor= (e) => {
  if (e === '特别紧急') {
    return (
      <div style={{ backgroundColor: 'red', width: '50px', height: '20px' }}/>
    );
  } else if (e === '紧急') {
    return (
      <div style={{ backgroundColor: 'orange', width: '50px', height: '20px' }}/>
    );
  } else {
    return (
      <div style={{ backgroundColor: 'blue', width: '50px', height: '20px' }}/>
    );
  }
}

const columns: ColumnsType<DataType> = [
  {
    title: '详情描述',
    dataIndex: 'description',
    key: 'description',
    render: (text) => <a onClick={showModal}>{text}</a>,
  },
  {
    title: '事件类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '所属群众',
    dataIndex: 'belong',
    key: ' belong',
  },
  {
    title: '创建时间',
    dataIndex: 'creattime',
    key: 'creattime',
  },
  {
    title: '紧急程度',
    key: 'emergency',
    dataIndex: 'emergency',
    render: (_, emergency) => (
    <div>
       {whatcolor(emergency.emergency)}
    </div>
    )
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a onClick={showModal}>查看具体信息</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    description: '初次增加姓名“xxx”的群众',
    type: '新增群众',
    belong: '咯咯gaga区',
    creattime: '2023/6/4',
    emergency: '特别紧急',
    key: '1',
    },
  {
    description: '初次增加姓名“xxx”的群众',
    type: '新增群众',
    belong: '埋土社区',
    creattime: '2023/6/4',
    emergency: '不紧急',
    key: '2',
    },
    {
      description: '初次增加姓名“xxx”的群众',
      type: '新增群众',
      belong: '埋土社区',
      creattime: '2023/6/4',
      emergency: '不紧急',
      key: '2',
      },
      {
        description: '初次增加姓名“xxx”的群众',
        type: '新增群众',
        belong: '埋土社区',
        creattime: '2023/6/4',
        emergency: '不紧急',
        key: '2',
        },
    {
      description: '初次增加姓名“xxx”的群众',
      type: '新增群众',
      belong: '咯咯社区',
      creattime: '2023/6/4',
      emergency: '不紧急',
      key: '2',

      },
      {
        description: '初次增加姓名“xxx”的群众',
        type: '新增群众',
        belong: '咯咯社区',
        creattime: '2023/6/4',
        emergency: '不紧急',
        key: '2',
  
        },
        {
          description: '初次增加姓名“xxx”的群众',
          type: '新增群众',
          belong: '咯咯社区',
          creattime: '2023/6/4',
          emergency: '不紧急',
          key: '2',
    
          },
      {
        description: '初次增加姓名“xxx”的群众',
        type: '新增群众',
        belong: '呱呱社区',
        creattime: '2023/6/4',
        emergency: '紧急',
        key: '2',

        },
        {
          description: '初次增加姓名“xxx”的群众',
          type: '新增群众',
          belong: '呱呱社区',
          creattime: '2023/6/4',
          emergency: '紧急',
          key: '2',
  
          },
        {
          description: '初次增加姓名“xxx”的群众',
          type: '新增群众',
          belong: '咯咯社区',
          creattime: '2023/6/4',
          emergency: '不紧急',
          key: '2',
    
          },
          {
            description: '初次增加姓名“xxx”的群众',
            type: '新增群众',
            belong: '咯咯社区',
            creattime: '2023/6/4',
            emergency: '不紧急',
            key: '2',
      
            },
      ]

      return (<>
      <Table pagination={{pageSize:9}} columns={columns} dataSource={data} />
      <Modal
      title="查看具体信息"
      open={open}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
      ]}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Descriptions
      title={modalText}
      bordered
      column={{ xxl: 1, xl: 2, lg: 3, md: 3, sm: 2, xs: 1 }}
    >
      <Descriptions.Item label="姓名">Cloud Database</Descriptions.Item>
      <Descriptions.Item label="身份证号">Prepaid</Descriptions.Item>
    </Descriptions>
    <Divider />
    <Table  pagination={false} columns={changecolumns} dataSource={changedata} size="middle" />
    </Modal></>)}

export default App;