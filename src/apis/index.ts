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
