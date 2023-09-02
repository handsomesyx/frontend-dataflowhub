import { Modal } from 'antd';
import { useEffect, useState } from 'react';

import { logout } from '@/store/SaveToken';
const LogOut = () => {
  const [isOpen, setIsOpen] = useState(false);

  const showConfirm = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    logout();
    setIsOpen(false);
  };

  const handleCancel = () => {
    window.history.back();
    setIsOpen(false);
  };

  useEffect(() => {
    showConfirm();
    console.log('测试');
  }, []);
  return (
    <Modal
      title="确认退出登录"
      okText="确定"
      cancelText="取消"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>您确定要退出登录吗?</p>
    </Modal>
  );
};
export default LogOut;
