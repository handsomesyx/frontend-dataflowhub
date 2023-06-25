/* eslint-disable max-len */
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { getRefreshToken, logout } from '@/store/SaveToken';

import TopIcon from '../../assets/top.svg';
import styles from './HomePage.module.less';
import Time from './Time';
import Menu from './TopMenuItem';

function HomePage() {
  const local = useLocation();

  useEffect(() => {
    if (local.pathname === '/home/index') {
      const elem = document.getElementById('headerBox');
      if (elem) {
        elem.style.background = 'none';
      }
    } else {
      const elem = document.getElementById('headerBox');
      if (elem) {
        elem.style.background = 'linear-gradient(180deg, #082366 0%, #021042 40%)';
      }
    }
  }, [local]);
  const token = getRefreshToken();
  if (!token) {
    logout();
  }
  return (
    <>
      {token ? (
        <Layout className={styles.LayoutBox}>
          <header className={styles.HeaderBox} id="headerBox">
            <img src={TopIcon} className={styles.TopIcon} />
            <div className={styles.TopBox}>
              <div>
                <span>欢迎你 ! 超级管理员</span>
                <Time></Time>
              </div>
              <div style={{ color: '#fff' }}>通知</div>
            </div>
            <Menu></Menu>
          </header>
          <Content>
            <div className={styles.ContentBox}>
              <Outlet></Outlet>
            </div>
          </Content>
        </Layout>
      ) : (
        ''
      )}
    </>
  );
}
export default HomePage;
