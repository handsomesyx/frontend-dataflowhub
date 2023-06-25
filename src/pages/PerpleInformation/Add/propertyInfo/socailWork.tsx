import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Col, Form, Input, Row, Space } from 'antd';
import { useEffect } from 'react';

type props = {
    form: FormInstance,
    data?: string[]
}
const SocialWork = ({ form, data }: props) => {

    useEffect(() => {
        if (data) {
            Array(data);
        }
    });
    return (
        <Form form={form}>
            <Form.List name="Social" initialValue={[{}]}>
                {(fields, { add, remove }) => {
                    return (
                        <>
                            {fields.map(({ key, name, ...restField }) =>
                            (<div key={key}>
                                <Row>
                                    <Col span={24} >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'SocialWorker']}
                                            style={{ float: 'left' }}
                                            label="社工服务记录:"
                                            required>
                                            <Input
                                                placeholder='请填写'
                                                style={{ width: '26vw' }}
                                            />
                                        </Form.Item>
                                        {fields.length > 1 && (
                                            <Form.Item {...restField}
                                                style={{ float: 'left', marginLeft: '1vw' }}>
                                                <a
                                                    onClick={() => {
                                                        remove(name);
                                                    }}
                                                    style={{ color: 'black' }}
                                                >
                                                    <CloseCircleOutlined />
                                                </a>
                                            </Form.Item>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                            ))}
                            <Form.Item style={{ marginTop: '-10px' }} key={999}>
                                <a
                                    onClick={() => {
                                        add();
                                    }}
                                >
                                    <Space>
                                        <PlusOutlined />
                                        继续添加
                                    </Space>
                                </a>
                            </Form.Item>
                        </>
                    );
                }}
            </Form.List>
        </Form>
    );
};

export default SocialWork;