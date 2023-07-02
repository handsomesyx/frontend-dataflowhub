import { Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import CaseRating from '@/pages/IncidentManagement/components/caseRating';
import TobeEvaluatedViewModal from '@/pages/IncidentManagement/components/Model/tobeEvaluatedViewModal';
import type { eventData } from '@/pages/IncidentManagement/type';

function ToBeEvaluated(Props: { role: number }) {
  const [visible, setVisible] = useState(false);
  const { role } = Props; // 这个用来判断是民警还是网格员
  const [id, setId] = useState<number>(-1);
  const columns: ColumnsType<eventData> = [
    {
      title: '事件信息',
      dataIndex: 'eventInformation',
      key: 'eventInformation',
    },
    {
      title: '网格员',
      dataIndex: 'gridMan',
      key: 'gridMan',
    },
    {
      title: '紧急状态',
      dataIndex: 'emergency',
      key: 'emergency',
    },
    {
      title: '上报地点',
      dataIndex: 'placeOfEscalation',
      key: 'placeOfEscalation',
    },
    {
      title: '上报时间',
      dataIndex: 'reportingTime',
      key: 'reportingTime',
    },
    {
      title: '处理时间',
      dataIndex: 'processingTime',
      key: 'processingTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
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
      <CaseRating columns={columns} level={3} />
      <TobeEvaluatedViewModal
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
