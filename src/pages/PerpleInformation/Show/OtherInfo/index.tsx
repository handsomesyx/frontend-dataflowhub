/* eslint-disable max-len */
import styles from './style.module.less';

// 全部传入没有传空
export type OtherInfoType = {
  house_info: string; // 房子信息 开关没有暂时没用上
  house_owner: string; // 房子产权人
  house_area: string; // 建筑面积 平方米
  hobbies: string; // 兴趣爱好
  car_model: string; // 车型号（可选）
  car_plate: string; // 车牌照（可选）
  car_owner: string; // 车辆所有人（可选）
  car_color: string; // 车身颜色（可选）
  house_type: string; // 房屋类型
  house_condition: string; // 危房等级
  smoking_status: string; // 吸烟是否  必选
  volunteer_status: string; // 志愿者{ } json里边写字符数组，来记录志愿者
  social_worker: string; // 社工{ }  json里边写字符数组，来记录社工
  driving_license_type: string; // 驾驶证类型（可选）
};
let volunteerArr: string[];
let socailArr: string[];
// 民政卫健
const OtherInfo = ({ OtherInfoData }: any) => {
  if (OtherInfoData?.volunteer_status) {
    const jsonObj = JSON.parse(OtherInfoData?.volunteer_status);
    volunteerArr = Object.values(jsonObj);
    volunteerArr = volunteerArr.map((item, index) => {
      return item[index + 1];
    });
  }

  if (OtherInfoData?.social_worker) {
    const jsonObjsocial = JSON.parse(OtherInfoData?.social_worker);
    socailArr = Object.values(jsonObjsocial);
    socailArr = socailArr.map((item, index) => {
      return item[index + 1];
    });
  }

  // return OtherInfoData?.map((item: any, index: number) => {
  return (
    <div className={styles.HealthInfoBox}>
      <table>
        <tbody>
          <tr>
            <td>
              <span className="LeftRedSpan">*</span>吸烟与否
            </td>
            <td>
              {OtherInfoData?.smoking_status === 0
                ? '否'
                : OtherInfoData?.smoking_status === 1
                ? '是'
                : '--'}
            </td>
            <td>志愿者</td>
            {/* proof_contraindication */}
            <td>{volunteerArr.toString()}</td>
            <td>车辆所有人</td>
            <td>{OtherInfoData?.car_owner}</td>
          </tr>
          <tr>
            <td>车型号</td>
            <td>{OtherInfoData?.car_model}</td>
            <td>车牌照</td>
            <td>{OtherInfoData?.car_plate}</td>
            <td>车身颜色</td>
            <td>{OtherInfoData?.car_color}</td>
          </tr>
          <tr>
            <td>驾驶证类型</td>
            <td>{OtherInfoData?.driving_license_type}</td>
            <td>兴趣爱好</td>
            <td>{OtherInfoData?.hobbies}</td>
            <td>社工</td>
            {/* proof_contraindication */}
            <td>{socailArr.toString()}</td>
          </tr>
        </tbody>
      </table>
      <table style={{ marginTop: 10 }}>
        <tbody>
          <tr>
            <td className="FirstWidth" rowSpan={6}>
              房屋信息
            </td>
            <td>房子产权人</td>
            <td>建筑面积</td>
          </tr>
          <tr>
            <td>{OtherInfoData?.house_owner}</td>
            <td>{OtherInfoData?.house_area}</td>
          </tr>
          <tr>
            <td>房屋类型</td>
            <td>危房等级</td>
          </tr>
          <tr>
            <td>{OtherInfoData?.house_type}</td>
            <td>{OtherInfoData?.house_condition}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  // });
};

export default OtherInfo;
