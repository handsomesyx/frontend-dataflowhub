import { useMount } from 'ahooks';
import { Button, ColorPicker, message, Popconfirm, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import CaseRating from '@/pages/IncidentManagement/components/caseRating';
import type { eventData, user } from '@/pages/IncidentManagement/type';
import { timestampToTime } from '@/utils/commonFunctions/timestampToTime';

// @ts-ignore
import IncidentsAreReportedModal from '../components/Model/incidentsAreReportedModal';

/* 已上报表格信息 */
function Reported(Props: { role: number; updata: Function }) {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>(-1);
  const [disable, setdisable] = useState<boolean>(false);
  const [ModelData, setModelData] = useState<eventData>();
  const [reloading, setReloading] = useState<boolean>(false);
  const { role, updata } = Props; // 这个用来判断是民警还是网格员
  useMount(() => {});
  // const [modifyReportInfo] = useMutation(modifyTheEventInformation, {
  //   onCompleted: (data) => {
  //     console.log(data);
  //     setReloading(!reloading); // 重新加载数据
  //     message.success('删除成功');
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     message.error('删除失败');
  //   }
  // });

  function ReturnAction(role: number, id: number, record: eventData) {
    switch (role) {
      case 1:
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => {
                setModelData(record);
                setId(id);
                setdisable(true);
                setVisible(true);
              }}
            >
              查看详情
            </Button>
          </Space>
        );
      default:
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => {
                setModelData(record);
                setId(id);
                setdisable(true);
                setVisible(true);
              }}
            >
              查看详情
            </Button>
            <Popconfirm
              title="取消本次上报"
              description="确定取消本次上报吗？"
              onConfirm={() => {
                // modifyReportInfo({
                //   variables: {
                //     ModifyReportInput:{
                //       id: id,
                //       is_delete: true
                //     }
                //   }
                // });
                updata({
                  variables: {
                    ModifyReportInput: {
                      id: id,
                      is_delete: true,
                    },
                  },
                })
                  .then(() => {
                    setReloading(!reloading); // 重新加载数据
                    message.success('删除成功');
                  })
                  .catch((error: any) => {
                    console.log(error);
                    message.error('删除失败');
                  });
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" danger>
                确认删除
              </Button>
            </Popconfirm>
          </Space>
        );
    }
  }

  const columns: ColumnsType<eventData> = [
    {
      title: '事件信息',
      dataIndex: 'classification_basis',
      key: 'classification_basis',
    },
    {
      title: '网格员',
      dataIndex: 'report_user',
      key: 'report_user',
      render: (user: user) => <span>{user.real_name}</span>,
    },
    {
      title: '紧急状态',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: number) => {
        let color = '';
        switch (priority) {
          case 1:
            color = 'red';
            break;
          case 2:
            color = 'yellow';
            break;
          case 3:
            color = 'blue';
            break;
        }
        return <ColorPicker defaultValue={color} disabled={true} />;
      },
    },
    {
      title: '上报地点',
      dataIndex: 'report_address',
      key: 'report_address',
    },
    {
      title: '上报时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (time: number) => <span>{timestampToTime(time)}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => ReturnAction(role, record.id, record),
    },
  ];
  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          height: '0px',
          float: 'right',
          position: 'relative',
          bottom: '60px',
          marginRight: '10px',
        }}
      >
        {role === 1 ? (
          <></>
        ) : (
          <Button
            type={'primary'}
            onClick={() => {
              setModelData(undefined);
              setdisable(false);
              setVisible(true);
            }}
          >
            事件上报
          </Button>
        )}
      </div>
      <IncidentsAreReportedModal
        role={role}
        id={id}
        disable={disable}
        visible={visible}
        setVisible={setVisible}
        level={1}
        data={ModelData}
        reloading={reloading}
        setReloading={setReloading}
        updata={updata}
      />
      <CaseRating columns={columns} level={1} reloading={reloading} />
    </div>
  );
}
export default Reported;
