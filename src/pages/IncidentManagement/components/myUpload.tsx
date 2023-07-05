import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
// import axios from 'axios';
import { useState } from 'react';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const MyUpload = (Props: {
  disable: boolean;
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[]) => void;
}) => {
  const { disable, fileList, setFileList } = Props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // const [fileList, setFileList] = useState<UploadFile[]>(List);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log(newFileList, 'newFileList');
    message.success('上传成功');
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  // };
  return (
    <>
      <Upload
        action="http://127.0.0.1:7000/file/upload/image" //
        method="post" // 上传方法，post或者get
        listType="picture-card" // 类型，你要是想改样式直接改这个，别瞎改
        fileList={fileList} // 这里进行表示上传拥有的本身数据
        accept="image/*" // 这里表示只接受图片的形式，例如：.png .jpg .jpeg
        disabled={disable}
        maxCount={3} // 最大限制数字，下面的length也是要写的，我希望他达到最大数之后不能再调用这个函数了
        onPreview={handlePreview} // 传输上来的文件，是个file类型，这里是进行预览的
        onChange={handleChange} // 这里是进行改变的时候，进行的操作
      >
        {fileList?.length >= 3 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="加载" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default MyUpload;
