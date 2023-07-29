import { Button, ColorPicker, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import CaseRating from '@/pages/IncidentManagement/components/caseRating';
import TobeEvaluatedViewModal from '@/pages/IncidentManagement/components/Model/tobeEvaluatedViewModal';
import type { eventData, user } from '@/pages/IncidentManagement/type';
import { timestampToTime } from '@/utils/commonFunctions/timestampToTime';

function ToBeEvaluated(Props: { role: number; updata: Function; level: number }) {
  const [visible, setVisible] = useState(false);
  const { role, updata } = Props; // 这个用来判断是民警还是网格员
  const [id, setId] = useState<number>(-1);
  const [ModelData, setModelData] = useState<eventData>({} as eventData);
  const [reloading, setReloading] = useState(false);
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
      title: '处理时间',
      dataIndex: 'report_time',
      key: 'report_time',
      render: (time: number) => <span>{timestampToTime(time)}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setModelData(record);
              setId(record.id);
              setVisible(true);
            }}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <CaseRating columns={columns} level={Props.level} reloading={reloading} />
      <TobeEvaluatedViewModal
        reloading={reloading}
        setReloading={setReloading}
        data={ModelData}
        updata={updata}
        role={role}
        level={3}
        visible={visible}
        id={id}
        disable={true}
        setVisible={setVisible}
      />
    </div>
  );
}
export default ToBeEvaluated;
