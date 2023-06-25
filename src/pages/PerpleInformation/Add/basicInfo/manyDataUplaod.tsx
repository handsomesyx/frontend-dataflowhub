import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Col, message, Modal, Row, Upload } from 'antd';
import { useState } from 'react';
import { read, utils } from 'xlsx';

import { CreateFamilyInfo } from '@/apis';

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
    const [familyFileList, setFamilyFileList] = useState<UploadFile[]>([]);
    const [okDisable, setOkDisable] = useState<boolean>(false);

    const [manyFamilyCreatData, setManyFamilyCreate] = useState<familyDataType[]>();

    const [createFamilyInfo] = useMutation(CreateFamilyInfo);

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

    const familyProps: UploadProps = {
        showUploadList: true,
        onRemove: (file) => {
            const index = familyFileList.indexOf(file);
            const newFileList = familyFileList.slice();
            newFileList.splice(index, 1);
            setFamilyFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFamilyFileList([...familyFileList, file]);
            handleFamilyUpload(file);
            return false;
        },
        // fileList: familyFileList,
        accept: '.xlsx,.xls',
        maxCount: 1,
    };

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
                    // const porData: propertyInfo[] = [];
                    // const baiscData: BasicInfo[] = [];
                    // const disData: disabilityInfo[] = [];
                    // const healthData: healthInfo[] = [];
                    // const politicalData: politicalInfo[] = [];
                    // const ecoData: economicInfo[] = [];
                    // // 提取数据
                    // const extractedData = jsonData.map((row: string[]) => {
                    //     baiscData.push({
                    //         name: row[6],
                    //         idCard: row[13].toString(),
                    //         residence: row[15].toString(),
                    //         pinyin: row[10],
                    //         // gender: row[11],
                    //         // age: row[12],c
                    //         certificateType: parseInt(row[11]),
                    //         phone: row[14],
                    //         currentAddress: row[16],
                    //         formerName: row[8],
                    //         nickname: row[7],
                    //         dateOfResidence: new Date(row[9]),
                    //     });
                    //     healthData.push({
                    //         childNumber: parseInt(row[1]),
                    //         specialGroup: row[32],
                    //         remarkOne: row[1],
                    //         remarkTow: row[1],
                    //         healthInsurance: row[40],
                    //         pensionInsurance: row[41],
                    //         vaccinationStatus: row[43],
                    //         proofContraindication: row[44],
                    //         marriageStatus: row[42],
                    //         supervisorId: parseInt(row[1]),
                    //         otherConditions: row[45],
                    //         // creatorId:row[1],
                    //     })
                    //     politicalData.push({
                    //         workUnit: row[46],
                    //         position: row[47],
                    //         politicalStatus: row[48],
                    //         party: row[50],
                    //         religion: row[49],
                    //         nationality: row[51],
                    //         education: row[52],
                    //         militaryService: row[533],
                    //         school: row[54],
                    //     })
                    //     ecoData.push({
                    //         plantingBreeding: row[55],
                    //         plantType: row[56],
                    //         plantQuantity: parseInt(row[57]),
                    //         breedingType: row[59],
                    //         breedingQuantity: parseInt(row[60]),
                    //         bussinessInfo: row[61],
                    //         businessLocation: row[62],
                    //         licenseNum: row[63],
                    //         fireEquipmentType: row[64],
                    //         fireEquipmentQuantity: parseInt(row[65]),
                    //         surStatus: row[66],
                    //         surQuantity: parseInt(row[67]),
                    //     })
                    //     porData.push({
                    //         houseInfo: row[68],
                    //         houseOwner: row[69],
                    //         houseArea: row[70],
                    //         houseCondition: row[72],
                    //         hobbies: row[73],
                    //         carModal: row[75],
                    //         carPlate: row[78],
                    //         carOwner: row[79],
                    //         carColor: row[77],
                    //         houseType: row[71],
                    //         smokingStatus: row[74],
                    //         VolunteerStatus: row[67],
                    //         SocialWorker: row[67],
                    //         drivingLicenseType: row[80],
                    //     }),
                    //         disData.push({
                    //             disabilityId: row[34],
                    //             disabilitySubsidy: row[35],
                    //             servereDisabilitySub: row[36],
                    //             disabilityType: row[35],
                    //             superviser: row[37],
                    //             disabilityLevel: row[68],
                    //             // disabilityId:row[68],
                    //         })
                    //     // householdId: parseInt(row[1]),
                    // });
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

    const handleFamilyUpload = (file: Blob) => {
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
                if (headerRow[1] === '户号' && headerRow[2] === '成员姓名' && headerRow[3] === '成员身份证号'
                    && headerRow[4] === '成员联系方式' && headerRow[5] === '成员与户主关系'
                ) {
                    // 提取数据（去掉表头）
                    const dataRows = jsonData.slice(1);
                    console.log('数据:', dataRows);
                    jsonData.shift();
                    // 提取数据
                    const extractedData = jsonData.map((row: string[]) => ({
                        name: row[2],
                        idCard: row[3].toString(),
                        phone: row[4].toString(),
                        memberRelation: row[5],
                        householdId: parseInt(row[1]),
                    }));
                    // 在这里对提取的数据进行处理
                    // console.log(extractedData);
                    setManyFamilyCreate(extractedData);
                    setOkDisable(false);
                } else {
                    message.error('请检查文件中是否按规定格式填写');
                    setOkDisable(true);
                }

                // 在这里可以对表头和数据进行进一步处理或发送到后端
                console.log('表头:', headerRow);



            }


        };

        reader.readAsArrayBuffer(file);
    };

    const createMany = () => {
        createFamilyInfo({
            variables: {
                createFamilyInfoInput: {
                    CreateManyFamilyInfoDto: manyFamilyCreatData
                }
            },
            awaitRefetchQueries: true,
            refetchQueries: ['findFamilyMemberInfo'],
        }).then(() => {
            message.success('添加成功');
            setManyVisible(false);
        })
            .catch(() => {
                message.error('添加失败');
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
                        <Upload
                            {...familyProps}>
                            <Button icon={<UploadOutlined />}>人员家庭成员信息上传</Button>
                        </Upload>
                    </Col>
                </Row>
            </Modal >
        </>
    );
};

export default ManyDataUpload;