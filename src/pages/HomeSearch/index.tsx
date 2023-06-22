import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { useEffect, useState } from 'react';

import searchicon from '../../assets/search-outlined@2x.png';
import showicon from '../../assets/xiala@2x.png';
import searchText from '../../assets/搜索@2x.png';
import styles from './style.module.less';
const HomeSearch = () => {
  const [value, setValue] = useState(1);
  // const [timeStart, setTimeStart] = useState< | null>(null);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  

  const getElement = () => {
    switch (value) {
      case 1:
        return (
          <>
          </>
        );
      case 2:
        return <>sdfsd</>;
      case 3:
        return <>sdfsd</>;
      case 4:
        return <>sdfsd</>;
      case 5:
        return <>sdfsd</>;
      case 6:
        return <>sdfsd</>;
    }
  };
  useEffect(() => {
    const handleResize = () => {
      const parentElement = document.getElementById('radioBox');
      const childElement: any = document.querySelector('.ant-radio-group');

      if (parentElement && childElement) {
        const parentWidth = parentElement.offsetWidth;
        const childWidth = childElement.offsetWidth;
        console.log('parentWidth', parentWidth);
        console.log('childWidth', childWidth);

        const flage = childWidth > parentWidth;
        // 示例用法：
        if (flage) {
          console.log('子元素宽度大于父元素宽度');
        } else {
          console.log('子元素宽度小于或等于父元素宽度');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
  }, []);
  return (
    <>
      {/* 背景 */}
      <div className={styles.Box}>
        {/* 中间区域边框锁定 */}
        <div className={styles.ContentBox}>
          {/* 搜索框位置锁定 */}
          <div className={styles.SearchBox}>
            <div className={styles.SearchLeft}>
              <img src={searchicon} />
              <input type="text" placeholder="请输入关键词进行搜索" />
              <img src={searchText} />
            </div>
            <div className={styles.SearchRight}>
              高级搜索
              <img src={showicon} />
            </div>
          </div>
          {/* 筛选框位置锁定 */}
          <div className={styles.SelectBox}>
            <div className={styles.Radio} id="radioBox">
              <Radio.Group onChange={onChange} value={value}>
                <Radio value={1}>时间筛选</Radio>
                <Radio value={2}>姓名首字母</Radio>
                <Radio value={3}>年龄段筛选</Radio>
                <Radio value={4}>人口类型</Radio>
                <Radio value={5}>身高</Radio>
                <Radio value={6}>公安局</Radio>
              </Radio.Group>
            </div>
            {getElement()}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSearch;
