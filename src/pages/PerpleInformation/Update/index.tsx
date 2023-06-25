import { useQuery } from '@apollo/client';
import { Form } from 'antd';
import { type ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPeopleData } from '@/apis';
import AnchorHome from '@/utils/PopulationBasics';

import BasicInfo from '../Add/basicInfo';
import EconomicInfo from '../Add/economicInfo';
import HealthInfo from '../Add/HealthInfo';
import EducationInfo from '../Add/politicalInfo';
import PorpertyInfo from '../Add/propertyInfo';
import type {
    getbasicInfo, getdisabilityInfo,
    getHealthInfo, WarrantorType
} from '../Add/types';
import type { CombinationType } from '../Show/Combination';
import Combination from '../Show/Combination';
import type { EducationType } from '../Show/Education';
import type { OtherInfoType } from '../Show/OtherInfo';
import type { ProductionType } from '../Show/Production';
import type { WellbeingType } from '../Show/Wellbeing/indedx';
import Wellbeing from '../Show/Wellbeing/indedx';
import Warrantor from './warrantor';

type ItemConfigType = {
    id: number;
    name: string;
    href: string;
    elem: ReactElement;
};

function InformationUpdate() {
    const params = useParams();
    console.log(params);


    const [basicForm] = Form.useForm();
    const [healthForm] = Form.useForm();
    const [ecomomicForm] = Form.useForm();
    const [porForm] = Form.useForm();
    const [eduForm] = Form.useForm();
    const [disform] = Form.useForm();
    const [imgSrc, setImgSrc] = useState<string>();

    const { data } = useQuery(getPeopleData, {
        nextFetchPolicy: 'network-only',
        fetchPolicy: 'network-only',
        // notifyOnNetworkStatusChange: true,
        variables: {
            personal_id: parseInt(params?.id ?? ''),
        }
    });

    // function formatLocalDate(aa: any) {
    //     if (aa) {
    //         let timestamp = parseInt(aa);
    //         const date = new Date(timestamp);
    //         const year = date.getFullYear();
    //         const month = String(date.getMonth() + 1).padStart(2, '0');
    //         const day = String(date.getDate()).padStart(2, '0');

    //         return `${year}-${month}-${day}`;
    //     } else return '--';
    // }

    const objJson = (obj: any) => {
        let output = '';
        for (let key in obj) {
            let value = obj[key];
            output = key + ': ' + value;
        }
        return output;
    };
    const dataAll = data?.getPeopleData?.peopleData;
    console.log(dataAll);

    // 基础信息配置
    // eslint-disable-next-line no-redeclare
    const peopleData: getbasicInfo = {
        id: dataAll?.id,
        head_url: dataAll?.head_url,
        name: dataAll?.name,
        id_card: dataAll?.id_card,
        residence: dataAll?.residence,
        pinyin: dataAll?.pinyin,
        phone: dataAll?.phone,
        current_address: dataAll?.current_address,
        former_name: dataAll?.former_name,
        nickname: dataAll?.nickname,
        date_of_residence: dataAll?.date_of_residence,
        age: dataAll?.age,
        height: dataAll?.height,
        gender: dataAll?.gender,

    };

    // 专群结合数据
    const CombinationData: CombinationType = {
        level: dataAll?.person_classification,
        reason: objJson(dataAll?.classification_reason),
        petition: dataAll?.petition,
    };

    // 民生
    const WellbeingData: WellbeingType = {
        issue_level: dataAll?.reportInfoArr?.issue_level,
        classification_basis: dataAll?.reportInfoArr?.classification_basis,
        public_demand: dataAll?.reportInfoArr?.public_demand,
        public_opinion: dataAll?.reportInfoArr?.public_opinion,
    };

    // 民政卫健数据
    const HealthInfoData: getHealthInfo = {
        marriage_status: dataAll?.healthData?.marriage_status,
        child_number: dataAll?.healthData?.child_number,
        health_insurance: dataAll?.healthData?.health_insurance,
        pension_insurance: dataAll?.healthData?.pension_insurance,
        vaccination_status: dataAll?.healthData?.vaccination_status,
        proof_contraindication: dataAll?.healthData?.proof_contraindication,
        other_conditions: dataAll?.healthData?.other_conditions,
        special_group: dataAll?.healthData?.special_group,
        supervisor_name: dataAll?.healthData?.supervisor,
        disability_id: dataAll?.disableData?.disability_id, // 残疾证编号
        disability_type: dataAll?.disableData?.disability_type, // 残疾类型
        disability_subsidy: dataAll?.disableData?.disability_subsidy, // 困难残疾补贴用0代表空
        disability_level: dataAll?.disableData?.disability_level, // 残疾级别
        severe_disability_subsidy: dataAll?.disableData?.severe_disability_subsidy, // 重度残疾补贴
    };
    const disData: getdisabilityInfo = {
        disability_id: dataAll?.disableData?.disability_id, // 残疾证编号
        disability_type: dataAll?.disableData?.disability_type, // 残疾类型
        disability_subsidy: dataAll?.disableData?.disability_subsidy, // 困难残疾补贴用0代表空
        disability_level: dataAll?.disableData?.disability_level, // 残疾级别
        severe_disability_subsidy: dataAll?.disableData?.severe_disability_subsidy, // 重度残疾补贴

    };
    const EducationData: EducationType = {
        work_unit: dataAll?.politicalData?.work_unit,
        position: dataAll?.politicalData?.work_unit,

        religion: dataAll?.politicalData?.religion,
        political_status: dataAll?.politicalData?.political_status,
        party_organization: dataAll?.politicalData?.party_organization,
        nationality: dataAll?.politicalData?.nationality,
        education: dataAll?.politicalData?.education,
        military_service: dataAll?.politicalData?.military_service,
        school: dataAll?.politicalData?.school,
    };

    const ProductionData: ProductionType =
    {
        planting_breeding: '', // 种植养殖情况
        plant_type: dataAll?.economicData[0]?.plant_type, // 种植种类
        plant_quantity: dataAll?.economicData[0]?.plant_quantity, // 种植数量
        plant_area: dataAll?.economicData[0]?.plant_quantity, // 种植面积
        breeding_type: dataAll?.economicData[0]?.breeding_type, // 养殖种类
        breeding_quantity: dataAll?.economicData[0]?.breeding_quantity, // 养殖数量
        business_info: dataAll?.economicData[0]?.business_info, // 营商情况(商户名称)
        business_location: dataAll?.economicData[0]?.business_location, // 门面位置
        license_number: dataAll?.economicData[0]?.plant_type, // 营业执照编号
        fire_equipment_type: dataAll?.economicData[0]?.plant_type, // 门面消防设备类型
        fire_equipment_quantity: dataAll?.economicData[0]?.plant_type, // 门面消防设备数量
        surveillance_status: dataAll?.economicData[0]?.plant_type, // 门面电子监控状态
        surveillance_quantity: dataAll?.economicData[0]?.plant_type, // 门面电子监控数量
    };

    const OtherInfoData: OtherInfoType = {
        house_info: dataAll?.propertyData[0]?.house_info, // 房子信息 开关没有暂时没用上
        house_owner: dataAll?.propertyData[0]?.house_owner, // 房子产权人
        house_area: dataAll?.propertyData[0]?.house_area, // 建筑面积 平方米
        house_type: dataAll?.propertyData[0]?.house_type, // 房屋类型
        house_condition: dataAll?.propertyData[0]?.house_condition, // 危房等级
        smoking_status: dataAll?.propertyData[0]?.smoking_status, // 吸烟是否  必选
        hobbies: dataAll?.propertyData[0]?.hobbies, // 兴趣爱好
        car_model: dataAll?.propertyData[0]?.car_model, // 车型号（可选）
        car_owner: dataAll?.propertyData[0]?.car_owner, // 车辆所有人（可选）
        car_plate: dataAll?.propertyData[0]?.car_plate, // 车牌照（可选）
        car_color: dataAll?.propertyData[0]?.car_color, // 车身颜色（可选）
        volunteer_status: JSON.stringify(dataAll?.propertyData[0]?.volunteer_status)
            ?? '{}', // 志愿者{ } json里边写字符数组，来记录志愿者
        social_worker: '{}', // 社工{ }  json里边写字符数组，来记录社工
        driving_license_type: dataAll?.propertyData[0]?.driving_license_type, // 驾驶证类型（可选）
    };

    const WarrantorData: WarrantorType = {
        community: dataAll?.community,
        gridding: dataAll?.bBData?.grid_name,
        gridPersonName: dataAll?.bBData?.grid_user_name,
        gridPersonId: dataAll?.grid_user_id,
        girdPersonPhone: dataAll?.bBData?.grid_phone,
        police: dataAll?.policeStation,
        policeName: dataAll?.bBData?.police_name,
        policePhone: dataAll?.bBData?.police_phone,
    };

    // elem里面加每个页面的组件 
    //  不需要更改的使用Show中的 
    const itemConfig: ItemConfigType[] = [
        {
            id: 1, name: '基础信息', href: 'basicsInformation1',
            elem: <BasicInfo form={basicForm}
                basicUpdateData={peopleData} update={true}
                imgSrc={imgSrc} setImgSrc={setImgSrc}
            />
        },
        {
            id: 2,
            name: '专群结合',
            href: 'combination2',
            elem: <Combination CombinationData={CombinationData} />
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
            elem: <HealthInfo form={healthForm} disform={disform}
                healthData={HealthInfoData} disData={disData} />
        },
        {
            id: 5,
            name: '政治教育',
            href: 'politicalEducation5',
            elem: <EducationInfo form={eduForm} politicalData={EducationData} />,
        },
        {
            id: 6,
            name: '生产经营情况',
            href: 'production5',
            elem: <EconomicInfo form={ecomomicForm} ecoData={ProductionData} />
        },
        {
            id: 7,
            name: '其他情况',
            href: 'otherInformation6',
            elem: <PorpertyInfo porform={porForm} ecomomicform={ecomomicForm}
                healthform={healthForm} basicform={basicForm} disform={disform}
                eduform={eduForm} porData={OtherInfoData} update={true} />
        },
        {
            id: 8, name: '包保人员信息', href: 'warrantor7',
            elem: <Warrantor
                basicData={peopleData}
                HealthInfoData={HealthInfoData}
                EducationData={EducationData}
                ProductionData={ProductionData}
                porform={porForm} ecomomicform={ecomomicForm}
                healthform={healthForm} basicform={basicForm}
                eduform={eduForm} disform={disform}
                warData={WarrantorData} OtherInfoData={OtherInfoData} disUpdateData={disData} />
        },
    ];

    return (
        <>
            <AnchorHome itemData={itemConfig}></AnchorHome>
        </>
    );
}

export default InformationUpdate;
