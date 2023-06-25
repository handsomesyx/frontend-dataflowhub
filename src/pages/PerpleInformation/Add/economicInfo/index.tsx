
import type { FormInstance } from 'antd';
import { Col, Form, Input, Row, Switch } from 'antd';
import { useEffect, useState } from 'react';

import type { ProductionType } from '../../Show/Production';
import styles from '../basicInfo/styles.module.less';
type props = {
    form: FormInstance,
    ecoData?: ProductionType,
}
// const { Option } = Select;
const EconomicInfo = ({ form, ecoData }: props) => {

    const [plantingOn, setPlantingOn] = useState<boolean>(false);
    const [bussinessOn, setBussinessOn] = useState<boolean>(false);

    useEffect(() => {
        if (ecoData) {
            if (ecoData?.plant_type || ecoData?.breeding_type) {
                setPlantingOn(true);
                form.setFieldsValue({
                    // plantingBreeding: ecoData?.plantingBreeding,
                    plantType: ecoData?.plant_type,
                    plantQuantity: ecoData?.plant_quantity,
                    plantArea: ecoData?.plant_area,
                    breedingType: ecoData?.breeding_type,
                    breedingQuantity: ecoData?.breeding_quantity,
                });
            }
            if (ecoData?.business_info) {
                setBussinessOn(true);
                form.setFieldsValue({
                    breedingQuantity: ecoData?.breeding_quantity,
                    bussinessInfo: ecoData?.business_info,
                    businessLocation: ecoData?.business_location,
                    licenseNum: ecoData?.license_number,
                    fireEquipmentType: ecoData?.fire_equipment_type,
                    fireEquipmentQuantity: ecoData?.fire_equipment_quantity,
                    surStatus: ecoData?.surveillance_status,
                    surQuantity: ecoData?.surveillance_quantity,
                });
            }

        }
    }, [ecoData, form]);

    return (
        <>
            <div className={styles.Container}>
                <div className={styles.Basic}>
                    <Form
                        form={form}>
                        <Row style={{ margin: '2vh 0' }}>
                            <span>种植养殖情况</span>
                            <Switch
                                checked={plantingOn}
                                checkedChildren="开启"
                                unCheckedChildren="关闭"
                                style={{ marginLeft: '5px' }}
                                onChange={(checked) => {
                                    setPlantingOn(checked);
                                    if (!checked) {
                                        form.resetFields(['plantType', 'plantQuantity',
                                            'plantArea', 'breedingType',
                                            'breedingQuantity']);
                                    }
                                }} />
                        </Row>
                        {plantingOn ? <><Row>
                            <Col span={6}>
                                <Form.Item
                                    name="plantType"
                                    label="种植种类:"
                                >
                                    <Input placeholder='请填写' style={{ width: '11vw' }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="plantQuantity"
                                    label="种植数量:">
                                    <Input placeholder='请填写' style={{ width: '11vw' }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="plantArea"
                                    label="种植面积:">
                                    <Input placeholder='请填写' style={{ width: '11vw' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                            <Row>
                                <Col span={6}>
                                    <Form.Item
                                        name="breedingType"
                                        label="养殖种类:">
                                        <Input placeholder='请填写' style={{ width: '11vw' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="breedingQuantity"
                                        label="养殖数量:">
                                        <Input placeholder='请填写' style={{ width: '11vw' }} />
                                    </Form.Item>
                                </Col>
                            </Row></> : <></>}
                        <Row style={{ margin: '2vh 0' }}>
                            <span>营商情况</span>
                            <Switch
                                checked={bussinessOn}
                                checkedChildren="开启"
                                unCheckedChildren="关闭"
                                style={{ marginLeft: '5px' }}
                                onChange={(checked) => {
                                    setBussinessOn(checked);
                                    if (!checked) {
                                        form.resetFields(['bussinessInfo', 'businessLocation',
                                            'licenseNum', 'fireEquipmentType',
                                            'fireEquipmentQuantity', 'surStatus', 'surQuantity']);
                                    }
                                }} />

                        </Row>
                        {bussinessOn ?
                            <><Row>
                                <Col span={12}>
                                    <Form.Item
                                        name="bussinessInfo"
                                        label='商户名称:'
                                    >
                                        <Input placeholder='请输入' style={{ width: '29vw' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            name="businessLocation"
                                            label='门面位置:'
                                        >
                                            <Input placeholder='请输入' style={{ width: '29vw' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="licenseNum"
                                            label='营业执照编号:'>
                                            <Input placeholder='请输入' style={{ width: '28vw' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <Form.Item
                                            name="fireEquipmentType"
                                            label='门面消防设备类型:'>
                                            <Input placeholder='请输入' style={{ width: '10vw' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name="fireEquipmentQuantity"
                                            label='门面消防设备数量:'>
                                            <Input placeholder='请填写' style={{ width: '7.6vw' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name="surStatus"
                                            label='门面电子监控状态:'>
                                            <Input placeholder='请输入' style={{ width: '10vw' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name="surQuantity"
                                            label='门面电子监控数量:'>
                                            <Input placeholder='请填写' style={{ width: '7.6vw' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </> : <></>}




                    </Form>
                </div>
            </div >
        </>
    );
};

export default EconomicInfo;
