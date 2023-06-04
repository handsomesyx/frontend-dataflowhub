/* eslint-disable max-len */
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

import TopIcon from '../../assets/top.svg';
import styles from './HomePage.module.less';
import Time from './Time';
import Menu from './TopMenuItem';

function HomePage() {
  return (
    <>
      <Layout className={styles.LayoutBox}>
        <header className={styles.HeaderBox}>
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
    </>
  );
}
export default HomePage;
