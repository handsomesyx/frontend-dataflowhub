type LeftType = {
  name: string;
  data: MapData[];
  loading: boolean;
  route?: string;
};
type MapData = {
  url: string;
  count: number;
  name: string;
  route: string;
};
type RightType = {
  name: string;
  data: RightMapData[];
  loading: boolean;
  route?: string;
};

type RightMapData = {
  left: MapData;
  right: MapData;
};
type CountData = {
  basicInformationAboutTheWarranty: basicInformationAboutTheWarranty; //  包保基础信息
  partyBuildingLeads: partyBuildingLeads; // 党建引领
  basicInformation: basicInformation; // 基础信息
  combinationOfSpecializedGroups: combinationOfSpecializedGroups; // 专群结合
  contradictoryDisputeSituations: contradictoryDisputeSituations; // 矛盾纠纷情况
};
type basicInformationAboutTheWarranty = {
  //  包保基础信息
  totalNumberOfMeshes: number; //  网格总数
  totalNumberOfGridMen: number; // 网格员总数
  totalNumberOfCivilianPolice: number; // 民警总数
};

type partyBuildingLeads = {
  // 党建引领
  grassrootsPartyOrganizations: number; // 基层党组织
  party: number; // 党员
};

type keyTargetInformation = {
  // 重点目标信息
  flammableAndExplosive: number; // 易燃易爆
  finance: number; // 金融
  educate: number; // 教育
  partyAndGovernmentOrgans: number; // 党政机关
  livelihood: number; // 民生
};

type basicInformation = {
  // 基础信息
  totalNumberOfHouseholds: number; // 总户数
  population: number; // 总人口
  temporaryResidents: number; // 暂住人员
  rentalHousing: number; // 出租房屋
};

type combinationOfSpecializedGroups = {
  // 专群结合
  A: number; // A类
  B: number; // B类
  C: number; // C类
  D: number; // D类
};

type contradictoryDisputeSituations = {
  // 矛盾纠纷情况
  numberOfTroubleshoots: number; // 排查数
  numberOfSolutions: number; // 解决数
};
