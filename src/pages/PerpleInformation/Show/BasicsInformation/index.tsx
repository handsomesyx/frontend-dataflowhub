/* eslint-disable max-len */
import type { CombinationType } from '../Combination';
import type { EducationType } from '../Education';
import type { HealthInfoType } from '../HealthInfo';
import type { OtherInfoType } from '../OtherInfo';
import type { ProductionType } from '../Production';
import type { WarrantorType } from '../Warrantor/indedx';
import type { WellbeingType } from '../Wellbeing/indedx';
import type { CommonPeopleBasics } from './CommonInfo';
import Common from './CommonInfo';
import type { familyDataType } from './Family';
import Family from './Family';
import styles from './style.module.less';

interface Props {
  peopleData: CommonPeopleBasics;
  familyData: familyDataType[];
  CombinationData: CombinationType;
  HealthInfoData: HealthInfoType;
  WellbeingData: WellbeingType;
  EducationData: EducationType;
  ProductionData: ProductionType[];
  OtherInfoData: OtherInfoType;
  WarrantorData: WarrantorType;
}

const BasicsInfomation: React.FC<Props> = ({
  peopleData,
  familyData,
  CombinationData,
  HealthInfoData,
  WellbeingData,
  EducationData,
  ProductionData,
  OtherInfoData,
  WarrantorData,
}) => {
  return (
    <div className={styles.BorderBox}>
      <Common
        peopleData={peopleData}
        familyData={familyData}
        CombinationData={CombinationData}
        HealthInfoData={HealthInfoData}
        WellbeingData={WellbeingData}
        EducationData={EducationData}
        ProductionData={ProductionData}
        OtherInfoData={OtherInfoData}
        WarrantorData={WarrantorData}
      ></Common>
      {/* 分割线 */}
      <div className={styles.Dir}></div>
      <Family familyData={familyData}></Family>
    </div>
  );
};

export default BasicsInfomation;
