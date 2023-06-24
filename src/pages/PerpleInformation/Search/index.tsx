import 'dayjs/locale/zh-cn';

import { useLazyQuery, useQuery } from '@apollo/client';
import {
  Cascader,
  ConfigProvider,
  DatePicker,
  Empty,
  Input,
  Pagination,
  Select,
  Spin,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getPeopleDataFilter,
  getSelectAdmin,
  getSelectGrid,
  getSelectPolicer,
  getSelectPoliceStation,
} from '@/apis';

import BasicShowList from './BasicShowList';
import city from './cities.json';
import nationality from './nationality.json';
import religion from './religion.json';
import SearchIcon from './search.svg';
import styles from './style.module.less';
const { RangePicker } = DatePicker;
type filterType = {
  administrative_area_id: number | undefined;
  age: number | undefined;
  createtimedown: number | undefined;
  createtimeup: number | undefined;
  current_address: string | undefined;
  gender: boolean | undefined;
  grid_id: number | undefined;
  id_card: string | undefined;
  name: string | undefined;
  nationality: string | undefined;
  nickname: string | undefined;
  person_classification: string | undefined;
  phone: string | undefined;
  police_station_id: number | undefined;
  police_user_id: number | undefined;
  religion: string | undefined;
  residence: string | undefined;
  updatetimedown: number | undefined;
  updatetimeup: number | undefined;
};

// 控制数据请求 筛选  筛选后的内容会传递给子组件BasicShowList展示
const SearchBasic = () => {
  // 保存所有的筛选数据
  const [filterData, setFilterData] = useState<filterType>({
    administrative_area_id: undefined,
    age: undefined,
    createtimedown: undefined,
    createtimeup: undefined,
    current_address: undefined,
    gender: undefined,
    grid_id: undefined,
    id_card: undefined,
    name: undefined,
    nationality: undefined,
    nickname: undefined,
    person_classification: undefined,
    phone: undefined,
    police_station_id: undefined,
    police_user_id: undefined,
    religion: undefined,
    residence: undefined,
    updatetimedown: undefined,
    updatetimeup: undefined,
  });

  // 记录旧的筛选数据  点击分页的时候使用   防止没有点击查询查询条件变更问题
  const [filterDataOld, setFilterDataOld] = useState<filterType>({
    administrative_area_id: undefined,
    age: undefined,
    createtimedown: undefined,
    createtimeup: undefined,
    current_address: undefined,
    gender: undefined,
    grid_id: undefined,
    id_card: undefined,
    name: undefined,
    nationality: undefined,
    nickname: undefined,
    person_classification: undefined,
    phone: undefined,
    police_station_id: undefined,
    police_user_id: undefined,
    religion: undefined,
    residence: undefined,
    updatetimedown: undefined,
    updatetimeup: undefined,
  });
  // 网格员筛选数据获取
  const { data: gridData } = useQuery(getSelectGrid, {
    variables: {
      policer_id: filterData?.police_user_id,
      police_station_id: filterData.police_station_id,
      admin_id: filterData?.administrative_area_id,
    },
    nextFetchPolicy: 'network-only',
    fetchPolicy: 'network-only',
  });

  const [isshowSearch, setShowSearch] = useState(true);
  // 获取派出所内容
  const { data: policeStationData } = useQuery(getSelectPoliceStation);

  // 选中的派出所
  const [policeStationId, setPoliceStationId] = useState();

  // huoqu警员下拉框数据
  const { data: police } = useQuery(getSelectPolicer, {
    variables: {
      id: policeStationId,
    },
    nextFetchPolicy: 'network-only',
    fetchPolicy: 'network-only',
  });

  // 选中的警员
  const [policeValue, setPoliceValue] = useState<any>();

  // 选中的网格
  const [gridSelect, setGridSelect] = useState<any>();

  // 选中的行政区域
  const [regionalSelect, setRegionalSelect] = useState<any>();

  // 行政区域数据
  const { data: regional } = useQuery(getSelectAdmin);

  // 页码
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: undefined,
  });

  const current: any = pagination.current;
  const pageSize: any = pagination.pageSize;
  const skip = (current - 1) * pageSize;
  const take = pageSize;
  const changePage = (current: any, pageSize: any) => {
    setPagination((pre) => {
      return {
        ...pre,
        current: current,
        pageSize: pageSize,
      };
    });
  };
  const currentChange = (current: any) => {
    setPagination((pre) => {
      return {
        ...pre,
        current,
      };
    });
  };
  const [getFilterPeopleData, { data: peopleData, loading }] =
    useLazyQuery(getPeopleDataFilter);

  // 首次加载首次
  useEffect(() => {
    getFilterPeopleData({
      variables: {
        content: {},
        pagingOption: {
          skip: skip,
          take: take,
        },
      },
    }).then(({ data }) => {
      setPagination((pre) => {
        return {
          ...pre,
          total: data?.getPeopleDataFilter?.total,
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 分页的时候使用旧的数据进行筛选
  useEffect(() => {
    getFilterPeopleData({
      variables: {
        content: { ...filterDataOld },
        pagingOption: {
          skip: skip,
          take: take,
        },
      },
    }).then(({ data }) => {
      setPagination((pre) => {
        return {
          ...pre,
          total: data?.getPeopleDataFilter?.total,
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.current, pagination?.pageSize]);

  const navigate = useNavigate();

  /* 处理是否展开菜单 */
  const handleShowSearch = () => {
    const topElem = document.getElementById('TopSearchHidden');
    if (topElem) {
      if (isshowSearch) {
        topElem.style.maxHeight = '0';
      }
      if (!isshowSearch) {
        topElem.style.maxHeight = '250px';
      }
    }
    setShowSearch((pre) => !pre);
  };

  const showMadal = () => {
    navigate('/population-manager/person-management-add');
  };

  // 处理传入展示列表页面BasicShowList的数据
  const datalist = () => {
    return peopleData?.getPeopleDataFilter?.data?.map((item: any) => {
      return {
        basicsinfo: '',
        name: item?.name,
        former_name: item?.former_name || '--',
        pinyin: item?.pinyin,
        cardid: item?.id_card,
        phone: item?.phone || '--',
        nickname: item?.nickname || '--',
        placeDomicile: item?.residence,
        currentAddress: item?.current_address,
        level: item?.person_classification,
        id: item?.id,
      };
    });
  };

  // 籍贯选择内容转换 并存储到filterData中
  const onChange = (value: any) => {
    if (value) {
      const newValue = value.join('');
      setFilterData((pre) => {
        return {
          ...pre,
          residence: newValue,
        };
      });
    }
  };

  // 籍贯筛选
  const filter: any = (inputValue: any, path: any) => {
    return path.some((option: any) => option.label.indexOf(inputValue) > -1);
  };

  const handleSearch = () => {
    setFilterDataOld(filterData);
    getFilterPeopleData({
      variables: {
        content: { ...filterData },
        pagingOption: {
          skip: skip,
          take: take,
        },
      },
    }).then(({ data }) => {
      setPagination((pre) => {
        return {
          ...pre,
          total: data?.getPeopleDataFilter?.total,
        };
      });
    });
  };

  console.log('aaa', filterData);
  console.log('pagination?.total', pagination?.total);
  const handleSetPoliceStation = (e: any) => {
    setPoliceStationId(e);
    setPoliceValue(undefined);
    setFilterData((pre) => {
      return {
        ...pre,
        police_station_id: e,
      };
    });
  };

  // 数据输出到fliter中代码  针对input组件
  const handleFliterData = (a: any, dataName: string) => {
    let e = a.target.value;
    if (e === '') {
      e = undefined;
    }
    setFilterData((pre: any) => {
      return { ...pre, [dataName]: e };
    });
  };

  // 数据输出到fliter中 针对select组件
  const handleFliterDataSelect = (a: any, dataName: string) => {
    setFilterData((pre: any) => {
      return { ...pre, [dataName]: a };
    });
  };
  return (
    <div className={styles.FlexColomnBox}>
      <div className={styles.TopBox}>
        <div className={styles.TopTitle}>人员管理</div>
        <div>
          <button className={styles.ClickShow} onClick={handleShowSearch}>
            {isshowSearch ? '收起筛选' : '展开筛选'}
          </button>
          <button className={styles.AddPeople} onClick={showMadal}>
            <span style={{ transform: ' scale(1.5)', display: 'inline-block' }}>+</span>
            &nbsp;增加人员信息
          </button>
        </div>
      </div>

      <div className={styles.TopSearchBox} id="TopSearchHidden">
        <div className={styles.TopSearchPadding}>
          <div>
            <div>
              <span>公安局：</span>
              {/* jiade */}
              <Select
                placeholder="选择公安局"
                style={{ width: '60%' }}
                allowClear
                options={[{ value: 1, label: '漠河市公安局' }]}
              ></Select>
            </div>
            <div>
              <span>姓名：</span>
              <Input
                placeholder="请输入姓名"
                onChange={(a) => {
                  handleFliterData(a, 'name');
                }}
                value={filterData?.name}
                style={{ width: '60%' }}
              ></Input>
            </div>
            <div>
              <span>人口标识：</span>
              <Select
                placeholder="请输入人口标识"
                allowClear
                style={{ width: '60%' }}
                onChange={(e) => {
                  handleFliterDataSelect(e, 'person_classification');
                }}
                options={[
                  { label: 'A', value: 'A', id: 'A' },
                  { label: 'B', value: 'B', id: 'B' },
                  { label: 'C', value: 'C', id: 'C' },
                  { label: 'D', value: 'D', id: 'D' },
                ]}
              ></Select>
            </div>
            <div>
              <span>籍贯：</span>
              <Cascader
                options={city}
                onChange={onChange}
                changeOnSelect
                placeholder="请输入或选择籍贯"
                showSearch={filter}
                style={{ width: '60%' }}
              />
            </div>
            <div>
              <span>录入日期：</span>
              <ConfigProvider locale={zhCN}>
                <RangePicker style={{ width: '60%' }} />
              </ConfigProvider>
            </div>
          </div>
          <div>
            <div>
              <span>分县公安局</span>：
              <Select
                placeholder="选择分县公安局"
                allowClear
                style={{ width: '60%' }}
                options={[{ value: 1, label: '漠河县公安局' }]}
              ></Select>
            </div>
            <div>
              <span>身份证号</span>：
              <Input
                placeholder="输入身份证号"
                onChange={(a) => {
                  handleFliterData(a, 'id_card');
                }}
                value={filterData?.id_card}
                style={{ width: '60%' }}
              ></Input>
            </div>
            <div>
              <span>手机号码</span>：
              <Input
                allowClear
                placeholder="输入手机号码"
                onChange={(a) => {
                  let e = a.target.value;
                  if (/^\d*$/.test(e)) {
                    setFilterData((pre: any) => {
                      return { ...pre, phone: e };
                    });
                  } else {
                    return;
                  }
                }}
                value={filterData?.phone}
                style={{ width: '60%', display: 'flex' }}
              ></Input>
            </div>
            <div>
              <span>住址</span>：
              <Input
                placeholder="输入住址"
                onChange={(a) => {
                  handleFliterData(a, 'current_address');
                }}
                value={filterData?.current_address}
                style={{ width: '60%' }}
              ></Input>
            </div>
            <div>
              <span>修改日期</span>：
              <ConfigProvider locale={zhCN}>
                <RangePicker style={{ width: '60%' }} />
              </ConfigProvider>
            </div>
          </div>
          <div>
            <div>
              <span>派出所</span>：
              <Select
                placeholder="选择派出所"
                disabled={regionalSelect ? true : false}
                onClear={() => {
                  setPoliceValue(undefined);
                }}
                allowClear
                style={{ width: '60%' }}
                onChange={handleSetPoliceStation}
                options={policeStationData?.getSelectPoliceStation?.selectPoliceStation?.map(
                  (item: any) => {
                    return { value: item?.id, label: item?.name };
                  },
                )}
              ></Select>
            </div>
            <div>
              <span>性别</span>：
              <Select
                placeholder="选择性别"
                allowClear
                onChange={(e) => {
                  handleFliterDataSelect(e, 'gender');
                }}
                options={[
                  { value: true, label: '女' },
                  { value: false, label: '男' },
                ]}
                style={{ width: '60%' }}
              ></Select>
            </div>
            <div>
              <span>行政区域</span>：
              <Select
                disabled={policeStationId || gridSelect ? true : false}
                placeholder="行政区域"
                value={regionalSelect}
                onChange={(e) => {
                  setRegionalSelect(e);
                  handleFliterDataSelect(e, 'administrative_area_id');
                }}
                style={{ width: '60%' }}
                allowClear
                options={regional?.getSelectAdmin?.selectAdmin?.map((item: any) => {
                  return { value: item?.id, label: item?.name };
                })}
              ></Select>
            </div>
            <div>
              <span>宗教信仰</span>：
              <Select
                placeholder="请选择宗教"
                options={religion}
                onChange={(e) => {
                  handleFliterDataSelect(e, 'religion');
                }}
                allowClear
                style={{ width: '60%' }}
              ></Select>
            </div>
            <div>
              <span>别名</span>：
              <Input
                placeholder="输入别名"
                onChange={(a) => {
                  handleFliterData(a, 'nickname');
                }}
                value={filterData?.nickname}
                style={{ width: '60%' }}
              ></Input>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div>
              <span>警员</span>：
              <Select
                placeholder="选择警员"
                value={policeValue}
                disabled={regionalSelect ? true : false}
                allowClear
                style={{ width: '60%' }}
                onChange={(e) => {
                  setPoliceValue(e);
                  handleFliterDataSelect(e, 'police_user_id');
                }}
                options={police?.getSelectPolicer?.selectPolicer?.map((item: any) => {
                  return { value: item?.id, label: item?.name };
                })}
              ></Select>
            </div>
            <div>
              <span>民族</span>：
              <Select
                showSearch
                allowClear
                onChange={(e) => {
                  handleFliterDataSelect(e, 'nationality');
                }}
                placeholder="输入或选择民族"
                style={{ width: '60%' }}
                options={nationality}
              ></Select>
            </div>
            <div>
              <span>网格</span>：
              <Select
                showSearch
                style={{ width: '60%' }}
                placeholder="输入或选择网格号"
                optionFilterProp="children"
                value={gridSelect}
                // onSearch={(value) => {
                //   console.log('sdfdsfs', value);
                //   setGridSelect(value);
                // }}
                onChange={(e) => {
                  console.log('e', e);
                  setGridSelect(e);
                  handleFliterDataSelect(e, 'grid_id');
                }}
                allowClear
                options={gridData?.getSelectGrid?.selectGrid?.map((item: any) => {
                  return { value: item?.id, label: item?.name };
                })}
              />
            </div>

            <div>
              <span>年龄</span>：
              <Input
                placeholder="输入年龄"
                allowClear
                onChange={(a) => {
                  handleFliterData(a, 'age');
                }}
                value={filterData?.age}
                style={{ width: '60%', display: 'flex' }}
              ></Input>
            </div>
            <div style={{ justifyContent: 'end' }}>
              <button onClick={handleSearch}>
                <img src={SearchIcon} />
                &nbsp;查询
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 具体内容区域 */}
      <div className={styles.BottomShowList}>
        <Spin size={'large'} delay={50} spinning={loading}>
          {pagination?.total === 0 ? (
            <div
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Empty />
            </div>
          ) : (
            <BasicShowList
              BasicShowListData={datalist()}
              currentPage={current}
              onePageTotal={pageSize}
            ></BasicShowList>
          )}
        </Spin>
      </div>
      <div className={styles.PaginationBox}>
        <Pagination
          className={styles.Pagination}
          onShowSizeChange={changePage}
          showSizeChanger
          onChange={currentChange}
          showTotal={(total) => `共 ${total} 条`}
          {...pagination}
          pageSizeOptions={[5, 10, 15, 20]}
        />
      </div>
    </div>
  );
};

export default SearchBasic;
