// import type { eventData } from '@/pages/IncidentManagement/type';

export function dealEventData(data: any) {
  let tempData = { ...data };
  switch (tempData.issue_level) {
    case 'A':
      tempData.issue_level = 'NEIGHBORHOOD_DISPUTE';
      break;
    case 'B':
      tempData.issue_level = 'PETITION';
      break;
    case 'C':
      tempData.issue_level = 'NORMAL_DEMAND';
      break;
    default:
      tempData.issue_level = 'NEIGHBORHOOD_DISPUTE';
      break;
  }
  switch (tempData.priority) {
    case 1:
      tempData.priority = 'CRITICAL';
      break;
    case 2:
      tempData.priority = 'URGENT';
      break;
    case 3:
      tempData.priority = 'NORMAL';
      break;
  }
  return tempData;
}
