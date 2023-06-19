import { useMount } from 'ahooks';
import * as echarts from 'echarts';
import { useRef } from 'react';

import moheJson from '../../assets/mohe.json';
// import { geoJson } from "../../assets/mohe.json";

function MapOfMohe() {
  const ref = useRef(null);
  let mapInstance = null;

  const renderChart = () => {
    if (ref !== null && ref.current !== null) {
      // 基于准备好的dom，初始化echarts实例
      echarts.registerMap('漠河', moheJson as any);
      mapInstance = echarts.init(ref.current);
      const option = {
        title: {
          text: '漠河市地图',
          x: 'center',
          textStyle: {
            color: 'white',
          },
        },
        series: [
          {
            type: 'map',
            map: '漠河',
            mapLocation: {
              y: 60,
            },
            label: {
              normal: {
                show: true,
                color: 'white', // 不触摸时地图上文字颜色
              },
              emphasis: {
                textStyle: {
                  color: 'black', // 触摸时地图上文字颜色
                },
              },
            },
            itemStyle: {
              normal: {
                areaColor: 'white', // 不触摸是地图颜色
              },
              emphasis: {
                areaColor: 'red', // 触摸时地图颜色
              },
            },
          },
        ],
      };
      mapInstance.setOption(option);
    }
  };

  useMount(() => {
    renderChart();
  });

  return (
    <div>
      <div style={{ width: '100%', height: '52vh', margin: '0  auto' }} ref={ref}></div>
    </div>
  );
}
export default MapOfMohe;
