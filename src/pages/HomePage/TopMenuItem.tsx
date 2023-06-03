import { useNavigate } from 'react-router-dom';

import MenuIcon from '../../assets/caidan_moren.svg';
import styles from './HomePage.module.less';
function MenuItem({ item, isSubMenuItem }: any) {
  const navigate = useNavigate();
  const handleItemClick = (e: any) => {
    const currentElement = e.currentTarget;
    // 获取父ul元素
    const ul = currentElement?.parentElement;
    if (isSubMenuItem) {
      navigate(item.path);
      // 获取所有的同级元素 并删除高亮样式
      const li = ul?.querySelectorAll('li');
      li.forEach((li: any) => {
        li.classList.remove('TopMenuActive');
      });

      // 添加新的高亮样式
      currentElement?.classList.add('TopMenuActive');

      // 关闭二级菜单
      ul?.classList.remove('TopSecondMenuShow');

      // 找到一级菜单内容
      const parentLi = ul?.parentElement;
      // 找到一级菜单同级的高亮样式 并清除
      const parentLiParent = parentLi?.parentElement.querySelectorAll('li');
      // 清空之前的
      parentLiParent.forEach((li: any) => {
        li.classList.remove('TopTextAndImgMove');
      });
      // 当前点击元素添加新的移动动画效果
      parentLi?.classList.add('TopTextAndImgMove');
    } else if (!item.children) {
      // 跳转路由
      navigate(item.path);
      const li = ul?.querySelectorAll('li');
      // 清空之前的
      li.forEach((li: any) => {
        li.classList.remove('TopTextAndImgMove');
      });
      // 当前点击元素添加新的移动动画效果
      currentElement?.classList.add('TopTextAndImgMove');
    }
  };

  const handleMouseEnter = (e: any) => {
    if (!isSubMenuItem) {
      const currentElement = e.currentTarget;
      const ulElement = currentElement?.querySelector('ul');
      ulElement?.classList.add('TopSecondMenuShow');
    }
  };

  const handleMouseLeave = (e: any) => {
    if (!isSubMenuItem) {
      const currentElement = e.currentTarget;
      const ulElement = currentElement?.querySelector('ul');
      ulElement?.classList?.remove('TopSecondMenuShow');
    }
  };

  return (
    // eslint-disable-next-line max-len
    item.show ? (
      // eslint-disable-next-line max-len
      <li
        onClick={handleItemClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <>
          <span>{item.text}</span>
          {item.children && (
            <>
              <img src={MenuIcon} style={{ marginLeft: '.5em' }} />
              <ul className={styles.DropdownTopMenu}>
                {item.children.map((childItem: any) => (
                  <MenuItem key={childItem.id} item={childItem} isSubMenuItem={true} />
                ))}
              </ul>
            </>
          )}
        </>
      </li>
    ) : (
      <div></div>
    )
  );
}

function Menu() {
  const menuItems = [
    {
      id: 1,
      text: '首页',
      path: '/home',
      show: true,
    },
    {
      id: 2,
      text: '用户管理',
      path: '/user-manager',
      show: true,
    },
    {
      id: 3,
      text: '人口管理',
      path: '/population-manager',
      show: true,
      children: [
        {
          id: 31,
          text: '人员管理',
          path: '/population-manager/person-management',
          show: true,
        },
        {
          id: 32,
          text: '历史数据查看',
          path: '/population-manager/history-lookOver',
          show: true,
        },
        {
          id: 33,
          text: '审核待处理',
          path: '/population-manager/pending',
          show: true,
        },
        {
          id: 34,
          text: '群众指派',
          path: '/population-manager/designate',
          show: true,
        },
        {
          id: 35,
          text: '人员信息推送',
          path: '/population-manager/information-push',
          show: true,
        },
      ],
    },
    {
      id: 4,
      text: '基础信息',
      path: '/basic-information',
      show: true,
    },
    {
      id: 5,
      text: '',
      path: '',
      show: false,
    },
    {
      id: 6,
      text: '',
      path: '',
      show: false,
    },
    {
      id: 7,
      text: '',
      path: '',
      show: false,
    },
    {
      id: 8,
      text: '',
      path: '',
      show: false,
    },
    {
      id: 9,
      text: '事件管理',
      path: '/event-management',
      show: true,
    },
    {
      id: 10,
      text: '日志记录',
      path: '/log-record',
      show: true,
    },
    {
      id: 11,
      text: '绩效查看',
      path: '/check-performance',
      show: true,
    },
    {
      id: 12,
      text: '系统设置',
      path: '/system-setting',
      show: true,
    },
  ];

  return (
    <ul className={styles.TopMenu}>
      {menuItems.map((menuItem) => (
        <MenuItem key={menuItem.id} item={menuItem} isSubMenuItem={false} />
      ))}
    </ul>
  );
}

export default Menu;
