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

export const QUERY_AUDITS = gql`
  query  {
    findManyAudit(
      select: { status: 1 }
      skip: 0
      take: 1000
    ) {
      id
      action_type
      create_time
      creator_id
      is_delete
      officer_id
    officer_name
    review_comments
    status
    update_time
    updater_id
    }
  }
`;

