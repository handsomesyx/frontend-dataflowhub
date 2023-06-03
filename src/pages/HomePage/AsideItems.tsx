// import baobaorenyuanxinxi from '../../assets/baobaorenyuanxinxi.svg';
import jichuxinxi from '../../assets/jichuxinxi.svg';
// import minsheng from '../../assets/minsheng.svg';
// import minzhengweijian from '../../assets/minzhengweijian.svg';
// import qitaqingkuang from '../../assets/qitaqingkuang.svg';
// import shengchanjingyingqingkuang from '../../assets/shengchanjingyingqingkuang.svg';
// import zhengzhijiaoyu from '../../assets/zhengzhijiaoyu.svg';
import zhuanqunjiehe from '../../assets/zhuanqunjiehe.svg';
// 需要传入以及菜单的路由名称  返回二级路由菜单具体内容
export const getItems = (url1: string) => {
  switch (url1) {
    // 示例   人口管理
    case 'population-manager':
      return [
        {
          // 菜单名称
          menuName: '基础信息',
          // 菜单key值
          key: 'menu1',
          // url对应的二级url  在router/index里面配置后填写
          url2: '/personn-management',
          // 菜单图片
          img: { jichuxinxi },
        },
        {
          menuName: '专群结合',
          key: 'menu1',
          // url对应的二级url  在router/index里面配置后填写
          url2: '/history-lookOver',
          img: { zhuanqunjiehe },
        },
        // ..........
      ];
  }
};
