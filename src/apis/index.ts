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


export const FindManyArea = gql`
  query findManyArea($skip:Int!,$take:Int!) {
    findManyArea(skip:$skip,take:$take) {
      id
      leader{
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
  query findManyGrid($select:gridWhereInput,$skip:Int,$take:Int) {
    findManyGrid(select:$select,skip:$skip,take:$take) {
      count
      data {
        area_leader_info{
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
        id
        creator_id
        update_time
        create_time
        is_delete
        updater_id
        name
        grid_leader_info{
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
        area_info{
          create_time
          creator_id
          id
          is_delete
          leader{
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
          level
          name
          parent_id
          update_time
          updater_id
        }
      }
    }
  }
`;

export const FindManyPolicestation = gql`
  query findManyPolicestation($select:pstationWhereInput,$skip:Int,$take:Int) {
    findManyPolicestation(select:$select,skip:$skip,take:$take) {
    count
    data{
      area
      id
      creator_id
      update_time
      name
      create_time
      is_delete
      updater_id
      user_id
      police_count
      policeleader_name
    }
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
      area_leader_info{
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
      grid_leader_info{
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
      area_info{
        create_time
        creator_id
        id
        is_delete
        leader{
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

export const DeletePolicestation = gql`
mutation deletePolicestation($id:Int!){
  deletePolicestation(id:$id)
}
`;

export const DeleteArea = gql`
mutation deleteArea($id:Int!){
  deleteArea(id:$id)
}
`;

export const DeleteGrid = gql`
mutation deleteGrid($id:Int!){
  deleteGrid(id:$id)
}
`;

export const DeleteCommunity = gql`
mutation deleteCommunity($id:Int!){
  deleteCommunity(id:$id)
}
`;

export const UpdateArea = gql`
mutation updateArea($new_data:administrativeareaCreateInput!,
  $rightnow_area_id:Int!,$rightnow_policestation_id:Int){
    updateArea(new_data:$new_data,
        rightnow_area_id:$rightnow_area_id,
        rightnow_policestation_id:$rightnow_policestation_id)
  }
`;

export const UpdateCommunity = gql`
mutation updateCommunity($new_data:communityCreateInput!,
  $rightnow_community_id:Int!,$rightnow_grid_id:Int,$rightnow_policestation_id:Int){
    updateCommunity(new_data:$new_data,
      rightnow_community_id:$rightnow_community_id,
      rightnow_grid_id:$rightnow_grid_id,
      rightnow_policestation_id:$rightnow_policestation_id)
  }
`;

export const UpdateGrid = gql`
mutation updateGrid($new_data:gridCreateInput!,$rightnow_grid_id:Int!){
    updateGrid(new_data:$new_data,
      rightnow_grid_id:$rightnow_grid_id)
  }
`;

export const UpdatePolicestation = gql`
mutation updatePolicestation($new_data:policestationCreateInput!,$rightnow_pstation_id:Int!){
    updatePolicestation(new_data:$new_data,
      rightnow_pstation_id:$rightnow_pstation_id)
  }
`;

export const FindUser = gql`
query findUser($name:String!,$role:String!){
  findUser(name:$name,role:$role) {
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
query getPoliceInfo($rightnow_policestation_id:Int!,$role:Int){
  getPoliceInfo(rightnow_policestation_id:$rightnow_policestation_id,role:$role){
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
mutation addPolice($rightnow_policestation_id:Int!,$user_id:Int!){
  addPolice(rightnow_policestation_id:$rightnow_policestation_id,
    user_id:$user_id)
}
`;

export const DeletePolice = gql`
mutation deletePolice($user_id:Int!){
  deletePolice(user_id:$user_id)
}
`;