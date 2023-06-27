import { ApolloClient, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import { Card, message, Modal, Popconfirm, Space, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import { DELETE_AUDIT_MUTATION, QUERY_OK, QUERY_REFUSE } from '@/apis';
import { getUserName, getUserType } from '@/store/SaveToken';

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
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState(7);//  1超管2警察4网格员7无权限
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [datashow, setDataShow] = useState<Audi[]>([]);
  const [suggestion, setSuggestion] = useState('未设置处理意见');
  const { data: re, refetch: refetch1 } = useQuery(QUERY_REFUSE, { client });
  const { data: ok, refetch: refetch2 } = useQuery(QUERY_OK, { client });
  const [deleteAuditMutation] = useMutation(DELETE_AUDIT_MUTATION, { client });

  const confirm = async (id: any) => {
    const tmp = parseInt(id);
    try {
      await deleteAuditMutation({
        variables: { rightnow_auditrecords_id: tmp },
      });
      refetch1();
      refetch2();
      message.info('删除完成');
    } catch (e) {
      console.error(e);
      message.error('删除失败');
    }
  };

  useEffect(() => {
    console.log('getUserType', getUserType());
    let tmp=7;
    if (getUserType()==='superAdmin') {setRole(1);tmp=1;}
    if (getUserType()==='filmPolice') {setRole(2);tmp=2;}
    if (getUserType()==='gridMember') {setRole(4);tmp=4;}
    console.log('身份验证完成');
    console.log(re);
    console.log(ok);
    if (re && ok) {
      console.log(re.findManyAudit.data);
      console.log(ok.findManyAudit.data);
      const username=getUserName();
      console.log(username);
      const newArray = re.findManyAudit.data.concat(ok.findManyAudit.data);
      const filtered = newArray.filter((item: any) => {
        if (item.is_delete === false && tmp === 2 && item?.officer_info?.username === username) {
          return true;
        }
        if (item.is_delete === false && tmp === 4 && item?.user_info?.username === username) {
          return true;
        }
        return false;
      });
      message.info('列表加载完成');
      const formattedData = filtered.map((item: any) => {
        const date = new Date(item.update_time);
        const date1 = new Date(item.create_time);
        const formattedDate = date.toLocaleString();
        const formattedDate1 = date1.toLocaleString();
        return {
          ...item,
          create_time: formattedDate1,
          update_time: formattedDate,
        };
      });
      setDataShow(formattedData);
      console.log(formattedData);
    }
  }, [re, ok]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
  };

  const showModal = (e: string) => {
    setSuggestion(e);
    setIsModalOpen(true);
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

  const whatcolor = (e: Number) => {
    if (e === 1) {
      return <div style={{ backgroundColor: 'red', width: '50px', height: '20px' }} />;
    } else if (e === 2) {
      return <div style={{ backgroundColor: 'orange', width: '50px', height: '20px' }} />;
    } else {
      return <div style={{ backgroundColor: 'blue', width: '50px', height: '20px' }} />;
    }
  };

  const columns: ColumnsType<object> = [
    {
      title: '详情描述',
      dataIndex: 'action_type',
      key: 'action_type',
      render: (_, text: any) => (
        <a>
          {text?.__typename}姓名为&quot;{text?.person_info?.real_name}&quot;的群众信息
        </a>
      ),
    },
    {
      title: '事件类型',
      dataIndex: 'action_type',
      key: 'action_type',
      render: (_, text) => {
        let content = '编辑';
        switch (text?.action_type) {
          case '1':
            content = '新增信息';
            break;
          case '2':
            content = '删除信息';
            break;
          case '3':
            content = '修改信息';
            break;
          case '4':
            content = '添加家庭关系';
            break;
          case '5':
            content = '删除家庭关系';
            break;
          default:
            break;
        }
        return <div>{content}</div>;
      },
    },
    {
      title: '所属群众',
      dataIndex: 'belong',
      key: ' belong',
      render: (_, text: any) => <div>{text?.person_info?.id}</div>,
    },
    {
      title: '所属网格员',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (_, text: any) => <div>{text?.user_info?.real_name}</div>,
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
      render: (_, emergency: any) => <div>{whatcolor(emergency.priority)}</div>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: any) => (
        <Space size="middle">
          <Popconfirm
            placement="topLeft"
            title="你确定要删除吗？"
            onConfirm={() => {
              confirm(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>

          <a style={{ color: record.status === 1 ? 'green' : 'red' }}>
            {record.status === 1 ? '审核通过' : '审核未通过'}
          </a>
          <a onClick={() => showModal(record.review_comments)}>
            {record.status === 1 ? '' : '查看处理意见'}
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table pagination={{ pageSize: 9 }} columns={columns} dataSource={datashow} />
      <Modal
        okText="确认"
        cancelText="取消"
        title="查看具体处理意见"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Card style={{ marginTop: 30, marginBottom: 30 }} title="处理意见">
          {suggestion}
        </Card>
      </Modal>
      <Modal
        okText="确认"
        cancelText="取消"
        title="重新提交理由"
        open={isModal2Open}
        onOk={resumit}
        onCancel={handleCancel}
      >
        <TextArea
          style={{ marginTop: 30, marginBottom: 40 }}
          showCount
          maxLength={1000}
          onChange={onChange}
          placeholder="输入重新提交理由"
        />
      </Modal>
    </>
  );
};

export default App;
