import type { PaginationProps } from 'antd';
import { Pagination, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { BasicShowListDataType } from './BasicShowList';
import BasicShowList from './BasicShowList';
import SearchIcon from './search.svg';
import styles from './style.module.less';
const showTotal: PaginationProps['showTotal'] = (total) => `共 ${total} 条`;

// 控制数据请求 筛选  筛选后的内容会传递给子组件BasicShowList展示
const SearchBasic = () => {
  const [isshowSearch, setShowSearch] = useState(true);
  const [currentPage] = useState(1);
  const [onePageTotal] = useState(10);

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

  // 模拟数据
  const BasicShowListData: BasicShowListDataType[] = [
    {
      basicsinfo: '',
      name: '',
      griding: '',
      pinyin: '',
      cardid: '',
      phone: '',
      policeStation: '',
      placeDomicile: '',
      currentAddress: '',
      level: '',
    },
    {
      basicsinfo: '',
      name: '',
      griding: '',
      pinyin: '',
      cardid: '',
      phone: '',
      policeStation: '',
      placeDomicile: '',
      currentAddress: '',
      level: '',
    },
    {
      basicsinfo: '',
      name: '',
      griding: '',
      pinyin: '',
      cardid: '',
      phone: '',
      policeStation: '',
      placeDomicile: '',
      currentAddress: '',
      level: '',
    },
    {
      basicsinfo: '',
      name: '',
      griding: '',
      pinyin: '',
      cardid: '',
      phone: '',
      policeStation: '',
      placeDomicile: '',
      currentAddress: '',
      level: '',
    },
    {
      basicsinfo: '',
      name: '',
      griding: '',
      pinyin: '',
      cardid: '',
      phone: '',
      policeStation: '',
      placeDomicile: '',
      currentAddress: '',
      level: '',
    },
  ];

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
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>姓名：</span>
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>人口标识：</span>
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>籍贯：</span>
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>录入日期：</span>
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
          </div>
          <div>
            <div>
              <span>分县公安局</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>身份证号</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>手机号码</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>住址</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>修改日期</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
          </div>
          <div>
            <div>
              <span>派出所</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>性别</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>网格</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>宗教信仰</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>别名</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div>
              <span>警员</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>民族</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>行政区域</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div>
              <span>年龄</span>：
              <Select placeholder="选择公安局" style={{ width: 120 }}></Select>
            </div>
            <div style={{ justifyContent: 'end' }}>
              <button>
                <img src={SearchIcon} />
                &nbsp;查询
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 高度根据实际手动调整 */}

      {/* 具体内容区域 */}
      <div className={styles.BottomShowList}>
        <BasicShowList
          BasicShowListData={BasicShowListData}
          currentPage={currentPage}
          onePageTotal={onePageTotal}
        ></BasicShowList>
      </div>
      <Pagination className={styles.Pagination} total={200} showTotal={showTotal} />
    </div>
  );
};

export default SearchBasic;
