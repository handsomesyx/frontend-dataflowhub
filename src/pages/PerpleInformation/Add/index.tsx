import { Form } from 'antd';
import { type ReactElement, useState } from 'react';

import AnchorHome from '@/utils/PopulationBasics';

import BasicInfo from './basicInfo';
import EconomicInfo from './economicInfo';
import HealthInfo from './HealthInfo';
import EducationInfo from './politicalInfo';
import PorpertyInfo from './propertyInfo';

type ItemConfigType = {
  id: number;
  name: string;
  href: string;
  elem: ReactElement;
};

function InformationAdd() {
  const [basicForm] = Form.useForm();
  const [healthForm] = Form.useForm();
  const [ecomomicForm] = Form.useForm();
  const [porForm] = Form.useForm();
  const [eduForm] = Form.useForm();
  const [disForm] = Form.useForm();
  const [imgSrc, setImgSrc] = useState<string>();
  // elem里面加每个页面的组件
  const itemConfig: ItemConfigType[] = [
    {
      id: 1,
      name: '基础信息',
      href: 'basicsInformation1',
      elem: (
        <BasicInfo
          form={basicForm}
          update={false}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
        />
      ),
    },
    // { id: 2, name: '专群结合', href: 'combination2', elem: <>1</> },
    // { id: 3, name: '民生', href: 'wellbeing3', elem: <>1</> },
    {
      id: 2,
      name: '民政卫健',
      href: 'administration4',
      elem: <HealthInfo form={healthForm} disform={disForm} />,
    },
    {
      id: 3,
      name: '政治教育',
      href: 'politicalEducation5',
      elem: <EducationInfo form={eduForm} />,
    },
    {
      id: 4,
      name: '生产经营情况',
      href: 'production5',
      elem: <EconomicInfo form={ecomomicForm} />,
    },
    {
      id: 5,
      name: '其他情况',
      href: 'otherInformation6',
      elem: (
        <PorpertyInfo
          porform={porForm}
          ecomomicform={ecomomicForm}
          imgSrc={imgSrc}
          healthform={healthForm}
          basicform={basicForm}
          eduform={eduForm}
          update={false}
          disform={disForm}
        />
      ),
    },
    // { id: 7, name: '包保人员信息', href: 'warrantor7', elem: <>1</> },
  ];

  return (
    <>
      <AnchorHome itemData={itemConfig}></AnchorHome>
    </>
  );
}

export default InformationAdd;
