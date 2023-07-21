import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Col, Form, message, Modal, Row, Select, Upload } from 'antd';
import { useState } from 'react';
// import { Form } from 'react-router-dom';
import { read, utils } from 'xlsx';

import { CreatePeopleInfo } from '@/apis';

import type {
  basicInfo,
  disabilityInfo,
  economicInfo,
  healthInfo,
  politicalInfo,
  propertyInfo,
} from '../types';
// import { BasicInfo, disabilityInfo,
// economicInfo, healthInfo, politicalInfo, propertyInfo } from '../types';

export type familyDataType = {
  id?: number;
  name: string;
  idCard: string;
  memberRelation: string;
  phone: string;
  householdId: number;
};

const { Option } = Select;

const ManyDataUpload = ({
  visible,
  setManyVisible,
}: {
  visible: boolean;
  setManyVisible: (v: boolean) => void;
}) => {
  const [infoFileList, setInfoFileList] = useState<UploadFile[]>([]);
  // const [familyFileList, setFamilyFileList] = useState<UploadFile[]>([]);
  const [okDisable, setOkDisable] = useState<boolean>(false);
  const [baiscData, setbaiscData] = useState<basicInfo[]>();
  const [healthData, sethealthData] = useState<healthInfo[]>();
  const [politicalData, setpoliticalData] = useState<politicalInfo[]>();
  const [ecoData, setecoData] = useState<economicInfo[]>();
  const [porData, setporData] = useState<propertyInfo[]>();
  const [disData, setdisData] = useState<disabilityInfo[]>();
  const [form] = Form.useForm();

  // const [manyFamilyCreatData, setManyFamilyCreate] = useState<familyDataType[]>();

  const [createPeopleInfo] = useMutation(CreatePeopleInfo);

  const infoProps: UploadProps = {
    showUploadList: true,
    onRemove: (file) => {
      const index = infoFileList.indexOf(file);
      const newFileList = infoFileList.slice();
      newFileList.splice(index, 1);
      setInfoFileList(newFileList);
    },
    beforeUpload: (file) => {
      setInfoFileList([...infoFileList, file]);
      handleInfoUpload(file);
      return false;
    },
    // fileList: infoFileList,
    accept: '.xlsx,.xls',
    maxCount: 1,
  };

  function ExcelDateToJSDate(serial: number) {
    // Deal with time zone
    if (serial) {
      var step = new Date().getTimezoneOffset() <= 0 ? 25567 + 2 : 25567 + 1;
      var utc_days = Math.floor(serial - step);
      var utc_value = utc_days * 86400;
      var date_info = new Date(utc_value * 1000);

      var fractional_day = serial - Math.floor(serial) + 0.0000001;

      var total_seconds = Math.floor(86400 * fractional_day);

      var seconds = total_seconds % 60;

      total_seconds -= seconds;

      var hours = Math.floor(total_seconds / (60 * 60));
      var minutes = Math.floor(total_seconds / 60) % 60;

      return new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds,
      )?.toLocaleDateString();
    }
  }
  // const familyProps: UploadProps = {
  //     showUploadList: true,
  //     onRemove: (file) => {
  //         const index = familyFileList.indexOf(file);
  //         const newFileList = familyFileList.slice();
  //         newFileList.splice(index, 1);
  //         setFamilyFileList(newFileList);
  //     },
  //     beforeUpload: (file) => {
  //         setFamilyFileList([...familyFileList, file]);
  //         handleFamilyUpload(file);
  //         return false;
  //     },
  //     // fileList: familyFileList,
  //     accept: '.xlsx,.xls',
  //     maxCount: 1,
  // };
  const handleInfoUpload = (file: Blob) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      // console.log('1');

      const fileData = e.target?.result;
      if (fileData instanceof ArrayBuffer) {
        const data = new Uint8Array(fileData);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: string[][] = utils.sheet_to_json(worksheet, { header: 1 });

        // 提取表头
        // const headerRow: string[] = jsonData[0];
        // 提取数据（去掉表头）
        // const dataRows = jsonData.slice(2);
        // jsonData.shift();
        jsonData.shift();
        const porData: propertyInfo[] = [];
        const baiscData: basicInfo[] = [];
        const disData: disabilityInfo[] = [];
        const healthData: healthInfo[] = [];
        const politicalData: politicalInfo[] = [];
        const ecoData: economicInfo[] = [];
        // 提取数据
        jsonData.map((row: string[]) => {
          let gender;
          let ss;
          if (row[6] === '男') {
            gender = false;
          } else {
            gender = true;
          }
          if (row[57] === '是') {
            ss = 1;
          } else {
            ss = 0;
          }
          baiscData.push({
            name: row[1],
            idCard: row[9]?.toString(),
            residence: row[11],
            pinyin: row[5],
            gender: gender,
            height: parseFloat(row[7]),
            age: Number(row[8]),
            // certificateType: parseInt(row[10]),
            phone: row[10]?.toString(),
            currentAddress: row[12],
            formerName: row[3],
            nickname: row[2],
            dateOfResidence: ExcelDateToJSDate(Number(row[4]))?.toString() ?? '',
          });
          console.log(baiscData);

          healthData.push({
            childNumber: parseInt(row[13]),
            specialGroup: row[14],
            healthInsurance: row[21],
            pensionInsurance: row[22],
            vaccinationStatus: row[24],
            proofContraindication: row[25],
            marriageStatus: row[23],
            supervisorName: row[15],
            otherConditions: row[26],
            // creatorId:row[1],
          });
          politicalData.push({
            workUnit: row[27],
            position: row[28],
            politicalStatus: row[29],
            party: row[30],
            religion: row[31],
            nationality: row[32],
            education: row[33],
            militaryService: row[34],
            school: row[35],
          });
          ecoData.push({
            // plantingBreeding: row[55],
            plantType: row[36],
            plantQuantity: parseInt(row[37]),
            plantArea: parseFloat(row[38]),
            breedingType: row[39],
            breedingQuantity: parseInt(row[40]),
            bussinessInfo: row[41],
            businessLocation: row[42],
            licenseNum: row[43]?.toString(),
            fireEquipmentType: row[44],
            fireEquipmentQuantity: parseInt(row[45]),
            surStatus: row[46],
            surQuantity: parseInt(row[47]),
          });
          porData.push({
            houseInfo: row[48],
            houseOwner: row[49],
            houseArea: parseFloat(row[50]),
            houseCondition: row[52],
            hobbies: row[53],
            carModal: row[55],
            carPlate: row[57]?.toString(),
            carOwner: row[58],
            carColor: row[56],
            houseType: row[51],
            smokingStatus: ss,
            // VolunteerStatus: row[66],
            // SocialWorker: row[66],
            drivingLicenseType: row[59]?.toString(),
          });
          if (row[15] === '残疾人') {
            disData.push({
              disabilityId: row[17],
              disabilitySubsidy: parseFloat(row[19]),
              servereDisabilitySub: parseFloat(row[20]),
              disabilityType: row[18],
              disabilityLevel: Number(row[21]),
              // disabilityId:row[68],
            });
          }

          // householdId: parseInt(row[1]),
          setbaiscData(baiscData);
          sethealthData(healthData);
          setpoliticalData(politicalData);
          setecoData(ecoData);
          setporData(porData);
          setdisData(disData);
        });
        // 在这里对提取的数据进行处理
        // //console.log(extractedData);
        // setManyFamilyCreate(extractedData);
        setOkDisable(false);
      }

      reader.readAsArrayBuffer(file);
    };
    reader.readAsArrayBuffer(file);
  };

  // const handleFamilyUpload = (file: Blob) => {
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //         const fileData = e.target?.result;
  //         if (fileData instanceof ArrayBuffer) {
  //             const data = new Uint8Array(fileData);
  //             const workbook = read(data, { type: 'array' });
  //             const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //             const jsonData: string[][] = utils.sheet_to_json(worksheet, { header: 1 });
  //             // 提取表头
  //             const headerRow: string[] = jsonData[0];
  //             if (headerRow[1] === '户号' && headerRow[2] === '成员姓名' && headerRow[3] === '成员身份证号'
  //                 && headerRow[4] === '成员联系方式' && headerRow[5] === '成员与户主关系'
  //             ) {
  //                 // 提取数据（去掉表头）
  //                 const dataRows = jsonData.slice(1);
  //                 //console.log('数据:', dataRows);
  //                 jsonData.shift();
  //                 // 提取数据
  //                 const extractedData = jsonData.map((row: string[]) => ({
  //                     name: row[2],
  //                     idCard: row[3].toString(),
  //                     phone: row[4].toString(),
  //                     memberRelation: row[5],
  //                     householdId: parseInt(row[1]),
  //                 }));
  //                 // 在这里对提取的数据进行处理
  //                 // //console.log(extractedData);
  //                 setManyFamilyCreate(extractedData);
  //                 setOkDisable(false);
  //             } else {
  //                 message.error('请检查文件中是否按规定格式填写');
  //                 setOkDisable(true);
  //             }

  //             // 在这里可以对表头和数据进行进一步处理或发送到后端
  //             //console.log('表头:', headerRow);

  //         }

  //     };

  //     reader.readAsArrayBuffer(file);
  // };

  const createMany = () => {
    createPeopleInfo({
      variables: {
        createBasicInfoInput: {
          CreateManyBasicInfoDto: baiscData,
        },
        createDisabilityInfoInput: {
          CreateManDisabilityInfoDto: disData,
        },
        createEconomicInfoInput: {
          CreateManyEconomicInfoDto: ecoData,
        },
        createHealthInfoInput: {
          CreateManyHealthInfoDto: healthData,
        },
        createPoliticalInfoInput: {
          CreateManyPoliticalInfoDto: politicalData,
        },
        createPropertyInfoInput: {
          CreateManyPropertyInfoDto: porData,
        },
        priority: parseInt(form.getFieldsValue().priority),
      },
      onCompleted: () => {
        message.success('已为您创建审核记录');
        // 跳回上一页面
      },
      onError: (e) => {
        console.log(e);

        message.error('创建审核记录失败');
      },
    });
  };

  return (
    <>
      <Modal
        okText="确认"
        cancelText="取消"
        okButtonProps={{ disabled: okDisable }}
        title="批量导入人口信息"
        open={visible}
        maskClosable
        // width={1000}
        destroyOnClose
        onOk={createMany}
        onCancel={() => setManyVisible(false)}
      >
        <Row>
          <Col span={12}>
            <Upload {...infoProps}>
              <Button icon={<UploadOutlined />} style={{ textAlign: 'center' }}>
                人员信息上传
              </Button>
            </Upload>
          </Col>
          <Col span={12}>
            {/* <Upload
                            {...familyProps}>
                            <Button icon={<UploadOutlined />}>人员家庭成员信息上传</Button>
                        </Upload> */}
            <Form form={form}>
              <Form.Item
                name="priority"
                // label="紧急程度："
                rules={[
                  {
                    required: true,
                    message: '请选择紧急程度！',
                  },
                ]}
              >
                <Select placeholder="请选择紧急程度" style={{ width: '200px' }}>
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
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ManyDataUpload;
