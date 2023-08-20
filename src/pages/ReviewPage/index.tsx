import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import Watermark from 'antd/es/watermark';

import { getUserIdCard, getUserName } from '@/store/SaveToken';

import Complete from './Complete';
import Pending from './Pending';
const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: ' 待处理 ',
    children: <Pending />,
  },
  {
    key: '2',
    label: ' 已处理 ',
    children: <Complete />,
  },
];
// 添加水印
const nowusername = getUserName();
const nowuserid_card = getUserIdCard();
function ReviewPage() {
  return (
    <>
      <Watermark content={`${nowusername},${nowuserid_card}`} className="WaterMarkBox">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          style={{ paddingTop: '1vw', paddingLeft: '2vw', paddingRight: '2vw' }}
        />
      </Watermark>
    </>
  );
}
export default ReviewPage;
