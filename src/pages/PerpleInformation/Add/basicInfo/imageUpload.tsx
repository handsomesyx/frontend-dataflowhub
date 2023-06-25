import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import type { RcFile, UploadFile, } from 'antd/es/upload';
import { useEffect, useState } from 'react';

type props = {
    imgSrc?: string,
    setImgSrc: (e: string) => void,
}


const ImageUpload = ({ imgSrc, setImgSrc }: props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>();
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        if (imgSrc) {
            setPreviewImage(imgSrc);
        }
    }, [imgSrc]);

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        setFileList([...fileList, file]);
        handleUpload(file);
        return false;
    };

    const handleUpload = (file: Blob) => {
        const a = URL.createObjectURL(file);
        setImageUrl(a);
        setLoading(true);
        getBase64(file as RcFile, (url) => {
            setLoading(false);
            setImageUrl(url);
            setImgSrc(url);
        });
    };

    const handlePreview = async (file: UploadFile) => {
        setPreviewImage(imageUrl);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleCancel = () => {
        setPreviewOpen(false);
    };

    const handleRemove = (file: UploadFile) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
        setImgSrc('');
    };

    return (
        <>
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                // showUploadList={false}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onRemove={handleRemove}
                accept='.png,.jpg'
            // onChange={handleChange}
            >
                {fileList.length >= 1 ? null : uploadButton}

            </Upload>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default ImageUpload;