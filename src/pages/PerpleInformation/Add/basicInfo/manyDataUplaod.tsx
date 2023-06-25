import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Col, Form, Input, message, Modal, Row, Upload } from 'antd';
import { useState } from 'react';
// import { Form } from 'react-router-dom';
import { read, utils } from 'xlsx';

import { CreatePeopleInfo } from '@/apis';

import type {
    basicInfo,
    disabilityInfo, economicInfo,
    healthInfo, politicalInfo, propertyInfo
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


const ManyDataUpload = ({ visible, setManyVisible }:
    { visible: boolean, setManyVisible: (v: boolean) => void }) => {
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
            const fileData = e.target?.result;
            if (fileData instanceof ArrayBuffer) {
                const data = new Uint8Array(fileData);
                const workbook = read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData: string[][] = utils.sheet_to_json(worksheet, { header: 1 });

                // 提取表头
                const headerRow: string[] = jsonData[0];
                if (headerRow[1] === '本人姓名' && headerRow[2] === '身份证号（护照）'
                    && headerRow[3] === '户籍所在地'
                    && headerRow[4] === '姓名拼音' && headerRow[5] === '联系方式' && headerRow[6] === '现住址'
                    && headerRow[7] === '曾用名' && headerRow[8] === '绰号' && headerRow[9] === '何时来本地居住'
                ) {
                    // 提取数据（去掉表头）
                    const dataRows = jsonData.slice(1);
                    console.log('数据:', dataRows);
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
                        if (row[7] === '男') {
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
                            name: row[2],
                            idCard: row[10].toString(),
                            residence: row[12],
                            pinyin: row[6],
                            gender: gender,
                            height: parseFloat(row[8]),
                            age: Number(row[9]),
                            certificateType: parseInt(row[11]),
                            phone: row[11].toString(),
                            currentAddress: row[13],
                            formerName: row[4],
                            nickname: row[3],
                            dateOfResidence: row[5],
                        });
                        healthData.push({
                            childNumber: parseInt(row[14]),
                            specialGroup: row[15],
                            healthInsurance: row[24],
                            pensionInsurance: row[25],
                            vaccinationStatus: row[27],
                            proofContraindication: row[28],
                            marriageStatus: row[26],
                            supervisorName: row[20],
                            otherConditions: row[29],
                            // creatorId:row[1],
                        });
                        politicalData.push({
                            workUnit: row[30],
                            position: row[31],
                            politicalStatus: row[32],
                            party: row[33],
                            religion: row[34],
                            nationality: row[35],
                            education: row[36],
                            militaryService: row[37],
                            school: row[38],
                        });
                        ecoData.push({
                            // plantingBreeding: row[55],
                            plantType: row[39],
                            plantQuantity: parseInt(row[40]),
                            plantArea: parseFloat(row[41]),
                            breedingType: row[42],
                            breedingQuantity: parseInt(row[43]),
                            bussinessInfo: row[44],
                            businessLocation: row[45],
                            licenseNum: row[46],
                            fireEquipmentType: row[47],
                            fireEquipmentQuantity: parseInt(row[48]),
                            surStatus: row[49],
                            surQuantity: parseInt(row[50]),
                        });
                        porData.push({
                            houseInfo: row[51],
                            houseOwner: row[52],
                            houseArea: parseFloat(row[53]),
                            houseCondition: row[55],
                            hobbies: row[56],
                            carModal: row[58],
                            carPlate: row[60],
                            carOwner: row[61],
                            carColor: row[59],
                            houseType: row[54],
                            smokingStatus: ss,
                            // VolunteerStatus: row[67],
                            // SocialWorker: row[67],
                            drivingLicenseType: row[62],
                        });
                        if (row[15] === '残疾人') {

                            disData.push({
                                disabilityId: row[17],
                                disabilitySubsidy: parseFloat(row[21]),
                                servereDisabilitySub: parseFloat(row[22]),
                                disabilityType: row[18],
                                disabilityLevel: Number(row[23]),
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
                    // console.log(extractedData);
                    // setManyFamilyCreate(extractedData);
                    setOkDisable(false);
                } else {
                    message.error('请检查文件中是否按规定格式填写');
                    setOkDisable(true);
                }

            };

            reader.readAsArrayBuffer(file);
        };
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
    //                 console.log('数据:', dataRows);
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
    //                 // console.log(extractedData);
    //                 setManyFamilyCreate(extractedData);
    //                 setOkDisable(false);
    //             } else {
    //                 message.error('请检查文件中是否按规定格式填写');
    //                 setOkDisable(true);
    //             }

    //             // 在这里可以对表头和数据进行进一步处理或发送到后端
    //             console.log('表头:', headerRow);



    //         }


    //     };

    //     reader.readAsArrayBuffer(file);
    // };

    const createMany = () => {
        createPeopleInfo({
            variables: {
                createBasicInfoInput: {
                    CreateManyBasicInfoDto: baiscData
                },
                createDisabilityInfoInput: {
                    CreateManDisabilityInfoDto: disData
                },
                createEconomicInfoInput: {
                    CreateManyEconomicInfoDto: ecoData
                },
                createHealthInfoInput: {
                    CreateManyHealthInfoDto: healthData
                },
                createPoliticalInfoInput: {
                    CreateManyPoliticalInfoDto: politicalData
                },
                createPropertyInfoInput: {
                    CreateManyPropertyInfoDto: porData
                },
                priority: parseInt(form.getFieldsValue().priority),
            },
            onCompleted: () => {
                message.success('已为您创建审核记录');
                // 跳回上一页面
            },
            onError: () => {
                message.error('创建审核记录失败');
            }
        });

    };

    return (
        <>
            <Modal
                okText="确认"
                cancelText="取消"
                okButtonProps={
                    { disabled: okDisable }
                }
                title="批量导入人口信息"
                open={visible}
                maskClosable
                // width={1000}
                onOk={createMany}
                onCancel={() => setManyVisible(false)}>
                <Row>
                    <Col span={12}>
                        <Upload {...infoProps}>
                            <Button icon={<UploadOutlined />}>人员信息上传</Button>
                        </Upload>
                    </Col>
                    <Col span={12}>
                        {/* <Upload
                            {...familyProps}>
                            <Button icon={<UploadOutlined />}>人员家庭成员信息上传</Button>
                        </Upload> */}
                        <Form form={form}>
                            <Form.Item
                                name='priority'
                                label='紧急程度：'>
                                <Input
                                    style={{ width: '15vw' }}
                                    placeholder='请输入紧急程度,如：1-3' />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal >
        </>
    );
};

export default ManyDataUpload;