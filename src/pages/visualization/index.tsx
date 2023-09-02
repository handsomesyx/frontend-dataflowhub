// import { useQuery } from '@apollo/client';

// import { Card } from 'antd';
// import { visualLargeScreenInterface } from '@/apis';
import { useQuery } from '@apollo/client';
// import { useMount } from 'ahooks';
import { useState } from 'react';

import { visualLargeScreenInterface } from '@/apis';
import Left from '@/pages/visualization/component/left';
import Right from '@/pages/visualization/component/right';
import MapOfMohe from '@/pages/visualization/mapOfMohe';

function Visualization() {
  const { loading: loading } = useQuery(visualLargeScreenInterface, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setCountData(data?.getAll);
    },
  });
  const [countData, setCountData] = useState<CountData>({
    basicInformationAboutTheWarranty: {
      totalNumberOfMeshes: 1, //  网格总数
      totalNumberOfGridMen: 1, // 网格员总数
      totalNumberOfCivilianPolice: 1, // 民警总数
    },
    partyBuildingLeads: {
      grassrootsPartyOrganizations: 1, // 党员总数
      party: 1, // 党员总数
    },
    basicInformation: {
      totalNumberOfHouseholds: 1, // 总户数
      population: 1, // 总人口
      temporaryResidents: 1, // 暂住人员
      rentalHousing: 1, // 出租房屋
    },
    combinationOfSpecializedGroups: {
      A: 1, // A类
      B: 1, // B类
      C: 1, // C类
      D: 1, // D类
    },
    contradictoryDisputeSituations: {
      numberOfTroubleshoots: 1, // 排查数
      numberOfSolutions: 1, // 解决数
    },
  });
  const basicInformationAboutTheWarranty: MapData[] = [
    {
      name: '网格总数',
      url: 'wanggezongshu.png',
      count: countData.basicInformationAboutTheWarranty.totalNumberOfMeshes,
      route: '/basic-information/administrativeRegion',
    },
    {
      name: '民警数',
      url: 'minjingshu.png',
      count: countData.basicInformationAboutTheWarranty.totalNumberOfCivilianPolice,
      route: '/user-manager/police',
    },
    {
      name: '网格员数',
      url: 'renshu.png',
      count: countData.basicInformationAboutTheWarranty.totalNumberOfGridMen,
      route: '/user-manager/grid',
    },
  ];
  const partyBuildingLeads: MapData[] = [
    {
      name: '基层党员数',
      url: 'renshu.png',
      count: countData.partyBuildingLeads.party,
      route: '/population-manager/person-search/partyMember',
    },
    {
      name: '基层党组织数',
      url: 'jicengdangzuzhishu.png',
      count: countData.partyBuildingLeads.grassrootsPartyOrganizations,
      route: '/population-manager/person-search/partyMember',
    },
  ];
  const combinationOfSpecializedGroupsData: RightMapData[] = [
    {
      left: {
        name: 'A类人数',
        url: 'renshu.png',
        count: countData.combinationOfSpecializedGroups.A,
        route: '/population-manager/person-search/A',
      },
      right: {
        name: 'B类人数',
        url: 'renshu.png',
        count: countData.combinationOfSpecializedGroups.B,
        route: '/population-manager/person-search/B',
      },
    },
    {
      left: {
        name: 'C类人数',
        url: 'renshu.png',
        count: countData.combinationOfSpecializedGroups.C,
        route: '/population-manager/person-search/C',
      },
      right: {
        name: 'D类人数',
        url: 'renshu.png',
        count: countData.combinationOfSpecializedGroups.D,
        route: '/population-manager/person-search/D',
      },
    },
  ];
  const basicInformationData: RightMapData[] = [
    {
      left: {
        name: '总户数',
        url: 'zonghushu.png',
        count: countData.basicInformation.totalNumberOfHouseholds,
        route: '/population-manager/person-search',
      },
      right: {
        name: '总人口',
        url: 'zongrenkou.png',
        count: countData.basicInformation.population,
        route: '/population-manager/person-search',
      },
    },
    {
      left: {
        name: '暂住人员',
        url: 'renshu.png',
        count: countData.basicInformation.temporaryResidents,
        route: '/population-manager/person-search/temporary',
      },
      right: {
        name: '出租房屋',
        url: 'chuzufangwu.png',
        count: countData.basicInformation.rentalHousing,
        route: '/population-manager/person-search/rent',
      },
    },
  ];
  const contradictoryDisputeSituationsData: RightMapData[] = [
    {
      left: {
        name: '排查数',
        url: 'paichashu.png',
        count: countData.contradictoryDisputeSituations.numberOfTroubleshoots,
        route: '/event-management',
      },
      right: {
        name: '解决数',
        url: 'jiejueshu.png',
        count: countData.contradictoryDisputeSituations.numberOfSolutions,
        route: '/event-management/solved',
      },
    },
  ];
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#2471FA',
        backgroundImage: 'url("/bg.png")',
        backgroundSize: '100% 100%',
      }}
    >
      <div>
        <div
          style={{
            width: '400px',
            float: 'left',
          }}
          className="left"
        >
          <Left
            name={'包保基础信息'}
            data={basicInformationAboutTheWarranty}
            loading={loading}
            route="/basic-information/administrativeRegion"
          />
          <Left
            name={'党建引领'}
            data={partyBuildingLeads}
            loading={loading}
            route="/population-manager/person-search"
          />
        </div>

        <div
          style={{
            float: 'left',
            width: 'calc(100% - 820px)',
            height: '100vh',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '70%',
              textAlign: 'center',
              background: 'linear-gradient(360deg, #2471FA 0%, #0F1E68 100%)',
              boxShadow: '0px 1px 3px 0px rgba(0,99,233,1)',
              borderRadius: '5px 5px 0px 0px',
              opacity: 0.75,
              filter: 'blur(0px)',
            }}
          >
            <MapOfMohe />
          </div>
        </div>
        <div
          style={{
            width: '400px',
            float: 'right',
          }}
          className="right"
        >
          <Right
            name={'专群信息'}
            data={combinationOfSpecializedGroupsData}
            loading={loading}
            route="/population-manager/person-search"
          />
          <Right
            name="基础信息"
            data={basicInformationData}
            loading={loading}
            route="/population-manager/person-search"
          />
          <Right
            name={'矛盾纠纷情况'}
            data={contradictoryDisputeSituationsData}
            loading={loading}
            route="/event-management"
          />
        </div>
      </div>

      <img
        style={{
          width: '100%',
          position: 'absolute',
          bottom: '1px',
          left: '1px',
        }}
        alt="xia"
        src="/xia.png"
      />
    </div>
  );
}
export default Visualization;
