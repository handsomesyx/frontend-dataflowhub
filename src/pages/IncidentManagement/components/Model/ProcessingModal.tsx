/* 处理中 网格员 民警两用*/
import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';

import HandlingOpinionsModal from '@/pages/IncidentManagement/components/Model/handlingOpinionsModal';

function ProcessingModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
}) {
  // 处理中的modal 民警有一个去处理的按钮，网格员没有
  const [form] = Form.useForm();
  const [visableResult, setVisableResult] = useState(false);
  const { id, visible, disable, role } = Props;
  console.log(id);
  function handleSubmit() {
    if (role === 1) {
      console.log('这里应该弹出处理的窗口');
    }
  }
  return (
    <div>
      <Modal
        title="事件上报"
        open={visible}
        onOk={handleSubmit}
        onCancel={() => {
          Props.setVisible(false);
        }}
        footer={
          role === 2 ? null : (
            <Button
              type={'primary'}
              onClick={() => {
                Props.setVisible(false);
                setVisableResult(true);
              }}
            >
              去处理
            </Button>
          )
        }
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请填写内容' }]}
          >
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
        </Form>
      </Modal>
      <HandlingOpinionsModal
        role={role}
        id={id}
        visible={visableResult}
        setVisible={setVisableResult}
        level={Props.level}
        disable={false}
      />
    </div>
  );
}
export default ProcessingModal;
