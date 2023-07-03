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
      /* 这个option是没有点的 echarts  */
      // const option = {
      //   title: {
      //     text: '漠河市地图',
      //     x: 'center',
      //     textStyle: {
      //       color: 'black',
      //     },
      //   },
      //   series: [
      //     {
      //       type: 'map',
      //       map: '漠河',
      //       mapLocation: {
      //         y: 60,
      //       },
      //       label: {
      //         normal: {
      //           show: true,
      //           color: 'white', // 不触摸时地图上文字颜色
      //         },
      //         emphasis: {
      //           textStyle: {
      //             color: 'black', // 触摸时地图上文字颜色
      //           },
      //         },
      //       },
      //       itemStyle: {
      //         normal: {
      //           areaColor: 'white', // 不触摸是地图颜色
      //         },
      //         emphasis: {
      //           areaColor: 'red', // 触摸时地图颜色
      //         },
      //       },
      //     },
      //     {
      //       name: '漠河',
      //       type: 'scatter',
      //       coordinateSystem: 'geo',
      //       color: ['#000000'],
      //       makePoint: {
      //         data: [
      //           {
      //             name: '最大值',
      //             type: 'max'
      //           },
      //           {
      //             name: '某个坐标',
      //             coord: [10, 20]
      //           }, {
      //             name: '固定 x 像素位置',
      //             yAxis: 10,
      //             x: '90%'
      //           },
      //
      //           {
      //             name: '某个屏幕坐标',
      //             x: 100,
      //             y: 100
      //           }
      //         ]
      //       }
      //     },
      //   ],
      // };

      const option2 = {
        color: ['#5470c6'],
        tooltip: {
          trigger: 'item',
          renderMode: 'html',
          // 触发方式
          triggerOn: 'click',
          enterable: true,
          backgroundColor: '#fff',
          padding: 0,
          textStyle: {
            color: '#000',
            fontSize: '12',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
        dispatchAction: {
          type: 'downplay',
        },
        roam: false,
        roamController: {
          show: true,
          x: 'right',
          mapTypeControl: {
            china: true,
          },
        },
        series: [
          {
            name: '',
            type: 'scatter',
            coordinateSystem: 'geo',
            color: ['#000'],
            tooltip: {
              position: 'right',
              color: '#000',
              formatter(d: any) {
                // console.log(d, 'd');
                return `<div >${d.data.name}</div>`;
              },
            },
            data: [
              {
                name: '图强林业局',
                value: [122.860397, 53.172922],
              },
              {
                name: '兴安镇',
                value: [123.999657, 53.398249],
              },
              {
                name: '西林吉镇',
                value: [122.901597, 53.031933],
              },
              {
                name: '西林吉林业局',
                value: [121.568003, 52.812684],
              },
              {
                name: '阿木尔镇',
                value: [123.130838, 52.863651],
              },
              {
                name: '阿木尔林业局',
                value: [123.158647, 52.88199],
              },
              {
                name: '北极镇',
                value: [122.486693, 53.454799],
              },
              {
                name: '图强镇',
                value: [122.780748, 52.933544],
              },
            ],
          },
        ],
        geo: {
          show: true,
          map: '漠河',
          type: 'map',
          mapType: 'anhui',
          roam: false,
          label: {
            normal: {
              // 显示省份标签
              show: false,
              textStyle: {
                color: '#fff',
                fontSize: 10,
              },
            },
            emphasis: {
              // 对应的鼠标悬浮效果
              show: true,
              // 选中后的字体样式
              textStyle: {
                color: '#000',
                fontSize: 14,
              },
            },
          },
          itemStyle: {
            color: '#ddb926',
            normal: {
              areaColor: '#8abcd1',
              borderColor: '#fff',
              borderWidth: 1,
            },
            emphasis: {
              borderWidth: 0.5,
              borderColor: '#8abcd1',
              areaColor: '#fff',
            },
          },
          emphasis: {
            label: {
              show: false,
            },
          },
        },
      };
      mapInstance.setOption(option2);
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
