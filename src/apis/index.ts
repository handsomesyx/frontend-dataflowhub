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
  query  {
    findManyAudit(
      select: { status: 0 }
      skip: 0
      take: 1000
    ) {
      count
    data{
      action_type
create_time
creator_id
id
is_delete
officer_info{real_name}
priority
request_data
request_time
review_comments
review_time
status
person_info{real_name,id}
update_time
updater_id
user_info{real_name}}
    }
  }
`;
//  获取审核通过
export const QUERY_OK = gql`
  query  {
    findManyAudit(
      select: { status: 1 }
      skip: 0
      take: 1000
    ) {
      count
      data{
      action_type
create_time
creator_id
id
is_delete
officer_info{real_name}
priority
request_data
request_time
review_comments
review_time
person_info{real_name,id}
status
update_time
updater_id
user_info{real_name}}
    }
  }
`;
//  获取审核失败
export const QUERY_REFUSE = gql`
  query  {
    findManyAudit(
      select: { status: 2 }
      skip: 0
      take: 1000
    ) {
      count
      data{
      action_type
create_time
creator_id
id
is_delete
officer_info{real_name}
priority
request_data
request_time
review_comments
review_time
status
update_time
person_info{real_name,id}
updater_id
user_info{real_name}}
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
export const GET_AUDIT_CHANGE = gql`query {
  getChangeRecord(rightnow_auditrecords_id:8){
  audit_records_id
  change_item
  change_time
  content_after
  content_before
  create_time
  creator_id
  id
  is_delete
  personal_info{gender
  head_url
  id
  id_card
  is_delete
  mobile
  real_name
  role
  status
  username}
  update_time
  updater_id}}`;
  //  修改审核信息
  export const UPDATE_AUDIT = gql`
  mutation UpdateAudit($new_data: auditCreateInput!, $rightnow_auditrecords_id: Int!) {
    updateAudit(new_data: $new_data, rightnow_auditrecords_id: $rightnow_auditrecords_id)
  }
`;