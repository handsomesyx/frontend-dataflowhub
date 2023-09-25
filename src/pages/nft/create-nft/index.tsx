import './index.less';

import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { useState } from 'react';

const { Option } = Select;

// const formLayout = {
//   wrapperCol: { span: 24 },
//   labelCol: { span: 24 },
// };

// 创建NFT
function CreateNFT() {
  const [loading] = useState(false);
  const [imageUrl] = useState<string>();

  // 上传图片
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: '1%' }}>Upload</div>
    </div>
  );

  // 上传文件
  const props: UploadProps = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // 输入表单
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className="nft-create-container">
      {/* 上半部分：头部导航 */}
      <div className="nft-create-top">
        <div className="nft-create-nft-first">
          <div style={{ color: 'gray' }}>
            NFT <RightOutlined />
          </div>
          <div style={{ paddingLeft: '6px' }}>创建NFT</div>
        </div>
        <div className="nft-create-top-second">创建NFT</div>
      </div>
      {/* 下半部分：NFT创建区 */}
      <div className="nft-create-bottom">
        <div className="nft-create-upload">
          <div style={{ height: '22px' }}>
            <span>
              <span style={{ color: 'red' }}>*</span>
              Required fields 图像、视频、音频或三维模型
            </span>
          </div>
          <div style={{ display: 'flex', height: '105px' }}>
            <div>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '7%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </div>
            <div>
              <div style={{ paddingTop: '20px' }}>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload>
              </div>
              <div style={{ paddingTop: '10px' }}>可拖拽图片到左侧区域上传</div>
            </div>
          </div>
          <div style={{ height: '44px', color: 'gray' }}>
            <span>
              File types supported: JPG, PGN, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB,
              GLTF.
            </span>
            <br />
            <span>Max size: 100MB</span>
          </div>
        </div>
        <div className="nft-create-input">
          <Form
            form={form}
            onFinish={onFinish}
            style={{ width: 450 }}
            layout="vertical"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
          >
            <Form.Item
              name="name"
              label="名称"
              rules={[{ required: true }]}
              style={{ marginBottom: '5px' }}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name="describe"
              label="描述"
              rules={[{ required: true }]}
              style={{ marginBottom: '5px' }}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true }]}
              style={{ marginBottom: '5px' }}
            >
              <Select placeholder="请选择" allowClear>
                <Option value="nft">NFT</Option>
                <Option value="other">消息</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="label"
              label="标签"
              rules={[{ required: true }]}
              style={{ marginBottom: '5px' }}
            >
              <Select placeholder="请选择" allowClear>
                <Option value="nft">NFT</Option>
                <Option value="other">消息</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="supply"
              label="供应量"
              rules={[{ required: true }]}
              style={{ marginBottom: '15px' }}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateNFT;
