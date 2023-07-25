import 'dayjs/locale/zh-cn';

import { useQuery } from '@apollo/client';
import { Input, message, Radio, type RadioChangeEvent, Select } from 'antd';
import { ConfigProvider } from 'antd';
import DatePicker from 'antd/es/date-picker';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getSelectPoliceStation } from '@/apis';
import { saveSearchData } from '@/store/SaveToken';

import searchicon from '../../assets/search-outlined@2x.png';
import showicon from '../../assets/xiala@2x.png';
import searchText from '../../assets/搜索@2x.png';
import styles from './style.module.less';
const HomeSearch = () => {
  const [value, setValue] = useState(1);
  const [isshowSearch, setShowSearch] = useState(true);
  // 保存所有的配置信息
  const [optiondata, setOption] = useState<any>({
    type: undefined,
    ageup: undefined,
    agedown: undefined,
    police_station_id: undefined,
    timeup: undefined,
    timedown: undefined,
    heightup: undefined,
    heightdown: undefined,
    nameAZ: undefined,
    grid_id: undefined,
  });

  // const [timeStart, setTimeStart] = useState< | null>(null);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    // 重置配置信息
    setOption({
      type: undefined,
      ageup: undefined,
      agedown: undefined,
      police_station_id: undefined,
      timeup: undefined,
      timedown: undefined,
      heightup: undefined,
      heightdown: undefined,
      nameAZ: undefined,
      grid_id: undefined,
    });
  };

  // 时间处理事件
  const TimeonChangeUp = (value: any) => {
    if (value) {
      // const time = new Date(value.$d);
      const time = new Date(value.$y, value.$M, value.$D, 23, 59, 59, 59);
      setOption((pre: any) => {
        return {
          ...pre,
          timeup: time.getTime(),
        };
      });
    } else {
      setOption((pre: any) => {
        return {
          ...pre,
          timeup: undefined,
        };
      });
    }
  };
  const TimeonChangeDown = (value: any) => {
    if (value) {
      const time = new Date(value.$y, value.$M, value.$D, 0, 0, 0, 0);
      // const time = new Date(value.$d);
      setOption((pre: any) => {
        return {
          ...pre,
          timedown: time.getTime(),
        };
      });
    } else {
      setOption((pre: any) => {
        return {
          ...pre,
          timedown: undefined,
        };
      });
    }
  };

  const onchangegrid_id = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        grid_id: Number(e.target.value || ''),
      };
    });
  };

  const ageonChangeUp = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        ageup: Number(e.target.value || ''),
      };
    });
  };
  const ageonChangeDown = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        agedown: Number(e.target.value || ''),
      };
    });
  };
  const { data: policeStationData } = useQuery(getSelectPoliceStation);

  // 设置身高筛选
  const heightonChangeUp = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        heightup: Number(e.target.value || ''),
      };
    });
  };
  const heightonChangeDown = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        heightdown: Number(e.target.value || ''),
      };
    });
  };

  // 设置人口类型筛选
  const handleClassSelet = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        type: e.target.value,
      };
    });
  };
  const handleNameSelet = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        nameAZ: e.target.value,
      };
    });
  };
  const handlePolice = (e: any) => {
    setOption((pre: any) => {
      return {
        ...pre,
        police_station_id: e,
      };
    });
  };
  // 记录输入的内容
  const [inputvalue, setInputValue] = useState('');

  const getElement = () => {
    switch (value) {
      case 1:
        return (
          <>
            <div className={styles.TimeBox}>
              <div className={styles.Timetitle}>时间筛选</div>
              <ConfigProvider locale={zhCN}>
                <DatePicker
                  disabledDate={(current) => {
                    const choose2day = optiondata.timeup;
                    if (choose2day) {
                      if (dayjs.unix(choose2day / 1000).endOf('day') < current) {
                        return true;
                      }
                      if (current > dayjs().endOf('day')) {
                        return true;
                      } else {
                        return false;
                      }
                    } else {
                      return current && current > dayjs().endOf('day');
                    }
                  }}
                  className={styles.TimeOne}
                  onChange={TimeonChangeDown}
                />
                <DatePicker
                  disabledDate={(current) => {
                    const choose1day = optiondata.timedown;
                    if (choose1day) {
                      if (dayjs.unix(choose1day / 1000).startOf('day') > current) {
                        return true;
                      }
                      if (current > dayjs().endOf('day')) {
                        return true;
                      } else {
                        return false;
                      }
                    } else {
                      return current && current > dayjs().endOf('day');
                    }
                  }}
                  className={styles.TimeTwo}
                  onChange={TimeonChangeUp}
                />
              </ConfigProvider>
            </div>
          </>
        );
      case 2:
        return (
          <div className={styles.TimeBox}>
            <div className={styles.Agetitle}>是否按照姓名首字母排序</div>
            <div className={styles.ContentName}>
              <Radio.Group
                defaultValue={0}
                onChange={(e) => {
                  handleNameSelet(e);
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </div>
          </div>
        );
      case 3:
        return (
          <>
            <div className={styles.TimeBox}>
              <div className={styles.Agetitle}>年龄段筛选</div>
              <ConfigProvider locale={zhCN}>
                <Input
                  placeholder="输入最小年龄"
                  style={{ color: '#000' }}
                  className={styles.TimeOne}
                  onChange={ageonChangeDown}
                />
                <Input
                  placeholder="输入最大年龄"
                  style={{ color: '#000' }}
                  className={styles.TimeTwo}
                  onChange={ageonChangeUp}
                />
              </ConfigProvider>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className={styles.TimeBox}>
              <div className={styles.Agetitle}>网格筛选</div>
              <Input
                placeholder="请输入网格号"
                style={{ color: '#000' }}
                className={styles.TimeOne}
                onChange={onchangegrid_id}
              />
            </div>
          </>
        );
      case 5:
        return (
          <div className={styles.TimeBox}>
            <div className={styles.Agetitle}>人口类型筛选</div>
            <div className={styles.ContentClass}>
              <Radio.Group
                defaultValue={0}
                onChange={(e) => {
                  handleClassSelet(e);
                }}
              >
                <Radio value="A">A</Radio>
                <Radio value="B">B</Radio>
                <Radio value="C">C</Radio>
                <Radio value="D">D</Radio>
              </Radio.Group>
            </div>
          </div>
        );
      case 6:
        return (
          <>
            <div className={styles.TimeBox}>
              <div className={styles.Agetitle}>身高筛选</div>
              <ConfigProvider locale={zhCN}>
                <Input
                  placeholder="输入身高最小值"
                  style={{ color: '#000' }}
                  onChange={heightonChangeDown}
                  className={styles.TimeOne}
                />
                <Input
                  placeholder="输入身高最大值"
                  style={{ color: '#000' }}
                  className={styles.TimeTwo}
                  onChange={heightonChangeUp}
                />
              </ConfigProvider>
            </div>
          </>
        );
      case 7:
        return (
          <>
            <div className={styles.TimeBox}>
              <div className={styles.Agetitle}>公安局筛选</div>
              <div style={{ flex: 1, justifyContent: 'center', display: 'flex' }}>
                <Select
                  style={{ color: '#000', width: '50%' }}
                  placeholder="选择公安局id"
                  options={policeStationData?.getSelectPoliceStation?.selectPoliceStation?.map(
                    (item: any) => {
                      return { value: item?.id, label: item?.name };
                    },
                  )}
                  allowClear
                  onChange={handlePolice}
                ></Select>
              </div>
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
  const navigate = useNavigate();
  const handleSearch = () => {
    // 判断是否都是空格
    const isAllSpacesRegex = /^\s*$/;
    const flag = isAllSpacesRegex.test(inputvalue);
    if ((!flag && inputvalue) || isshowSearch) {
      const option = {
        content: inputvalue,
        option: optiondata,
      };
      saveSearchData(option);

      setTimeout(() => {
        navigate('/search-info');
      }, 200);
    } else {
      message.warning('搜索内容不能为空');
    }
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
              <input
                type="text"
                placeholder="请输入关键词进行搜索"
                value={inputvalue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                    // 在这里执行回车事件的逻辑操作
                  }
                }}
              />
              <img src={searchText} onClick={handleSearch} />
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
                <Radio value={4}>网格</Radio>
                <Radio value={5}>人口类型</Radio>
                <Radio value={6}>身高</Radio>
                <Radio value={7}>公安局</Radio>
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
