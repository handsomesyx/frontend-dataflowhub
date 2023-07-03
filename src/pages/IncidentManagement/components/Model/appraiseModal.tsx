/* 评价的model */
import { Button, Form, Input, message, Modal, Rate } from 'antd';

function AppraiseModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
  reloading: boolean;
  setReloading: (reloading: boolean) => void;
  updata: Function;
}) {
  const [form] = Form.useForm();
  const { id, visible, disable, role, updata } = Props;
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
                        updata({
                          variables: {
                            ModifyReportInput: {
                              id: id,
                              processing_status: '已完结',
                              ...values,
                            },
                          },
                        })
                          .then(() => {
                            Props.setVisible(false);
                            Props.setReloading(!Props.reloading);
                            message.success('评价成功');
                          })
                          .catch(() => {
                            console.log('error');
                            message.error('评价失败');
                          });
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
            name="reporter_star_rating"
            rules={[{ required: true, message: '请填写评分' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item label="备注" name="reporter_evaluate">
            <Input disabled={disable} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AppraiseModal;
