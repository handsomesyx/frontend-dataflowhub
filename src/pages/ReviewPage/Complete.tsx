/* eslint-disable */
import React, { useState } from 'react';
import { Card, Modal, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TextArea from 'antd/es/input/TextArea';

interface DataType {
  description: string;
  type: string;
  belong: string;
  suggest:string;
  admin: string,
  creattime: string;
  handletime: string;
  emergency: string;
  status: string;
  key: string;
}

const App: React.FC = () => { 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [suggestion, setSuggestion] = useState("未设置处理意见");

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
  };  

  const showModal = (e: string) => {
    setSuggestion(e)
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModal2Open(true);
  };

  const resumit = () => {
    setIsModal2Open(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
  };
const confirm = () => {
  message.info('删除完成');
};

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
    title: '所属网格员',
    dataIndex: 'admin',
    key: 'admin',
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
      <Popconfirm
        placement="topLeft"
        title="你确定要删除吗？"
        onConfirm={confirm}
        okText="Yes"
        cancelText="No"
      >
        <a>删除</a></Popconfirm>
        <a onClick={()=>showModal(record.suggest)} >查看处理意见</a>
        <a onClick={()=>showModal2()} style={{visibility:record.status=='审核失败'?'visible':'hidden'}}>{record.status=='审核失败'?'重新提交':''}</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    description: '初次增加姓名“xxx”的群众',
    type: '新增群众',
    belong: '咯咯gaga区',
    admin: '小格',
    suggest:'再改改',
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
    admin: '小格',
    suggest:'再改改',
    creattime: '2023/6/4',
    handletime: '2023/6/9',
    emergency: '不紧急',
    status: '审核成功',
    key: '2',
    },
    {
      description: '初次增加姓名“xxx”的群众',
      type: '新增群众',
      suggest:'再改改wwwwww五五咻咻咻',
      belong: '咯咯社区',
      admin: '小格',
      creattime: '2023/6/4',
      handletime: '2023/6/9',
      emergency: '不紧急',
      status: '审核失败',
      key: '2',

      },
      {
        description: '初次增加姓名“xxx”的群众',
        type: '新增群众',
        belong: '呱呱社区',
        suggest:'再改改',
        admin: '小格',
        creattime: '2023/6/4',
        handletime: '2023/6/9',
        emergency: '紧急',
        status: '审核成功',
        key: '2',

        },
      ]

return(<><Table  pagination={{pageSize:9}} columns={columns} dataSource={data} /><Modal okText="确认"
cancelText="取消" title="查看具体处理意见" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
    <Card style={{marginTop:30,marginBottom:30}} title="处理意见">{suggestion}</Card>

</Modal><Modal okText="确认"
cancelText="取消" title="重新提交理由" open={isModal2Open} onOk={resumit} onCancel={handleCancel}>
    <TextArea
      style={{marginTop:30,marginBottom:40}}
      showCount
      maxLength={1000}
      onChange={onChange}
      placeholder="输入重新提交理由"
    />
</Modal></>)};

export default App;