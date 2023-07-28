import { Button, ColorPicker, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import CaseRating from '@/pages/IncidentManagement/components/caseRating';
import ProcessingModal from '@/pages/IncidentManagement/components/Model/ProcessingModal';
import type { eventData, user } from '@/pages/IncidentManagement/type';
import { timestampToTime } from '@/utils/commonFunctions/timestampToTime';

/* 处理中 */
function Processing(Props: { role: number; updata: Function; level: number }) {
  const [visible, setVisible] = useState(false);
  const { role, updata } = Props; // 这个用来判断是民警还是网格员
  const [id, setId] = useState<number>(-1);
  const [ModelData, SetModelData] = useState<eventData>();
  const [reloading, setReloading] = useState<boolean>(false);
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
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              SetModelData(record);
              setId(record.id);
              setVisible(true);
              console.log('查看详情', record.id);
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
      <ProcessingModal
        role={role}
        id={id}
        disable={true}
        visible={visible}
        reloading={reloading}
        setVisible={setVisible}
        setReloading={setReloading}
        level={2}
        data={ModelData}
        updata={updata}
      />
      <CaseRating columns={columns} level={Props.level} reloading={reloading} />
    </div>
  );
}
export default Processing;
