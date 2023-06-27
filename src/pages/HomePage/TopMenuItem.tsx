import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import MenuIcon from '../../assets/caidan_moren.svg';
import styles from './HomePage.module.less';
function MenuItem({ item, isSubMenuItem }: any) {
  const navigate = useNavigate();
  const handleItemClick = () => {
    if (isSubMenuItem) {
      navigate(item.path);
    } else if (!item.children) {
      // 跳转路由
      navigate(item.path);
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

  return item.show ? (
    <li
      onClick={handleItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={item.id + 'go_back'}
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
  );
}

function Menu() {
  const menuItems = [
    {
      id: '1',
      text: '首页',
      path: '/home',
      show: true,
      children: [
        {
          id: '1-1',
          text: '搜索',
          path: '/home/index',
          show: true,
        },
        {
          id: '1-2',
          text: '可视化',
          path: '/home/te',
          show: true,
        },
      ],
    },
    {
      id: '2',
      text: '用户管理',
      path: '/user-manager',
      show: true,
    },
    {
      id: '3',
      text: '人口管理',
      path: '/population-manager',
      show: true,
      children: [
        {
          id: '3-1',
          text: '人员管理',
          path: '/population-manager/person-search',
          show: true,
        },
        {
          id: '3-2',
          text: '历史数据查看',
          path: '/population-manager/history-lookOver',
          show: true,
        },
        {
          id: '3-3',
          text: '审核模块',
          path: '/population-manager/pending',
          show: true,
        },
        {
          id: '3-4',
          text: '展示（暂时）',
          path: '/population-manager/person-show',
          show: true,
        },
        // {
        //   id: '3-5',
        //   text: '人员信息推送',
        //   path: '/population-manager/information-push',
        //   show: true,
        // },
      ],
    },
    {
      id: '4',
      text: '基础信息',
      path: '/basic-information',
      show: true,
      children: [
        {
          id: '4-1',
          text: '行政区域管理',
          path: '/basic-information/administrativeRegion',
          show: true,
        },
        // {
        //   id: '4-2',
        //   text: '网格区域管理',
        //   path: '/basic-information/gridArea',
        //   show: true,
        // },
        {
          id: '4-3',
          text: '警局管理',
          path: '/basic-information/policeStation',
          show: true,
        },
        // {
        //   id: '4-4',
        //   text: '社区管理',
        //   path: '/basic-information/community',
        //   show: true,
        // },
      ],
    },
    {
      id: '5',
      text: '',
      path: '',
      show: false,
    },
    {
      id: '6',
      text: '',
      path: '',
      show: false,
    },
    {
      id: '7',
      text: '',
      path: '',
      show: false,
    },
    {
      id: '8',
      text: '',
      path: '',
      show: false,
    },
    {
      id: '9',
      text: '事件管理',
      path: '/event-management',
      show: true,
    },
    {
      id: '10',
      text: '日志记录',
      path: '/log-record',
      show: true,
    },
    {
      id: '11',
      text: '绩效查看',
      path: '/check-performance',
      show: true,
    },
    {
      id: '12',
      text: '系统设置',
      path: '/system-setting',
      show: true,
      children: [
        {
          id: '12-1',
          text: '退出登入',
          path: '/system-setting/logout',
          show: true,
        },
      ],
    },
  ];

  const [element, setElement] = useState<any>();
  const location = useLocation();

  // 优先去查找二级路由   如果找不到用一级路由  去找一级路由
  function findItemIdByRoute(items: any, route: any) {
    let itemId = null;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.children && item.children.length > 0) {
        const childItem = item.children.find((child: any) => child.path === route);
        if (childItem) {
          itemId = childItem.id; // 找到匹配的二级路由，更新itemId
          break;
        }
      }
    }

    if (!itemId) {
      const pathArray = route.split('/').filter(Boolean);
      const foundItem = items.find((item: any) => item.path === `/${pathArray[0]}`);
      itemId = foundItem ? foundItem.id : null; // 没有找到匹配的二级路由，返回对应的一级路由的id或null
    }

    return itemId;
  }

  // 更新高亮效果和移动效果
  useEffect(() => {
    const id = findItemIdByRoute(menuItems, location.pathname) || '';
    if (id) {
      const currentElement = document.getElementById(id + 'go_back');
      const ul = currentElement?.parentElement;
      // 是二级路由情况
      if (id.indexOf('-') !== -1) {
        // 获取所有的二级菜单 并删除高亮样式
        const li = ul?.querySelectorAll('li');
        li?.forEach((li: any) => {
          li.classList.remove('TopMenuActive');
        });

        // 添加新的高亮样式
        currentElement?.classList.add('TopMenuActive');

        // 记录当前的二级高亮内容  当点击一级的时候能够找到他 并删除
        setElement(currentElement);

        // 关闭二级菜单
        ul?.classList.remove('TopSecondMenuShow');

        // 找到一级菜单li
        const parentLi = ul?.parentElement;
        // 找到一级菜单统计的所有li
        const parentLiParent = parentLi?.parentElement?.querySelectorAll('li');
        // 清空之前的一级菜单移动效果
        parentLiParent?.forEach((li: any) => {
          li.classList.remove('TopTextAndImgMove');
        });
        // 为点击的二级菜单 挂载的一级菜单添加移动效果
        parentLi?.classList.add('TopTextAndImgMove');
      } else {
        const li = ul?.querySelectorAll('li');
        // 清空之前的
        li?.forEach((li: any) => {
          li.classList.remove('TopTextAndImgMove');
        });
        // 当前点击元素添加新的移动动画效果
        currentElement?.classList.add('TopTextAndImgMove');

        // 设置以及路由向上移动
        currentElement?.classList.add('TopTextAndImgMove');

        // 如果有二级菜单高亮  清除二级菜单高亮状态
        if (element) {
          element.classList.remove('TopMenuActive');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ul className={styles.TopMenu}>
      {menuItems.map((menuItem) => (
        <MenuItem key={menuItem.id} item={menuItem} isSubMenuItem={false} />
      ))}
    </ul>
  );
}

export default Menu;
