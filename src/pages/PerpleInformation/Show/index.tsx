import type { ReactElement } from 'react';

import AnchorHome from '@/utils/PopulationBasics';

import BasicsInfomation from './BasicsInformation';
import type { CommonPeopleBasics } from './BasicsInformation/CommonInfo';
import type { familyDataType } from './BasicsInformation/Family';

type ItemConfigType = {
  id: number;
  name: string;
  href: string;
  elem: ReactElement;
};

// 信息展示页面
function InformationShow() {
  // 请求数据基础信息和家庭信息
  // const { peopleData } = useQuery();
  // 基础信息配置
  const peopleData: CommonPeopleBasics = { name: 'zhangsan' };
  // 家庭成员信息配置;
  const familyData: familyDataType[] = [
    {
      name: '王世恒',
      card: '123348329843984',
      relationship: '子女',
      phone: '1239319239',
      liveComeTime: '2020-12-10',
    },
    {
      name: '王世恒',
      card: '123348329843984',
      relationship: '子女',
      phone: '1239319239',
      liveComeTime: '2020-12-10',
    },
  ];

  // 页面展示内容配置
  const itemConfig: ItemConfigType[] = [
    {
      id: 1,
      name: '基础信息',
      href: 'basicsInformation1',
      elem: <BasicsInfomation peopleData={peopleData} familyData={familyData} />,
    },
    { id: 2, name: '专群结合', href: 'combination2', elem: <></> },
    { id: 3, name: '民生', href: 'wellbeing3', elem: <></> },
    { id: 4, name: '民政卫健', href: 'administration4', elem: <></> },
    { id: 5, name: '生产经营情况', href: 'production5', elem: <></> },
    { id: 6, name: '其他情况', href: 'otherInformation6', elem: <></> },
    { id: 7, name: '包保人员信息', href: 'warrantor7', elem: <></> },
  ];

  return (
    <>
      <AnchorHome itemData={itemConfig}></AnchorHome>
    </>
  );
}

export default InformationShow;
