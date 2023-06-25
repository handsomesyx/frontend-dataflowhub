import { gql } from '@apollo/client';

export const GetDemoDashData = gql`
  query getDemoDashData($endTime: Int!) {
    inbounds(end_time: $endTime) {
      date
      total
    }
    outbounds(end_time: $endTime) {
      date
      total
    }
    domesticIp(end_time: $endTime) {
      date
      total
    }
    overseasIp(end_time: $endTime) {
      date
      total
    }
    totalOutFlow(end_time: $endTime) {
      country
      number
    }
  }
`;

// FindManyArea随便取的名字，（&data:data）前一个data和接口参数名一致，后一个data代表类型，
// 第二个findManyArea是接口的名字，（data:$data）第一个data是接口参数名，第二个是上一行的$data{}是返回的数据
export const FindManyArea = gql`
  query findManyArea($skip:Int!,$take:Int!) {
    findManyArea(skip:$skip,take:$take) {
      id
      create_time
      creator_id
      is_delete
      level
      name
      parent_id
      update_time
      updater_id
    }
  }
`;

export const FindManyCommunity = gql`
  query findManyCommunity($skip:Int!,$take:Int!) {
    findManyCommunity(skip:$skip,take:$take) {
    id
    update_time
    create_time
    administrative_area_id
    creator_id
    is_delete
    name
    updater_id
    user_id
    }
  }
`;

export const FindManyGrid = gql`
  query findManyGrid($skip:Int!,$take:Int!) {
    findManyGrid(skip:$skip,take:$take) {
      area_id
      id
      creator_id
      update_time
      create_time
      is_delete
      updater_id
      user_id
    }
  }
`;

export const FindManyPolicestation = gql`
  query findManyPolicestation($skip:Int!,$take:Int!) {
    findManyPolicestation(skip:$skip,take:$take) {
    id
    creator_id
    update_time
    name
    create_time
    is_delete
    updater_id
    user_id
    }
  }
`;

export const CreateArea = gql`
  mutation createArea($data:administrativeareaCreateInput!) {
    createArea(data:$data) {
      name
      id
      creator_id
      create_time
      is_delete
      level
      parent_id
      updater_id
      update_time
    }
  }
`;

export const CreateCommunity = gql`
  mutation createCommunity($data:communityCreateInput!) {
    createCommunity(data:$data) {
    id
    administrative_area_id
    user_id
    create_time
    creator_id
    is_delete
    name
    update_time
    updater_id
    }
  }
`;

export const CreateGrid = gql`
  mutation createGrid($data:gridCreateInput!) {
    createGrid(data:$data) {
      id
      area_id
      creator_id
      create_time
      is_delete
      updater_id
      update_time
      user_id
    }
  }
`;
export const CreatePolicestation = gql`
  mutation createPolicestation($data:policestationCreateInput!) {
    createPolicestation(data:$data) {
    id
    creator_id
    update_time
    create_time
    is_delete
    name
    updater_id
    user_id
    }
  }
`;

export const CreatePeopleInfo = gql`
mutation createPeopleInfo(
  $createBasicInfoInput: manyBasicInfo!
  $createDisabilityInfoInput: manyDisabilityInfo!
  $createEconomicInfoInput: manyEconomicInfo!
  $createHealthInfoInput: manyHealthInfo!
  $createPoliticalInfoInput: manyPoliticalInfo!
  $createPropertyInfoInput: manyPropertyInfo!
  $priority: Int!
){
  createPeopleInfo(
    createBasicInfoInput: $createBasicInfoInput
    createDisabilityInfoInput: $createDisabilityInfoInput
    createEconomicInfoInput: $createEconomicInfoInput
    createHealthInfoInput: $createHealthInfoInput
    createPoliticalInfoInput: $createPoliticalInfoInput
    createPropertyInfoInput: $createPropertyInfoInput
    priority: $priority
  )
}
`;

export const CreateFamilyInfo = gql`
  mutation createFamilyInfo(
    $id: Int!,
    $priority: Int!,
    $familyData: CreateFamilyInfoDto!
  ) {
    createFamilyInfo(
      id:$id,
      priority:$priority,
      familyData: $familyData
    )
  }
`;

export const UpdatePeopleInfo = gql`
  mutation updatePeopleInfo(
  $id: Int!
  $priority: Int!
  $changeRecord: manyChangeInfo!

  ){
    updatePeopleInfo(
      id: $id,
      priority: $priority
      changeRecord: $changeRecord
    )
  }
`;

export const DeleteFamilyInfo = gql`
  mutation deleteFamilyInfo(
    $id: Int!
    $priority: Int!
    $memberId: Int!
  ){
    deleteFamilyInfo(
      id: $id
      priority: $priority
      memberId: $memberId
    )
  }
`;


export const DeletePeopleInfo = gql`
  mutation deletePeopleInfo(
    $id: Int!
    $priority: Int!
  ){
    deletePeopleInfo(
      id: $id
      priority: $priority
    )
  }
`;

export const FindFamilyMember = gql`
  query findFamilyMemberInfo(
    $pesonal_id: Int!
  ){
    findFamilyMemberInfo(
      pesonal_id: $pesonal_id
    ){
      idCard
      id
      householdId
      memberRelation
      name
      phone
      personalId
      memberId
    }
  }
`;

export const getPeopleData = gql`
  query getPeopleData($personal_id: Int!) {
    getPeopleData(personal_id: $personal_id) {
      isFound
      message
      peopleData {
        age
        classification_reason
        # community
        create_time
        creator_id
        current_address
        date_of_residence
        former_name
        gender
        grid
        grid_user_id
        head_url
        # height
        id
        id_card
        name
        nickname
        person_classification
        petition
        phone
        pinyin
        policeStation
        residence
        update_time
        updater_id

        bBData {
          grid_name
          grid_phone
          grid_user_name
          # police_name
          police_phone
        }
        disableData {
          disability_id
          disability_level
          # disability_subsidy
          disability_type
          # severe_disability_subsidy
        }
        economicData {
          breeding_quantity
          breeding_type
          business_info
          business_location
          fire_equipment_quantity
          fire_equipment_type
          plant_quantity
          plant_type
          planting_area
          surveillance_quantity
          surveillance_status
        }
        family {
          household_id
          id
          id_card
          member_id
          member_relation
          name
          phone
        }

        healthData {
          child_number
          health_insurance
          marriage_status
          other_conditions
          pension_insurance
          proof_contraindication
          special_group
          supervisor
          vaccination_status
        }
        history {
          current_address
          phone
          update_time
        }
        politicalData {
          education
          military_service
          nationality
          party_organization
          political_status
          position
          religion
          school
          work_unit
        }
        propertyData {
          car_color
          car_model
          car_owner
          car_plate
          driving_license_type
          hobbies
          house_area
          house_condition
          house_owner
          house_type
          smoking_status
          volunteer_status
        }
        reportInfoArr {
          classification_basis
          issue_level
          public_demand
          public_opinion
        }
      }
    }
  }
`;