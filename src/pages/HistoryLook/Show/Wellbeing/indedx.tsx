/* eslint-disable max-len */
import styles from './style.module.less';

interface Props {
  WellbeingData: WellbeingType;
}

// 全部传入没有传空
export type WellbeingType = {
  issue_level: string; // 事情分类级别 A B C
  classification_basis: string;
  // 分类依据 Raihy:
  // A邻里纠纷，家庭纠纷等易产生矛盾纠纷的事
  // B群众对党委政府有诉求和社区群众急难愁的事
  // C社区群众正常需求的事
  public_demand: string; // 群众需求;
  public_opinion: string; // 群众意见建议;
};

// 民政卫健
const Wellbeing: React.FC<Props> = ({ WellbeingData }) => {
  return (
    <div className={styles.HealthInfoBox}>
      <table>
        <tbody>
          <tr>
            <td>事情分级类别</td>
            <td>{WellbeingData?.issue_level}</td>
          </tr>
          <tr>
            <td>分类依据</td>
            <td>{WellbeingData?.classification_basis}</td>
          </tr>
          <tr>
            <td>群众需求</td>
            <td>{WellbeingData?.public_demand}</td>
          </tr>
          <tr>
            <td>群众意见建议</td>
            <td>{WellbeingData?.public_opinion}</td>
            {/* <td>是否上访对象</td>
            <td>{WellbeingData?.}</td>
            <td>上访诉求</td>
            <td>{WellbeingData?.}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Wellbeing;
