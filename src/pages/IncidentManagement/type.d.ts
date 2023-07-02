export interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
interface temp {
  // id
  id: number;
  // 事件信息
  eventInformation: string;
  // 网格员
  gridMan: string;
  // 紧急状态 1，2，3
  emergency: number;
  // 上报地点
  placeOfEscalation: string | null;
  // 上报时间
  reportingTime: string;
  // 处理时间
  processingTime: string | null;
}
interface user {
  id: number;
  real_name: string;
}

interface eventData {
  classification_basis: string | null;
  create_time: date;
  creator_id: number | null;
  id: number;
  image_url: string | null;
  is_delete: boolean | null;
  issue_level: string | null;
  police_id: number | null;
  police_opinion: string | null;
  priority: number | null;
  processing_status: string | null;
  processing_time: date | null;
  public_demand: string | null;
  public_opinion: string | null;
  report_address: string | null;
  report_time: date | null;
  report_user: user | null;
  reporter_evaluate: string | null;
  reporter_id: number | null;
  reporter_star_rating: number | null;
  update_time: date | null;
  updater_id: number | null;
}
