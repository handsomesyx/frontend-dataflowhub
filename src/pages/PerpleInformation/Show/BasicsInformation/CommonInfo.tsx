import React from 'react';

import styles from './style.module.less';

/* 使用组件需要传入数据类型 */
interface Props {
  peopleData: CommonPeopleBasics;
}

export type CommonPeopleBasics = {
  name?: string;
  card?: string;
  spell?: string;
  phone?: string;
  formerName?: string;
  nickName?: string;
  level?: string;
  liveComeTime?: string;
  police?: string;
  community?: string;
  gridding?: string;
  placeDomicile?: string;
  currentAddress?: string;
  history?: string;
};

// 组件使用的时候需要写一个边框外层border: 1px solid #d9d9d9;  width： 100% 不用写高度
const Common: React.FC<Props> = ({ peopleData }) => {
  return (
    <div className={styles.CommonBox}>
      <div className={styles.TopSelf}>
        {/* 图片 */}
        <div>
          <img src="" alt="" />
        </div>
        {/* 本人姓名列 */}
        <div>
          <div>
            <span>*</span>本人姓名：<span>{peopleData?.name}</span>
          </div>
          <div>
            <span>*</span>姓名拼音：<span>{peopleData?.spell}</span>
          </div>
          <div>
            <span></span>曾用名：<span>{peopleData?.formerName}</span>
          </div>
          <div>
            <span>*</span>人员分级类别：<span>{peopleData?.level}</span>
          </div>
          <div style={{ width: '100%' }}>
            <span>*</span>所属派出所：
            <span>{peopleData?.police}</span>
          </div>
          <div>
            <span>*</span> 所属网格：<span>{peopleData?.gridding}</span>
          </div>
        </div>
        <div>
          <div>
            <span>*</span>身份证号(护照)：
            <span>{peopleData?.card}</span>
          </div>
          <div>
            <span>*</span>联系方式：<span>{peopleData?.phone}</span>
          </div>
          <div>
            <span></span>绰号：<span>{peopleData?.nickName}</span>
          </div>
          <div>
            <span></span> 何时来本地居住：<span>{peopleData?.liveComeTime}</span>
          </div>
          <div>
            <span>*</span>所属社区：
            <span>{peopleData?.community}</span>
          </div>
          <div>
            <span>*</span>户籍所在地：<span>{peopleData?.placeDomicile}</span>
          </div>
        </div>
      </div>

      {/* 比较长的内容单独一行 */}
      <div className={styles.TopDataLong}>
        <div>
          <span className="SpanRedColor">*</span>现住址：
          <span>{peopleData?.currentAddress}</span>
        </div>
        <div>
          <span className="SpanRedColor">*</span>历史数据(电话、住址)：
          <span>{peopleData?.history}</span>
        </div>
      </div>
    </div>
  );
};

export default Common;
