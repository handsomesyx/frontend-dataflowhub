/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Card, Modal, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TextArea from 'antd/es/input/TextArea';
import { DELETE_AUDIT_MUTATION, QUERY_OK, QUERY_REFUSE } from '@/apis';
import { ApolloClient, InMemoryCache, useMutation, useQuery } from '@apollo/client';



interface Audi {
  action_type: string;
  create_time: Date;
  creator_id: number;
  id: string;
  is_delete: boolean;
  officer_id: number;
  officer_name: string;
  priority: number;
  request_data: object;
  request_time: Date;
  review_comments: string;
  review_time: Date;
  status: number;
  update_time: Date;
  updater_id: number;
  user_id: number;
  user_name: string;
}

const client = new ApolloClient({
  uri: 'http://127.0.0.1:7000/graphql',
  cache: new InMemoryCache()
});

const App: React.FC = () => { 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [datashow, setDataShow] = useState<Audi[]>([]);
  const [suggestion, setSuggestion] = useState("未设置处理意见");
  const {data:re } = useQuery(QUERY_REFUSE,{client});
  const {data:ok } = useQuery(QUERY_OK,{client});
  const [deleteAuditMutation] = useMutation(DELETE_AUDIT_MUTATION,{client});
  
  const confirm = async(id: any) => {
    const tmp=parseInt(id)
    try {
      await deleteAuditMutation({
        variables: {rightnow_auditrecords_id:tmp},
      });
      message.info('删除完成');
    } catch (e) {
      console.error(e);
    }
      

    
  };

  
  useEffect(() => {
    console.log(re)
    console.log(ok)
    if(re&&ok)
    {
      console.log("齐全")
      console.log(re.findManyAudit.data)
      console.log(ok.findManyAudit.data)
      const newArray = re.findManyAudit.data.concat(ok.findManyAudit.data);
      const formattedData = newArray.map((item:any) => {
        const date = new Date(item.update_time);
        const date1 = new Date(item.create_time);
        const formattedDate = date.toLocaleString();
        const formattedDate1 = date1.toLocaleString();
        return {
          ...item,
          create_time:formattedDate1,
          update_time: formattedDate
        };
      });
      setDataShow(formattedData)
      console.log(formattedData)
    }
  }, [re, ok]);
  
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


const whatcolor= (e: Number) => {
  if (e === 1) {
    return (
      <div style={{ backgroundColor: 'red', width: '50px', height: '20px' }}/>
    );
  } else if (e ===2) {
    return (
      <div style={{ backgroundColor: 'orange', width: '50px', height: '20px' }}/>
    );
  } else {
    return (
      <div style={{ backgroundColor: 'blue', width: '50px', height: '20px' }}/>
    );
  }
}

const columns: ColumnsType= [
  {
    title: '详情描述',
    dataIndex: 'action_type',
    key: 'action_type',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '事件类型',
    dataIndex: 'action_type',
    key: 'action_type',
  },
  {
    title: '所属群众',
    dataIndex: 'belong',
    key: ' belong',
  },
  {
    title: '所属网格员',
    dataIndex: 'user_name',
    key: 'user_name',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: '处理时间',
    dataIndex: 'update_time',
    key: 'update_time',
  },
  {
    title: '紧急程度',
    key: 'emergency',
    dataIndex: 'emergency',
    render: (_, emergency) => (
    <div>
       {whatcolor(emergency.priority)}
    </div>
    )
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
      <Popconfirm
        placement="topLeft"
        title="你确定要删除吗？"
        onConfirm={()=>{confirm(record.id)}}
        okText="Yes"
        cancelText="No"
      >
        <a>删除</a></Popconfirm>
        <a onClick={()=>showModal(record.review_comments)} >查看处理意见</a>
        <a style={{color:record.status==1?'green':'red'}}>{record.status==1?'审核通过':'审核未通过'}</a>
      </Space>
    ),
  },
];


return(<><Table  pagination={{pageSize:9}} columns={columns} dataSource={datashow} /><Modal okText="确认"
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