import { useMutation, useQuery } from '@apollo/client';
import type { FormInstance } from 'antd';
import { Button, Col, Divider, Form, Input, message, Modal, Row, Select } from 'antd';
import Pinyin from 'pinyin';
import { useEffect, useState } from 'react';

import { CreateFamilyInfo, DeleteFamilyInfo, FindFamilyMember } from '@/apis';

// import type { CommonPeopleBasics } from '../../Show/BasicsInformation/CommonInfo';
import { relation } from '../Option';
import type { familyInfo, getbasicInfo } from '../types';
import ImageUpload from './imageUpload';
import ManyDataUpload from './manyDataUplaod';
import styles from './styles.module.less';

export type familyDataType = {
  id?: number;
  name?: string;
  idCard: string;
  memberRelation: string;
  phone?: string;
  householdId: string;
  personalId?: number;
  memberId?: number;
};

type props = {
  form: FormInstance;
  basicUpdateData?: getbasicInfo;
  familyUpdateData?: familyInfo[];
  update: boolean;
  imgSrc?: string;
  setImgSrc: React.Dispatch<React.SetStateAction<string | undefined>>;
};

type DebounceFn = (...args: any[]) => void;

const { Option } = Select;

const BasicInfo = ({
  form,
  basicUpdateData,
  familyUpdateData,
  update,
  imgSrc,
  setImgSrc,
}: props) => {
  const [formFamily] = Form.useForm();

  // const [idCard, setIdCard] = useState<string>('');
  const [familyData, setFamilyData] = useState<familyDataType[]>();
  const [addVisible, setAddVisible] = useState<boolean>();
  const [deleteVisible, setDeleteVisible] = useState<boolean>();
  const [memberId, setMemberId] = useState<number>();
  const [noDataVisible, setNoDataVisible] = useState<boolean>();
  const [manyVisible, setManyVisible] = useState<boolean>(false);
  const [personalId, setPersonalId] = useState<number>();

  const { data: family } = useQuery(FindFamilyMember, {
    nextFetchPolicy: 'network-only',
    fetchPolicy: 'network-only',
    // notifyOnNetworkStatusChange: true,
    variables: {
      pesonal_id: basicUpdateData?.id,
    },
  });

  const [createFamilyInfo] = useMutation(CreateFamilyInfo);
  const [deleteFamilyInfo] = useMutation(DeleteFamilyInfo);

  useEffect(() => {
    if (family?.findFamilyMemberInfo.length !== 0) {
      setFamilyData(family?.findFamilyMemberInfo);
      setNoDataVisible(false);
    }
  }, [family]);

  // 若为修改信息则将信息注入
  useEffect(() => {
    if (basicUpdateData) {
      form.setFieldsValue({
        name: basicUpdateData.name,
        idCard: basicUpdateData.id_card,
        residence: basicUpdateData.residence,
        pinyin: basicUpdateData.pinyin,
        phone: basicUpdateData.phone,
        currentAddress: basicUpdateData.current_address,
        formerName: basicUpdateData.former_name,
        nickname: basicUpdateData.nickname,
        dateOfResidence: basicUpdateData.date_of_residence,
        height: basicUpdateData?.height,
        age: basicUpdateData?.age,
        gender: basicUpdateData?.gender,
      });
      setImgSrc(basicUpdateData?.head_url);
    }
    if (familyUpdateData) {
      setFamilyData(familyUpdateData);
      setNoDataVisible(false);
    } else if (update && !familyUpdateData) {
      setNoDataVisible(true);
    }
  }, [basicUpdateData, familyUpdateData, form, setImgSrc, update]);

  const createFamilyMember = () => {
    const result = formFamily.getFieldsValue();
    const addFamilyData = {
      idCard: result.idCard,
      memberRelation: result.memberRelation,
      householdId: result.hId,
    };
    createFamilyInfo({
      variables: {
        id: basicUpdateData?.id,
        priority: parseInt(formFamily.getFieldsValue().priority),
        familyData: addFamilyData,
      },
      // awaitRefetchQueries: true,
      // refetchQueries: ['findFamilyMemberInfo'],
    })
      .then((result) => {
        console.log(result);
        if (result.data.createFamilyInfo) {
          message.success('已为您创建审核记录');
          setAddVisible(false);
          formFamily.resetFields();
        } else {
          message.error('此人暂未被创建，无法创建为家庭成员');
        }
      })
      .catch(() => {
        message.error('创建审核记录失败');
      });
  };

  const deleteFamilyMember = () => {
    deleteFamilyInfo({
      variables: {
        id: personalId,
        memberId: memberId,
        priority: parseInt(form.getFieldsValue().priority),
      },
    })
      .then(() => {
        message.success('已为您创建审核记录');
        setDeleteVisible(false);
      })
      .catch(() => {
        message.error('创建审核记录失败');
      });
  };

  // 防抖
  const debounce = (fn: DebounceFn, ms: number) => {
    let timeId: NodeJS.Timeout;
    return function (e: any) {
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        fn(e);
      }, ms);
    };
  };

  // 将姓名转换成拼音格式
  const CovertToSpell = debounce((e) => {
    const pinyin = Pinyin(e.target.value, {
      style: Pinyin.STYLE_NORMAL, // 设置拼音风格为普通风格
      heteronym: true, // 不启用多音字模式
    });
    const capitalizedPinyin = pinyin.map((word) => {
      return word[0].charAt(0).toUpperCase() + word[0].slice(1);
    });
    const result = capitalizedPinyin.join('');
    if (capitalizedPinyin) {
      form.setFieldsValue({
        pinyin: result,
      });
    }
  }, 300); // 设置防抖延迟时间为300毫秒

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Basic}>
          {/* <h3>基本信息</h3> */}
          <Button className={styles.Btn} onClick={() => setManyVisible(true)}>
            批量导入
          </Button>
          <div className={styles.FormInput}>
            <Row>
              <Col span={2}>
                <div className={styles.UploadImage}>
                  <div className={styles.Jpg}>
                    <ImageUpload imgSrc={imgSrc} setImgSrc={setImgSrc} />
                  </div>
                </div>
              </Col>
              <Col span={22}>
                <div>
                  <Form
                    labelCol={{ span: 8 }}
                    labelWrap={true}
                    // wrapperCol={{ span: 4 }}
                    form={form}
                  >
                    <Row>
                      <Col span={8}>
                        <Form.Item
                          name="name"
                          label="本人姓名:"
                          rules={[
                            {
                              required: true,
                              message: '请输入本人姓名！',
                            },
                          ]}
                        >
                          {/* <label className={styles.Label}>
                                                        <label className={styles.Require}>*</label>
                                                        本人姓名：
                                                    </label> */}
                          <Input
                            placeholder="请填写"
                            onChange={CovertToSpell}
                            style={{ width: '15vw' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="idCard"
                          label="身份证号(护照):"
                          rules={[
                            {
                              required: true,
                              message: '请输入身份证号或护照！',
                            },
                          ]}
                        >
                          {/* <label
                                                        className={styles.Label}
                                                        style={{ width: '7.5vw' }}>
                                                        <label className={styles.Require}>*</label>
                                                        身份证号(护照)：
                                                    </label> */}
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="residence"
                          label="户籍所在地:"
                          // style={{ float: 'right' }}
                          rules={[
                            {
                              required: true,
                              message: '请输入户籍所在地！',
                            },
                          ]}
                        >
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Form.Item
                          name="pinyin"
                          label="姓名拼音:"
                          rules={[
                            {
                              required: true,
                              message: '请输入姓名拼音！',
                            },
                          ]}
                        >
                          {/* <label className={styles.Label}>
                                                        <label className={styles.Require}>*</label>
                                                        姓名拼音：
                                                    </label> */}
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="phone"
                          label="联系方式:"
                          rules={[
                            {
                              required: true,
                              message: '请输入联系方式！',
                            },
                          ]}
                        >
                          {/* <label
                                                        className={styles.Label}
                                                        style={{ width: '7.5vw' }}>
                                                        <label className={styles.Require}>*</label>
                                                        联系方式：
                                                    </label> */}
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="currentAddress"
                          label="现住址:"
                          // style={{ float: 'right' }}
                          rules={[
                            {
                              required: true,
                              message: '请输入现住址！',
                            },
                          ]}
                        >
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Form.Item name="formerName" label="曾用名:">
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="nickname" label="绰号:">
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="dateOfResidence" label="何时来本地居住:">
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Form.Item name="age" label="年龄:">
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="height" label="身高:">
                          <Input placeholder="请填写" style={{ width: '15vw' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="gender" label="性别:">
                          <Select style={{ width: '15vw' }}>
                            <Option key={1} value={false}>
                              男
                            </Option>
                            <Option key={2} value={true}>
                              女
                            </Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
          <Divider style={{ border: '1px solid #F0F0F0' }} />
        </div>
        <div className={styles.Basic}>
          <h4>家庭成员</h4>
          <div className={styles.FormInput}>
            {update ? (
              <>
                <Button type="primary" onClick={() => setAddVisible(true)}>
                  添加家庭成员
                </Button>
              </>
            ) : (
              <></>
            )}
            <div className={styles.FamilyBox}>
              {familyData ? (
                familyData?.map((item: familyDataType, index: number) => {
                  return (
                    <div className={styles.FamilyBorderBox} key={index}>
                      <div>
                        <span> 家 庭 成 员 {index + 1}</span>
                      </div>
                      <div>
                        <div>
                          成员姓名：<span>{item.name}</span>
                        </div>
                        <div>
                          成员身份证号：
                          <span>{item.idCard}</span>
                        </div>
                        <div>
                          成员联系方式：<span>{item.phone}</span>
                        </div>
                      </div>
                      <div>
                        <div>
                          户号：<span>{item.householdId}</span>
                        </div>
                        <div>
                          成员与户主关系：<span>{item.memberRelation}</span>
                        </div>
                        <div>
                          <div>
                            <Button
                              onClick={() => {
                                setDeleteVisible(true);
                                setMemberId(item.personalId);
                                setPersonalId(item.personalId);
                              }}
                            >
                              删除此成员
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>请先完成所有人的信息创建，在修改信息页面中再添加家庭成员</div>
              )}
              {noDataVisible ? <div>暂无此人的家庭成员，请添加其家庭成员</div> : <></>}
            </div>
          </div>
        </div>
      </div>

      <Modal
        okText="确认"
        cancelText="取消"
        title="添加成员"
        open={addVisible}
        maskClosable
        width={1000}
        onOk={createFamilyMember}
        onCancel={() => setAddVisible(false)}
      >
        <Form labelCol={{ span: 8 }} form={formFamily}>
          <Row>
            <Col span={12}>
              <Form.Item name="idCard" label="成员身份证号:" required>
                <Input placeholder="请填写" style={{ width: '15vw' }} />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item name="relationship" label="成员与本人关系:" required>
                <Select placeholder="请选择">
                  {relation.map((item) => (
                    <Option key={item.index} value={item.relation}>
                      {item.relation}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="hId" label="户号:">
                <Input placeholder="请输入" style={{ width: '15vw' }} />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item name="priority" label="紧急程度：">
                <Input style={{ width: '15vw' }} placeholder="请输入紧急程度,如：1-3" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        okText="确认"
        cancelText="取消"
        title="删除此成员信息"
        open={deleteVisible}
        maskClosable
        // width={1000}
        onOk={deleteFamilyMember}
        onCancel={() => setDeleteVisible(false)}
      >
        <Form form={form}>
          <Form.Item name="priority" label="紧急程度：">
            <Select placeholder="请选择紧急程度">
              <Option key={1} value={1}>
                红色
              </Option>
              <Option key={2} value={2}>
                黄色
              </Option>
              <Option key={3} value={3}>
                蓝色
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {update ? (
        <></>
      ) : (
        <ManyDataUpload visible={manyVisible} setManyVisible={setManyVisible} />
      )}
    </>
  );
};

export default BasicInfo;
