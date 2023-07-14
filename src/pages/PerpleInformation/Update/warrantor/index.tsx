import { SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Form,
  type FormInstance,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FindUser, UpdatePeopleInfo } from '@/apis';

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

const { Option } = Select;

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
  // const [errorVisible, setErrorVisibile] = useState<Boolean>(false);

  const [updatePeopleInfo] = useMutation(UpdatePeopleInfo);
  const [urgencyVisible, setUrgencyVisible] = useState<boolean>();

  // 网格员信息
  const [gridperson, setGridperson] = useState(false);
  // 用户名字
  const [searchName, setSearchName] = useState('');
  // 用户角色
  const [searchRole, setSearchRole] = useState('');
  // 用户ID
  const [userid, setUserID] = useState<number>();
  // 搜索的用户信息
  const [informationRole, setInformationRole] = useState();

  const navigate = useNavigate();

  const columnsRole: any = [
    {
      title: '姓名',
      dataIndex: 'real_name',
      key: 'real_name',
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '身份证号',
      dataIndex: 'id_card',
      key: 'id_card',
    },
    {
      title: '操作',
      key: 'action',
      render: (value: any) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSearchName('');
              setUserID(value.id);
              setGridperson(false);
            }}
          >
            选择
          </Button>
        </Space>
      ),
    },
  ];

  // 用户数据
  const { data: searchNamedata } = useQuery(FindUser, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      name: searchName,
      role: searchRole,
    },
  });

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
      if (warData.gridPersonId) {
        setUserID(Number(warData.gridPersonId));
      }
    }
  }, [warData, warform]);

  useEffect(() => {
    if (searchNamedata) {
      setInformationRole(searchNamedata.findUser);
    }
  }, [searchNamedata]);

  const handleSubmit = () => {
    const porData: propertyInfo[] = [];
    const baiscData: basicInfo[] = [];
    const disData: disabilityInfo[] = [];
    const healthData: healthInfo[] = [];
    const politicalData: politicalInfo[] = [];
    const ecoData: economicInfo[] = [];
    // const warrantorData: WarrantorType[] = [];
    const changeRecord: changeInfo[] = [];
    setUrgencyVisible(false);
    let errVisible: boolean = false;
    porform
      ?.validateFields()
      .then(() => {
        const data: propertyInfo = porform.getFieldsValue();
        let volunter: { [x: number]: string }[] = [];
        let social: { [x: number]: string }[] = [];
        data?.Social?.map((item: any, index: number) => {
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
          VolunteerStatus: JSON.parse(JSON.stringify(volunter)),
          SocialWorker: JSON.parse(JSON.stringify(social)),
          drivingLicenseType: data?.drivingLicenseType,
          creatorId: data?.creatorId,
        });

        let afterData = Object.values(data);
        let beforeData = Object.values(OtherInfoData);

        beforeData.map((item, index) => {
          if (item !== afterData[index]) {
            if (index < 11) {
              changeRecord.push({
                changeItem: proName[index],
                ItemName: proItem[index],
                contentBefore: afterData[index].toString(),
                contentAfter: item.toString(),
              });
            }

            if (index === 11 && item !== JSON.stringify(volunter)) {
              changeRecord.push({
                changeItem: proName[index],
                ItemName: proItem[index],
                contentBefore: item.toString(),
                contentAfter: JSON.stringify(volunter),
              });
            }
            if (index === 12 && item !== JSON.stringify(social)) {
              changeRecord.push({
                changeItem: proName[index],
                ItemName: proItem[index],
                contentBefore: item.toString(),
                contentAfter: JSON.stringify(social),
              });
            }
          }
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
      .catch(() => {
        errVisible = true;
      });
    basicform
      ?.validateFields()
      .then(() => {
        const data: basicInfo = basicform.getFieldsValue();
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
        afterData.map((item, index) => {
          if (item.toString() !== beforeData[index + 2].toString()) {
            if (beforeData[index + 2]) {
              changeRecord.push({
                changeItem: baiscName[index],
                ItemName: baiscItem[index],
                contentBefore: beforeData[index + 2].toString(),
                contentAfter: item.toString(),
              });
            } else {
              changeRecord.push({
                changeItem: baiscName[index],
                ItemName: baiscItem[index],
                contentBefore: 'null',
                contentAfter: item.toString(),
              });
            }
          }
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

          const disailityAfterData = Object.values(disaility);

          const disailitybeforeData = Object.values(disUpdateData);
          disailityAfterData.map((item, index) => {
            if (item !== disailitybeforeData[index]) {
              changeRecord.push({
                changeItem: disName[index],
                ItemName: disItem[index],
                contentBefore: disailitybeforeData[index].toString(),
                contentAfter: item.toString(),
              });
            }
          });
        }

        const afterData = Object.values(data);

        const beforeData = Object.values(HealthInfoData);

        beforeData.map((item, index) => {
          if (index < 9) {
            if (item !== afterData[index]) {
              changeRecord.push({
                changeItem: healthName[index],
                ItemName: healthItem[index],
                contentAfter: afterData[index].toString(),
                contentBefore: item.toString(),
              });
            }
          }
        });
      })
      .catch(() => {
        errVisible = true;
      });

    eduform
      .validateFields()
      .then(() => {
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
              contentBefore: beforeData[index],
              contentAfter: item.toString(),
            });
          }
        });

        if (changeRecord.length !== 0) {
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
              navigate('/population-manager/person-search');
            },
            onError: () => {
              message.error('创建审核记录失败');
            },
          });
        } else {
          message.warning('您未修改任何信息');
        }
      })
      .catch(() => {
        errVisible = true;
      });

    warform
      .validateFields()
      .then(() => {
        // console.log('w');

        if (userid !== warData.gridPersonId) {
          changeRecord.push({
            ItemName: 'grid_user_id',
            changeItem: '网格员编号',
            contentBefore: warData.gridPersonId?.toString() ?? '',
            contentAfter: userid ? userid.toString() : '',
          });
        }
        // console.log(changeRecord);
      })
      .catch(() => {
        errVisible = true;
      });
    if (errVisible) {
      message.error('您有未完成填写的必填项');
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Basic}>
          <Form form={warform}>
            <Form.Item name="gridPersonName" label="网格员">
              <Input
                placeholder="请输入网格员名称"
                style={{ width: '20vw' }}
                suffix={
                  <SearchOutlined
                    onClick={() => {
                      let name = warform.getFieldValue('gridPersonName');
                      if (!name) {
                        message.info('请输入网格员名称');
                        return;
                      }
                      let role = '网格员';
                      setGridperson(true);
                      setSearchName(name);
                      setSearchRole(role);
                    }}
                  />
                }
              />
            </Form.Item>
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
        // style={{z-index:"1"}}
        zIndex={1}
        title={'网格员信息'}
        open={gridperson}
        centered
        onCancel={() => {
          setSearchName('');
          setGridperson(false);
        }}
        footer={null}
      >
        <Table
          // style={{ overflow: 'hidden' }}
          columns={columnsRole}
          dataSource={informationRole}
        />
      </Modal>
    </>
  );
};

export default Warrantor;
