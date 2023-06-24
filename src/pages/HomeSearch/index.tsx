import 'dayjs/locale/zh-cn';

import { type DatePickerProps, Radio, type RadioChangeEvent } from 'antd';
import { ConfigProvider } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import DatePicker from 'antd/es/date-picker';
import zhCN from 'antd/locale/zh_CN';
import { useState } from 'react';

import searchicon from '../../assets/search-outlined@2x.png';
import showicon from '../../assets/xiala@2x.png';
import searchText from '../../assets/搜索@2x.png';
import styles from './style.module.less';
const HomeSearch = () => {
  const [value, setValue] = useState(1);
  const [isshowSearch, setShowSearch] = useState(true);
  // const [timeStart, setTimeStart] = useState< | null>(null);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const TimeonChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value);
  };

  const getElement = () => {
    switch (value) {
      case 1:
        return (
          <>
            <div className={styles.TimeBox}>
              <div className={styles.Timetitle}>时间筛选</div>
              <ConfigProvider locale={zhCN}>
                <DatePicker
                  className={styles.TimeOne}
                  onChange={TimeonChange}
                  onOk={onOk}
                />
                <DatePicker
                  className={styles.TimeTwo}
                  onChange={TimeonChange}
                  onOk={onOk}
                />
              </ConfigProvider>
            </div>
          </>
        );
    }
  };

  const handleShow = () => {
    const topElem = document.getElementById('slectBoxid');
    if (topElem) {
      if (isshowSearch) {
        topElem.style.height = '0';
        topElem.style.minHeight = '0';
      }
      if (!isshowSearch) {
        topElem.style.height = 'calc(47% - 10px)';
        topElem.style.minHeight = '153px';
      }
    }

    // 图片点击翻转动效
    let box: any = document.querySelector('.IconSpin');
    if (box) {
      if (isshowSearch) {
        box.style.transform = 'rotate(180deg)';
      } else {
        box.style.transform = 'rotate(0deg)';
      }
    }

    setShowSearch((pre) => !pre);
  };

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
            <div className={styles.SearchRight} onClick={handleShow}>
              高级搜索
              <img className="IconSpin" src={showicon} />
            </div>
          </div>
          {/* 筛选框位置锁定 */}
          <div className={styles.SelectBox} id="slectBoxid">
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
