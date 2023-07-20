// import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import type { FormInstance } from 'antd';
import { Button, Col, Form, Input, message, Modal, Row, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreatePeopleInfo } from '@/apis';

import type { OtherInfoType } from '../../Show/OtherInfo';
import styles from '../basicInfo/styles.module.less';
import type {
  basicCreateInfo,
  basicInfo,
  disabilityInfo,
  economicInfo,
  healthInfo,
  politicalInfo,
  propertyInfo,
} from '../types';
import SocialWork from './socailWork';
import Volunteer from './voluntter';

const { Option } = Select;
type props = {
  porform: FormInstance;
  ecomomicform: FormInstance;
  healthform: FormInstance;
  basicform: FormInstance;
  eduform: FormInstance;
  update: boolean;
  porData?: OtherInfoType;
  imgSrc?: string;
  disform: FormInstance;
};
const PorpertyInfo = ({
  porform,
  ecomomicform,
  healthform,
  disform,
  basicform,
  eduform,
  update,
  porData,
  imgSrc,
}: props) => {
  const [socialWorkOn, setSocialWorkOn] = useState<boolean>(false);
  const [volunteerOn, setVolunteerOn] = useState<boolean>(false);
  const [volunteerStatus, setVolunteerStatus] = useState<any[]>();
  const [socialWorker, setSocialWorker] = useState<any[]>();
  const [urgencyVisible, setUrgencyVisible] = useState<boolean>();

  const navigate = useNavigate();

  useEffect(() => {
    if (porData) {
      const jsonObj = JSON.parse(porData.volunteer_status);
      const volunteerArr: string[] = Object.values(jsonObj);
      const jsonObjsocial = JSON.parse(porData.social_worker);
      const socailArr: string[] = Object.values(jsonObjsocial);
      porform.setFieldsValue({
        houseInfo: porData?.house_info,
        // personalId: porData?.personalId,
        houseOwner: porData?.house_owner,
        houseArea: porData?.house_area,
        houseCondition: porData?.house_condition,
        hobbies: porData?.hobbies,
        carModal: porData?.car_model,
        carPlate: porData.car_plate,
        carOwner: porData?.car_owner,
        carColor: porData?.car_color,
        houseType: porData?.house_type,
        smokingStatus: porData?.smoking_status,
        VolunteerStatus: porData?.volunteer_status,
        SocialWorker: porData?.social_worker,
        drivingLicenseType: porData?.driving_license_type,
      });
      porData.volunteer_status;
      if (volunteerArr.length !== 0) {
        const resultVolunteer = volunteerArr.map((item, index) => {
          return {
            VolunteerStatus: item[index + 1],
          };
        });
        if (resultVolunteer[0].VolunteerStatus) {
          setVolunteerStatus(resultVolunteer);
          setVolunteerOn(true);
        }
      }
      if (socailArr.length !== 0) {
        const resultSocial = socailArr.map((item, index) => {
          return {
            SocialWorker: item[index + 1],
          };
        });
        if (resultSocial[0].SocialWorker) {
          setSocialWorker(resultSocial);
          setSocialWorkOn(true);
        }
      }
    }
  }, [porData, porform]);

  const [createPeopleInfo] = useMutation(CreatePeopleInfo);

  const handleSubmit = () => {
    const porData: propertyInfo[] = [];
    const baiscData: basicCreateInfo[] = [];
    const disData: disabilityInfo[] = [];
    const healthData: healthInfo[] = [];
    const politicalData: politicalInfo[] = [];
    const ecoData: economicInfo[] = [];
    let errVisible: boolean = false;
    setUrgencyVisible(false);
    porform
      ?.validateFields()
      .then(() => {
        const data: any = porform.getFieldsValue();
        let volunter: { [x: number]: string }[] = [];
        let social: { [x: number]: string }[] = [];
        data.Social?.map((item: any, index: number) => {
          social.push({
            [index + 1]: item.SocialWorker,
          });
        });
        data.Volunteer?.map((item: any, index: number) => {
          volunter.push({
            [index + 1]: item.VolunteerStatus,
          });
        });

        porData.push({
          houseInfo: data?.houseInfo,
          personalId: data?.personalId,
          houseOwner: data?.houseOwner,
          houseArea: parseInt(data?.houseArea?.toString()),
          houseCondition: data?.houseCondition,
          hobbies: data?.hobbies,
          carModal: data?.carModal,
          carPlate: data.carPlate,
          carOwner: data?.carOwner,
          carColor: data?.carOwner,
          houseType: data?.houseType,
          smokingStatus: data?.smokingStatus,
          VolunteerStatus: JSON.parse(JSON.stringify(volunter)),
          SocialWorker: JSON.parse(JSON.stringify(social)),
          drivingLicenseType: data?.drivingLicenseType,
        });
      })
      .catch(() => {
        errVisible = true;
      });
    ecomomicform
      ?.validateFields()
      .then(() => {
        const data: economicInfo = ecomomicform.getFieldsValue();
        ecoData.push({
          plantingBreeding: data?.plantingBreeding,
          plantType: data?.plantType,
          plantQuantity: parseInt(data?.plantQuantity?.toString()),
          plantArea: parseFloat(data?.plantArea?.toString()),
          breedingType: data?.breedingType,
          breedingQuantity: parseInt(data?.breedingQuantity?.toString()),
          bussinessInfo: data?.businessLocation,
          businessLocation: data?.businessLocation,
          licenseNum: data?.licenseNum,
          fireEquipmentType: data?.fireEquipmentType,
          fireEquipmentQuantity: parseInt(data?.fireEquipmentQuantity?.toString()),
          surStatus: data?.surStatus,
          surQuantity: parseInt(data?.surQuantity?.toString()),
        });
      })
      .catch(() => {
        errVisible = true;
      });
    basicform
      ?.validateFields()
      .then(() => {
        const data: basicInfo = basicform.getFieldsValue();

        baiscData.push({
          name: data?.name,
          certificateType: data?.certificateType ?? 0,
          idCard: data?.idCard,
          phone: data?.phone,
          residence: data?.residence, //
          currentAddress: data?.currentAddress,
          pinyin: data?.pinyin,
          nickname: data?.nickname, //
          formerName: data?.formerName,
          dateOfResidence: new Date(data?.dateOfResidence), //
          height: parseFloat(data?.height?.toString()),
          age: parseInt(data?.age?.toString()),
          gender: data?.gender,
          headUrl: imgSrc ?? '', //
        });
      })
      .catch(() => {
        errVisible = true;
      });
    healthform
      ?.validateFields()
      .then(() => {
        const data: healthInfo = healthform.getFieldsValue();
        healthData.push({
          childNumber: data?.childNumber,
          specialGroup: data?.specialGroup,
          healthInsurance: data?.healthInsurance,
          pensionInsurance: data?.pensionInsurance,
          vaccinationStatus: data?.vaccinationStatus,
          proofContraindication: data?.proofContraindication,
          marriageStatus: data?.marriageStatus,
          otherConditions: data?.otherConditions,
          creatorId: data?.creatorId,
          supervisorName: data?.supervisorName,
        });

        const disaility: disabilityInfo = disform.getFieldsValue();
        if (data?.specialGroup === '残疾人') {
          disData.push({
            disabilityId: disaility.disabilityId,
            disabilityType: disaility.disabilityType,
            disabilitySubsidy: parseFloat(disaility.disabilitySubsidy.toString()),
            disabilityLevel: parseInt(disaility.disabilityLevel.toString()),
            servereDisabilitySub: parseFloat(disaility.servereDisabilitySub.toString()),
          });
        }

        if (errVisible) {
          message.error('您有未完成填写的必填项');
        } else {
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
              priority: parseInt(porform.getFieldsValue().priority),
            },
            onCompleted: () => {
              message.success('已为您创建审核记录');
              // 跳回上一页面
              navigate('/population-manager/person-search');
            },
            onError: () => {
              message.error('创建审核记录失败');
            },
          });
        }
      })
      .catch(() => {
        errVisible = true;
        message.error('您有未完成填写的必填项');
      });

    eduform
      .validateFields()
      .then(() => {
        const data: politicalInfo = eduform.getFieldsValue();
        politicalData.push({
          workUnit: data?.workUnit,
          position: data?.position,
          politicalStatus: data?.politicalStatus,
          party: data?.partyOrganization,
          religion: data?.religion,
          nationality: data?.nationality,
          education: data?.education,
          militaryService: data?.militaryService,
          school: data?.school,
        });
      })
      .catch(() => {
        errVisible = true;
        if (errVisible) {
          message.error('您有未完成填写的必填项');
        }
      });
    if (errVisible) {
      message.error('您有未完成填写的必填项');
    }
    // //console.log(porData);
  };

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Basic}>
          {/* <h3>基本信息</h3> */}
          <Form labelCol={{ span: 5 }} form={porform}>
            <Row>
              <Col span={8}>
                <Form.Item name="houseInfo" label="房子信息:">
                  {/* <label className={styles.Label}>
                                                <label className={styles.Require}>*</label>
                                                房子信息：
                                            </label> */}
                  <Select style={{ width: '11vw' }}>
                    <Option key={1} value="常住户">
                      常住户
                    </Option>
                    <Option key={2} value="租房户">
                      租房户
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="houseOwner" label="房子产权人:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="houseArea" label="建筑面积:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="houseType" label="房屋类型:">
                  <Select style={{ width: '11vw' }}>
                    <Option key={1} value="危房">
                      危房
                    </Option>
                    <Option key={2} value="非危房">
                      不是危房
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="houseCondition" label="危房等级:">
                  {/* <label
                                        className={styles.Label}>
                                        危房等级：
                                    </label> */}
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="smokingStatus"
                  label="吸烟与否:"
                  // style={{ float: 'right' }}
                  rules={[
                    {
                      required: true,
                      message: '请选择相关信息！',
                    },
                  ]}
                >
                  <Select style={{ width: '15vw' }}>
                    <Option key={1} value={1}>
                      是
                    </Option>
                    <Option key={2} value={0}>
                      否
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="hobbies" label="兴趣爱好:">
                  {/* <label className={styles.Label}>曾用名：</label> */}
                  <Input placeholder="请填写" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="carModal" label="车型号:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="carOwner" label="车辆所有人:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="carPlate" label="车牌号:">
                  {/* <label className={styles.Label}>曾用名：</label> */}
                  <Input placeholder="请填写" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="carColor" label="车身颜色:">
                  <Input placeholder="请填写" style={{ width: '15vw' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={12}>
              <span>志愿者</span>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={volunteerOn}
                style={{ marginLeft: '5px', marginBottom: '1.5vh' }}
                onChange={(checked) => {
                  setVolunteerOn(checked);
                  if (!checked) {
                    porform.resetFields(['Volunteer']);
                  }
                }}
              />
              {volunteerOn ? <Volunteer form={porform} data={volunteerStatus} /> : <></>}
            </Col>
            <Col
              span={12}
              style={{
                borderLeft: '1px solid rgb(0 0 0 / 15%)',
                paddingLeft: '1vw',
              }}
            >
              {/* <Divider type='vertical'
                                    style={{ border: '1px solid rgb(0 0 0 / 15%)' }} /> */}
              <span>社工</span>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={socialWorkOn}
                style={{ marginLeft: '5px', marginBottom: '1.5vh' }}
                onChange={(checked) => {
                  setSocialWorkOn(checked);
                  if (!checked) {
                    porform.resetFields(['Social']);
                  }
                }}
              />
              {socialWorkOn ? <SocialWork form={porform} data={socialWorker} /> : <></>}
            </Col>
          </Row>
        </div>
      </div>
      {update ? (
        <></>
      ) : (
        <Button
          htmlType="submit"
          style={{ float: 'right', marginRight: '1vw' }}
          type="primary"
          onClick={() => setUrgencyVisible(true)}
        >
          保存
        </Button>
      )}

      {/* {errorVisible ? 
            <alert
                message="Error"
                description="您有未完成填写的必填项"
                type="error"
                showIcon
                banner
            // visible={}
            /> : <></>} */}

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
    </>
  );
};

export default PorpertyInfo;
