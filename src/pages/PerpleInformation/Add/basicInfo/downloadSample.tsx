import { Button, message } from 'antd';
import * as ExcelJs from 'exceljs';

import { saveWorkbook } from '@/utils/ExportExcel';

const data = [
  {
    id: '',
    name: '必填',
    id_card: '必填',
    residence: '必填',
    pinyin: '必填',
    phone: '必填',
    current_address: '必填',
    former_name: '',
    nickname: '',
    date_of_residence: 'YYY-MM-DD',
    age: '',
    height: '',
    gender: '必填：男/女',
    // 民政卫健
    marriage_status: '必填：未婚/已婚/离异/丧偶',
    child_number: '',
    health_insurance: '职工保险/社会保险/个人保险/无',
    pension_insurance: '职工保险/社会保险/个人保险/无',
    vaccination_status: '必填',
    proof_contraindication: '',
    other_conditions: '',
    special_group: '',
    supervisor: '',
    disability_id: '', // 残疾证编号
    disability_type: '', // 残疾类型
    disability_subsidy: '', // 困难残疾补贴用0代表空
    disability_level: '', // 残疾级别
    severe_disability_subsidy: '', // 重度残疾补贴
    // 政治教育
    work_unit: '',
    position: '',
    religion: '',
    party: ' ',
    schooll: ' ',
    education: '必填',
    political_status: '必填：中共党员/共青团员/群众',

    military_service: '必填：未服兵役/入伍/退伍',
    nationality: '必填',

    // 种植
    plant_type: '', // 种植种类
    plant_quantity: '', // 种植数量
    plant_area: '', // 种植面积
    breeding_type: '', // 养殖种类
    breeding_quantity: '', // 养殖数量
    business_info: '', // 营商情况(商户名称)
    business_location: '', // 门面位置
    license_number: '', // 营业执照编号
    fire_equipment_type: '', // 门面消防设备类型
    fire_equipment_quantity: '', // 门面消防设备数量
    surveillance_status: '', // 门面电子监控状态
    surveillance_quantity: '', // 门面电子监控数量
    // 其他
    house_owner: '', // 房子产权人
    house_area: '', // 建筑面积 平方米
    house_type: '', // 房屋类型
    house_condition: '', // 危房等级
    hobbies: '', // 兴趣爱好
    car_model: '', // 车型号（可选）
    car_owner: '', // 车辆所有人（可选）
    car_plate: '', // 车牌照（可选）
    car_color: '', // 车身颜色（可选）
    house_info: '常住户/租房户', // 房子信息 开关没有暂时没用上
    smoking_status: '必填：是/否',
    driving_license_type: '', // 驾驶证类型（可选）
    // volunteer_status:
    //   JSON.stringify(datas?.propertyData[0]?.volunteer_status) ?? '', // 志愿者{ } json里边写字符数组，来记录志愿者
    // social_worker: JSON.stringify(datas?.propertyData[0]?.social_worker) ?? '', // 社工{ }  json里边写字符数组，来记录社工
  },
];

const DownloadSmaple = () => {
  const download = () => {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('sheet');
    worksheet.properties.defaultRowHeight = 20;
    worksheet.columns = [
      { header: '序号', key: 'id', width: 12 },
      { header: '本人姓名', key: 'name', width: 12 },
      { header: '绰号', key: 'nickname', width: 12 },
      { header: '曾用名', key: 'former_name', width: 12 },
      { header: '何时来本地居住', key: 'date_of_residence', width: 12 },
      { header: '姓名拼音', key: 'pinyin', width: 12 },
      { header: '性别', key: 'gender', width: 12 },
      { header: '身高', key: 'height', width: 12 },
      { header: '年龄', key: 'age', width: 12 },
      { header: '身份证号', key: 'id_card', width: 12 },
      { header: '联系方式', key: 'phone', width: 12 },
      { header: '户籍所在地', key: 'residence', width: 12 },
      { header: '现住址', key: 'current_address', width: 12 },
      { header: '生育儿女数量', key: 'child_number', width: 12 },
      { header: '特殊群体', key: 'special_group', width: 12 },
      { header: '监护人姓名', key: 'supervisor', width: 12 },
      // { header: '残疾人', key: 'disability', width: 12 },
      { header: '残疾证编号', key: 'disability_id', width: 12 },
      { header: '残疾类型', key: 'disability_type', width: 12 },
      // { header: '困难残疾人生活补贴', key: 'disability_subsidy', width: 12 },

      { header: '困难残疾人生活补贴', key: 'disability_subsidy', width: 12 }, // ss
      { header: '重度残疾人护理补贴', key: 'severe_disability_subsidy', width: 12 },
      { header: '残疾等级', key: 'disability_level', width: 12 },
      { header: '医疗保险情况', key: 'health_insurance', width: 12 },
      { header: '养老保险情况', key: 'pension_insurance', width: 12 },
      { header: '婚姻状态', key: 'marriage_status', width: 12 },
      { header: '疫苗接种情况', key: 'vaccination_status', width: 12 },
      { header: '禁忌证明', key: 'proof_contraindication', width: 12 },
      { header: '民政卫健其他情况', key: 'other_conditions', width: 12 },
      { header: '工作单位', key: 'work_unit', width: 12 },
      { header: '职务', key: 'position', width: 12 },
      { header: '政治面貌', key: 'political_status', width: 12 },
      { header: '宗教信仰', key: 'religion', width: 12 },
      { header: '所属党组织', key: 'party', width: 12 },
      { header: '民族', key: 'nationality', width: 12 },
      { header: '文化程度', key: 'education', width: 12 },
      { header: '入伍情况', key: 'military_service', width: 12 },
      { header: '毕业院校', key: 'schooll', width: 12 },
      { header: '种植种类', key: 'plant_type', width: 12 },
      { header: '种植数量', key: 'plant_quantity', width: 12 },
      { header: '种植面积', key: 'plant_area', width: 12 },
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
      { header: '驾驶证类型', key: 'driving_license_type', width: 12 },
    ];
    worksheet.addRows(data);
    const insertRow = worksheet.getRow(2);
    insertRow.eachCell((cell) => {
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
    });
    // clearInterval(int);
    // 合并单元格
    // 插入新行
    // worksheet.insertRow(1, []);

    // worksheet.mergeCells('A1:M1');
    // worksheet.mergeCells('N1:AC1');
    // worksheet.mergeCells('AD1:AK1');
    // worksheet.mergeCells('AM1:AX1');
    // worksheet.mergeCells('AY1:BJ1');
    // // 获取合并后的单元格，并设置数据
    // const mergedCell1 = worksheet.getCell('A1');
    // mergedCell1.value = '基础信息';
    // const newRow = worksheet.getRow(1);
    // newRow.values = ['基础信息', '民政卫健信息', '政治教育信息', '种植营商情况', '其他情况'];
    setTimeout(() => {
      message.open({
        type: 'success',
        content: '导出成功',
        duration: 2,
      });
    });
    saveWorkbook(workbook, '人口批量导入模板.xlsx');
  };

  return <Button onClick={download}>下载批量导入模板</Button>;
};

export default DownloadSmaple;
