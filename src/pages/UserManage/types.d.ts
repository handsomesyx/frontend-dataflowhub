export type TableDataType = {
  id: number;
  username: string | null;
  role_name: string;
  grid_name: string;
  create_time: Date;
  update_time: Date;
};

export type DataType = {
  id: number;
  username: string | null;
  real_name: string | null;
  role_name: string | null;
  grid_name: string | null;
  create_time: string;
  update_time: string;
  role_id: number;
  id_card: string;
  password: string;
  head_url: string;
  mobile: string;
  grid_id: number | null;
  police_user_id: number | null;
  policestation: number | null;
};

export type Role_userInputType = {
  role_id: number;
  police_station_id?: number;
  grid_id?: number;
};

export type SelectObject = {
  username?: string;
  area_id?: number;
  community_id?: number;
  grid_id?: number;
  role_id?: number;
  police_station_id?: number | null;
  role_community_id?: number | null;
  role_grid_id?: number | null;
};

export type Area = {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
};

export type Grid = {
  id: number;
  name: string;
  area_id: number;
};

export type Police = {
  police_user_id: number;
  real_name: string;
  areaid: number[];
};
