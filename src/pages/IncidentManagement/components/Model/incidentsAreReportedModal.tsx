/* 事件上报添加model 网格员用 */
import { useMutation } from '@apollo/client';
import { Button, Form, Input, message, Modal, Radio, Select, Space } from 'antd';
import type { UploadFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';

import { addAnEventGridMember } from '@/apis';
import MyUpload from '@/pages/IncidentManagement/components/myUpload';
import type { eventData } from '@/pages/IncidentManagement/type';
import { dealEventData } from '@/utils/commonFunctions/dealEventData';

import HandlingOpinionsModal from '../Model/handlingOpinionsModal';

function IncidentsAreReportedModal(Props: {
  role: number;
  level: number;
  visible: boolean;
  id: number;
  disable: boolean;
  reloading: boolean;
  setVisible: (visible: boolean) => void;
  setReloading: (reloading: boolean) => void;
  data: eventData | undefined;
  updata: Function;
}) {
  // level 1 已上报，2：处理中，3：待评价，4：已完结
  // role : 1表示民警或者超级管理员 2表示网格员
  // role表示当前角色，如果是民警的话，只能查看，根据level来判断 如果是已上报拥有：已知晓，去处理, 如果是处理中，拥有：去处理，如果是待评价或者已完结，即只能查看，无操作
  // 如果是网格员，就只能进行查看，不能进行修改，除非是添加的时候才能看到
  const [form] = Form.useForm();
  const { id, visible, disable, role, setReloading, updata, reloading } = Props;
  const [visableResult, setVisableResult] = useState(false);
  const [visableHandlingOpinions, setVisableHandlingOpinions] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [addReportInfo] = useMutation(addAnEventGridMember, {
    onCompleted(data) {
      console.log(data, '添加成功');
      message.success('添加成功');
      setReloading(!reloading);
      Props.setVisible(false);
    },
    onError(error) {
      console.log(error, '添加失败');
      message.error('添加失败');
    },
  });
  useEffect(() => {
    if (Props.data) {
      const tempData = dealEventData(Props.data);
      form.setFieldsValue(tempData);
      console.log(Props.data.image_url);
      if (Props.data.image_url) {
        const uu = Props.data.image_url.split(',');
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
    if (Props.data?.issue_level === 'C') {
      setVisableHandlingOpinions(true);
    } else {
      setVisableHandlingOpinions(false);
    }
  }, [setVisableHandlingOpinions, Props, form]);

  function dealButton() {
    if (role === 1) {
      return (
        <Space>
          <Button onClick={handleCancel}>已知晓</Button>
          <Button type="primary" onClick={handleSubmit}>
            去处理
          </Button>
        </Space>
      );
    } else if (disable) {
      return null;
    } else {
      return (
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Space>
      );
    }
  }

  function handleSubmit() {
    if (role === 1) {
      Props.setVisible(false);
      setVisableResult(true);
    } else {
      form
        .validateFields()
        .then((values) => {
          console.log(fileList);
          const filTemp = fileList.map((item) => {
            return `http://${window.location.hostname}:7000/static/${item.response}`;
          });
          console.log(filTemp, 'filTemp');
          addReportInfo({
            variables: {
              addReportInput: {
                ...values,
                image_url: filTemp.toString(),
              },
            },
          });
        })
        .catch(() => {
          console.log('error');
        });
    }
  }
  function handleCancel() {
    if (role === 1) {
      updata({
        variables: {
          ModifyReportInput: {
            id: id,
            processing_status: '处理中',
          },
        },
      })
        .then(() => {
          setReloading(!reloading);
          message.success('修改成功');
        })
        .catch(() => {
          message.error('修改失败');
        });
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
        footer={dealButton()}
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
        </Form>
      </Modal>
      <HandlingOpinionsModal
        role={role}
        updata={updata}
        id={id}
        visible={visableResult}
        setVisible={setVisableResult}
        level={Props.level}
        disable={false}
        reloading={reloading}
        setReloading={setReloading}
      />
    </div>
  );
}
export default IncidentsAreReportedModal;
