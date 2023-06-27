/* eslint-disable max-len */

import styles from './style.module.less';

// 全部传入没有传空
export type ProductionType = {
  planting_breeding: string; // 种植养殖情况
  plant_type: string; // 种植种类
  plant_quantity: number; // 种植数量
  plant_area: number; // 种植面积
  breeding_type: string; // 养殖种类
  breeding_quantity: number; // 养殖数量

  business_info: string; // 营商情况(商户名称)
  business_location: string; // 门面位置
  license_number: string; // 营业执照编号
  fire_equipment_type: string; // 门面消防设备类型
  fire_equipment_quantity: number; // 门面消防设备数量
  surveillance_status: string; // 门面电子监控状态
  surveillance_quantity: number; // 门面电子监控数量
};

// 民政卫健
const Production = ({ ProductionData }: any) => {
  return ProductionData?.map((item: any, index: number) => {
    return (
      <div className={styles.HealthInfoBox} key={index}>
        <table>
          <tbody>
            <tr>
              <td className="FirstWidth" rowSpan={4}>
                种植养殖情况
              </td>
              <td>种植种类</td>
              <td>种植数量</td>
              <td>种植面积</td>
            </tr>
            <tr>
              <td>{item?.planting_breeding}</td>
              <td>{item?.plant_type || '- -'}</td>
              <td>{item?.plant_area || '- -'}</td>
            </tr>
            <tr>
              <td>养殖种类</td>
              <td>养殖数量</td>
              <td></td>
            </tr>
            <tr>
              <td>{item?.breeding_type}</td>
              <td>{item?.breeding_quantity || '- -'}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table style={{ marginTop: 10 }}>
          <tbody>
            <tr>
              <td className="FirstWidth" rowSpan={6}>
                营商情况
              </td>
              <td>商户名称</td>
              <td>门面位置</td>
              <td>营业执照编号</td>
            </tr>
            <tr>
              <td>{item?.business_info}</td>
              <td>{item?.business_location}</td>
              <td>{item?.license_number}</td>
            </tr>
            <tr>
              <td>门面消防设备类型</td>
              <td>门面消防设备数量</td>
              <td>门面电子监控状态</td>
            </tr>
            <tr>
              <td>{item?.fire_equipment_type}</td>
              <td>{item?.fire_equipment_quantity || '- -'}</td>
              <td>{item?.surveillance_status}</td>
            </tr>
            <tr>
              <td>门面电子监控数量</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>{item?.surveillance_quantity || '- -'}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  });
};

export default Production;
