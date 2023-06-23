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
