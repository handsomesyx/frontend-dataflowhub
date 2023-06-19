/* eslint-disable max-len */
import styles from './style.module.less';

interface Props {
  HealthInfoData: HealthInfoType;
}

// 全部传入没有传空
export type HealthInfoType = {
  child_number: string;
  special_group: string;
  health_insurance: string;
  pension_insurance: string;
  vaccination_status: string;
  proof_contraindication: string;
  marriage_status: string; // 婚姻状态
  other_conditions: string;
  disability_id: string; // 残疾证编号
  disability_type: string; // 残疾类型
  disability_subsidy: number; // 困难残疾补贴
  severe_disability_subsidy: number; // 重度残疾补贴
  disability_level: number; // 残疾级别
  supervisor: string; // 监管
};

// 民政卫健
const HealthInfo: React.FC<Props> = ({ HealthInfoData }) => {
  return (
    <div className={styles.HealthInfoBox}>
      <table>
        <tbody>
          <tr>
            <td>生育子女数量</td>
            <td>{HealthInfoData?.child_number}</td>
            <td>特殊群体</td>
            <td>{HealthInfoData?.special_group}</td>
            <td>监管人</td>
            <td>{HealthInfoData?.supervisor}</td>
          </tr>
          <tr>
            <td>
              <span>*</span>婚姻状态
            </td>
            <td>{HealthInfoData?.marriage_status}</td>
            <td>残疾证编号</td>
            <td>{HealthInfoData?.disability_id || '- -'}</td>
            <td>残疾类型</td>
            <td>{HealthInfoData?.disability_type || '- -'}</td>
          </tr>
          <tr>
            <td>困难残疾人生活补贴</td>
            <td>{HealthInfoData?.disability_subsidy || '- -'} 元</td>
            <td>重度残疾人护理补贴</td>
            <td>{HealthInfoData?.severe_disability_subsidy || '- -'} 元</td>
            <td>残疾级别</td>
            <td>{HealthInfoData?.disability_level || '- -'}</td>
          </tr>
          <tr>
            <td>医疗保险情况</td>
            <td colSpan={2}>{HealthInfoData?.health_insurance}</td>
            <td>养老保险情况</td>
            <td colSpan={2}>{HealthInfoData?.pension_insurance}</td>
          </tr>
          <tr>
            <td>
              <span>*</span>疫苗接种情况
            </td>
            <td colSpan={2}>{HealthInfoData?.vaccination_status}</td>
            <td>禁忌证明</td>
            <td colSpan={2}>{HealthInfoData?.proof_contraindication}</td>
          </tr>
          <tr>
            <td>其他情况</td>
            <td colSpan={5}>{HealthInfoData?.other_conditions}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HealthInfo;
