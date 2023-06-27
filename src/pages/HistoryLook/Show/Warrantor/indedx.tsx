/* eslint-disable max-len */
import styles from './style.module.less';

interface Props {
  WarrantorData: WarrantorType;
}

// 全部传入没有传空
export type WarrantorType = {
  grid_name: string;
  gridPersonId: string;
  girdPersonPhone: string;
  policeName: string;
  policePhone: string;
};

const Warrantor: React.FC<Props> = ({ WarrantorData }) => {
  return (
    <div className={styles.HealthInfoBox}>
      <table>
        <tbody>
          <tr>
            <td>网格员名称</td>
            <td>{WarrantorData?.grid_name}</td>
            <td>网格员编号</td>
            <td>{WarrantorData?.gridPersonId}</td>
            <td>网格员联系方式</td>
            <td>{WarrantorData?.girdPersonPhone}</td>
          </tr>
          <tr>
            <td>民警姓名</td>
            <td>{WarrantorData?.policeName}</td>
            <td>民警联系方式</td>
            <td>{WarrantorData?.policePhone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Warrantor;
