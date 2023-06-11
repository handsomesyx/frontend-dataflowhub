/* eslint-disable max-len */
import type { CommonPeopleBasics } from './CommonInfo';
import Common from './CommonInfo';
import type { familyDataType } from './Family';
import Family from './Family';
import styles from './style.module.less';

interface Props {
  peopleData: CommonPeopleBasics;
  familyData: familyDataType[];
}

const BasicsInfomation: React.FC<Props> = ({ peopleData, familyData }) => {
  return (
    <div className={styles.BorderBox}>
      <Common peopleData={peopleData}></Common>
      {/* 分割线 */}
      <div className={styles.Dir}></div>
      <Family familyData={familyData}></Family>
    </div>
  );
};

export default BasicsInfomation;
