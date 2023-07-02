/*
 * 事件系统中的表格 */
import { useQuery } from '@apollo/client';
import { useMount } from 'ahooks';
import type { TablePaginationConfig } from 'antd';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { eventManagementGetsAListOfEvents } from '@/apis';
import type { eventData } from '@/pages/IncidentManagement/type';

/* 这里传入一个Props, level: 表示等级： 1 已上报，2：处理中，3：待评价，4：已完结*/
/* 传入Props 作为column */
function CaseRating(Props: { columns: ColumnsType<eventData>; level: number }) {
  const { loading: loading } = useQuery(eventManagementGetsAListOfEvents, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setData(data.queryReportInfoList.data);
      console.log(data.queryReportInfoList.data, 'data');
    },
  });
  const [data, setData] = useState<eventData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  // 分页点击其他的时候触发，这里重新refetch就行应该
  function handleChangeTable(e: TablePaginationConfig) {
    console.log(e.current);
    setPage(e.current || 1);
  }
  useMount(() => {
    setTimeout(() => {
      setTotal(100);
      setData([]);
    }, 100);
  });

  return (
    <div>
      <Table
        rowKey={(record: eventData) => record.id}
        columns={Props.columns}
        dataSource={data}
        pagination={{
          total: total,
          pageSize: 10,
          current: page,
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
        loading={loading}
        onChange={handleChangeTable}
      />
    </div>
  );
}
export default CaseRating;
