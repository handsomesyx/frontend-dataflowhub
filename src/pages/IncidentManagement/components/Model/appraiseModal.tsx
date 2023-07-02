/* 评价的model */
import { Button, Form, Input, Modal, Rate } from 'antd';

function AppraiseModal(Props: {
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
        title="评价"
        open={visible}
        onCancel={() => {
          Props.setVisible(false);
        }}
        footer={
          role === 2
            ? [
                <Button
                  key="cancel"
                  onClick={() => {
                    Props.setVisible(false);
                  }}
                >
                  取消
                </Button>,
                <Button
                  key="submit"
                  type={'primary'}
                  onClick={() => {
                    form
                      .validateFields()
                      .then((values) => {
                        console.log(values);
                        Props.setVisible(false);
                      })
                      .catch(() => {
                        console.log('error');
                      });
                  }}
                >
                  提交
                </Button>,
              ]
            : null
        }
      >
        <Form form={form}>
          <Form.Item
            label="总体"
            name="processTheResults"
            rules={[{ required: true, message: '请填写评分' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input disabled={disable} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AppraiseModal;
