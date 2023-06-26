import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { mainSearch } from '@/apis';

import styles from './style.module.less';

const SearchInfo = () => {
  const optionA = window.localStorage.getItem('searchData') || '';
  const option = JSON.parse(optionA);
  const { data: searchData } = useQuery(mainSearch, {
    variables: option,
  });

  const [flitdata, setFlitData] = useState<any>();
  useEffect(() => {
    if (searchData) {
      const data = searchData?.mainSearch?.data?.map((item: any) => {
        for (let key in item) {
          if (typeof item[key] === 'string' && item[key].includes('<em>')) {
            // 使用正则表达式将<em></em>标签包裹起来，并应用加粗样式
            const regex = /(.*)<em>(.*?)<\/em>(.*)/;
            const match = item[key].match(regex);

            if (match) {
              const before = match[1];
              const content = match[2];
              const after = match[3];
              // item[key] = (
              //   <>
              //     <span>
              //       {before}
              //       {content?.replace(
              //         /<em>(.*?)<\/em>/g,
              //         <span className="LightRed">{`$1`}</span>,
              //       )}
              //       {after}
              //     </span>
              //   </>
              // );
            }
          }
        }
        return { ...item };
      });
      setFlitData(data);
    }
  }, [searchData]);
  console.log('flitdata', flitdata);
  const navigate = useNavigate();
  return (
    <>
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
                户籍所在地：<span>{item?.residence}</span>
              </div>
              <div>
                身高<span>{item?.height}</span>
              </div>
              <div>
                民族：<span>{item?.nationality}</span>
              </div>
            </div>
            <a
              onClick={() => {
                navigate('/population-manager/person-show', {
                  state: { id: item?.id },
                });
                window.localStorage.setItem('userIdNum', item?.id?.toString());
              }}
            >
              查看具体信息
            </a>
            {/* <div className={styles.BoxLeftIcon}>
              {(currentPage - 1) * onePageTotal + index + 1 || 0 + index + 1}
            </div> */}
          </div>
        );
      })}
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
                残疾等级：<span>{item?.disability_level}</span>
              </div>
              <div>
                身高<span>{item?.height}</span>
              </div>
              <div>
                民族：<span>{item?.nationality}</span>
              </div>
              <div>
                户籍所在地：<span>{item?.residence}</span>
              </div>
            </div>
            <a
              onClick={() => {
                navigate('/population-manager/person-show', {
                  state: { id: item?.id },
                });
                window.localStorage.setItem('userIdNum', item?.id?.toString());
              }}
            >
              查看具体信息
            </a>
            {/* <div className={styles.BoxLeftIcon}>
              {(currentPage - 1) * onePageTotal + index + 1 || 0 + index + 1}
            </div> */}
          </div>
        );
      })}
    </>
  );
};

export default SearchInfo;
