import './index.css';

import { Spin } from 'antd';
import { Suspense, useCallback } from 'react';
import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, useRoutes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
// import AdministrativeRegion from "../pages/BasicInformation/AdministrativeRegion";
const AdministrativeRegion = React.lazy(
  () => import('@/pages/BasicInformation/AdministrativeRegion')
);
const HomePage = React.lazy(() => import('@/pages/HomePage'));
// const Aside = React.lazy(() => import("@/pages/HomePage/Aside"));

// import Community from '@/pages/BasicInformation/Community';
import PoliceStation from '@/pages/BasicInformation/PoliceStation';
import { userType } from '@/store';

import type { routerConfigType } from './routerConfigType';
// ———————— 说明 （1、2级路由正常）————————————
// 需要全部白色背景的页面在suspend里面加上div即可
// 需要侧边栏的页面在父级路由上面加上element:<Aside></Aside>即可   侧边栏菜单在HomePage/AsideItems中配置(现在没写好)
// 需要写哪个页面，就在哪个页面对应的路由下，将文字替换为组件名称 使用懒加载形式引入

// 没有路由需要自己加到相应位置，添加后 一级 二级菜单路由在HomePage/TopMenuItem.tsx中配置

// 懒加载形式示例  const RulesOfRecognition = React.lazy(() => import('@/pages/RulesOfRecognition'));

const routeConfig: routerConfigType[] = [
  {
    path: '/*',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <HomePage />
      </Suspense>
    ),
    auth: [1, 9, 8, 7, 'user1'],
    children: [
      {
        path: '',
        auth: [1, 9, 8, 7, 'user1'],
        element: <Navigate to="home" replace></Navigate>,
      },
      {
        path: 'home',
        auth: [1, 9, 8, 7, 'user1'],
        element: (
          <Suspense
            fallback={<Spin className="SetLazySpinCent" size="large" />}
          >
            <div>首页内容</div>
          </Suspense>
        ),
      },
      {
        path: 'user-manager',
        auth: [1, 9, 8, 7, 'user1'],
        element: (
          <Suspense
            fallback={<Spin className="SetLazySpinCent" size="large" />}
          >
            <div>用户管理</div>
          </Suspense>
        ),
      },
      // 人口管理
      {
        path: 'population-manager/*',
        auth: [1, 9, 8, 7, 'user1'],
        children: [
          {
            path: '',
            auth: [1, 9, 8, 7, 'user1'],
            element: <Navigate to="person-management" replace></Navigate>,
          },
          {
            path: 'person-management',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              >
                <div>人员管理</div>
              </Suspense>
            ),
          },
          {
            path: 'history-lookOver',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              >
                <div>历史数据查看</div>
              </Suspense>
            ),
          },
          {
            path: 'pending',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              >
                <div>审核待处理</div>
              </Suspense>
            ),
          },
          {
            path: 'designate',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              >
                <div>群众指派</div>
              </Suspense>
            ),
          },
          {
            path: 'information-push',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              >
                <div>人员信息推送</div>
              </Suspense>
            ),
          },
        ],
      },
      // 基础信息 有侧边栏的例子
      {
        path: 'basic-information/*',
        auth: [1, 9, 8, 7, 'user1'],
        children: [
          {
            path: '',
            auth: [1, 9, 8, 7, 'user1'],
            element: <Navigate to="basic" replace></Navigate>,
          },
          {
            path: 'administrativeRegion',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              >
                <div className="NotContentFFF"><AdministrativeRegion /></div>
              </Suspense>
            ),
          },
          // {
          //   path: 'gridArea',
          //   auth: [1, 9, 8, 7, 'user1'],
          //   element: (
          //     <Suspense
          //       fallback={<Spin className="SetLazySpinCent" size="large" />}
          //     >
          //       <div >网格区域管理</div>
          //     </Suspense>
          //   ),
          // },
          {
            path: 'policeStation',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              >
                {/* <div>警局管理</div> */}
                <PoliceStation />
              </Suspense>
            ),
          },
          // {
          //   path: 'community',
          //   auth: [1, 9, 8, 7, 'user1'],
          //   element: (
          //     <Suspense
          //       fallback={<Spin className="SetLazySpinCent" size="large" />}
          //     >
          //       {/* <div>社区管理</div> */}
          //       <Community />
          //     </Suspense>
          //   ),
          // },
        ],
      },
      {
        path: 'event-management',
        auth: [1, 9, 8, 7, 'user1'],
        element: (
          <Suspense
            fallback={<Spin className="SetLazySpinCent" size="large" />}
          >
            <div>事件管理</div>
          </Suspense>
        ),
      },
      {
        path: 'log-record',
        auth: [1, 9, 8, 7, 'user1'],
        element: (
          <Suspense
            fallback={<Spin className="SetLazySpinCent" size="large" />}
          >
            <div>日志记录</div>
          </Suspense>
        ),
      },
      {
        path: 'check-performance',
        auth: [1, 9, 8, 7, 'user1'],
        element: (
          <Suspense
            fallback={<Spin className="SetLazySpinCent" size="large" />}
          >
            <div>绩效查看</div>
          </Suspense>
        ),
      },
      {
        path: 'system-setting',
        auth: [1, 9, 8, 7, 'user1'],
        element: (
          <Suspense
            fallback={<Spin className="SetLazySpinCent" size="large" />}
          >
            <div>系统设置</div>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '404',
    element: <div>路径错误,用户未登录或用户权限不够</div>,
  },
  {
    path: 'login',
    element: <>LOGIN</>,
  },
];

function MyRoutes() {
  const currentUserType = useRecoilValue(userType);
  /**
   * @description: 路由配置列表数据转换
   * @param {routeConfig} routeConfig 路由配置
   */
  const transformRoutes = useCallback(
    (routeList: typeof routeConfig) => {
      const list: RouteObject[] = [];
      routeList.forEach((route: routerConfigType) => {
        if (route.path === undefined) {
          return null;
        }
        if (
          route.path !== '404' &&
          route.auth !== undefined &&
          route.auth.find((item) => item === currentUserType) === undefined
        ) {
          route.element = <Navigate replace to="404"></Navigate>;
        }
        if (route.children) {
          route.children = transformRoutes(route.children);
        }

        list.push(route);
      });
      return list;
    },
    [currentUserType]
  );

  const getRoutes = useRoutes(transformRoutes(routeConfig));
  return <>{getRoutes}</>;
}
export default MyRoutes;

