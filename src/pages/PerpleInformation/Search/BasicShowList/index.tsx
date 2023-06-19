/* eslint-disable max-len */
import { useNavigate } from 'react-router-dom';

import styles from './style.module.less';
interface Props {
  BasicShowListData: BasicShowListDataType[];
  currentPage: number;
  onePageTotal: number;
}

export type BasicShowListDataType = {
  basicsinfo: string;
  name: string;
  griding: string;
  pinyin: string;
  cardid: string;
  phone: string;
  policeStation: string;
  placeDomicile: string;
  currentAddress: string;
  level: string;
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
            <img src="" alt="" />
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
                所属网格：<span>{item?.griding}</span>
              </div>
            </div>
            <div>
              <div>
                身份证号(护照)：<span>{item.cardid}</span>
              </div>
              <div>
                联系方式：<span>{item.phone}</span>
              </div>
              <div>
                所属派出所：<span>{item.policeStation}</span>
              </div>
            </div>
            <div>
              <div>户籍所在地：{item?.placeDomicile}</div>
              <div>现住址：{item?.currentAddress}</div>
              <div>人员分级类别：{item?.level}</div>
            </div>
            <div>
              <a
                onClick={() => {
                  navigate('/population-manager/person-show');
                }}
              >
                查看具体信息
              </a>
            </div>
            <div className={styles.BoxLeftIcon}>
              {(currentPage - 1) * onePageTotal || 0 + index + 1}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default BasicShowList;
