/* 事件上报添加model 网格员用 */
import { Form, Input, Modal, Select } from 'antd';
import type { UploadFile } from 'antd/es/upload';
import { useState } from 'react';

import HandlingOpinionsModal from '@/pages/IncidentManagement/components/Model/handlingOpinionsModal';
import MyUpload from '@/pages/IncidentManagement/components/myUpload';

function IncidentsAreReportedModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  setVisible: (visible: boolean) => void;
}) {
  // level 1 已上报，2：处理中，3：待评价，4：已完结
  // role : 1表示民警或者超级管理员 2表示网格员
  // role表示当前角色，如果是民警的话，只能查看，根据level来判断 如果是已上报拥有：已知晓，去处理, 如果是处理中，拥有：去处理，如果是待评价或者已完结，即只能查看，无操作
  // 如果是网格员，就只能进行查看，不能进行修改，除非是添加的时候才能看到
  const [form] = Form.useForm();
  const { id, visible, disable, role } = Props;
  const [visableResult, setVisableResult] = useState(false);
  const List: UploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ];
  console.log(id);
  function handleSubmit() {
    if (role === 1) {
      Props.setVisible(false);
      setVisableResult(true);
      console.log('这里应该弹出处理的窗口');
    } else {
      form
        .validateFields()
        .then((values) => {
          console.log(values);
          Props.setVisible(false);
        })
        .catch(() => {
          console.log('error');
        });
    }
  }
  function handleCancel() {
    if (role === 1) {
      console.log('该民警已经知晓');
      Props.setVisible(false);
    } else {
      Props.setVisible(false);
    }
  }
  return (
    <div>
      <Modal
        title="事件上报"
        open={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        cancelText={role === 1 ? '已知晓' : '取消'}
        okText={role === 1 ? '去处理' : '提交'}
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
            <MyUpload disable={false} List={List} />
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
export default IncidentsAreReportedModal;
