import type { TabsProps } from 'antd';
import { Tabs } from 'antd';

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

function ReviewPage() {
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        style={{ paddingTop: '1vw', paddingLeft: '2vw', paddingRight: '2vw' }}
      />
    </>
  );
}
export default ReviewPage;
