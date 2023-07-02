/* 待评价中的查看操作，网格员拥有去评价，民警无操作 */
import { Button, Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';

import AppraiseModal from '@/pages/IncidentManagement/components/Model/appraiseModal';

function TobeEvaluatedViewModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const [form] = Form.useForm();
  const [visableappraise, setVisableAppraise] = useState(false);
  const { id, visible, disable, role } = Props;
  console.log(id); // 通过这个id 获取整体信息
  console.log(Props);
  return (
    <div>
      <Modal
        title="事件评价"
        open={visible}
        onCancel={() => {
          Props.setVisible(false);
        }}
        footer={
          role === 1 ? null : (
            <Button
              type={'primary'}
              onClick={() => {
                Props.setVisible(false);
                setVisableAppraise(true);
              }}
            >
              去评价
            </Button>
          )
        }
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="内容" name="content">
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item label="图片" name="picture">
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item label="事件分类级别" name="eventClassificationLevel">
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item label="紧急程度" name="emergencyLevel" initialValue={3}>
            <Select
              style={{ width: 120 }}
              allowClear
              disabled={disable}
              options={[
                { value: 1, label: '紧急' },
                { value: 2, label: '加急' },
                { value: 3, label: '一般' },
              ]}
            />
          </Form.Item>
          <Form.Item label="上报地点" name="reportLocation">
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item label="处理结果" name="processTheResults">
            <TextArea rows={4} disabled={disable} />
          </Form.Item>
        </Form>
      </Modal>
      <AppraiseModal
        disable={false}
        setVisible={setVisableAppraise}
        visible={visableappraise}
        level={3}
        id={id}
        role={role}
      />
    </div>
  );
}
export default TobeEvaluatedViewModal;
