import { useQuery } from '@apollo/client';
import { Spin } from 'antd';
import type { ReactElement } from 'react';

import { getPeopleData } from '@/apis';
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
import styles from './style.module.less';
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
  const id = window.localStorage.getItem('userIdNum');
  const { data, loading } = useQuery(getPeopleData, {
    variables: {
      isDelete: true,
      personal_id: Number(id),
    },
  });
  function formatLocalDate(aa: any) {
    if (aa) {
      let timestamp = parseInt(aa);
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } else return '--';
  }
  const dataAll = data?.getPeopleData?.peopleData;

  // console.log('allData', dataAll);

  // 基础信息配置
  const peopleData: CommonPeopleBasics = {
    img: dataAll?.head_url,
    name: dataAll?.name,
    card: dataAll?.id_card,
    nickName: dataAll?.nickname,
    spell: dataAll?.pinyin,
    phone: dataAll?.phone,
    formerName: dataAll?.former_name,
    level: dataAll?.person_classification,
    liveComeTime: formatLocalDate(dataAll?.date_of_residence),
    police: dataAll?.policeStation,
    community: dataAll?.community,
    gridding: dataAll?.grid,
    placeDomicile: dataAll?.residence,
    currentAddress: dataAll?.current_address,
    history: dataAll?.history,
    height: dataAll?.height,
    sex: dataAll?.gender,
  };

  // 家庭成员信息配置;
  const familyData: familyDataType[] = dataAll?.family?.map((item: any) => {
    return {
      name: item?.name,
      card: item?.id_card,
      relationship: item?.member_relation,
      phone: item?.phone,
      household_id: item?.household_id,
    };
  });
  const objJson = (obj: any) => {
    let output = '';
    for (let key in obj) {
      let value = obj[key];
      output = key + ': ' + value;
    }
    return output;
  };

  // 专群结合数据
  const CombinationData: CombinationType = {
    level: dataAll?.person_classification,
    reason: objJson(dataAll?.classification_reason),
    petition: dataAll?.petition,
  };

  // 民政卫健数据
  const HealthInfoData: HealthInfoType = {
    child_number: dataAll?.healthData?.child_number,
    special_group: dataAll?.healthData?.special_group,
    health_insurance: dataAll?.healthData?.health_insurance,
    pension_insurance: dataAll?.healthData?.pension_insurance,
    vaccination_status: dataAll?.healthData?.vaccination_status,
    proof_contraindication: dataAll?.healthData?.proof_contraindication,
    marriage_status: dataAll?.healthData?.marriage_status,
    other_conditions: dataAll?.healthData?.other_conditions,
    disability_id: dataAll?.disableData?.disability_id, // 残疾证编号
    disability_type: dataAll?.disableData?.disability_type, // 残疾类型
    disability_subsidy: dataAll?.disableData?.disability_subsidy, // 困难残疾补贴用0代表空
    severe_disability_subsidy: dataAll?.disableData?.severe_disability_subsidy, // 重度残疾补贴
    disability_level: dataAll?.disableData?.disability_level, // 残疾级别
    supervisor: dataAll?.healthData?.supervisor, // 监管
  };
  // 民生
  const WellbeingData: WellbeingType = {
    issue_level: dataAll?.reportInfoArr?.issue_level,
    classification_basis: dataAll?.reportInfoArr?.classification_basis,
    public_demand: dataAll?.reportInfoArr?.public_demand,
    public_opinion: dataAll?.reportInfoArr?.public_opinion,
  };
  const EducationData: EducationType = {
    work_unit: dataAll?.politicalData?.work_unit,
    position: dataAll?.politicalData?.work_unit,
    political_status: dataAll?.politicalData?.political_status,
    party_organization: dataAll?.politicalData?.party_organization,
    religion: dataAll?.politicalData?.religion,
    nationality: dataAll?.politicalData?.nationality,
    education: dataAll?.politicalData?.education,
    military_service: dataAll?.politicalData?.military_service,
    school: dataAll?.politicalData?.school,
  };

  // 数量用0代表没没有 显示的是— —
  const ProductionData: ProductionType[] = dataAll?.economicData?.map((item: any) => {
    return {
      planting_breeding: '', // 种植养殖情况
      plant_type: item?.plant_type, // 种植种类
      plant_quantity: item?.plant_quantity, // 种植数量
      plant_area: item?.plant_quantity, // 种植面积
      breeding_type: item?.breeding_type, // 养殖种类
      breeding_quantity: item?.breeding_quantity, // 养殖数量
      business_info: item?.business_info, // 营商情况(商户名称)
      business_location: item?.business_location, // 门面位置
      license_number: item?.plant_type, // 营业执照编号
      fire_equipment_type: item?.plant_type, // 门面消防设备类型
      fire_equipment_quantity: item?.plant_type, // 门面消防设备数量
      surveillance_status: item?.plant_type, // 门面电子监控状态
      surveillance_quantity: item?.plant_type, // 门面电子监控数量
    };
  });

  const OtherInfoData: OtherInfoType[] = dataAll?.propertyData?.map((item: any) => {
    return {
      house_info: '', // 房子信息 开关没有暂时没用上
      house_owner: item?.house_owner, // 房子产权人
      house_area: item?.house_area, // 建筑面积 平方米
      hobbies: item?.hobbies, // 兴趣爱好
      car_model: item?.car_model, // 车型号（可选）
      car_plate: item?.car_plate, // 车牌照（可选）
      car_owner: item?.car_owner, // 车辆所有人（可选）
      car_color: item?.car_color, // 车身颜色（可选）
      house_type: item?.house_type, // 房屋类型
      house_condition: item?.house_condition, // 危房等级
      smoking_status: item?.smoking_status, // 吸烟是否  必选
      volunteer_status: item?.volunteer_status, // 志愿者{ } json里边写字符数组，来记录志愿者
      social_worker: {}, // 社工{ }  json里边写字符数组，来记录社工
      driving_license_type: item?.driving_license_type, // 驾驶证类型（可选）
    };
  });

  const WarrantorData: WarrantorType = {
    grid_name: dataAll?.bBData?.grid_name,
    gridPersonId: dataAll?.bBData?.grid_user_name,
    girdPersonPhone: dataAll?.bBData?.grid_phone,
    policeName: dataAll?.bBData?.police_name,
    policePhone: dataAll?.bBData?.police_phone,
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
      {loading ? (
        <div className={styles.Box}>
          <Spin spinning={loading} size="large"></Spin>
        </div>
      ) : (
        ''
      )}

      {/* 调用封装的锚点页面 */}
      <AnchorHome itemData={itemConfig}></AnchorHome>
    </>
  );
}

export default InformationShow;
