import './index.css';

import { Spin } from 'antd';
import React, { Suspense, useCallback } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, useRoutes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import HomeLayout from '@/Layout/home-Layout';
import HomeLeftLayout from '@/Layout/home-Left-Layout';
import HomePage from '@/pages/home-page';
import CreateNFT from '@/pages/nft/create-nft';
import { OperateLog } from '@/pages/OperateLog';
import OrrderList from '@/pages/order-list';
import { userType } from '@/store';

import LogOut from './LogOut';
import type { routerConfigType } from './routerConfigType';

// import PropertyDetail from '@/pages/property-detail';
const PropertyDetail = React.lazy(() => import('@/pages/property-detail'));
const NFTList = React.lazy(() => import('@/pages/nft/nft-list'));
const NtfClassify = React.lazy(() => import('@/pages/nft-classify'));

// ———————— 说明 （1、2级路由正常）————————————
// 需要全部白色背景的页面在suspend里面加上div即可  不需要全部白色背景的加类名NotContentFFF
// 需要写哪个页面，就在哪个页面对应的路由下，将文字替换为组件名称 使用懒加载形式引入

// 没有路由需要自己加到相应位置，添加后 一级 二级菜单路由在HomePage/TopMenuItem.tsx中配置

// 懒加载形式示例  const RulesOfRecognition = React.lazy(() => import('@/pages/RulesOfRecognition'));

const routeConfig: routerConfigType[] = [
  {
    path: '/*',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <HomeLayout />
      </Suspense>
    ),
    auth: [1, 9, 8, 7, 'user1'],
    children: [
      {
        path: '',
        auth: [1, 9, 8, 7, 'user1'],
        element: <Navigate to="home/index" replace></Navigate>,
      },
      {
        path: 'home',
        auth: [1, 9, 8, 7, 'user1'],
        element: (
          <Suspense fallback={<Spin size="large" />}>
            <HomeLeftLayout />
          </Suspense>
        ),
        children: [
          {
            path: '',
            auth: [1, 9, 8, 7, 'user1'],
            element: <Navigate to="index" replace></Navigate>,
          },
          {
            path: 'index',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <HomePage />
              </Suspense>
            ),
          },
          {
            path: 'nft-list',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <NFTList />
              </Suspense>
            ),
          },
          {
            path: 'create-nft',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <CreateNFT />
              </Suspense>
            ),
          },
          {
            path: 'nft-classify',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <NtfClassify />
              </Suspense>
            ),
          },
          {
            path: 'orders-list',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <OrrderList />
              </Suspense>
            ),
          },
          {
            path: 'property-detail',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <PropertyDetail />
              </Suspense>
            ),
          },
        ],
      },
      // 日志记录
      {
        path: 'log-record/*',
        auth: [1, 9, 8, 7, 'user1'],
        children: [
          {
            path: '',
            auth: [1, 9, 8, 7, 'user1'],
            element: <Navigate to="log-record" replace></Navigate>,
          },
          {
            path: 'login-log',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense
                fallback={<Spin className="SetLazySpinCent" size="large" />}
              ></Suspense>
            ),
          },
          {
            path: 'operate-log',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <div>
                  <OperateLog />
                </div>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'system-setting',
        auth: [1, 9, 8, 7, 'user1'],
        children: [
          {
            path: 'logout',
            auth: [1, 9, 8, 7, 'user1'],
            element: (
              <Suspense fallback={<Spin className="SetLazySpinCent" size="large" />}>
                <div>
                  <LogOut></LogOut>
                </div>
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '404',
    element: <div>路径错误,用户未登录或用户权限不够</div>,
  },
  {
    path: 'login',
    element: <>{/* <Login></Login> */}</>,
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
    [currentUserType],
  );

  const getRoutes = useRoutes(transformRoutes(routeConfig));
  return <>{getRoutes}</>;
}
export default MyRoutes;
