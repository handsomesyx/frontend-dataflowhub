export type basicInfo = {
  name: string;
  certificateType?: number;
  idCard: string;
  phone: string;
  residence: string;
  currentAddress: string;
  pinyin: string;
  nickname: string;
  formerName: string;
  dateOfResidence: string;
  age: number;
  height: number;
  headUrl?: string;
  gender: boolean;
  // # userId: number
  // # petition: string
  // creatorId: number;
};
export type getbasicInfo = {
  id: number;
  name: string;
  // certificateType: number;
  id_card: string;
  phone: string;
  residence: string;
  current_address: string;
  pinyin: string;
  nickname: string;
  former_name: string;
  date_of_residence: string;
  age: number;
  height: number;
  head_url: string;
  gender: boolean;
  // # userId: number
  // # petition: string
  // creatorId: number;
};
export type basicCreateInfo = {
  name: string;
  certificateType: number;
  idCard: string;
  phone: string;
  residence: string;
  currentAddress: string;
  pinyin: string;
  nickname: string;
  formerName: string;
  dateOfResidence: Date;
  age: number;
  height: number;
  headUrl: string;
  gender: boolean;
  // # userId: number
  // # petition: string
  // creatorId: number;
};

export type familyInfo = {
  householdId: string;
  memberId: number;
  memberRelation: string;
  creatorId: number;
  name?: string;
  idCard: string;
  phone?: string;
};
export type getfamilyInfo = {
  household_id: string;
  member_id?: number;
  member_relation: string;
  creatorId: number;
  name?: string;
  idCard: string;
  phone?: string;
};

export type healthInfo = {
  personalId?: number;
  childNumber: number;
  specialGroup: string;
  healthInsurance: string;
  pensionInsurance: string;
  vaccinationStatus: string;
  proofContraindication: string;
  marriageStatus: string;
  supervisorName: string;
  otherConditions: string;
  creatorId?: number;
};

export type getHealthInfo = {
  child_number: string;
  special_group: string;
  health_insurance: string;
  pension_insurance: string;
  vaccination_status: string;
  proof_contraindication: string;
  marriage_status: string; // 婚姻状态
  other_conditions: string;
  disability_id?: string; // 残疾证编号
  disability_type?: string; // 残疾类型
  disability_subsidy?: number; // 困难残疾补贴
  severe_disability_subsidy?: number; // 重度残疾补贴
  disability_level?: number; // 残疾级别
  supervisor_name?: string; // 监管
};

export type disabilityInfo = {
  personalId?: number;
  disabilityId: string;
  disabilitySubsidy: number;
  servereDisabilitySub: number;
  disabilityType: string;
  disabilityLevel: number;
  creatorId?: number;
};

export type getdisabilityInfo = {
  personal_id?: number;
  disability_id: string;
  disability_subsidy: number;
  severe_disability_subsidy: number;
  disability_type: string;
  disability_level: number;
};

export type politicalInfo = {
  personalId?: number;
  workUnit: string;
  position: string;
  politicalStatus: string;
  party?: string;
  religion: string;
  nationality: string;
  education: string;
  militaryService: string;
  school: string;
  creatorId?: number;
  partyOrganization?: string;
};

export type economicInfo = {
  personalId?: number;
  plantingBreeding?: string;
  plantType: string;
  plantQuantity: number;
  plantArea: number;
  breedingType: string;
  breedingQuantity: number;
  bussinessInfo: string;
  businessLocation: string;
  licenseNum: string;
  fireEquipmentType: string;
  fireEquipmentQuantity: number;
  surStatus: string;
  surQuantity: number;
  creatorId?: number;
};

export type propertyInfo = {
  personalId?: number;
  houseInfo: string;
  houseOwner: string;
  houseArea: number;
  houseCondition: string;
  hobbies: string;
  carModal: string;
  carPlate: string;
  carOwner: string;
  carColor: string;
  houseType: string;
  smokingStatus: number;
  VolunteerStatus?: JSON;
  SocialWorker?: JSON;
  drivingLicenseType: string;
  creatorId?: number;
};

export type changeInfo = {
  changeTime?: Date;
  changeItem: string;
  ItemName: string;
  contentBefore: string;
  contentAfter: string;
  perosonalId?: number;
  auditRecordsId?: number;
};

export type WarrantorType = {
  community: string;
  gridding: string;
  gridPersonName: string;
  gridPersonId?: string;
  girdPersonPhone: string;
  policeName: string;
  policePhone: string;
  police: string;
};
