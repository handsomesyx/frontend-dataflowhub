import type { FormInstance } from 'antd';
import { Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

import styles from '../basicInfo/styles.module.less';
import { SpecialGroup } from '../Option';
import type { getdisabilityInfo, getHealthInfo } from '../types';

const { Option } = Select;

type props = {
  form: FormInstance;
  healthData?: getHealthInfo;
  disData?: getdisabilityInfo;
  disform: FormInstance;
};
const HealthInfo = ({ form, healthData, disData, disform }: props) => {
  const [openDis, setOpenDis] = useState<boolean>(false);

  useEffect(() => {
    if (healthData) {
      form.setFieldsValue({
        children: healthData?.child_number,
        specialGroup: healthData?.special_group,
        // remarkOne: healthData?.remarkOne,
        // remarkTow: healthData?.remarkTow,
        healthInsurance: healthData?.health_insurance,
        pensionInsurance: healthData?.pension_insurance,
        vaccinationStatus: healthData?.vaccination_status,
        proofContraindication: healthData?.proof_contraindication,
        marriageStatus: healthData?.marriage_status,
        otherConditions: healthData?.other_conditions,
        // creatorId: healthData?.creatorId,
        supervisorName: healthData?.supervisor_name,
        // supervisorName: healthData?.supervisor_name,
      });
    }
    if (disData) {
      setOpenDis(true);
      disform.setFieldsValue({
        disabilityId: disData.disability_id,
        disabilityType: disData.disability_type,
        disabilitySubsidy: disData.disability_subsidy,
        disabilityLevel: disData.disability_level,
        servereDisabilitySub: disData.severe_disability_subsidy,
      });
    }
  }, [healthData, disData, form, disform]);

  const openDisability = (e: any) => {
    if (e === '残疾人') {
      setOpenDis(true);
    } else {
      setOpenDis(false);
      form.resetFields([
        'disabilityId',
        'disabilityType',
        'disabilitySubsidy',
        'disabilityLevel',
        'servereDisabilitySub',
      ]);
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Basic}>
          <Form labelCol={{ span: 8 }} labelWrap={true} form={form}>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="marriageStatus"
                  label="婚姻状态:"
                  rules={[
                    {
                      required: true,
                      message: '请选择婚姻状态！',
                    },
                  ]}
                >
                  <Select style={{ width: '11vw' }}>
                    <Option key={1} value="未婚">
                      未婚
                    </Option>
                    <Option key={2} value="已婚">
                      已婚
                    </Option>
                    <Option key={1} value="离异">
                      离异
                    </Option>
                    <Option key={1} value="丧偶">
                      丧偶
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="children" label="生育子女数量:">
                  <Input placeholder="请填写" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="healthInsurance" label="医疗保险情况:">
                  <Select style={{ width: '11vw' }}>
                    <Option key={1} value="职工保险">
                      职工保险
                    </Option>
                    <Option key={2} value="社会保险">
                      社会保险
                    </Option>
                    <Option key={1} value="个人保险">
                      个人保险
                    </Option>
                    <Option key={1} value="无">
                      无
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="pensionInsurance" label="养老保险情况:">
                  <Select style={{ width: '11vw' }}>
                    <Option key={1} value="职工保险">
                      职工保险
                    </Option>
                    <Option key={2} value="社会保险">
                      社会保险
                    </Option>
                    <Option key={1} value="个人保险">
                      个人保险
                    </Option>
                    <Option key={1} value="无">
                      无
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form labelCol={{ span: 4 }} form={form}>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="vaccinationStatus"
                  label="疫苗接种情况:"
                  rules={[
                    {
                      required: true,
                      message: '请选择疫苗接种情况！',
                    },
                  ]}
                >
                  <Input placeholder="请输入" style={{ width: '29vw' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="proofContraindication" label="禁忌证明:">
                  <Input placeholder="请输入" style={{ width: '31vw' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form labelCol={{ span: 8 }} labelWrap={true} form={form}>
            <Row>
              <Col span={6}>
                <Form.Item name="otherConditions" label="民政卫健其他情况:">
                  <Input placeholder="请输入" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="specialGroup" label="特殊人群:">
                  <Select style={{ width: '11vw' }} allowClear onChange={openDisability}>
                    {SpecialGroup.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="监管人姓名:"
                  name="supervisorName"
                  // rules={[{
                  //     required: true,
                  //     message: '请输入监管人！'
                  // }]
                  // }
                >
                  {/* <label
                                        className={styles.Label}>
                                        <label className={styles.Require}>*</label>
                                        监管人：
                                    </label> */}
                  <Input placeholder="请填写" style={{ width: '11vw' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {openDis ? (
            <>
              <Form form={disform}>
                <Row>
                  <Col span={6}>
                    <Form.Item
                      name="disabilityId"
                      label="残疾证编号:"
                      // rules={[{
                      //     required: true,
                      //     message: '请输入现住址！'
                      // }]}
                    >
                      {/* <label
                                        className={styles.Label}>
                                        <label className={styles.Require}>*</label>
                                        残疾证编号：
                                    </label> */}
                      <Input placeholder="请输入" style={{ width: '11vw' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="disabilityType" label="残疾类型:">
                      <Input placeholder="请填写" style={{ width: '11vw' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="disabilitySubsidy" label="困难残疾人生活补贴:">
                      <Input placeholder="请填写" style={{ width: '11vw' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <Form.Item name="disabilityLevel" label="残疾级别:">
                      <Input
                        placeholder="请填写残疾级别为:1-10"
                        style={{ width: '11vw' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="servereDisabilitySub" label="重度残疾人护理补贴:">
                      <Input placeholder="请填写" style={{ width: '11vw' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default HealthInfo;
