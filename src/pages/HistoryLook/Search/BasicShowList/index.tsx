/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable max-len */
import { useNavigate } from 'react-router-dom';

import styles from './style.module.less';
interface Props {
  BasicShowListData: BasicShowListDataType[];
  currentPage: number;
  onePageTotal: number;
}

/**
 * @description 基础信息搜索列表接口参数
 */
export type BasicShowListDataType = {
  basicsinfo: string;
  name: string;
  former_name: string;
  pinyin: string;
  cardid: string;
  phone: string;
  nickname: string;
  placeDomicile: string;
  currentAddress: string;
  level: string;
  id: number;
  head_url: string;
};

const BasicShowList: React.FC<Props> = ({
  BasicShowListData,
  currentPage,
  onePageTotal,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {BasicShowListData?.map((item: BasicShowListDataType, index: number) => {
        return (
          <div className={styles.BorderBox} key={index}>
            <div className={styles.FirstDiv}>
              <img src="https://tse2-mm.cn.bing.net/th/id/OIP-C.ZcjidB6ytMyNAjg9clT4PAHaNK?pid=ImgDet&rs=1" />
            </div>
            <div>
              <span>基本信息</span>
            </div>
            <div>
              <div>
                姓名：
                <span>{item?.name}</span>
              </div>
              <div>
                姓名拼音：<span>{item?.pinyin}</span>
              </div>
              <div>
                曾用名：<span>{item?.former_name}</span>
              </div>
            </div>
            <div>
              <div>
                身份证号(护照)：<span>{item?.cardid}</span>
              </div>
              <div>
                联系方式：<span>{item?.phone}</span>
              </div>
              <div>
                绰号：<span>{item?.nickname}</span>
              </div>
            </div>
            <div>
              <div>
                户籍所在地：<span>{item?.placeDomicile}</span>
              </div>
              <div>
                现住址：<span>{item?.currentAddress}</span>
              </div>
              <div>
                人员分级类别：<span>{item?.level}</span>
              </div>
            </div>
            <div>
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
            </div>
            <div className={styles.BoxLeftIcon}>
              {(currentPage - 1) * onePageTotal + index + 1 || 0 + index + 1}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default BasicShowList;
