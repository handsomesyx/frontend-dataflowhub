/* 已完结中的操作，这里两个人都没有操作了 */
import { Form, Input, Modal, Radio, Rate, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import type { UploadFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';

import MyUpload from '@/pages/IncidentManagement/components/myUpload';
import type { eventData } from '@/pages/IncidentManagement/type';
import { dealEventData } from '@/utils/commonFunctions/dealEventData';

function FinishModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
  data: eventData;
}) {
  const [form] = Form.useForm();
  const { id, visible, disable, data } = Props;
  const [visableHandlingOpinions, setVisableHandlingOpinions] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    if (data) {
      const tempData = dealEventData(data);
      form.setFieldsValue(tempData);
      console.log(data.image_url);
      if (data.image_url) {
        const uu = data.image_url.split(',');
        const tempFileList: UploadFile[] = uu.map((item: string, index: number) => {
          return {
            uid: `${item}-${index}`,
            name: item,
            status: 'done',
            url: item,
            response: item,
          };
        });
        setFileList(tempFileList);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
    if (data?.issue_level === 'C') {
      setVisableHandlingOpinions(true);
    } else {
      setVisableHandlingOpinions(false);
    }
  }, [setVisableHandlingOpinions, data, form]);
  console.log(id); // 通过这个id 获取整体信息
  console.log(Props);
  return (
    <div>
      <Modal
        title="事件完结"
        open={visible}
        onCancel={() => {
          Props.setVisible(false);
        }}
        footer={null}
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
            <MyUpload disable={disable} fileList={fileList} setFileList={setFileList} />
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
          <Form.Item label="总体" name="reporter_star_rating">
            <Rate disabled={disable} />
          </Form.Item>
          <Form.Item label="备注" name="reporter_evaluate">
            <Input disabled={disable} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default FinishModal;
