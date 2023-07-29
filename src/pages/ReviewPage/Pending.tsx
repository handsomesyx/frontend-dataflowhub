import { useMutation, useQuery } from '@apollo/client';
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

// const client = new ApolloClient({
//   uri: 'http://127.0.0.1:7000/graphql',
//   cache: new InMemoryCache(),
// });
const { Title } = Typography;
interface ChangeWhat {
  id: any;
  change_item: string;
  content_before: string;
  content_after: string;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
  request_data: any;
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
  police_leader_name: string;
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
  // const [record, setRecord] = useState<DataType>();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(7); //  1超管2警察4网格员7无权限
  const [refuseopen, setRefuseOpen] = useState(false);
  // const [showClass, setShowClass] = useState(true);
  const [modalText, setModalText] = useState<DataType>();
  const [actionType, setActionType] = useState<string>();
  const { data, refetch: listrefetch } = useQuery(QUERY_AUDITS, {
    // client,
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    // onCompleted: () => {
    //   message.destroy();
    // },
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
    // client,
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
  const { loading } = useQuery(GET_AUDIT_CHANGE, {
    // client,
    fetchPolicy: 'no-cache',
    variables: { rightnow_auditrecords_id: rightnowAuditrecordsId },
    onCompleted: (data) => {
      // console.log('b', data.getChangeRecord); // 控制台结果
      setChangesShow(data.getChangeRecord);
      const changewhat = data.getChangeRecord.map((item: ChangeWhat) => ({
        after: item?.content_after,
        before: item?.content_before,
        value: item?.change_item,
        key: item?.id,
      }));

      setChangedata(changewhat);

      if (rightnowAuditrecordsId !== 0) {
        message.destroy();
        message.info('信息加载完成');
      }
    },
  });

  const [deleteAuditMutation] = useMutation(DELETE_AUDIT_MUTATION, {
    // client,
    onCompleted: () => {
      listrefetch();
    },
  });
  const [plainOptions, setPlainOptions] = useState<string[]>([]);
  const [comment, setComment] = useState('未填写'); // 拒绝原因
  const [classabcd, setClassabcd] = useState('未分类'); // 人员ABCD分类
  const [namecardnow, setNamecardnow] = useState('未设置'); // 身份证编辑中
  const [idcardnow, setIdcardnow] = useState('未设置'); // 身份证编辑中
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
    if (getUserType() === 'Director') {
      setRole(5);
      tmp = 5;
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
        if (
          item.is_delete === false &&
          tmp === 5 &&
          item.police_leader_name === username
        ) {
          return true;
        }
        return false;
      });
      message.info('列表加载完成');
      // console.log(filtered);

      const formattedData = filtered.map((item: any) => {
        const date = new Date(item.create_time);
        const formattedDate = formatDate(date);
        return {
          ...item,
          key: item.id,
          create_time: formattedDate,
        };
      });
      // console.log('显示结果');
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
    let newPlainOptions: string[] | ((prevState: never[]) => never[]) = [];

    switch (e.person_info.person_classification) {
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

    console.log(e.person_info.classification_reason);
    const reason_str: string = e.person_info.classification_reason;
    setCheckedList(reason_str.split(' '));
    // setRecord(e);
    setClassabcd(e.person_info.person_classification);
    setIdcardnow(e.request_data?.id_card);
    setNamecardnow(e.request_data?.name);
    setActionType(e?.action_type);
    if (e.action_type === '1') {
      // setShowClass(true);
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
      // setShowClass(false);
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

    // const tmp = parseInt(e.id);
    // setrightnowAuditrecordsId(tmp);
    // refetch();
    // message.loading('加载中...', 1000);
    // if (changedata.length !== 0) {
    //   message.destroy();
    // }
    setModalText(e);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    // setChangedata([]);
    setChangesShow([]);
  };

  const handlePass = () => {
    let reason: string;
    checkedList.map((item) => {
      reason = item + reason;
    });
    const newData = {
      review_comments: '审核通过',
      status: 1,
      review_time: new Date(),
    };
    const checkedList_string = checkedList.join(' ');
    const classData = {
      classification_reason: checkedList_string,
      person_classification: classabcd,
    };
    if (actionType === '1') {
      updateAudit({
        variables: {
          class_data: classData,
          new_data: newData,
          rightnow_auditrecords_id: rightnowAuditrecordsId,
        },
      });
    } else {
      updateAudit({
        variables: {
          // class_data: classData,
          new_data: newData,
          rightnow_auditrecords_id: rightnowAuditrecordsId,
        },
      });
    }
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
        let name = text?.person_info?.name ? text?.person_info?.name : '未提交姓名';
        switch (text?.action_type) {
          case '1':
            content = '新增';
            name = text?.request_data.name;
            break;
          case '2':
            content = '删除';
            name = text?.person_info?.name;
            break;
          case '3':
            content = '修改';
            name = text?.person_info?.name;
            break;
          case '4':
            content = '修改';
            name = text?.person_info?.name;
            break;
          case '5':
            content = '修改';
            name = text?.person_info?.name;
            break;
          default:
            break;
        }
        return (
          <a onClick={showModal}>
            {content}姓名为&quot;{name}&quot;的群众信息
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
      title: '所属操作人员',
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
          <a
            onClick={() => {
              showModal(record);
              setrightnowAuditrecordsId(Number(record.id));
            }}
          >
            查看具体信息
          </a>
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
      <Table
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['5', '10', '15', '20'],
        }}
        columns={columns}
        dataSource={dataSource}
      />
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
            {changesShow[0]?.personal_info?.name
              ? changesShow[0]?.personal_info?.name
              : namecardnow}
          </Descriptions.Item>
          <Descriptions.Item label="身份证号">
            {changesShow[0]?.personal_info?.id_card
              ? changesShow[0]?.personal_info?.id_card
              : idcardnow}
          </Descriptions.Item>
        </Descriptions>
        <Divider />

        <Table
          pagination={false}
          columns={changecolumns}
          dataSource={changedata}
          size="middle"
          loading={loading}
        />
        <Divider />

        {/* {showClass && (role === 1 || role === 2) ? (
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
        )} */}
        <Title level={5}>人员分级类别</Title>
        <Radio.Group
          style={{ marginTop: 10, marginBottom: 10 }}
          options={options}
          value={classabcd}
          onChange={checkonChange}
        />
        <Checkbox.Group
          options={plainOptions}
          value={checkedList}
          onChange={onsubChange}
        />
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
