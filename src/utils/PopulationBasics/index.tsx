import Watermark from 'antd/es/watermark';
import type { ReactElement } from 'react';

import { getRealName, getUserIdCard } from '@/store/SaveToken';

import styles from './style.module.less';
import LeftTimeLine from './TimeLine/LeftTimeLine';

export type ItemConfigType = {
  id: number;
  name: string;
  href: string;
  elem: ReactElement;
};
interface Props {
  itemData: ItemConfigType[];
}

const AnchorHome: React.FC<Props> = ({ itemData }) => {
  // 将配置转换成jsx元素
  const getElem: any = () => {
    const data = itemData?.map((item: ItemConfigType) => {
      return (
        <section id={item.href} key={item.id}>
          <h3>{item.name}</h3>
          {item.elem}
        </section>
      );
    });
    return data;
  };

  // 解出跳转id配置
  const menuConfig = () => {
    return itemData.map((item) => {
      return {
        href: item.href,
        id: item.id,
        name: item.name,
      };
    });
  };
  const name = getRealName();
  const id_card = getUserIdCard();

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div className={styles.LeftBox}>
        {/* 左侧同步锚点  需要传入滑动区域的id */}
        <LeftTimeLine menuConfig={menuConfig()} dataID="informationBasics"></LeftTimeLine>
      </div>

      {/* 如果想要去除水印环衬div就行*/}
      <Watermark
        content={`${name} ${id_card}`}
        // rotate={-20}
        // gap={[50, 120]}
        className={styles.WaterMarkBox}
      >
        <div id="informationBasics" className={styles.RightBox}>
          {getElem()}
        </div>
      </Watermark>
    </div>
  );
};

export default AnchorHome;
