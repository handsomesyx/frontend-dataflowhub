import { ApolloClient, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import type { RadioChangeEvent } from 'antd';
import {
  Button,
  Checkbox,
  Descriptions,
  Divider,
  message,
  Modal,
  Radio,
  Typography,
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import TextArea from 'antd/es/input/TextArea';
import type { ColumnsType } from 'antd/es/table';
import Table from 'antd/es/table';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

// import { getUserType } from '@/store/SaveToken';
import { GET_AUDIT_CHANGE, UPDATE_AUDIT } from '@/apis';
import { getUserType } from '@/store/SaveToken';

const { Title } = Typography;
const client = new ApolloClient({
  uri: 'http://127.0.0.1:7000/graphql',
  cache: new InMemoryCache(),
});

interface ChangeWhat {
  id: any;
  change_item: string;
  content_before: string;
  content_after: string;
}
interface dataChange {
  personal_info: personinfo;
}
interface personinfo {
  name: ReactNode;
  real_name: String;
  id_card: String;
}
// interface DataType {
//   request_data: any;
//   action_type: ReactNode;
//   id: any;
//   priority: Number;
//   user_info: any;
//   person_info: any;
//   __typename: ReactNode;
//   description: string;
//   type: string;
//   belong: string;
//   admin: string;
//   creattime: string;
//   emergency: string;
//   key: string;
// }
type EventData = {
  create_time: Date;
  creator_id: number;
  event_type: string;
  id: number;
  is_delete: Boolean;
  link: string;
  receiver_id: number;
  sender_id: number;
  status: string;
  update_time: Date;
  updater_id: number;
  audit_records_id: number;
  auditrecords: AuditRecords;
};

type AuditRecords = {
  description: string;
  action_type: string;
  create_time: Date;
  creatod_id: number;
  id: string;
  is_delete: Boolean;
  officer_info: any;
  person_info: any;
  priority: number;
  request_data: any;
};
type props = {
  visibleDetail: boolean;
  rightnowAuditrecordsId: number;
  setVisibleDetail: (value: boolean) => void;
  setRightnowAuditrecordsId: (value: any) => void;
  currentEventData?: EventData;
};
const Detail = React.memo(
  ({
    visibleDetail,
    rightnowAuditrecordsId,
    setRightnowAuditrecordsId,
    setVisibleDetail,
    currentEventData,
  }: props) => {
    // 拒绝按钮的弹窗状态
    const [refuseopen, setRefuseOpen] = useState(false);
    const [plainOptions, setPlainOptions] = useState<string[]>([]);
    const [role, setRole] = useState(7); //  1超管2警察3所长4网格员7无权限
    const [changesShow, setChangesShow] = useState<dataChange[]>([]);
    const [changedata, setChangedata] = useState<ChangeWhat[]>([]);
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(['未选择']);
    const [classabcd, setClassabcd] = useState('未分类'); // 人员ABCD分类
    // const [modalText, setModalText] = useState<DataType>();
    const [showClass, setShowClass] = useState(true);
    const [namecardnow, setNamecardnow] = useState('未设置'); // 身份证编辑中
    const [idcardnow, setIdcardnow] = useState('未设置'); // 身份证编辑中
    const [comment, setComment] = useState('未填写'); // 拒绝原因

    const onsubChange = (list: CheckboxValueType[]) => {
      setCheckedList(list);
    };
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
    const { refetch } = useQuery(GET_AUDIT_CHANGE, {
      client,
      variables: { rightnow_auditrecords_id: rightnowAuditrecordsId },
      onCompleted: (data) => {
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
    const [updateAudit] = useMutation(UPDATE_AUDIT, {
      client,
      onCompleted: (data) => {
        if (data.updateAudit) message.info('操作成功');
        handleCancel();
      },
      onError: (error) => {
        console.error(error);
        message.info('操作失败');
      },
    });
    const handleRefuse = () => {
      setRefuseOpen(true);
    };

    useEffect(() => {
      console.log('getUserType', getUserType());
      if (getUserType() === 'superAdmin') {
        setRole(1);
      }
      if (getUserType() === 'filmPolice') {
        setRole(2);
      }
      if (getUserType() === 'Director') {
        setRole(3);
      }
      if (getUserType() === 'gridMember') {
        setRole(4);
      }
    }, [setRole]);
    useEffect(() => {
      // visibleDetail 变化时执行的操作
      if (visibleDetail) {
        refetch();
      }
    }, [visibleDetail, refetch]);

    useEffect(() => {
      setIdcardnow(currentEventData?.auditrecords.request_data?.id_card);
      setNamecardnow(currentEventData?.auditrecords.request_data?.name);
      if (currentEventData?.auditrecords.action_type === '1') {
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
      const tmp = currentEventData?.audit_records_id;
      setRightnowAuditrecordsId(tmp);
      refetch();
    }, [currentEventData, setRightnowAuditrecordsId, refetch, visibleDetail]);
    const checkonChange = (e: RadioChangeEvent) => {
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

    const handleCancel = () => {
      setVisibleDetail(false);
      // setChangedata([]);
      // setChangesShow([]);
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
      updateAudit({
        variables: {
          class_data: classData,
          new_data: newData,
          rightnow_auditrecords_id: rightnowAuditrecordsId,
        },
      });
    };
    const handlereReview = () => {
      const newData = {
        review_comments: comment,
        status: 2,
        review_time: new Date(),
      };
      updateAudit({
        variables: {
          new_data: newData,
          rightnow_auditrecords_id: rightnowAuditrecordsId,
        },
      });
      setRefuseOpen(false);
      setVisibleDetail(false);
    };
    const handlerefuseCancel = () => {
      setRefuseOpen(false);
    };
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
    };
    return (
      <>
        <Modal
          title="查看具体信息"
          open={visibleDetail}
          width={910}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              取消
            </Button>,
            role === 1 || role === 2 || role === 3 ? (
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
            title={
              currentEventData?.auditrecords.action_type === '1'
                ? `新增姓名为 ${currentEventData?.auditrecords.person_info?.name} 的群众信息`
                : currentEventData?.auditrecords.action_type === '2'
                ? `删除姓名为 ${currentEventData?.auditrecords.person_info?.name} 的群众信息`
                : currentEventData?.auditrecords.action_type === '3'
                ? `修改姓名为 ${currentEventData?.auditrecords.person_info?.name} 的群众信息`
                : ''
            }
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
          />
          <Divider />

          {showClass && (role === 1 || role === 2 || role === 3) ? (
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
  },
);
Detail.displayName = 'Detail';
export default Detail;
