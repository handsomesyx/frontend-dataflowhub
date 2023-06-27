import { useEffect } from 'react';

import { logout } from '@/store/SaveToken';

const LogOut = () => {
  useEffect(() => {
    logout();
  }, []);
  return <></>;
};

export default LogOut;
