import styles from './styles.module.less';

interface Props {
  EducationData: EducationType;
}

export type EducationType = {
  work_unit: string;
  position: string;
  political_status: string;
  party_organization: string;
  religion: string;
  nationality: string;
  education: string;
  military_service: string;
  school: string;
};

const Education: React.FC<Props> = ({ EducationData }) => {
  return (
    <div className={styles.EducationBox}>
      <table>
        <tbody>
          <tr>
            <td>工作单位</td>
            <td>{EducationData?.work_unit}</td>
            <td>职务</td>
            <td>{EducationData?.position}</td>
            <td>
              <span>*</span>政治面貌
            </td>
            <td>{EducationData?.political_status}</td>
          </tr>
          <tr>
            <td>所属党团组织</td>
            <td>{EducationData?.party_organization}</td>
            <td>宗教信仰</td>
            <td>{EducationData?.religion}</td>
            <td>
              <span>*</span>民族
            </td>
            <td>{EducationData?.nationality}</td>
          </tr>
          <tr>
            <td>
              <span>*</span>文化程度
            </td>
            <td>{EducationData?.education}</td>
            <td>
              <span>*</span>入伍情况
            </td>
            <td>{EducationData?.military_service}</td>
            <td>毕业院校</td>
            <td>{EducationData?.school}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Education;
