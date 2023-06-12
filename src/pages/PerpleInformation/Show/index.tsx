import type { ReactElement } from 'react';

import AnchorHome from '@/utils/PopulationBasics';

import BasicsInfomation from './BasicsInformation';
import type { CommonPeopleBasics } from './BasicsInformation/CommonInfo';
import type { familyDataType } from './BasicsInformation/Family';
import type { CombinationType } from './Combination';
import Combination from './Combination';
import type { EducationType } from './Education';
import Education from './Education';
import type { HealthInfoType } from './HealthInfo';
import HealthInfo from './HealthInfo';
import type { OtherInfoType } from './OtherInfo';
import OtherInfo from './OtherInfo';
import type { ProductionType } from './Production';
import Production from './Production';
import type { WarrantorType } from './Warrantor/indedx';
import Warrantor from './Warrantor/indedx';
import type { WellbeingType } from './Wellbeing/indedx';
import Wellbeing from './Wellbeing/indedx';

type ItemConfigType = {
  id: number;
  name: string;
  href: string;
  elem: ReactElement;
};

// 信息展示页面  数据获取  页面整体配置
function InformationShow() {
  // 请求数据基础信息和家庭信息
  // const { peopleData } = useQuery();
  // 基础信息配置
  const peopleData: CommonPeopleBasics = { name: 'zhangsan' };

  // 家庭成员信息配置;
  const familyData: familyDataType[] = [
    {
      name: '',
      card: '',
      relationship: '',
      phone: '',
      liveComeTime: '',
    },
    {
      name: '',
      card: '',
      relationship: '',
      phone: '',
      liveComeTime: '',
    },
  ];

  // 专群结合数据
  const CombinationData: CombinationType = {
    level: '',
    reason: '',
    ispetition: false,
    petition: null,
  };

  // 民政卫健数据
  const HealthInfoData: HealthInfoType = {
    child_number: '',
    special_group: ' ',
    health_insurance: '',
    pension_insurance: '',
    vaccination_status: '',
    proof_contraindication: '',
    marriage_status: '',
    other_conditions: '',
    disability_id: '', // 残疾证编号
    disability_type: '', // 残疾类型
    disability_subsidy: 0, // 困难残疾补贴用0代表空
    severe_disability_subsidy: 0, // 重度残疾补贴
    disability_level: 0, // 残疾级别
    supervisor: '', // 监管
  };

  const WellbeingData: WellbeingType = {
    issue_level: '',
    classification_basis: '',
    public_demand: '',
    public_opinion: '',
  };
  const EducationData: EducationType = {
    work_unit: '',
    position: '',
    political_status: '',
    party_organization: '',
    religion: '',
    nationality: '',
    education: '',
    military_service: '',
    school: '',
  };

  // 数量用0代表没没有 显示的是— —
  const ProductionData: ProductionType = {
    planting_breeding: '', // 种植养殖情况
    plant_type: '', // 种植种类
    plant_quantity: 0, // 种植数量
    plant_area: 0, // 种植面积
    breeding_type: '', // 养殖种类
    breeding_quantity: 0, // 养殖数量
    business_info: '', // 营商情况(商户名称)
    business_location: '', // 门面位置
    license_number: '', // 营业执照编号
    fire_equipment_type: '', // 门面消防设备类型
    fire_equipment_quantity: 0, // 门面消防设备数量
    surveillance_status: '', // 门面电子监控状态
    surveillance_quantity: 0, // 门面电子监控数量
  };
  const OtherInfoData: OtherInfoType = {
    house_info: '', // 房子信息 开关没有暂时没用上
    house_owner: '', // 房子产权人
    house_area: '', // 建筑面积 平方米
    hobbies: '', // 兴趣爱好
    car_model: '', // 车型号（可选）
    car_plate: '', // 车牌照（可选）
    car_owner: '', // 车辆所有人（可选）
    car_color: '', // 车身颜色（可选）
    house_type: '', // 房屋类型
    house_condition: '', // 危房等级
    smoking_status: '', // 吸烟是否  必选
    volunteer_status: '', // 志愿者{ } json里边写字符数组，来记录志愿者
    social_worker: '', // 社工{ }  json里边写字符数组，来记录社工
    driving_license_type: '', // 驾驶证类型（可选）
  };
  const WarrantorData: WarrantorType = {
    gridPersonName: '',
    gridPersonId: '',
    girdPersonPhone: '',
    policeName: '',
    policePhone: '',
  };

  // 页面展示内容配置
  const itemConfig: ItemConfigType[] = [
    {
      id: 1,
      name: '基础信息',
      href: 'basicsInformation1',
      elem: <BasicsInfomation peopleData={peopleData} familyData={familyData} />,
    },
    {
      id: 2,
      name: '专群结合',
      href: 'combination2',
      elem: <Combination CombinationData={CombinationData} />,
    },
    {
      id: 3,
      name: '民生',
      href: 'wellbeing3',
      elem: <Wellbeing WellbeingData={WellbeingData} />,
    },
    {
      id: 4,
      name: '民政卫健',
      href: 'administration4',
      elem: <HealthInfo HealthInfoData={HealthInfoData} />,
    },
    {
      id: 5,
      name: '政治教育',
      href: 'politicalEducation5',
      elem: <Education EducationData={EducationData} />,
    },
    {
      id: 6,
      name: '生产经营情况',
      href: 'production6',
      elem: <Production ProductionData={ProductionData} />,
    },
    {
      id: 7,
      name: '其他情况',
      href: 'otherInformation7',
      elem: <OtherInfo OtherInfoData={OtherInfoData} />,
    },
    {
      id: 8,
      name: '包保人员信息',
      href: 'warrantor8',
      elem: <Warrantor WarrantorData={WarrantorData} />,
    },
  ];

  return (
    <>
      {/* 调用封装的锚点页面 */}
      <AnchorHome itemData={itemConfig}></AnchorHome>
    </>
  );
}

export default InformationShow;
