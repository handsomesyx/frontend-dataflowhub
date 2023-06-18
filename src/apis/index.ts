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
officer_id
officer_name
priority
request_data
request_time
review_comments
review_time
status
update_time
updater_id
user_id
user_name}
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
officer_id
officer_name
priority
request_data
request_time
review_comments
review_time
status
update_time
updater_id
user_id
user_name}
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
officer_id
officer_name
priority
request_data
request_time
review_comments
review_time
status
update_time
updater_id
user_id
user_name}
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