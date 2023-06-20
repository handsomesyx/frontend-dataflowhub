import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './HomePage.module.less';
function Aside() {
  // 侧边栏菜单点击效果
  useEffect(() => {
    // 获取所有的 <li> 元素
    let liElements = document.querySelectorAll('#menu li');

    // 为每个 <li> 元素添加点击事件处理程序
    liElements.forEach((li) => {
      li.addEventListener('click', function () {
        // 移除所有 <li> 元素的选中状态
        liElements.forEach((li) => {
          li.classList.remove('MenuActive');
        });

        // 添加当前点击的 <li> 元素的选中状态
        li.classList.add('MenuActive');
      });
    });
  }, []);

  // 自动配置传入参数
  // const localUrl = useLocation();
  // getItems(localUrl.pathname.split("/").slice(1).join("/"));

  return (
    <>
      {/* <aside>
        <ul id="menu">
          <li className="MenuActive">基础信息</li>
          <li>专群结合</li>
          <li>民生</li>
          <li>民政卫健</li>
          <li>政治教育</li>
          <li>生产经营情况</li>
          <li>其他情况</li>
          <li>包保人员信息</li>
        </ul>
      </aside> */}
      <div className={styles.ContentMarginLeft}>
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default Aside;
