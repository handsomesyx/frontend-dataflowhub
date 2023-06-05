/* eslint-disable */
import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { color } from 'echarts/types/dist/echarts';

interface DataType {
  description: string;
  type: string;
  belong: string;
  creattime: string;
  handletime: string;
  emergency: string;
  status: string;
  key: string;
}

const whatcolor= (e: string) => {
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
    render: (text) => <a>{text}</a>,
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
    title: '处理时间',
    dataIndex: 'handletime',
    key: 'handletime',
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
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>重新提交</a>
        <a>删除</a>
        <a style={{visibility:record.status=='审核失败'?'visible':'hidden'}}>{record.status=='审核失败'?'查看处理意见':'______________'}</a>
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
    handletime: '2023/6/9',
    emergency: '特别紧急',
    status: '审核失败',
    key: '1',
    },
  {
    description: '初次增加姓名“xxx”的群众',
    type: '新增群众',
    belong: '埋土社区',
    creattime: '2023/6/4',
    handletime: '2023/6/9',
    emergency: '不紧急',
    status: '审核成功',
    key: '2',
    },
    {
      description: '初次增加姓名“xxx”的群众',
      type: '新增群众',
      belong: '咯咯社区',
      creattime: '2023/6/4',
      handletime: '2023/6/9',
      emergency: '不紧急',
      status: '审核成功',
      key: '2',

      },
      {
        description: '初次增加姓名“xxx”的群众',
        type: '新增群众',
        belong: '呱呱社区',
        creattime: '2023/6/4',
        handletime: '2023/6/9',
        emergency: '紧急',
        status: '审核成功',
        key: '2',

        },
      ]

const App: React.FC = () => <Table pagination={{pageSize:9}} columns={columns} dataSource={data} />;

export default App;