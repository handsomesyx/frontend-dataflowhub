/* 处理中 网格员 民警两用*/
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import type { UploadFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';

import HandlingOpinionsModal from '@/pages/IncidentManagement/components/Model/handlingOpinionsModal';
import MyUpload from '@/pages/IncidentManagement/components/myUpload';
import type { eventData } from '@/pages/IncidentManagement/type';
import { dealEventData } from '@/utils/commonFunctions/dealEventData';

function ProcessingModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
  data: eventData | undefined;
}) {
  // 处理中的modal 民警有一个去处理的按钮，网格员没有
  const [form] = Form.useForm();
  const [visableResult, setVisableResult] = useState(false);
  const [visableHandlingOpinions, setVisableHandlingOpinions] = useState(false);
  const { id, visible, disable, role, data } = Props;
  const List: UploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ];
  console.log(id);
  useEffect(() => {
    if (data) {
      const tempData = dealEventData(data);
      form.setFieldsValue(tempData);
    }
    if (data?.issue_level === 'C') {
      setVisableHandlingOpinions(true);
    } else {
      setVisableHandlingOpinions(false);
    }
  }, [setVisableHandlingOpinions, data, form]);
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
            name="classification_basis"
            rules={[{ required: true, message: '请填写内容' }]}
          >
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item label="图片" name="image_url">
            <MyUpload disable={false} List={List} />
          </Form.Item>
          <Form.Item
            label="事件分类级别"
            name="issue_level"
            initialValue="NEIGHBORHOOD_DISPUTE"
          >
            <Radio.Group disabled={disable}>
              <Radio
                value="NEIGHBORHOOD_DISPUTE"
                onClick={() => {
                  setVisableHandlingOpinions(false);
                }}
              >
                A
              </Radio>
              <Radio
                value="PETITION"
                onClick={() => {
                  setVisableHandlingOpinions(false);
                }}
              >
                B
              </Radio>
              <Radio
                value="NORMAL_DEMAND"
                onClick={() => {
                  setVisableHandlingOpinions(true);
                }}
              >
                C
              </Radio>
            </Radio.Group>
          </Form.Item>
          {visableHandlingOpinions ? (
            <Form.Item
              label="群众需求"
              name="public_demand"
              rules={[{ required: true, message: '请填写群众需求' }]}
            >
              <Input disabled={disable} />
            </Form.Item>
          ) : null}
          {visableHandlingOpinions ? (
            <Form.Item
              label="群众建议"
              name="public_opinion"
              rules={[{ required: true, message: '请填写群众建议' }]}
            >
              <Input disabled={disable} />
            </Form.Item>
          ) : null}
          <Form.Item label="紧急程度" name="priority" initialValue="NORMAL">
            <Select
              style={{ width: 120 }}
              disabled={disable}
              options={[
                { value: 'CRITICAL', label: '紧急' },
                { value: 'URGENT', label: '加急' },
                { value: 'NORMAL', label: '一般' },
              ]}
            />
          </Form.Item>
          <Form.Item label="上报地点" name="report_address">
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
