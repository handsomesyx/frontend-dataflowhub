import axios from 'axios';

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'https://www.easy-mock.com/mock/5c6b6b1815b74a0aacc7a902/xyy';

// POST传参序列化
axios.interceptors.request.use(
  (config) => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    _.toast('错误的传参', 'fail');
    return Promise.reject(error);
  },
);

// 返回状态判断
axios.interceptors.response.use(
  (res) => {
    if (!res.data.success) {
      // _.toast(res.data.msg);
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    _.toast('网络异常', 'fail');
    return Promise.reject(error);
  },
);

export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
    console;
    axios
      .post(url, params)
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        },
      )
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchDelete(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: params,
      })
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        },
      )
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: param,
      })
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        },
      )
      .catch((error) => {
        reject(error);
      });
  });
}
export default {
  GetDemoDashData(params) {
    return fetchPost('/api/demoDashData', params);
  },
  //  获取待审
  QUERY_AUDITS(params) {
    return fetchPost('/api/findManyAudit', params);
  },
  //  获取审核通过
  QUERY_OK(params) {
    return fetchPost('/api/findManyAudit', params);
  },
  //  获取审核失败
  QUERY_REFUSE(params) {
    return fetchPost('/api/findManyAudit', params);
  },
  // 删除审核
  DELETE_AUDIT_MUTATION(rightnow_auditrecords_id) {
    return fetchPost('/api/DeleteAuditRecord', rightnow_auditrecords_id);
  },
  //  获取变更
  GET_AUDIT_CHANGE(rightnow_auditrecords_id) {
    return fetchGet('/api/GetChangeRecords', rightnow_auditrecords_id);
  },
  //  修改审核信息
  UPDATE_AUDIT(params) {
    return fetchPost('/api/UpdateAudit', params);
  },
  // 基础信息的行政管理区域、警局管理
  FindManyArea(params) {
    return fetchPost('/api/findManyArea', params);
  },

  FindManyCommunity(params) {
    return fetchPost('/api/findManyGrid', params);
  },

  FindManyGrid(params) {
    return fetchPost('/api/findManyGrid', params);
  },

  FindManyPolicestation(params) {
    return fetchPost('/api/findManyPolicestation', params);
  },

  CreateArea(params) {
    return fetchPost('/api/createArea', params);
  },

  CreateCommunity(params) {
    return fetchPost('/api/createCommunity', params);
  },

  CreateGrid(params) {
    return fetchPost('/api/createGrid', params);
  },

  CreatePolicestation(params) {
    return fetchPost('/api/createPolicestation', params);
  },

  DeletePolicestation(id) {
    return fetchDelete('/api/deletePolicestation', id);
  },

  DeleteArea(id) {
    return fetchDelete('/api/deleteArea', id);
  },
  DeleteGrid(id) {
    return fetchDelete('/api/deleteGrid', id);
  },

  DeleteCommunity(id) {
    return fetchDelete('/api/deleteCommunity', id);
  },

  UpdateArea(params) {
    return fetchPost('/api/updateArea', params);
  },
  UpdateCommunity(params) {
    return fetchPost('/api/updateCommunity', params);
  },

  UpdateGrid(params) {
    return fetchPost('/api/updateGrid', params);
  },

  UpdatePolicestation(params) {
    return fetchPost('/api/updatePolicestation', params);
  },

  FindUser(params) {
    return fetchPost('/api/findUser', params);
  },

  GetPoliceInfo(params) {
    return fetchPost('/api/getPoliceInfo', params);
  },

  CountGrid(params) {
    return fetchPost('/api/countGrid', params);
  },

  AddPolice(params) {
    return fetchPost('/api/addPolice', params);
  },
  DeletePolice(user_id) {
    return fetchDelete('/api/deletePolice', user_id);
  },

  CreatePeopleInfo(params) {
    return fetchPost('/api/createPeopleInfo', params);
  },

  CreateFamilyInfo(params) {
    return fetchPost('/api/createFamilyInfo', params);
  },

  UpdatePeopleInfo(params) {
    return fetchPost('/api/updatePeopleInfo', params);
  },

  DeleteFamilyInfo(params) {
    return fetchPost('/api/deleteFamilyInfo', params);
  },

  DeletePeopleInfo(params) {
    return fetchPost('/api/deletePeopleInfo', params);
  },

  FindFamilyMember(params) {
    return fetchPost('/api/findFamilyMemberInfo', params);
  },
  /**
   *
   * @description 警员下拉选择框
   */
  getSelectPolicer(params) {
    return fetchGet('/api/getSelectPolicer', params);
  },
  /**
   *@description 网格下拉选择框
   */
  getSelectGrid(params) {
    return fetchPost('/api/getSelectGrid', params);
  },
  /**
   * @description 行政区域下拉选择框
   */
  getSelectAdmin(params) {
    return fetchPost('/api/getSelectAdmin', params);
  },
  /**
   * @description 人员详情接口查看
   */

  getPeopleData(params) {
    return fetchPost('/api/getPeopleData', params);
  },

  /**
   * @description 人员查询接口筛选接口  人口管理界面
   */
  getPeopleDataFilter(params) {
    return fetchPost('/api/getPeopleDataFilter', params);
  },

  /**
   *  @description 搜索引擎
   */
  mainSearch(params) {
    return fetchPost('/api/mainSearch', params);
  },

  /**
   * @description  获取派出所下来菜单
   */
  getSelectPoliceStation(params) {
    return fetchPost('/api/getSelectPoliceStation', params);
  },

  visualLargeScreenInterface(params) {
    return fetchPost('/api/getAll', params);
  },

  // 增加人员
  CreatePerson(params) {
    return fetchPost('/api/create', params);
  },

  // 删除人员
  DeletePerson(params) {
    return fetchPost('/api/deletePerson', params);
  },

  // 修改人员信息
  UpdatePerson(params) {
    return fetchPost('/api/update', params);
  },

  // 查询人员信息
  GetPerson(params) {
    return fetchPost('/api/getPerson', params);
  },

  // 查询角色表
  GetRole(params) {
    return fetchPost('/api/getRole', params);
  },

  // 查询警员
  GetPolice(params) {
    return fetchPost('/api/getPolice', params);
  },

  // 查询网格
  GetGrid(params) {
    return fetchPost('/api/getGrid', params);
  },

  // 查询派出所信息
  GetPolicestation(params) {
    return fetchPost('/api/getPolicestation', params);
  },

  GetArea(params) {
    return fetchPost('/api/getArea', params);
  },

  // 获取所有用户登录日志
  GetAllUserLoginLogs(params) {
    return fetchPost('/api/getAllUserLoginLogs', params);
  },

  // 获取所有用户操作日志
  GetAllUserOperateLogs(params) {
    return fetchPost('/api/getAllUserOperateLogs', params);
  },

  // 获取当前用户的信息
  GetCurrentUser(params) {
    return fetchPost('/api/me', params);
  },

  // 获取所有已处理的事件
  GetAllHandledEvents(params) {
    return fetchPost('/api/getAllHandledEvents', params);
  },

  // 获取所有未处理的事件
  GetAllUnhandledEvents(params) {
    return fetchPost('/api/getAllUnhandledEvents', params);
  },

  getChangeRecordByPersonalId(params) {
    return fetchPost('/api/getChangeRecordByPersonalId', params);
  },

  eventManagementGetsAListOfEvents(params) {
    return fetchPost('/api/queryReportInfoList', params);
  },

  addAnEventGridMember(params) {
    return fetchPost('/api/addReportInfo', params);
  },

  modifyTheEventInformation(params) {
    return fetchPost('/api/modifyReportInfo', params);
  },

  UpdateClassification(params) {
    return fetchPost('/api/updatePeopleClassification', params);
  },
};
