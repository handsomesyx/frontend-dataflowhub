import { Modal } from 'antd';
import { useEffect } from 'react';

import { logout } from '@/store/SaveToken';

const LogOut = () => {
  const showConfirm = () => {
    Modal.confirm({
      title: '确认退出登录',
      content: '您确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
      },
      onCancel: () => {
        window.history.back(); // 回退到上一个页面
      },
    });
  };
  useEffect(() => {
    showConfirm();
    console.log('测试');
  }, []);
  return null;
};
export default LogOut;
