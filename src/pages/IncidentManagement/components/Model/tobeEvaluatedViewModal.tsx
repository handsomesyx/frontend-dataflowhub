/* 待评价中的查看操作，网格员拥有去评价，民警无操作 */
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import type { UploadFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';

import AppraiseModal from '@/pages/IncidentManagement/components/Model/appraiseModal';
import MyUpload from '@/pages/IncidentManagement/components/myUpload';
import type { eventData } from '@/pages/IncidentManagement/type';
import { dealEventData } from '@/utils/commonFunctions/dealEventData';

function TobeEvaluatedViewModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
  data: eventData;
  updata: Function;
  reloading: boolean;
  setReloading: (reloading: boolean) => void;
}) {
  const [form] = Form.useForm();
  const [visableappraise, setVisableAppraise] = useState(false);
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
  console.log(id); // 通过这个id 获取整体信息
  console.log(Props);
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
  return (
    <div>
      <Modal
        forceRender
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
          <Form.Item label="处理结果" name="police_opinion">
            <TextArea rows={4} disabled={disable} />
          </Form.Item>
        </Form>
      </Modal>
      <AppraiseModal
        reloading={Props.reloading}
        setReloading={Props.setReloading}
        updata={Props.updata}
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
