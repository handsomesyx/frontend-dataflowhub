import styles from './style.module.less';

interface Props {
  CombinationData: CombinationType;
}

export type CombinationType = {
  level: string;
  reason: string;
  petition: null | string;
};

const Combination: React.FC<Props> = ({ CombinationData }) => {
  return (
    <div className={styles.CombinationBox}>
      <table>
        <tbody>
          <tr>
            <td>人员分级类别</td>
            <td>{CombinationData?.level}</td>
          </tr>
          <tr>
            <td>分类依据</td>
            <td>{CombinationData?.reason}</td>
          </tr>
          <tr>
            <td>上访诉求</td>
            <td>{CombinationData?.petition}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Combination;
