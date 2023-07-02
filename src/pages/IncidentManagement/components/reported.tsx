import { useMount } from 'ahooks';
import { Button, Popconfirm, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import CaseRating from '@/pages/IncidentManagement/components/caseRating';
import IncidentsAreReportedModal from '@/pages/IncidentManagement/components/Model/incidentsAreReportedModal';
import type { eventData, user } from '@/pages/IncidentManagement/type';
import { timestampToTime } from '@/utils/commonFunctions/timestampToTime';

/* 已上报表格信息 */
function Reported(Props: { role: number }) {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>(-1);
  const [disable, setdisable] = useState<boolean>(false);
  const { role } = Props; // 这个用来判断是民警还是网格员
  useMount(() => {});

  function ReturnAction(role: number, id: number) {
    switch (role) {
      case 1:
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => {
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
                setId(id);
                setdisable(true);
                setVisible(true);
              }}
            >
              查看详情
            </Button>
            <Popconfirm
              title="取消本次上报"
              description="确定需要本次上报吗？"
              onConfirm={() => {
                console.log('删除id', id);
              }}
              okText="取消"
              cancelText="确认"
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
      dataIndex: 'emergency',
      key: 'emergency',
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
      render: (_, record) => ReturnAction(role, record.id),
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
              setdisable(false);
              setVisible(true);
              console.log('事件上报');
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
      />
      <CaseRating columns={columns} level={1} />
    </div>
  );
}
export default Reported;
