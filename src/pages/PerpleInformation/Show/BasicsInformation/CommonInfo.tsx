import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, message, Modal, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ExcelJs from 'exceljs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DeletePeopleInfo, getChangeRecordByPersonalId } from '@/apis';
import { saveWorkbook } from '@/utils/ExportExcel';

import type { CombinationType } from '../Combination';
import type { EducationType } from '../Education';
import type { HealthInfoType } from '../HealthInfo';
import type { OtherInfoType } from '../OtherInfo';
import type { ProductionType } from '../Production';
import type { WarrantorType } from '../Warrantor/indedx';
import type { WellbeingType } from '../Wellbeing/indedx';
import type { familyDataType } from './Family';
import styles from './style.module.less';

/* 使用组件需要传入数据类型 */
interface Props {
  peopleData: CommonPeopleBasics;
  familyData: familyDataType[];
  CombinationData: CombinationType;
  HealthInfoData: HealthInfoType;
  WellbeingData: WellbeingType;
  EducationData: EducationType;
  ProductionData: ProductionType[];
  OtherInfoData: OtherInfoType;
  WarrantorData: WarrantorType;
}
const { Option } = Select;

interface ChangeWhat {
  id: any;
  change_item: string;
  content_before: string;
  content_after: string;
}

/**
 * @description 基础信息接口
 */

export type CommonPeopleBasics = {
  age?: string;
  img?: string;
  name?: string;
  card?: string;
  spell?: string;
  phone?: string;
  formerName?: string;
  nickName?: string;
  level?: string;
  liveComeTime?: string;
  police?: string;
  community?: string;
  gridding?: string;
  placeDomicile?: string;
  currentAddress?: string;
  history?: [{}];
  height?: string;
  sex?: boolean;
};

export type CommonPeopleExport = {
  age?: string;
  img?: string;
  name?: string;
  card?: string;
  spell?: string;
  phone?: string;
  formerName?: string;
  nickName?: string;
  level?: string;
  liveComeTime?: string;
  police?: string;
  community?: string;
  gridding?: string;
  placeDomicile?: string;
  currentAddress?: string;
  history?: [{}];
  height?: string;
  sex?: string | boolean;
};

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

// 组件使用的时候需要写一个边框外层border: 1px solid #d9d9d9;  width： 100% 不用写高度
const Common: React.FC<Props> = ({
  peopleData,
  familyData,
  CombinationData,
  HealthInfoData,
  WellbeingData,
  EducationData,
  ProductionData,
  OtherInfoData,
  WarrantorData,
}) => {
  const id = window.localStorage.getItem('userIdNum');
  const [form] = Form.useForm();
  const [deleteVisible, setDeleteVisible] = useState<boolean>();
  const [recordVisible, setRecordVisible] = useState<boolean>();
  // const [changesShow, setChangesShow] = useState<dataChange[]>([]);
  const [changedata, setChangedata] = useState<ChangeWhat[]>([]);
  const changecolumns: ColumnsType<ChangeWhat> = [
    {
      title: '变更属性',
      dataIndex: 'value',
      key: 'value',
      width: '15%',
    },
    {
      title: '变更前',
      dataIndex: 'before',
      key: 'before',
    },
    {
      title: '变更后',
      dataIndex: 'after',
      key: 'after',
    },
  ];
  const navigate = useNavigate();

  const [deletePeopleInfo] = useMutation(DeletePeopleInfo);
  const deletePeople = () => {
    deletePeopleInfo({
      variables: {
        id: Number(id),
        priority: parseInt(form.getFieldsValue().priority),
      },
    })
      .then(() => {
        message.success('已为您创建审核记录');
        setDeleteVisible(false);
        navigate('/population-manager/person-search');
      })
      .catch(() => {
        message.error('创建审核记录失败');
      });
  };

  useQuery(getChangeRecordByPersonalId, {
    // client,
    variables: { personalId: Number(id) },
    onCompleted: (data) => {
      // console.log(data.getChangeRecord); // 控制台结果
      const changewhat = data.getChangeRecordByPersonalId.map((item: ChangeWhat) => ({
        after: item?.content_after,
        before: item?.content_before,
        value: item?.change_item,
        key: item?.id,
      }));

      // console.log(changewhat);
      setChangedata(changewhat);
    },
  });

  function insertfamily(index: number, obj: (string | number)[], ws: ExcelJs.Worksheet) {
    // ws.insertRow(index, ['']);
    const insertRow = ws.insertRow(index, obj);
    insertRow.eachCell((cell) => {
      cell.style = {
        font: {
          size: 10,
        },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: {
          type: 'pattern',
          pattern: 'solid',
        },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
      };
    });
  }

  const exportExcel = () => {
    let int = setInterval(() => {
      message.loading('正在导出');
    });
    // let exportData: any = [];
    // getExcelPeopleData({
    //   variables: {
    //     content: { ...filterData },
    //     pagingOption: {
    //       skip: 0,
    //       take: total,
    //     },
    //     isDelete: false,
    //   },
    // })
    // .then(({ data: exceldata }) => {
    // const datas = exceldata?.getPeopleDataFilter?.data;
    // console.log(datas);

    // for (let i = 0; i < datas?.length; ++i) {
    //   exportData.push({
    //     name: datas?.name,
    //     id_card: datas?.id_card,
    //     residence: datas?.residence,
    //     pinyin: datas?.pinyin,
    //     phone: datas?.phone,
    //     current_address: datas?.current_address,
    //     former_name: datas?.former_name,
    //     nickname: datas?.nickname,
    //     date_of_residence: formatLocalDate(datas?.date_of_residence),
    //     age: datas?.age,
    //     height: datas?.height,
    //     gender: datas?.gender,
    //     // 专群结合
    //     level: datas?.person_classification,
    //     reason: datas?.classification_reason,
    //     petition: datas?.petition,
    //     // 民生
    //     issue_level: datas?.reportInfoArr?.issue_level,
    //     classification_basis: datas?.reportInfoArr?.classification_basis,
    //     public_demand: datas?.reportInfoArr?.public_demand,
    //     public_opinion: datas?.reportInfoArr?.public_opinion,
    //     // 民政卫健
    //     marriage_status: datas?.healthData?.marriage_status,
    //     child_number: datas?.healthData?.child_number,
    //     health_insurance: datas?.healthData?.health_insurance,
    //     pension_insurance: datas?.healthData?.pension_insurance,
    //     vaccination_status: datas?.healthData?.vaccination_status,
    //     proof_contraindication: datas?.healthData?.proof_contraindication,
    //     other_conditions: datas?.healthData?.other_conditions,
    //     special_group: datas?.healthData?.special_group,
    //     supervisor: datas?.healthData?.supervisor,
    //     disability_id: datas?.disableData?.disability_id, // 残疾证编号
    //     disability_type: datas?.disableData?.disability_type, // 残疾类型
    //     disability_subsidy: datas?.disableData?.disability_subsidy, // 困难残疾补贴用0代表空
    //     disability_level: datas?.disableData?.disability_level, // 残疾级别
    //     severe_disability_subsidy: datas?.disableData?.severe_disability_subsidy, // 重度残疾补贴
    //     // 政治教育
    //     work_unit: datas?.politicalData?.work_unit,
    //     position: datas?.politicalData?.position,
    //     religion: datas?.politicalData?.religion,
    //     political_status: datas?.politicalData?.political_status,
    //     party_organization: datas?.politicalData?.party_organization,
    //     nationality: datas?.politicalData?.nationality,
    //     education: datas?.politicalData?.education,
    //     military_service: datas?.politicalData?.military_service,
    //     school: datas?.politicalData?.school,
    //     // 种植养殖营商
    //     plant_type: datas?.economicData[0]?.plant_type, // 种植种类
    //     plant_quantity: datas?.economicData[0]?.plant_quantity, // 种植数量
    //     plant_area: datas?.economicData[0]?.plant_area, // 种植面积
    //     breeding_type: datas?.economicData[0]?.breeding_type, // 养殖种类
    //     breeding_quantity: datas?.economicData[0]?.breeding_quantity, // 养殖数量
    //     business_info: datas?.economicData[0]?.business_info, // 营商情况(商户名称)
    //     business_location: datas?.economicData[0]?.business_location, // 门面位置
    //     license_number: datas?.economicData[0]?.license_number, // 营业执照编号
    //     fire_equipment_type: datas?.economicData[0]?.fire_equipment_type, // 门面消防设备类型
    //     fire_equipment_quantity: datas?.economicData[0]?.fire_equipment_quantity, // 门面消防设备数量
    //     surveillance_status: datas?.economicData[0]?.surveillance_status, // 门面电子监控状态
    //     surveillance_quantity: datas?.economicData[0]?.surveillance_quantity, // 门面电子监控数量
    //     // 其他
    //     house_info: datas?.propertyData[0]?.house_info, // 房子信息 开关没有暂时没用上
    //     house_owner: datas?.propertyData[0]?.house_owner, // 房子产权人
    //     house_area: datas?.propertyData[0]?.house_area, // 建筑面积 平方米
    //     house_type: datas?.propertyData[0]?.house_type, // 房屋类型
    //     house_condition: datas?.propertyData[0]?.house_condition, // 危房等级
    //     smoking_status: datas?.propertyData[0]?.smoking_status, // 吸烟是否  必选
    //     hobbies: datas?.propertyData[0]?.hobbies, // 兴趣爱好
    //     car_model: datas?.propertyData[0]?.car_model, // 车型号（可选）
    //     car_owner: datas?.propertyData[0]?.car_owner, // 车辆所有人（可选）
    //     car_plate: datas?.propertyData[0]?.car_plate, // 车牌照（可选）
    //     car_color: datas?.propertyData[0]?.car_color, // 车身颜色（可选）
    //     volunteer_status:
    //       JSON.stringify(datas?.propertyData[0]?.volunteer_status) ?? '', // 志愿者{ } json里边写字符数组，来记录志愿者
    //     social_worker: JSON.stringify(datas?.propertyData[0]?.social_worker) ?? '', // 社工{ }  json里边写字符数组，来记录社工
    //     driving_license_type: datas?.propertyData[0]?.driving_license_type, // 驾驶证类型（可选）
    //     // 报保人员信息
    //     community: datas?.community,
    //     gridding: datas?.bBData?.grid_name,
    //     gridPersonName: datas?.bBData?.grid_user_name,
    //     gridPersonId: datas?.grid_user_id,
    //     girdPersonPhone: datas?.bBData?.grid_phone,
    //     police: datas?.policeStation,
    //     policeName: datas?.bBData?.police_name,
    //     policePhone: datas?.bBData?.police_phone,
    //   });
    // };
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('sheet1');
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 17;
    const columnData = [
      // { header: '序号', key: 'id', width: 12 },
      { header: '本人姓名', key: 'name', width: 12 },
      { header: '身份证号', key: 'card', width: 12 },
      { header: '绰号', key: 'nickName', width: 12 },
      { header: '姓名拼音', key: 'spell', width: 12 },
      { header: '联系方式', key: 'phone', width: 12 },
      { header: '曾用名', key: 'formerName', width: 12 },
      { header: '户籍所在地', key: 'residence', width: 12 },
      { header: '性别', key: 'sex', width: 12 },
      { header: '身高', key: 'height', width: 12 },
      { header: '年龄', key: 'age', width: 12 },
      { header: '现住址', key: 'currentAddress', width: 12 },
      { header: '何时来本地居住', key: 'liveComeTime', width: 12 },
      { header: '人员分级类别', key: 'level', width: 12 },
      { header: '分类依据', key: 'reason', width: 12 },
      { header: '上访诉求', key: 'petition', width: 12 },
      { header: '事情分级类别', key: 'issue_level', width: 12 },
      { header: '分类依据', key: 'classification_basis', width: 12 },
      { header: '群众需求', key: 'public_demand', width: 12 },
      { header: '群众意见建议', key: 'public_opinion', width: 12 },
      { header: '生育儿女数量', key: 'child_number', width: 12 },
      { header: '婚姻状态', key: 'marriage_status', width: 12 },
      { header: '医疗保险情况', key: 'health_insurance', width: 12 },
      { header: '养老保险情况', key: 'pension_insurance', width: 12 },
      { header: '疫苗接种情况', key: 'vaccination_status', width: 12 },
      { header: '禁忌证明', key: 'proof_contraindication', width: 12 },
      { header: '民政卫健其他情况', key: 'other_conditions', width: 12 },
      { header: '特殊群体', key: 'special_group', width: 12 },
      { header: '监护人姓名', key: 'supervisor', width: 12 },
      { header: '残疾证编号', key: 'disability_id', width: 12 },
      { header: '残疾类型', key: 'disability_type', width: 12 },
      { header: '困难残疾人生活补贴', key: 'disability_subsidy', width: 12 }, // ss
      { header: '重度残疾人护理补贴', key: 'severe_disability_subsidy', width: 12 },
      { header: '残疾等级', key: 'disability_level', width: 12 },
      { header: '工作单位', key: 'work_unit', width: 12 },
      { header: '职务', key: 'position', width: 12 },
      { header: '政治面貌', key: 'political_status', width: 12 },
      { header: '宗教信仰', key: 'religion', width: 12 },
      { header: '所属党组织', key: 'party_organization', width: 12 },
      { header: '民族', key: 'nationality', width: 12 },
      { header: '文化程度', key: 'education', width: 12 },
      { header: '入伍情况', key: 'military_service', width: 12 },
      { header: '毕业院校', key: 'school', width: 12 },
      { header: '种植种类', key: 'plant_type', width: 12 },
      { header: '种植数量', key: 'plant_quantity', width: 12 },
      { header: '种植面积', key: 'planting_area', width: 12 },
      { header: '养殖种类', key: 'breeding_type', width: 12 },
      { header: '养殖数量', key: 'breeding_quantity', width: 12 },
      { header: '商户名称', key: 'business_info', width: 12 },
      { header: '门面位置', key: 'business_location', width: 12 },
      { header: '营业执照编号', key: 'license_number', width: 12 },
      { header: '门面消防设备类型', key: 'fire_equipment_type', width: 12 },
      { header: '门面消防设备数量', key: 'fire_equipment_quantity', width: 12 },
      { header: '门面电子监控状态', key: 'surveillance_status', width: 12 },
      { header: '门面电子监控数量', key: 'surveillance_quantity', width: 12 },
      { header: '房子信息', key: 'house_info', width: 12 },
      { header: '房子产权人', key: 'house_owner', width: 12 },
      { header: '建筑面积', key: 'house_area', width: 12 },
      { header: '房屋类型', key: 'house_type', width: 12 },
      { header: '危房等级', key: 'house_condition', width: 12 },
      { header: '兴趣爱好', key: 'hobbies', width: 12 },
      { header: '吸烟与否', key: 'smoking_status', width: 12 },
      { header: '车型号', key: 'car_model', width: 12 },
      { header: '车身颜色', key: 'car_color', width: 12 },
      { header: '车牌号', key: 'car_plate', width: 12 },
      { header: '车辆所有人', key: 'car_owner', width: 12 },
      { header: '驾驶证类型', key: 'school', width: 12 },
      { header: '志愿者', key: 'volunteer_status', width: 12 },
      { header: '社工', key: 'social_worker', width: 12 },
      { header: '网格员名称', key: 'car_color', width: 12 },
      { header: '网格员编号', key: 'car_plate', width: 12 },
      { header: '网格员联系方式', key: 'car_owner', width: 12 },
      { header: '民警姓名', key: 'school', width: 12 },
      { header: '民警联系方式', key: 'volunteer_status', width: 12 },
    ];

    // 计算行数和每行的列数
    const rowCount = 17;
    // const columnsPerRow = 5;
    let people: CommonPeopleExport = peopleData;
    let por = OtherInfoData;
    let volunteerArr: string[];
    let socailArr: string[];
    people.sex = peopleData.sex ? '女' : '男';
    por.smoking_status = por.smoking_status === '0' ? '否' : '是';
    if (OtherInfoData?.volunteer_status) {
      const jsonObj = JSON.parse(OtherInfoData?.volunteer_status);
      volunteerArr = Object.values(jsonObj);
      volunteerArr = volunteerArr.map((item, index) => {
        return item[index + 1];
      });
      por.volunteer_status = volunteerArr.toString();
    }

    if (OtherInfoData?.social_worker) {
      const jsonObjsocial = JSON.parse(OtherInfoData?.social_worker);
      socailArr = Object.values(jsonObjsocial);
      socailArr = socailArr.map((item, index) => {
        return item[index + 1];
      });
      por.social_worker = socailArr.toString();
    }
    const arr1 = Object.values(people).slice(1, 13);
    const arr2 = Object.values(CombinationData);
    const arr3 = Object.values(WellbeingData);
    const arr4 = Object.values(HealthInfoData);
    const arr5 = Object.values(EducationData);
    const arr6 = Object.values(ProductionData[0]).slice(1, 13);
    const arr7 = Object.values(por);
    const arr8 = Object.values(WarrantorData);
    const arr9 = Object.values(familyData);
    console.log(arr9);

    // const data = [
    //   {arr1.slice(1, 13) },
    //   { 'arr2': arr2 },
    //   { 'arr3': arr3 },
    //   { 'arr4': arr4 },
    //   { 'arr5': arr5 },
    //   { 'arr6': arr6 },
    //   { 'arr7': arr7 },
    //   { 'arr8': arr8 },
    // ];
    const data = [arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8];

    let headRowIndex = 1;
    let dataRowIndex = 2;
    let arrIndex: number = 0;
    let index = 0;
    let headIndex = 0;
    // console.log(data[arrIndex]);
    for (let row = 1; row <= rowCount; row++) {
      // console.log('2');
      // 计算每行的起始列索引和结束列索引
      // const startColumnIndex = 1;
      // const endColumnIndex = 5;

      // 获取当前行
      const headRow = worksheet.getRow(headRowIndex);
      // console.log(data[arrIndex]);

      const dataRow = worksheet.getRow(dataRowIndex);

      // 遍历每行的列
      for (let columnIndex = 0; columnIndex <= 4; columnIndex++) {
        // 判断是否超出列信息的长度

        if (index <= data[arrIndex]?.length - 1) {
          const column = columnData[headIndex];
          const headCell = headRow.getCell(columnIndex + 1);
          headCell.value = column?.header;
          const dataCell = dataRow.getCell(columnIndex + 1);
          dataCell.value = data[arrIndex][index]?.toString();
          headCell.style = {
            font: {
              size: 10,
              bold: true,
            },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: {
              type: 'pattern',
              pattern: 'solid',
            },
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            },
          };
          dataCell.style = {
            font: {
              size: 8,
            },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: {
              type: 'pattern',
              pattern: 'solid',
            },
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            },
          };
          // currentRow.getCell(columnIndex + 1).width = column.width;
        } else {
          arrIndex = arrIndex + 1;
          index = 0;
          break;
        }
        headIndex++;
        index++;
      }
      headRowIndex = headRowIndex + 2;
      dataRowIndex = dataRowIndex + 2;
    }
    function insertOneRow(index: number, obj: string, ws: ExcelJs.Worksheet) {
      // ws.insertRow(index, ['']);
      const insertRow = ws.insertRow(index, ['']);
      worksheet.mergeCells(`A${index}:E${index}`);
      const cell = insertRow.getCell(1);
      cell.value = obj;
      cell.style = {
        font: {
          size: 10,
          bold: true,
          color: { argb: 'ffffff' },
        },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '25B0F3' },
        },
        border: {
          top: { style: 'thin', color: { argb: '9e9e9e' } },
          left: { style: 'thin', color: { argb: '9e9e9e' } },
          bottom: { style: 'thin', color: { argb: '9e9e9e' } },
          right: { style: 'thin', color: { argb: '9e9e9e' } },
        },
      };
    }

    insertfamily(
      7,
      ['成员姓名', '成员关系', '成员身份证号', '成员联系方式', '户号'],
      worksheet,
    );
    for (let i = 1; i <= arr9.length; i++) {
      if (arr9[i]?.name) {
        const obj = Object.values(arr9[i]);
        insertfamily(7 + i, obj, worksheet);
      }
    }
    insertOneRow(7 + arr9.length, '专群结合', worksheet);
    insertOneRow(10 + arr9.length, '民生', worksheet);
    insertOneRow(13 + arr9.length, '民政卫健', worksheet);
    insertOneRow(20 + arr9.length, '政治教育', worksheet);
    insertOneRow(25 + arr9.length, '生产经营情况', worksheet);
    insertOneRow(32 + arr9.length, '其他信息', worksheet);
    insertOneRow(39 + arr9.length, '包保人员信息', worksheet);
    clearInterval(int);
    setTimeout(() => {
      message.success('导出成功');
    });
    saveWorkbook(workbook, '人口信息.xlsx');
    // });
  };

  // useEffect(() => {
  //   if (changeData) {
  //     console.log(changeData);

  //     const changewhat = changeData?.data?.getChangeRecord.map((item: ChangeWhat) => ({
  //       after: item?.content_after,
  //       before: item?.content_before,
  //       value: item?.change_item,
  //       key: item?.id,
  //     }));

  //     setChangedata(changewhat);
  //   }
  // }, [changeData]);

  return (
    <div className={styles.CommonBox}>
      <div className={styles.TopSelf}>
        {/* 图片 */}
        <div>
          <img src={peopleData?.img} />
        </div>
        {/* 本人姓名列 */}
        <div>
          <div>
            <span>*</span>本人姓名：<span>{peopleData?.name}</span>
          </div>
          <div>
            <span>*</span>姓名拼音：<span>{peopleData?.spell}</span>
          </div>
          <div>
            <span></span>曾用名：<span>{peopleData?.formerName}</span>
          </div>
          <div>
            <span></span>身高：<span>{peopleData?.height}</span>
          </div>
          <div style={{ width: '100%' }}>
            <span>*</span>所属派出所：
            <span>{peopleData?.police}</span>
          </div>
          <div>
            <span>*</span> 所属网格：<span>{peopleData?.gridding}</span>
          </div>
          <div>
            <span>*</span>人员分级类别：<span>{peopleData?.level}</span>
          </div>
        </div>
        <div>
          <div>
            <span>*</span>身份证号(护照)：
            <span>{peopleData?.card}</span>
          </div>
          <div>
            <span>*</span>联系方式：<span>{peopleData?.phone}</span>
          </div>
          <div>
            <span></span>绰号：<span>{peopleData?.nickName}</span>
          </div>
          <div>
            <span></span> 何时来本地居住：<span>{peopleData?.liveComeTime}</span>
          </div>
          <div>
            <span>*</span>户籍所在地：<span>{peopleData?.placeDomicile}</span>
          </div>
          <div>
            <span>*</span>性别：
            <span>
              {peopleData?.sex === false ? '男' : peopleData?.sex === true ? '女' : ''}
            </span>
          </div>
          <div>
            <span></span>年龄：
            <span>{peopleData?.age}</span>
          </div>
        </div>
      </div>

      {/* 比较长的内容单独一行 */}
      <div className={styles.TopDataLong}>
        <div>
          <span className="SpanRedColor">*</span>现住址：
          <span>{peopleData?.currentAddress}</span>
        </div>
        {peopleData?.history?.map((item: any) => {
          return (
            <>
              <div>
                <span className="SpanRedColor">*</span>历史数据(电话、住址)：
                <div className={styles.BottomHistory}>
                  电话：<span>{item.phone}</span>&nbsp;&nbsp;&nbsp;&nbsp; 住址：
                  <span>{item.current_address}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 时间：
                  <span>{formatLocalDate(item.update_time)}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
              </div>
            </>
          );
        })}
      </div>

      <div style={{ position: 'absolute', right: '1px', top: '-40px' }}>
        <Button
          style={{
            marginRight: '10px',
            backgroundColor: '#0559ca',
            borderRadius: '5px',
          }}
          type="primary"
          onClick={exportExcel}
        >
          下载此人员信息
        </Button>
        <Button
          style={{
            marginRight: '10px',
            backgroundColor: '#0559ca',
            borderRadius: '5px',
          }}
          type="primary"
          onClick={() => {
            setRecordVisible(true);
          }}
        >
          查看历史记录
        </Button>
        <Button
          style={{
            marginRight: '10px',
            backgroundColor: '#0559ca',
            borderRadius: '5px',
          }}
          type="primary"
          onClick={() => {
            navigate(`/population-manager/person-management-update/${Number(id)}`);
          }}
        >
          修改信息
        </Button>
        <Button
          style={{
            backgroundColor: '#0559ca',
            borderRadius: '5px',
          }}
          onClick={() => setDeleteVisible(true)}
          type="primary"
        >
          删除
        </Button>

        <Modal
          okText="确认"
          cancelText="取消"
          title="删除此人员信息"
          open={deleteVisible}
          maskClosable
          // width={1000}
          onOk={deletePeople}
          onCancel={() => setDeleteVisible(false)}
        >
          <Form form={form}>
            <Form.Item
              name="priority"
              label="紧急程度："
              rules={[
                {
                  required: true,
                  message: '请选择紧急程度！',
                },
              ]}
            >
              <Select placeholder="请选择紧急程度">
                <Option key={1} value={1}>
                  紧急
                </Option>
                <Option key={2} value={2}>
                  加急
                </Option>
                <Option key={3} value={3}>
                  一般
                </Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          // okText="确认"
          // cancelText="取消"
          title="历史变更记录"
          open={recordVisible}
          maskClosable
          footer={null}
          // width={1000}
          // onOk={deletePeople}
          onCancel={() => setRecordVisible(false)}
        >
          <Table
            pagination={false}
            columns={changecolumns}
            dataSource={changedata}
            // size="middle"
          />
        </Modal>
      </div>
    </div>
  );
};

export default Common;
