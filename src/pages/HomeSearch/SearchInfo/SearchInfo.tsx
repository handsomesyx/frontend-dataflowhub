import { useLazyQuery } from '@apollo/client';
import { Pagination, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { mainSearch } from '@/apis';

import styles from './style.module.less';

const SearchInfo = () => {
  const [curoption, setCuroption] = useState<any>({});
  const [getData, { data: searchData, loading, error }] = useLazyQuery(mainSearch);
  // 设置分页
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

  // 如果没有total说明第一次加载请求数据
  // 如果有total,分页的时候重新请求新的数据
  useEffect(() => {
    if (pagination.total === undefined) {
      const optionA = window.localStorage.getItem('searchData') || '';
      const option = JSON.parse(optionA);

      // 作用域覆盖变量 防止更新未获取到新值
      let curoption = option;
      setCuroption(option);

      getData({
        variables: {
          ...curoption,
          pagingOption: {
            skip: skip,
            take: take,
          },
        },
      }).then(({ data }) => {
        setPagination((pre) => {
          return {
            ...pre,
            total: data?.mainSearch?.total,
          };
        });
      });
    } else {
      getData({
        variables: {
          ...curoption,
          pagingOption: {
            skip: skip,
            take: take,
          },
        },
      }).then(({ data }) => {
        setPagination((pre) => {
          return {
            ...pre,
            total: data?.mainSearch?.total,
          };
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.current, pagination?.pageSize]);

  const [flitdata, setFlitData] = useState<any>();
  useEffect(() => {
    if (searchData) {
      const a = searchData;
      const data = a?.mainSearch?.data?.map((item: any) => {
        let strongRed: any = {};
        for (let key in item) {
          if (typeof item[key] === 'string' && item[key].includes('<em>')) {
            // 使用正则表达式将<em></em>标签包裹起来，并应用加粗样式
            const regex = /(.*)<em>(.*?)<\/em>(.*)/;
            const match = item[key].match(regex);

            if (match) {
              const before = match[1];
              const content = match[2];
              const after = match[3];

              strongRed[key] = (
                <span>
                  {before}
                  <span className="LightRed">
                    {content?.replace(/<em>(.*?)<\/em>/g, '$1')}
                  </span>
                  {after}
                </span>
              );
            }
          }
        }
        return { ...item, ...strongRed };
      });
      setFlitData(data);
    }
  }, [searchData]);

  const navigate = useNavigate();
  return (
    <div className={styles.Box}>
      <h3>
        <span className="LightRed">{curoption?.content}</span>&nbsp;的搜索结果
      </h3>
      {/* 加载中 判断没有结果 或者出错情况 */}
      {(!loading && pagination.total === 0) || error ? (
        <div className={styles.Nodata}>暂无结果</div>
      ) : (
        <div className={styles.Nodata}>
          <Spin delay={100} size="large" spinning={loading}></Spin>
        </div>
      )}

      <div className={styles.ContentBox}>
        {flitdata?.map((item: any, index: number) => {
          return (
            <div className={styles.BorderBox} key={index}>
              <div>
                <div>
                  姓名：
                  <span>{item?.pname}</span>
                </div>
                <div>
                  年龄：
                  <span>{item?.age}</span>
                </div>
                <div>
                  性别：
                  <span>{item?.gender}</span>
                </div>
                <div>
                  拼音：<span>{item?.pinyin}</span>
                </div>
              </div>
              <div>
                <div>
                  身份证号：<span>{item?.id_card}</span>
                </div>
                <div>
                  联系方式：<span>{item?.phone}</span>
                </div>
                <div>
                  人口标识：<span>{item?.person_classification}</span>
                </div>

                <div>
                  目前地址：<span>{item?.current_address}</span>
                </div>
              </div>
              <div>
                <div>
                  曾用名称：<span>{item?.former_name}</span>
                </div>
                <div>
                  民族：<span>{item?.nationality}</span>
                </div>
                <div>
                  身高<span>{item?.height}</span>
                </div>
                <div>
                  户籍所在地：<span>{item?.residence}</span>
                </div>
              </div>
              <div className={styles.BoxLeftIcon}>
                {(pagination.current - 1) * pagination.pageSize + index + 1 ||
                  0 + index + 1}
              </div>
              <a
                onClick={() => {
                  navigate('/population-manager/person-show', {
                    state: { id: item?.id },
                  });
                  window.localStorage.setItem('userIdNum', item?.pid?.toString());
                }}
              >
                查看具体信息
              </a>
            </div>
          );
        })}
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

export default SearchInfo;
