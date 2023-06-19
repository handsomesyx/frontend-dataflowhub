import styles from './style.module.less';

/* 使用组件需要传入数据类型 */
interface Props {
  familyData: familyDataType[];
}

export type familyDataType = {
  name: string;
  card: string;
  relationship: string;
  phone: string;
  liveComeTime: String;
};

// 组件使用的时候需要写一个边框外层border: 1px solid #d9d9d9;  width： 100% 不用写高度
const Family: React.FC<Props> = ({ familyData }) => {
  return (
    <div className={styles.FamilyBox}>
      {familyData?.map((item: familyDataType, index: number) => {
        return (
          <div className={styles.FamilyBorderBox} key={index}>
            <div>
              <span> 家 庭 成 员 {index + 1}</span>
            </div>
            <div>
              <div>
                成员姓名：<span>{item.name}</span>
              </div>
              <div>
                成员与本人关系：<span>{item.relationship}</span>
              </div>
              <div>
                何时来本地居住：<span>{item.liveComeTime}</span>
              </div>
            </div>
            <div>
              <div>
                成员身份证号：
                <span>{item.card}</span>
              </div>
              <div>
                成员联系方式：<span>{item.phone}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Family;
