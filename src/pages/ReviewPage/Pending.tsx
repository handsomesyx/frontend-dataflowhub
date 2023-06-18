/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Typography,
  Tag,
  Divider,
  Button,
  Modal,
  Descriptions,
  message,
  Popconfirm,
  Checkbox,
  Radio,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { ApolloClient, InMemoryCache, useQuery } from "@apollo/client";
import { GET_AUDIT_CHANGE, QUERY_AUDITS } from "@/apis";

const client = new ApolloClient({
  uri: 'http://127.0.0.1:7000/graphql',
  cache: new InMemoryCache()
});
const { Title } = Typography;
interface ChangeWhat {
  key: React.Key;
  value: string;
  before: string;
  after: string;
}

const options = [
  {
    label:
      "A涉政、恐、毒、重大刑事犯罪前科人员，肇事肇祸精神病人，潜在社会危害性等重点人员",
    value: "A",
  },
  {
    label:
      "B一般违法和其他刑满释放人员、社区矫正、取保候审监视居住、境外居留人员、旅游人员、涉枪涉爆涉危化、现实表现差等重点人员",
    value: "B",
  },
  {
    label:
      "C其他流动人口、涉访人员和独居老人、生活困难等无人监管的鳏寡孤独残障病幼等特殊人员",
    value: "C",
  },
  {
    label: "D有固定住所、稳定收入、家庭和睦、现实表现良好等各种人群",
    value: "D",
  },
];

const checkonChange = (checkedValues: CheckboxValueType[]) => {
  console.log("checked = ", checkedValues);
};

const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  console.log("Change:", e.target.value);
};

const confirm = () => {
  message.info("删除完成");
};

const changecolumns: ColumnsType<ChangeWhat> = [
  {
    title: "变更属性",
    dataIndex: "value",
  },
  {
    title: "变更前",
    dataIndex: "before",
  },
  {
    title: "变更后",
    dataIndex: "after",
  },
];

const changedata: ChangeWhat[] = [
  {
    key: "1",
    value: "姓名",
    before: "张大猫",
    after: "张小狗",
  },
  {
    key: "2",
    value: "年龄",
    before: "42",
    after: "88",
  },
  {
    key: "3",
    value: "家庭成员信息",
    before: "wuwuuw",
    after: "xxxxxxxxxxx",
  },
];

interface DataType {
  description: string;
  type: string;
  belong: string;
  admin: string;
  creattime: string;
  emergency: string;
  key: string;
}
const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [refuseopen, setRefuseOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<DataType>();
  const { loading, error, data } = useQuery(QUERY_AUDITS,{client});
  const [dataSource, setDataSource] = useState([]);
  const [tdata, settData] = useState([]);
  const [rightnowAuditrecordsId, setrightnowAuditrecordsId] = useState(0);
  const [DataShow, setDataShow] = useState([]);
  const { refetch } = useQuery(GET_AUDIT_CHANGE, {
    client,
    variables: { rightnow_auditrecords_id: rightnowAuditrecordsId },
    onCompleted: (data) => {
      console.log(data.getChangeRecord[0]); // 控制台结果
    },
  });

  useEffect(() => {
    console.log("请求完成")
    if (data) {
      console.log(data)
      const filtered = data.findManyAudit.data.filter((item:any) => item.is_delete === false);
      const formattedData = filtered.map((item:any) => {
        const date = new Date(item.create_time);
        const formattedDate = date.toLocaleString();
        return {
          ...item,
          create_time: formattedDate
        };
      });
      console.log(formattedData)
      setDataSource(formattedData);
    }
    
  }, [data]);




  const handleRefuse = () => {
    setRefuseOpen(true);
  };

  const handlereReview = () => {
    setRefuseOpen(false);
    setOpen(false);
  };

  const showModal = (e: any) => {
    const tmp=parseInt(e.id)
    setrightnowAuditrecordsId(tmp)
    refetch()

    setModalText(e);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlerefuseCancel = () => {
    setRefuseOpen(false);
  };

  const whatcolor = (e: string) => {
    if (e === "特别紧急") {
      return (
        <div
          style={{ backgroundColor: "red", width: "50px", height: "20px" }}
        />
      );
    } else if (e === "紧急") {
      return (
        <div
          style={{ backgroundColor: "orange", width: "50px", height: "20px" }}
        />
      );
    } else {
      return (
        <div
          style={{ backgroundColor: "blue", width: "50px", height: "20px" }}
        />
      );
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "详情描述",
      dataIndex: "action_type",
      key: "action_type",
      render: (text) => <a onClick={showModal}>{text}</a>,
    },
    {
      title: "事件类型",
      dataIndex: "action_type",
      key: "action_type",
    },
    {
      title: "所属群众",
      dataIndex: "action_type",
      key: " action_type",
    },
    {
      title: "所属网格员",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
    },
    {
      title: "紧急程度",
      key: "status",
      dataIndex: "status",
      render: (_, emergency) => <div>{whatcolor(emergency.emergency)}</div>,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>查看具体信息</a>
          <Popconfirm
            placement="topRight"
            title="你确定要删除吗？"
            onConfirm={confirm}
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
          <Button
            key="refuse"
            onClick={handleRefuse}
            style={{ backgroundColor: "red", color: "white" }}
          >
            拒绝
          </Button>,
          <Button key="ok" type="primary" onClick={handleCancel}>
            同意
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        <Descriptions
          title={modalText?.description}
          bordered
          column={{ xxl: 1, xl: 2, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="姓名">Cloud Database</Descriptions.Item>
          <Descriptions.Item label="身份证号">Prepaid</Descriptions.Item>
        </Descriptions>
        <Divider />

        <Table
          pagination={false}
          columns={changecolumns}
          dataSource={changedata}
          size="middle"
        />
        <Divider />
        <Title level={5}>人员分级类别</Title>
        <Radio.Group
          style={{ marginTop: 10, marginBottom: 10 }}
          options={options}
          onChange={checkonChange}
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
