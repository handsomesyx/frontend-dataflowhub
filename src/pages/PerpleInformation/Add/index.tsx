import type { ReactElement } from 'react';

import AnchorHome from '@/utils/PopulationBasics';

type ItemConfigType = {
  id: number;
  name: string;
  href: string;
  elem: ReactElement;
};

function InformationAdd() {
  // elem里面加每个页面的组件
  const itemConfig: ItemConfigType[] = [
    { id: 1, name: '基础信息', href: 'basicsInformation1', elem: <>1</> },
    { id: 2, name: '专群结合', href: 'combination2', elem: <>1</> },
    { id: 3, name: '民生', href: 'wellbeing3', elem: <>1</> },
    { id: 4, name: '民政卫健', href: 'administration4', elem: <>1</> },
    { id: 5, name: '生产经营情况', href: 'production5', elem: <>1</> },
    { id: 6, name: '其他情况', href: 'otherInformation6', elem: <>1</> },
    { id: 7, name: '包保人员信息', href: 'warrantor7', elem: <>1</> },
  ];

  return (
    <>
      <AnchorHome itemData={itemConfig}></AnchorHome>
    </>
  );
}

export default InformationAdd;
