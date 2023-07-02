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
//  获取待审
export const QUERY_AUDITS = gql`
  query {
    findManyAudit(select: { status: 0 }, skip: 0, take: 1000) {
      count
      data {
        action_type
        create_time
        creator_id
        id
        is_delete
        officer_info {
          real_name
        }
        priority
        request_data
        request_time
        review_comments
        review_time
        status
        person_info {
          real_name
          id
        }
        update_time
        updater_id
        user_info {
          real_name
        }
      }
    }
  }
`;
//  获取审核通过
export const QUERY_OK = gql`
  query {
    findManyAudit(select: { status: 1 }, skip: 0, take: 1000) {
      count
      data {
        action_type
        create_time
        creator_id
        id
        is_delete
        officer_info {
          real_name
        }
        priority
        request_data
        request_time
        review_comments
        review_time
        person_info {
          real_name
          id
        }
        status
        update_time
        updater_id
        user_info {
          real_name
        }
      }
    }
  }
`;
//  获取审核失败
export const QUERY_REFUSE = gql`
  query {
    findManyAudit(select: { status: 2 }, skip: 0, take: 1000) {
      count
      data {
        action_type
        create_time
        creator_id
        id
        is_delete
        officer_info {
          real_name
        }
        priority
        request_data
        request_time
        review_comments
        review_time
        status
        update_time
        person_info {
          real_name
          id
        }
        updater_id
        user_info {
          real_name
        }
      }
    }
  }
`;
//  删除
export const DELETE_AUDIT_MUTATION = gql`
  mutation DeleteAuditRecord($rightnow_auditrecords_id: Int!) {
    deleteAudit(rightnow_auditrecords_id: $rightnow_auditrecords_id)
  }
`;
//  获取变更
export const GET_AUDIT_CHANGE = gql`
  query GetChangeRecords($rightnow_auditrecords_id: Int!) {
    getChangeRecord(rightnow_auditrecords_id: $rightnow_auditrecords_id) {
      audit_records_id
      change_item
      change_time
      content_after
      content_before
      create_time
      creator_id
      id
      is_delete
      personal_info {
        gender
        head_url
        id
        id_card
        is_delete
        mobile
        real_name
        role
        role_id
        status
        username
      }
      update_time
      updater_id
    }
  }
`;
//  修改审核信息
export const UPDATE_AUDIT = gql`
  mutation UpdateAudit($new_data: auditCreateInput!, $rightnow_auditrecords_id: Int!) {
    updateAudit(new_data: $new_data, rightnow_auditrecords_id: $rightnow_auditrecords_id)
  }
`;

// FindManyArea随便取的名字，（&data:data）前一个data和接口参数名一致，后一个data代表类型，
// 第二个findManyArea是接口的名字，（data:$data）第一个data是接口参数名，第二个是上一行的$data{}是返回的数据
export const FindManyArea = gql`
  query findManyArea($skip: Int!, $take: Int!) {
    findManyArea(skip: $skip, take: $take) {
      id
      leader {
        gender
        head_url
        id
        id_card
        is_delete
        mobile
        real_name
        role
        role_id
        status
        username
      }
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
  query findManyCommunity($skip: Int!, $take: Int!) {
    findManyCommunity(skip: $skip, take: $take) {
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
  query findManyGrid($skip: Int!, $take: Int!) {
    findManyGrid(skip: $skip, take: $take) {
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
  query findManyPolicestation($skip: Int!, $take: Int!) {
    findManyPolicestation(skip: $skip, take: $take) {
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
  mutation createArea($data: administrativeareaCreateInput!) {
    createArea(data: $data) {
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
  mutation createCommunity($data: communityCreateInput!) {
    createCommunity(data: $data) {
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
  mutation createGrid($data: gridCreateInput!) {
    createGrid(data: $data) {
      area_leader_info {
        gender
        head_url
        id
        id_card
        is_delete
        mobile
        real_name
        role
        role_id
        status
        username
      }
      grid_leader_info {
        gender
        head_url
        id
        id_card
        is_delete
        mobile
        real_name
        role
        role_id
        status
        username
      }
      create_time
      id
      area_id
      creator_id
      area_info {
        create_time
        creator_id
        id
        is_delete
        leader {
          gender
          head_url
          id
          id_card
          is_delete
          mobile
          real_name
          role
          role_id
          status
          username
        }
      }
      id
      is_delete
      name
      update_time
      updater_id
    }
  }
`;
export const CreatePolicestation = gql`
  mutation createPolicestation($data: policestationCreateInput!) {
    createPolicestation(data: $data) {
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
  ) {
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
    $id: Int!
    $priority: Int!
    $familyData: CreateFamilyInfoDto!
  ) {
    createFamilyInfo(id: $id, priority: $priority, familyData: $familyData)
  }
`;

export const UpdatePeopleInfo = gql`
  mutation updatePeopleInfo($id: Int!, $priority: Int!, $changeRecord: manyChangeInfo!) {
    updatePeopleInfo(id: $id, priority: $priority, changeRecord: $changeRecord)
  }
`;

export const DeleteFamilyInfo = gql`
  mutation deleteFamilyInfo($id: Int!, $priority: Int!, $memberId: Int!) {
    deleteFamilyInfo(id: $id, priority: $priority, memberId: $memberId)
  }
`;

export const DeletePeopleInfo = gql`
  mutation deletePeopleInfo($id: Int!, $priority: Int!) {
    deletePeopleInfo(id: $id, priority: $priority)
  }
`;

export const FindFamilyMember = gql`
  query findFamilyMemberInfo($pesonal_id: Int!) {
    findFamilyMemberInfo(pesonal_id: $pesonal_id) {
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

/**
 *
 * @description 警员下拉选择框
 */
export const getSelectPolicer = gql`
  query getSelectPolicer($id: Int!) {
    getSelectPolicer(police_station_id: $id) {
      message
      selectPolicer {
        id
        name
      }
    }
  }
`;

/**
 *@description 网格下拉选择框
 */
export const getSelectGrid = gql`
  query getSelectGrid($admin_id: Int, $police_station_id: Int, $policer_id: Int) {
    getSelectGrid(
      option: {
        admin_id: $admin_id
        police_station_id: $police_station_id
        policer_id: $policer_id
      }
    ) {
      message
      selectGrid {
        id
        name
      }
    }
  }
`;

/**
 * @description 行政区域下拉选择框
 */
export const getSelectAdmin = gql`
  query getSelectAdmin {
    getSelectAdmin {
      message
      selectAdmin {
        id
        name
      }
    }
  }
`;

/**
 * @description 人员详情接口查看
 */
export const getPeopleData = gql`
  query getPeopleData($personal_id: Int!, $isDelete: Boolean!) {
    getPeopleData(personal_id: $personal_id, isDelete: $isDelete) {
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
        height
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
          disability_subsidy
          disability_type
          severe_disability_subsidy
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
/**
 * @description 人员查询接口筛选接口  人口管理界面
 */

export const getPeopleDataFilter = gql`
  query getPeopleDataFilter(
    $content: PeoeleManageInput!
    $pagingOption: PagingOption!
    $isDelete: Boolean!
  ) {
    getPeopleDataFilter(
      content: $content
      pagingOption: $pagingOption
      isDelete: $isDelete
    ) {
      data {
        age
        certificate_type
        creator_id
        classification_reason
        # create_Time
        current_address
        date_of_residence
        former_name
        grid_user_id
        height
        id
        id_card
        name
        nationality
        nickname
        person_classification
        petition
        phone
        head_url
        pinyin
        religion
        residence
        update_time
        gender
        updater_id
      }
      info {
        isStart
        message
      }
      total
    }
  }
`;
/**
 *  @description 搜索引擎
 */

export const mainSearch = gql`
  query mainSearch(
    $content: String!
    $option: MainSearchOption!
    $pagingOption: PagingOption!
  ) {
    mainSearch(content: $content, option: $option, pagingOption: $pagingOption) {
      #   info{
      #   isStart
      #   message
      # }
      # data{
      #   id_card
      #   indexcreate
      #   pname
      #   current_address
      # }
      data {
        age
        current_address
        did
        disability_level
        document_id
        education
        familyInfo {
          household_id
          id
          id_card
          member_id
          member_relation
          name
          phone
        }
        former_name
        gender
        grid_user_id
        height
        id_card
        indexcreate
        indexupdate
        marriage_status
        nationality
        nickname
        party_organization
        person_classification
        phone
        pid
        pinyin
        pname
        poid
        political_status
        propertyinfo {
          car_plate
          id
        }
        religion
        residence
        school
        table_name
      }
      info {
        isStart
        message
      }
      total
    }
  }
`;

/**
 * @description  获取派出所下来菜单
 */

export const getSelectPoliceStation = gql`
  query getSelectPoliceStation {
    getSelectPoliceStation {
      selectPoliceStation {
        id
        name
      }
    }
  }
`;

export const visualLargeScreenInterface = gql`
  query getAll {
    getAll {
      basicInformation {
        population
        totalNumberOfHouseholds
        temporaryResidents
        rentalHousing
      }
      basicInformationAboutTheWarranty {
        totalNumberOfMeshes
        totalNumberOfGridMen
        totalNumberOfCivilianPolice
      }
      partyBuildingLeads {
        grassrootsPartyOrganizations
        party
      }
      combinationOfSpecializedGroups {
        A
        B
        C
        D
      }
      contradictoryDisputeSituations {
        numberOfTroubleshoots
        numberOfSolutions
      }
    }
  }
`;

export const DeletePolicestation = gql`
  mutation deletePolicestation($id: Int!) {
    deletePolicestation(id: $id)
  }
`;

export const DeleteArea = gql`
  mutation deleteArea($id: Int!) {
    deleteArea(id: $id)
  }
`;

export const DeleteGrid = gql`
  mutation deleteGrid($id: Int!) {
    deleteGrid(id: $id)
  }
`;

export const DeleteCommunity = gql`
  mutation deleteCommunity($id: Int!) {
    deleteCommunity(id: $id)
  }
`;

export const UpdateArea = gql`
  mutation updateArea(
    $new_data: administrativeareaCreateInput!
    $rightnow_area_id: Int!
    $rightnow_policestation_id: Int
  ) {
    updateArea(
      new_data: $new_data
      rightnow_area_id: $rightnow_area_id
      rightnow_policestation_id: $rightnow_policestation_id
    )
  }
`;

export const UpdateCommunity = gql`
  mutation updateCommunity(
    $new_data: communityCreateInput!
    $rightnow_community_id: Int!
    $rightnow_grid_id: Int
    $rightnow_policestation_id: Int
  ) {
    updateCommunity(
      new_data: $new_data
      rightnow_community_id: $rightnow_community_id
      rightnow_grid_id: $rightnow_grid_id
      rightnow_policestation_id: $rightnow_policestation_id
    )
  }
`;

export const UpdateGrid = gql`
  mutation updateGrid($new_data: gridCreateInput!, $rightnow_grid_id: Int!) {
    updateGrid(new_data: $new_data, rightnow_grid_id: $rightnow_grid_id)
  }
`;

export const UpdatePolicestation = gql`
  mutation updatePolicestation(
    $new_data: policestationCreateInput!
    $rightnow_pstation_id: Int!
  ) {
    updatePolicestation(new_data: $new_data, rightnow_pstation_id: $rightnow_pstation_id)
  }
`;

export const FindUser = gql`
  query findUser($name: String!, $role: String!) {
    findUser(name: $name, role: $role) {
      gender
      head_url
      id
      id_card
      is_delete
      mobile
      real_name
      role
      role_id
      status
      username
    }
  }
`;

export const GetPoliceInfo = gql`
  query getPoliceInfo($rightnow_policestation_id: Int!, $role: Int) {
    getPoliceInfo(rightnow_policestation_id: $rightnow_policestation_id, role: $role) {
      gender
      head_url
      id
      id_card
      is_delete
      mobile
      real_name
      role
      status
      username
    }
  }
`;

export const CountGrid = gql`
  query countGrid {
    countGrid
  }
`;

export const AddPolice = gql`
  mutation addPolice($rightnow_policestation_id: Int!, $user_id: Int!) {
    addPolice(rightnow_policestation_id: $rightnow_policestation_id, user_id: $user_id)
  }
`;

export const DeletePolice = gql`
  mutation deletePolice($user_id: Int!) {
    deletePolice(user_id: $user_id)
  }
`;
/**
 * @description 登录接口
 */
export const login = gql`
  mutation login($username: String!, $password: String!) {
    login(data: { username: $username, password: $password }) {
      accessToken
      refreshToken
      user {
        role
        username
        id
      }
    }
  }
`;

/**
 * @description 获取新的accesstoken
 */
export const RefreshToken = gql`
  mutation refreshToken($refresh_token: JWT!) {
    refreshToken(token: $refresh_token) {
      accessToken
      refreshToken
    }
  }
`;

// 增加人员
export const CreatePerson = gql`
  mutation create($input: personCreateInput!, $input2: role_userCreateInput!) {
    createPerson(input: $input, input2: $input2) {
      username
      id
    }
  }
`;

// 删除人员
export const DeletePerson = gql`
  mutation deletePerson($id: Int!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

// 修改人员信息
export const UpdatePerson = gql`
  mutation update($id: Int!, $input: personCreateInput!, $input2: role_userCreateInput!) {
    updatePerson(id: $id, input: $input, input2: $input2) {
      id
      username
    }
  }
`;

// 查询人员信息
export const GetPerson = gql`
  query getPerson($skip: Int!, $take: Int!, $selectOption: selectOptionInput!) {
    getPerson(skip: $skip, take: $take, selectOption: $selectOption) {
      data {
        id
        username
        role_name
        grid_name
        create_time
        update_time
        role_id
        id_card
        password
        head_url
        mobile
      }
      total
    }
  }
`;

// 查询角色表
export const GetRole = gql`
  query getRole {
    getRole {
      id
      name
      remark
    }
  }
`;

// 查询警员
export const GetPolice = gql`
  query getPolice {
    getPolice {
      police_user_id
      username
    }
  }
`;

// 查询网格
export const GetGrid = gql`
  query getGrid {
    getGrid {
      id
      name
      area_id
    }
  }
`;

export const GetArea = gql`
  query getArea {
    getArea {
      id
      name
      parent_id
      level
    }
  }
`;

export const eventManagementGetsAListOfEvents = gql`
  query queryReportInfoList($processing_status: String, $skip: Int, $take: Int) {
    queryReportInfoList(processing_status: $processing_status, skip: $skip, take: $take) {
      data {
        id
        classification_basis
        create_time
        creator_id
        image_url
        is_delete
        issue_level
        police_id
        police_opinion
        priority
        processing_status
        processing_time
        public_demand
        public_opinion
        report_address
        report_time
        report_user {
          real_name
        }
        reporter_evaluate
        reporter_id
        reporter_star_rating
        update_time
        updater_id
      }
      total
    }
  }
`;

export const addAnEventGridMember = gql`
  mutation addReportInfo($addReportInput: AddReportInput!) {
    addReportInfo(addReportInput: $addReportInput) {
      id
      classification_basis
      create_time
      creator_id
      image_url
    }
  }
`;

export const modifyTheEventInformation = gql`
  mutation modifyReportInfo($ModifyReportInput: ModifyReportInput!) {
    modifyReportInfo(modifyReportInput: $ModifyReportInput) {
      id
    }
  }
`;
