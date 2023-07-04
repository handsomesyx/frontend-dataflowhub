import { ApolloClient, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import type { RadioChangeEvent } from 'antd';
import {
  Button,
  Checkbox,
  Descriptions,
  Divider,
  message,
  Modal,
  Popconfirm,
  Radio,
  Space,
  Table,
  Typography,
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import TextArea from 'antd/es/input/TextArea';
import type { ColumnsType } from 'antd/es/table';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import {
  DELETE_AUDIT_MUTATION,
  GET_AUDIT_CHANGE,
  QUERY_AUDITS,
  UPDATE_AUDIT,
} from '@/apis';
import { getUserName, getUserType } from '@/store/SaveToken';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:7000/graphql',
  cache: new InMemoryCache(),
});
const { Title } = Typography;
interface ChangeWhat {
  id: any;
  change_item: string;
  content_before: string;
  content_after: string;
}

const options = [
  {
    label: 'A',
    value: 'A',
  },
  {
    label: 'B',
    value: 'B',
  },
  {
    label: 'C',
    value: 'C',
  },
  {
    label: 'D',
    value: 'D',
  },
];

interface DataType {
  action_type: ReactNode;
  id: any;
  priority: Number;
  user_info: any;
  person_info: any;
  __typename: ReactNode;
  description: string;
  type: string;
  belong: string;
  admin: string;
  creattime: string;
  emergency: string;
  key: string;
}
interface personinfo {
  name: ReactNode;
  real_name: String;
  id_card: String;
}
interface dataChange {
  personal_info: personinfo;
}
const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(7); //  1超管2警察4网格员7无权限
  const [refuseopen, setRefuseOpen] = useState(false);
  const [showClass, setShowClass] = useState(true);
  const [modalText, setModalText] = useState<DataType>();
  const { data, refetch: listrefetch } = useQuery(QUERY_AUDITS, {
    client,
    onCompleted: () => {
      message.destroy();
    },
  });
  const [dataSource, setDataSource] = useState([]);
  const [changecolumns, setChangecolumns] = useState<ColumnsType<ChangeWhat>>([
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
  ]);
  const [changesShow, setChangesShow] = useState<dataChange[]>([]);
  const [changedata, setChangedata] = useState<ChangeWhat[]>([]);
  const [rightnowAuditrecordsId, setrightnowAuditrecordsId] = useState(0);
  const [updateAudit] = useMutation(UPDATE_AUDIT, {
    client,
    onCompleted: (data) => {
      // console.log(data);
      if (data.updateAudit) message.info('操作成功');
      listrefetch();
      handleCancel();
    },
    onError: (error) => {
      console.error(error);
      listrefetch();
      message.info('操作失败');
    },
  });
  const { refetch } = useQuery(GET_AUDIT_CHANGE, {
    client,
    variables: { rightnow_auditrecords_id: rightnowAuditrecordsId },
    onCompleted: (data) => {
      // console.log(data.getChangeRecord); // 控制台结果
      setChangesShow(data.getChangeRecord);
      const changewhat = data.getChangeRecord.map((item: ChangeWhat) => ({
        after: item?.content_after,
        before: item?.content_before,
        value: item?.change_item,
        key: item?.id,
      }));

      // console.log(changewhat);
      setChangedata(changewhat);

      if (rightnowAuditrecordsId !== 0) {
        message.destroy();
        message.info('信息加载完成');
      }
    },
  });

  const [deleteAuditMutation] = useMutation(DELETE_AUDIT_MUTATION, {
    client,
    onCompleted: () => {
      listrefetch();
    },
  });
  const [plainOptions, setPlainOptions] = useState<string[]>([]);
  const [comment, setComment] = useState('未填写'); // 拒绝原因
  const [classabcd, setClassabcd] = useState('未分类'); // 人员ABCD分类
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(['未选择']);
  const onsubChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };

  const checkonChange = (e: RadioChangeEvent) => {
    // console.log('checked = ', e.target.value);
    let newPlainOptions: string[] | ((prevState: never[]) => never[]) = [];

    switch (e.target.value) {
      case 'A':
        setClassabcd('A');
        newPlainOptions = [
          '涉政、恐、毒、重大刑事犯罪前科人员',
          '肇事肇祸精神病人',
          '潜在社会危害性人员',
          '其他重点人员',
        ];
        break;
      case 'B':
        setClassabcd('B');
        newPlainOptions = [
          '一般违法和其他刑满释放人员',
          '社区矫正、取保候审监视居住、境外居留人员',
          '旅游人员',
          '涉枪涉爆涉危化、现实表现差等重点人员',
          '其他重点人员',
        ];
        break;
      case 'C':
        setClassabcd('C');
        newPlainOptions = [
          '其他流动人口',
          '涉访人员和独居老人',
          '生活困难等无人监管的鳏寡孤独残障病幼等特殊人员',
          '其他特殊人员',
        ];
        break;
      default:
        setClassabcd('D');
        newPlainOptions = [];
    }

    setPlainOptions(newPlainOptions);
  };

  const confirm = async (id: any) => {
    const tmp = parseInt(id);
    try {
      await deleteAuditMutation({
        variables: { rightnow_auditrecords_id: tmp },
      });
      message.info('删除完成');
    } catch (e) {
      console.error(e);
      message.error('删除失败');
    }
  };

  useEffect(() => {
    // console.log('getUserType', getUserType());
    let tmp = 7;
    if (getUserType() === 'superAdmin') {
      setRole(1);
      tmp = 1;
    }
    if (getUserType() === 'filmPolice') {
      setRole(2);
      tmp = 2;
    }
    if (getUserType() === 'gridMember') {
      setRole(4);
      tmp = 4;
    }
    // console.log('身份验证完成');

    if (data) {
      // console.log(data);
      const username = getUserName();
      const filtered = data.findManyAudit.data.filter((item: any) => {
        if (
          item.is_delete === false &&
          tmp === 2 &&
          item?.officer_info?.username === username
        ) {
          return true;
        }
        if (
          item.is_delete === false &&
          tmp === 4 &&
          item?.user_info?.username === username
        ) {
          return true;
        }
        if (item.is_delete === false && tmp === 1) {
          return true;
        }
        return false;
      });
      message.info('列表加载完成');
      const formattedData = filtered.map((item: any) => {
        const date = new Date(item.create_time);
        const formattedDate = date.toLocaleString();
        return {
          ...item,
          key: item.id,
          create_time: formattedDate,
        };
      });
      // console.log(formattedData);
      setDataSource(formattedData);
    }
  }, [data]);

  const handleRefuse = () => {
    setRefuseOpen(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // console.log('Change:', e.target.value);
    setComment(e.target.value);
  };

  const handlereReview = () => {
    const newData = {
      review_comments: comment,
      status: 2,
      review_time: new Date(),
    };
    updateAudit({
      variables: { new_data: newData, rightnow_auditrecords_id: rightnowAuditrecordsId },
    });
    setRefuseOpen(false);
    setOpen(false);
  };

  const showModal = (e: any) => {
    if (e.action_type === '1') {
      setShowClass(true);
      setChangecolumns([
        {
          key: 'new',
          title: '新增属性',
          dataIndex: 'value',
        },
        {
          key: 'con',
          title: '内容',
          dataIndex: 'after',
        },
      ]);
    } else {
      setShowClass(false);
      setChangecolumns([
        {
          key: 'cvalue',
          title: '变更属性',
          dataIndex: 'value',
        },
        {
          key: 'cvalueb',
          title: '变更前',
          dataIndex: 'before',
        },
        {
          title: '变更后',
          key: 'cvaluea',
          dataIndex: 'after',
        },
      ]);
    }

    const tmp = parseInt(e.id);
    setrightnowAuditrecordsId(tmp);
    refetch();
    message.loading('加载中...', 1000);
    setModalText(e);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setChangedata([]);
    setChangesShow([]);
  };

  const handlePass = () => {
    // console.log(checkedList);
    const newData = {
      review_comments: '审核通过',
      status: 1,
      review_time: new Date(),
    };
    const checkedList_string = checkedList.join(' ');
    const classData = {
      classification_reason: checkedList_string,
      person_classification: classabcd
    };
    updateAudit({
      variables: { class_data:classData,new_data: newData,
         rightnow_auditrecords_id: rightnowAuditrecordsId },
    });
  };

  const handlerefuseCancel = () => {
    setRefuseOpen(false);
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

  const columns: ColumnsType<DataType> = [
    {
      title: '详情描述',
      dataIndex: 'action_type',
      key: 'action_type1',
      render: (_, text) => {
        let content = '编辑';
        switch (text?.action_type) {
          case '1':
            content = '新增';
            break;
          case '2':
            content = '删除';
            break;
          case '3':
            content = '修改';
            break;
          default:
            break;
        }
        return (
          <a onClick={showModal}>
            {content}姓名为&quot;{text?.person_info?.name}&quot;的群众信息
          </a>
        );
      },
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
      key: 'belong',
      render: (_, text) => <div>{text?.person_info?.person_classification}</div>,
    },
    {
      title: '所属网格员',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (_, text) => <div>{text.user_info.real_name}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '紧急程度',
      key: 'status',
      dataIndex: 'status',
      render: (_, emergency) => <div>{whatcolor(emergency.priority)}</div>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>查看具体信息</a>
          <Popconfirm
            placement="topRight"
            title="你确定要删除吗？"
            onConfirm={() => {
              confirm(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table pagination={{ pageSize: 9 }} columns={columns} dataSource={dataSource} />
      <Modal
        title="查看具体信息"
        open={open}
        width={910}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          role === 1 || role === 2 ? (
            <>
              <Button
                key="refuse"
                onClick={handleRefuse}
                style={{ backgroundColor: 'red', color: 'white' }}
              >
                拒绝
              </Button>
              ,
              <Button key="ok1" type="primary" onClick={handlePass}>
                同意
              </Button>
            </>
          ) : (
            <></>
          ),
        ]}
        onCancel={handleCancel}
      >
        <Descriptions
          title={modalText?.description}
          bordered
          column={{ xxl: 1, xl: 2, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="姓名">
            {changesShow[0]?.personal_info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="身份证号">
            {changesShow[0]?.personal_info?.id_card}
          </Descriptions.Item>
        </Descriptions>
        <Divider />

        <Table
          pagination={false}
          columns={changecolumns}
          dataSource={changedata}
          size="middle"
        />
        <Divider />

        {showClass && (role === 1 || role === 2) ? (
          <>
            <Title level={5}>人员分级类别</Title>
            <Radio.Group
              style={{ marginTop: 10, marginBottom: 10 }}
              options={options}
              onChange={checkonChange}
            />
            <Checkbox.Group
              options={plainOptions}
              value={checkedList}
              onChange={onsubChange}
            />
          </>
        ) : (
          <></>
        )}
      </Modal>
      <Modal
        okText="确认"
        cancelText="取消"
        title="提交拒绝原因"
        open={refuseopen}
        onOk={handlereReview}
        onCancel={handlerefuseCancel}
      >
        <TextArea
          style={{ marginTop: 30, marginBottom: 40 }}
          autoSize={{ minRows: 3, maxRows: 5 }}
          showCount
          maxLength={1000}
          onChange={onChange}
          placeholder="输入审核意见"
        />
      </Modal>
    </>
  );
};

export default App;
