import { useMutation } from '@apollo/client';
import type { TabsProps } from 'antd';
import { Layout, Tabs } from 'antd';
import Watermark from 'antd/es/watermark';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


import { modifyTheEventInformation } from '@/apis';
import Finished from '@/pages/IncidentManagement/components/finished';
import Processing from '@/pages/IncidentManagement/components/processing';
import Reported from '@/pages/IncidentManagement/components/reported';
import ToBeEvaluated from '@/pages/IncidentManagement/components/toBeEvaluated';
import { getUserIdCard, getUserName, getUserType } from '@/store/SaveToken';
function IncidentManagement() {
  const role = getUserType() === 'gridMember' ? 2 : 1; // 1表示民警，2表示网格员
  const params = useParams();
  console.log(role, 'getUserType(');
  const [modifyReportInfo] = useMutation(modifyTheEventInformation); // 除了添加以为，包括删除在内的函数均为此函数触发
  const [level, setLevel] = useState(1);
  const onChange = (key: string) => {
    console.log(key);
    setLevel(Number(key));
  };
  useEffect(() => {
    if (params.state === 'solved') {
      setLevel(4);
    }
  }, [params.state]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '已上报',
      children: <Reported role={role} updata={modifyReportInfo} level={level} />,
    },
    {
      key: '2',
      label: '处理中',
      children: <Processing role={role} updata={modifyReportInfo} level={level} />,
    },
    {
      key: '3',
      label: '待评价',
      children: <ToBeEvaluated role={role} updata={modifyReportInfo} level={level} />,
    },
    {
      key: '4',
      label: '已完结',
      children: <Finished role={role} level={level} />,
    },
  ];
  // 添加水印
  const nowusername = getUserName();
  const nowuserid_card = getUserIdCard();
  return (
    <Layout className="CpLayout" style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Watermark
          content={'漠河市基层社会治理智管平台'}
          // rotate={-20}
          // gap={[50, 120]}
          // className="WaterMarkBox"
        >
          <Tabs
            defaultActiveKey={'1'}
            items={items}
            onChange={onChange}
            activeKey={level?.toString()}
          />
        </Watermark>
      </div>

    </Layout>
  );
}
export default IncidentManagement;
