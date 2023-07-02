/* 已完结中的操作，这里两个人都没有操作了 */
import { Form, Input, Modal, Rate, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';

function FinishModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const [form] = Form.useForm();
  const { id, visible, disable } = Props;
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
          <Form.Item label="总体" name="processTheResults">
            <Rate disabled={disable} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input disabled={disable} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default FinishModal;
