import { useMutation } from '@apollo/client';
import { Button, Col, Form, type FormInstance, Input, message, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';

import { UpdatePeopleInfo } from '@/apis';

import styles from '../../Add/basicInfo/styles.module.less';
import type {
  basicInfo,
  changeInfo,
  disabilityInfo,
  economicInfo,
  getbasicInfo,
  getdisabilityInfo,
  getHealthInfo,
  healthInfo,
  politicalInfo,
  propertyInfo,
  WarrantorType,
} from '../../Add/types';
import type { EducationType } from '../../Show/Education';
import type { OtherInfoType } from '../../Show/OtherInfo';
import type { ProductionType } from '../../Show/Production';
import {
  baiscItem,
  baiscName,
  disItem,
  disName,
  ecoItem,
  ecoName,
  healthItem,
  healthName,
  politicalItem,
  politicalName,
  proItem,
  proName,
  warItem,
  warName,
} from './objectName';

type props = {
  porform: FormInstance;
  ecomomicform: FormInstance;
  healthform: FormInstance;
  basicform: FormInstance;
  eduform: FormInstance;
  basicData: getbasicInfo;
  HealthInfoData: getHealthInfo;
  EducationData: EducationType;
  ProductionData: ProductionType;
  OtherInfoData: OtherInfoType;
  warData: WarrantorType;
  imgSrc?: string;
  disform: FormInstance;
  disUpdateData: getdisabilityInfo;
};

const Warrantor = ({
  porform,
  ecomomicform,
  disform,
  disUpdateData,
  healthform,
  basicform,
  eduform,
  basicData,
  HealthInfoData,
  EducationData,
  ProductionData,
  OtherInfoData,
  warData,
  imgSrc,
}: props) => {
  const [warform] = Form.useForm();
  const [errorVisible, setErrorVisibile] = useState<Boolean>(false);

  const [updatePeopleInfo] = useMutation(UpdatePeopleInfo);
  const [urgencyVisible, setUrgencyVisible] = useState<boolean>();

  useEffect(() => {
    if (warData) {
      warform.setFieldsValue({
        community: warData?.community,
        gridding: warData?.gridding,
        gridPersonId: warData?.gridPersonId,
        girdPersonPhone: warData?.girdPersonPhone,
        policeName: warData?.policeName,
        policePhone: warData?.policePhone,
        gridPersonName: warData?.gridPersonName,
        police: warData?.police,
      });
    }
  });

  const handleSubmit = () => {
    console.log(porform);
    const porData: propertyInfo[] = [];
    const baiscData: basicInfo[] = [];
    const disData: disabilityInfo[] = [];
    const healthData: healthInfo[] = [];
    const politicalData: politicalInfo[] = [];
    const ecoData: economicInfo[] = [];
    const warrantorData: WarrantorType[] = [];
    const changeRecord: changeInfo[] = [];
    setUrgencyVisible(false);
    porform
      ?.validateFields()
      .then(() => {
        const data: propertyInfo = porform.getFieldsValue();
        porData.push({
          houseInfo: data?.houseInfo,
          personalId: data?.personalId, // 改
          houseOwner: data?.houseOwner,
          houseArea: data?.houseArea,
          houseCondition: data?.houseCondition,
          hobbies: data?.hobbies,
          carModal: data?.carModal,
          carPlate: data.carPlate,
          carOwner: data?.carOwner,
          carColor: data?.carOwner,
          houseType: data?.houseType,
          smokingStatus: data?.smokingStatus,
          VolunteerStatus: data?.VolunteerStatus,
          SocialWorker: data?.SocialWorker,
          drivingLicenseType: data?.drivingLicenseType,
          creatorId: data?.creatorId,
        });

        let afterData = Object.values(data);
        let beforeData = Object.values(OtherInfoData);

        afterData.map((item, index) => {
          if (item !== beforeData[index]) {
            changeRecord.push({
              changeItem: proName[index],
              ItemName: proItem[index],
              contentBefore: beforeData[index].toString(),
              contentAfter: item.toString(),
            });
          }
        });
        console.log('p');
      })
      .catch(() => setErrorVisibile(true));

    ecomomicform
      ?.validateFields()
      .then(() => {
        console.log('e');
        const data: economicInfo = ecomomicform.getFieldsValue();
        ecoData.push({
          personalId: data?.personalId,
          // plantingBreeding: data?.plantingBreeding,
          plantType: data?.plantType,
          plantQuantity: data?.plantQuantity,
          plantArea: data?.plantArea,
          breedingType: data?.breedingType,
          breedingQuantity: data?.breedingQuantity,
          bussinessInfo: data?.businessLocation,
          businessLocation: data?.businessLocation,
          licenseNum: data?.licenseNum,
          fireEquipmentType: data?.fireEquipmentType,
          fireEquipmentQuantity: data?.fireEquipmentQuantity,
          surStatus: data?.surStatus,
          surQuantity: data?.surQuantity,
          creatorId: data?.creatorId,
        });

        let afterData = Object.values(data);
        let beforeData = Object.values(ProductionData);

        afterData.map((item, index) => {
          if (item !== beforeData[index + 1]) {
            changeRecord.push({
              ItemName: ecoItem[index],
              changeItem: ecoName[index],
              contentBefore: beforeData[index + 1].toString(),
              contentAfter: item.toString(),
            });
          }
        });
      })
      .catch(() => setErrorVisibile(true));
    basicform
      ?.validateFields()
      .then(() => {
        console.log('b');
        const data: basicInfo = basicform.getFieldsValue();
        console.log(data);

        baiscData.push({
          name: data?.name,
          // certificateType: data?.certificateType,
          idCard: data?.idCard,
          phone: data?.phone,
          residence: data?.residence,
          currentAddress: data?.currentAddress,
          pinyin: data?.pinyin,
          nickname: data?.nickname,
          formerName: data?.formerName,
          dateOfResidence: data?.dateOfResidence,
          height: data?.height,
          age: data?.age,
          gender: data?.gender,
          headUrl: imgSrc ?? '',
        });

        let afterData = Object.values(data);
        let beforeData = Object.values(basicData);
        console.log(beforeData);

        afterData.map((item, index) => {
          if (item !== beforeData[index + 2]) {
            changeRecord.push({
              changeItem: baiscName[index],
              ItemName: baiscItem[index],
              contentBefore: beforeData[index + 2].toString(),
              contentAfter: item.toString(),
            });
          }
        });
      })
      .catch(() => setErrorVisibile(true));

    healthform
      ?.validateFields()
      .then(() => {
        console.log('h');
        const data: healthInfo = healthform.getFieldsValue();
        healthData.push({
          personalId: data?.personalId,
          childNumber: data?.childNumber,
          specialGroup: data?.specialGroup,
          healthInsurance: data?.healthInsurance,
          pensionInsurance: data?.pensionInsurance,
          vaccinationStatus: data?.vaccinationStatus,
          proofContraindication: data?.proofContraindication,
          marriageStatus: data?.marriageStatus,
          supervisorName: data?.supervisorName,
          otherConditions: data?.otherConditions,
          creatorId: data?.creatorId,
        });
        if (data?.specialGroup === '残疾人') {
          const disaility: disabilityInfo = disform.getFieldsValue();
          disData.push({
            disabilityId: disaility.disabilityId,
            disabilityType: disaility.disabilityType,
            disabilitySubsidy: parseFloat(disaility.disabilitySubsidy.toString()),
            disabilityLevel: parseInt(disaility.disabilityLevel.toString()),
            servereDisabilitySub: parseFloat(disaility.servereDisabilitySub.toString()),
          });

          let afterData = Object.values(disaility);
          console.log('after', afterData);

          let beforeData = Object.values(disUpdateData);
          console.log('before', beforeData);
          afterData.map((item, index) => {
            if (item !== beforeData[index]) {
              changeRecord.push({
                changeItem: disName[index],
                ItemName: disItem[index],
                contentBefore: beforeData[index].toString(),
                contentAfter: item.toString(),
              });
            }
          });
        }

        let afterData = Object.values(data);
        console.log('after', afterData);

        let beforeData = Object.values(HealthInfoData);
        console.log('before', beforeData);

        beforeData.map((item, index) => {
          if (index < 9) {
            if (item !== afterData[index]) {
              changeRecord.push({
                changeItem: healthName[index],
                ItemName: healthItem[index],
                contentBefore: beforeData[index].toString(),
                contentAfter: item.toString(),
              });
            }
          }
        });
      })
      .catch(() => setErrorVisibile(true));

    eduform
      .validateFields()
      .then(() => {
        console.log('e');
        const data: politicalInfo = eduform.getFieldsValue();
        politicalData.push({
          personalId: data?.personalId,
          workUnit: data?.workUnit,
          position: data?.position,
          politicalStatus: data?.politicalStatus,
          party: data?.party,
          religion: data?.religion,
          nationality: data?.nationality,
          education: data?.education,
          militaryService: data?.militaryService,
          school: data?.school,
          creatorId: data?.creatorId,
        });

        let afterData = Object.values(data);
        let beforeData = Object.values(EducationData);

        afterData.map((item, index) => {
          if (item !== beforeData[index]) {
            changeRecord.push({
              ItemName: politicalItem[index],
              changeItem: politicalName[index],
              contentBefore: beforeData[index].toString(),
              contentAfter: item.toString(),
            });
          }
        });
      })
      .catch(() => setErrorVisibile(true));

    warform
      .validateFields()
      .then(() => {
        console.log('w');
        const data: WarrantorType = warform.getFieldsValue();
        warrantorData.push({
          community: data?.community,
          gridding: data?.gridding,
          gridPersonId: data?.gridPersonId,
          girdPersonPhone: data?.girdPersonPhone,
          policeName: data?.policeName,
          policePhone: data?.policePhone,
          gridPersonName: data?.gridPersonName,
          police: data?.police,
        });

        let afterData = Object.values(data);
        let beforeData = Object.values(warData);

        afterData.map((item, index) => {
          if (item !== beforeData[index]) {
            changeRecord.push({
              ItemName: warItem[index],
              changeItem: warName[index],
              contentBefore: beforeData[index].toString(),
              contentAfter: item.toString(),
            });
          }
        });
        console.log(changeRecord);

        updatePeopleInfo({
          variables: {
            id: basicData.id,
            changeRecord: {
              CreateChangeRecordDto: changeRecord,
            },
            priority: parseInt(porform.getFieldsValue().priority),
          },
          onCompleted: () => {
            message.success('已为您创建审核记录');
            // 跳回上一页面
          },
          onError: () => {
            message.error('创建审核记录失败');
          },
        });
      })
      .catch(() => setErrorVisibile(true));
    if (errorVisible) {
      message.error('您有未完成填写的必填项');
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Basic}>
          <Form form={warform}>
            <Row>
              <Col span={8}>
                <Form.Item name="community" label="社区所在:">
                  {/* <label className={styles.Label}>曾用名：</label> */}
                  <Input placeholder="请填写" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="gridding" label="网格所在:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="gridPersonName" label="网格员个人姓名:">
                  {/* <label className={styles.Label}>曾用名：</label> */}
                  <Input placeholder="请填写" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="gridPersonId" label="网格员编号:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="girdPersonPhone"
                  label="网格员联系方式:"
                  style={{ float: 'right' }}
                >
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="police" label="所属派出所:">
                  {/* <label className={styles.Label}>曾用名：</label> */}
                  <Input placeholder="请填写" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="policeName" label="民警姓名:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="policePhone"
                  label="民警联系方式:"
                  style={{ float: 'right' }}
                >
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <Button
        style={{ float: 'right', marginRight: '1vw' }}
        type="primary"
        onClick={() => setUrgencyVisible(true)}
      >
        保存
      </Button>

      <Modal
        okText="确认"
        cancelText="取消"
        title="审核紧急程度"
        open={urgencyVisible}
        maskClosable
        // width={1000}
        onOk={handleSubmit}
        onCancel={() => setUrgencyVisible(false)}
      >
        <Form form={porform}>
          <Form.Item name="priority" label="紧急程度：">
            <Input placeholder="请输入紧急程度,如：1-3" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Warrantor;
