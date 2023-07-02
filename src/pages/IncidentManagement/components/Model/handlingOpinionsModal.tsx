/* 事件处理model 民警用 */
import { Button, Form, Modal, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';

function HandlingOpinionsModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const [form] = Form.useForm();
  const { id, visible, disable, role } = Props;
  console.log(id);
  return (
    <div>
      <Modal
        title="事件处理"
        open={visible}
        onCancel={() => {
          Props.setVisible(false);
        }}
        footer={
          role === 2 ? null : (
            <Space>
              <Button
                onClick={() => {
                  Props.setVisible(false);
                }}
              >
                取消
              </Button>
              <Button
                type={'primary'}
                onClick={() => {
                  console.log(id, '这里应该插入处理结果id');
                }}
              >
                提交
              </Button>
            </Space>
          )
        }
      >
        <Form form={form}>
          <div style={{ marginTop: '20px' }}>处理结果:</div>
          <Form.Item
            label=""
            name="processTheResults"
            rules={[{ required: true, message: '请填写结果' }]}
          >
            <TextArea rows={4} disabled={disable} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default HandlingOpinionsModal;
