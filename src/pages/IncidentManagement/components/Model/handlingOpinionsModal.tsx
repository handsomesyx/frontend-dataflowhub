/* 事件处理model 民警用 */
import { Button, Form, message, Modal, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';

function HandlingOpinionsModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  reloading: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
  setReloading: (reloading: boolean) => void;
  updata: Function;
}) {
  const [form] = Form.useForm();
  const { id, visible, disable, role, updata } = Props;
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
                  updata({
                    variables: {
                      ModifyReportInput: {
                        id: id,
                        processing_status: '待评价',
                        police_opinion: form.getFieldValue('police_opinion'),
                      },
                    },
                  })
                    .then(() => {
                      form.setFieldValue('police_opinion', '');
                      Props.setVisible(false);
                      Props.setReloading(true);
                      message.success('修改成功');
                    })
                    .catch(() => {
                      message.error('修改失败');
                    });
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
            name="police_opinion"
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
