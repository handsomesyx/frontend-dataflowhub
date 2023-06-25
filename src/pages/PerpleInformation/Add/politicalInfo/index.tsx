
import type { FormInstance } from 'antd';
import { Col, Form, Input, Row, Select, } from 'antd';
import { useEffect } from 'react';

import type { EducationType } from '../../Show/Education';
import styles from '../basicInfo/styles.module.less';
import { Education, Nationality } from '../Option';
// import type { politicalInfo } from '../types';

const { Option } = Select;

type props = {
    form: FormInstance,
    politicalData?: EducationType,
}

const EducationInfo = ({ form, politicalData }: props) => {

    useEffect(() => {
        if (politicalData) {
            form.setFieldsValue({
                workUnit: politicalData?.work_unit,
                position: politicalData?.position,
                politicalStatus: politicalData?.political_status,
                partyOrganization: politicalData?.party_organization,
                religion: politicalData?.religion,
                nationality: politicalData?.nationality,
                education: politicalData?.education,
                militaryService: politicalData?.military_service,
                school: politicalData?.school,
            });
        }
    });

    return (
        <>
            <div className={styles.Container}>
                <div className={styles.Basic}>
                    <Form
                        labelCol={{ span: 6 }}
                        form={form}>
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    name="workUnit"
                                    label="工作单位:"
                                >
                                    <Input placeholder='请填写' style={{ width: '15vw' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="position"
                                    label="职务:">
                                    <Input placeholder='请填写' style={{ width: '15vw' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="religion"
                                    label='宗教信仰:'
                                >
                                    <Input placeholder='请输入' style={{ width: '15vw' }} />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    name="politicalStatus"
                                    label="政治面貌:"
                                    rules={[{
                                        required: true,
                                        message: '请选择政治面貌！'
                                    }]}>
                                    <Select style={{ width: '15vw' }}>
                                        <Option key={1} value='中共党员'>中共党员</Option>
                                        <Option key={2} value='共青团员'>共青团员</Option>
                                        <Option key={1} value='群众'>群众</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="partyOrganization"
                                    label="所属党团组织:">
                                    <Input placeholder='请填写' style={{ width: '15vw' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="nationality"
                                    label='民族:'
                                    rules={[{
                                        required: true,
                                        message: '请选择民族！'
                                    }]}>
                                    <Select style={{ width: '15vw' }}>
                                        {Nationality.map((item, index) => (
                                            <Option key={index} value={item}>{item}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    name="education"
                                    label='文化程度:'
                                    rules={[{
                                        required: true,
                                        message: '请选择文化程度！'
                                    }]}>
                                    <Select style={{ width: '15vw' }}>
                                        {Education.map((item, index) => (
                                            <Option key={index} value={item}>{item}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="militaryService"
                                    label='入伍情况:'
                                    rules={[{
                                        required: true,
                                        message: '请选择入伍情况！'
                                    }]}>
                                    <Select style={{ width: '15vw' }}>
                                        <Option key={1} value='未服兵役'>未服兵役</Option>
                                        <Option key={2} value='入伍'>入伍</Option>
                                        <Option key={3} value='退伍'>退伍</Option>

                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="school"
                                    label="毕业院校:"
                                >
                                    {/* <label
                                        className={styles.Label}>
                                        <label className={styles.Require}>*</label>
                                        残疾证编号：
                                    </label> */}
                                    <Input placeholder='请填写' style={{ width: '15vw' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </div>
            </div >
        </>
    );
};

export default EducationInfo;