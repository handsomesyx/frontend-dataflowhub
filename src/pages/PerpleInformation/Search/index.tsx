import 'dayjs/locale/zh-cn';

import { useLazyQuery, useQuery } from '@apollo/client';
import {
  Cascader,
  ConfigProvider,
  DatePicker,
  Empty,
  Input,
  Pagination,
  Select,
  Spin,
} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import Layout from 'antd/es/layout/layout';
import Watermark from 'antd/es/watermark';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import * as ExcelJs from 'exceljs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getPeopleDataFilter,
  getSelectAdmin,
  getSelectGrid,
  getSelectPolicer,
  getSelectPoliceStation,
} from '@/apis';
import { getUserType } from '@/store/SaveToken';
import { getRealName, getUserIdCard } from '@/store/SaveToken';
import { saveWorkbook } from '@/utils/ExportExcel';

import BasicShowList from './BasicShowList';
import city from './cities.json';
import classificationReason from './classificatonReason.json';
import nationality from './nationality.json';
import religion from './religion.json';
import SearchIcon from './search.svg';
import special_group from './special_group.json';
import styles from './style.module.less';
const { RangePicker } = DatePicker;
type filterType = {
  administrative_area_id: number | undefined;
  age: number | undefined;
  createtimedown: number | undefined;
  createtimeup: number | undefined;
  current_address: string | undefined;
  gender: boolean | undefined;
  grid_id: number | undefined;
  id_card: string | undefined;
  name: string | undefined;
  nationality: string | undefined;
  nickname: string | undefined;
  person_classification: string | undefined;
  phone: string | undefined;
  police_station_id: number | undefined;
  police_user_id: number | undefined;
  religion: string | undefined;
  residence: string | undefined;
  updatetimedown: number | undefined;
  updatetimeup: number | undefined;
  special_group: string | undefined;
  house_info: string | undefined;
};

// 控制数据请求 筛选  筛选后的内容会传递给子组件BasicShowList展示
const SearchBasic = () => {
  const params = useParams();
  // 保存所有的筛选数据
  const [filterData, setFilterData] = useState<filterType>({
    administrative_area_id: undefined,
    age: undefined,
    createtimedown: undefined,
    createtimeup: undefined,
    current_address: undefined,
    gender: undefined,
    grid_id: undefined,
    id_card: undefined,
    name: undefined,
    nationality: undefined,
    nickname: undefined,
    person_classification: undefined,
    phone: undefined,
    police_station_id: undefined,
    police_user_id: undefined,
    religion: undefined,
    residence: undefined,
    updatetimedown: undefined,
    updatetimeup: undefined,
    special_group: undefined,
    house_info: undefined,
  });

  // 记录旧的筛选数据  点击分页的时候使用   防止没有点击查询查询条件变更问题
  const [filterDataOld, setFilterDataOld] = useState<filterType>({
    administrative_area_id: undefined,
    age: undefined,
    createtimedown: undefined,
    createtimeup: undefined,
    current_address: undefined,
    gender: undefined,
    grid_id: undefined,
    id_card: undefined,
    name: undefined,
    nationality: undefined,
    nickname: undefined,
    person_classification: undefined,
    phone: undefined,
    police_station_id: undefined,
    police_user_id: undefined,
    religion: undefined,
    residence: undefined,
    updatetimedown: undefined,
    updatetimeup: undefined,
    special_group: undefined,
    house_info: undefined,
  });
  // 网格员筛选数据获取
  const { data: gridData } = useQuery(getSelectGrid, {
    variables: {
      policer_id: filterData?.police_user_id,
      police_station_id: filterData.police_station_id,
      admin_id: filterData?.administrative_area_id,
    },
    nextFetchPolicy: 'network-only',
    fetchPolicy: 'network-only',
  });

  const [isshowSearch, setShowSearch] = useState(true);
  const [isPolice, setIsPolice] = useState(false);
  // 获取派出所内容
  const { data: policeStationData } = useQuery(getSelectPoliceStation);

  // 选中的派出所
  const [policeStationId, setPoliceStationId] = useState();

  // huoqu警员下拉框数据
  const { data: police } = useQuery(getSelectPolicer, {
    variables: {
      id: policeStationId,
    },
    nextFetchPolicy: 'network-only',
    fetchPolicy: 'network-only',
  });

  // 选中的警员
  const [policeValue, setPoliceValue] = useState<any>();

  // 选中的网格
  const [gridSelect, setGridSelect] = useState<any>();

  // 选中的行政区域
  const [regionalSelect, setRegionalSelect] = useState<any>();

  // 行政区域数据
  const { data: regional } = useQuery(getSelectAdmin);

  // 页码
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: undefined,
  });

  const current: any = pagination.current;
  const pageSize: any = pagination.pageSize;
  const skip = (current - 1) * pageSize;
  const take = pageSize;
  const changePage = (current: any, pageSize: any) => {
    setPagination((pre) => {
      return {
        ...pre,
        current: current,
        pageSize: pageSize,
      };
    });
  };
  const currentChange = (current: any) => {
    setPagination((pre) => {
      return {
        ...pre,
        current,
      };
    });
  };
  const [getFilterPeopleData, { data: peopleData, loading, error }] =
    useLazyQuery(getPeopleDataFilter);

  const [getFilterPeopleDataExport] = useLazyQuery(getPeopleDataFilter);

  // 首次加载
  useEffect(() => {
    const role = getUserType();
    if (role === 'filmPolice' || role === 'Director') {
      setIsPolice(true);
    }
    let select = {};
    if (params.content) {
      if (params.content === 'partyMember') {
        select = {
          political_status: '中共党员',
        };
      } else if (params.content === 'rent') {
        select = {
          house_info: '出租户',
        };
      } else if (params.content === 'temporary') {
        select = {
          people: '暂住人员',
        };
      } else {
        select = {
          person_classification: params.content,
        };
        setFilterDataOld((e) => {
          return {
            ...e,
            person_classification: params.content,
          };
        });
        setFilterData((e) => {
          return {
            ...e,
            person_classification: params.content,
          };
        });
      }
    }
    getFilterPeopleData({
      variables: {
        isDelete: false,
        content: select,
        pagingOption: {
          skip: skip,
          take: take,
        },
      },
    }).then(({ data }) => {
      setPagination((pre) => {
        return {
          ...pre,
          total: data?.getPeopleDataFilter?.total,
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 分页的时候使用旧的数据进行筛选
  useEffect(() => {
    console.log(filterDataOld);
    getFilterPeopleData({
      variables: {
        isDelete: false,
        content: { ...filterDataOld },
        pagingOption: {
          skip: skip,
          take: take,
        },
      },
    }).then(({ data }) => {
      setPagination((pre) => {
        return {
          ...pre,
          total: data?.getPeopleDataFilter?.total,
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.current, pagination?.pageSize]);

  const navigate = useNavigate();

  /* 处理是否展开菜单 */
  const handleShowSearch = () => {
    const topElem = document.getElementById('TopSearchHidden');
    if (topElem) {
      if (isshowSearch) {
        topElem.style.maxHeight = '0';
      }
      if (!isshowSearch) {
        topElem.style.maxHeight = '250px';
      }
    }
    setShowSearch((pre) => !pre);
  };

  const showMadal = () => {
    navigate('/population-manager/person-management-add');
  };

  // 处理传入展示列表页面BasicShowList的数据
  const datalist = () => {
    return peopleData?.getPeopleDataFilter?.data?.map((item: any) => {
      return {
        head_url: item?.head_url,
        basicsinfo: '',
        name: item?.name,
        former_name: item?.former_name || '--',
        pinyin: item?.pinyin,
        cardid: item?.id_card,
        phone: item?.phone || '--',
        nickname: item?.nickname || '--',
        placeDomicile: item?.residence,
        currentAddress: item?.current_address,
        level: item?.person_classification,
        id: item?.id,
      };
    });
  };

  // 籍贯选择内容转换 并存储到filterData中
  const onChange = (value: any) => {
    if (value) {
      const newValue = value.join('');
      setFilterData((pre) => {
        return {
          ...pre,
          residence: newValue,
        };
      });
    }
  };
  // console.log('filter', filterData);
  const handleTimeChange = (value: any) => {
    if (value) {
      const timeup = new Date(value[1].$d);
      const timedown = new Date(value[0].$d);
      setFilterData((pre) => {
        return {
          ...pre,
          updatetimeup: timeup.getTime(),
          updatetimedown: timedown.getTime(),
        };
      });
    } else {
      setFilterData((pre) => {
        return {
          ...pre,
          updatetimeup: undefined,
          updatetimedown: undefined,
        };
      });
    }
  };

  const handleinTimeChange = (value: any) => {
    if (value) {
      const timeup = new Date(value[1].$d);
      const timedown = new Date(value[0].$d);
      setFilterData((pre) => {
        return {
          ...pre,
          createtimeup: timeup.getTime(),
          createtimedown: timedown.getTime(),
        };
      });
    } else {
      setFilterData((pre) => {
        return {
          ...pre,
          createtimeup: undefined,
          createtimedown: undefined,
        };
      });
    }
  };

  // 籍贯筛选
  const filter: any = (inputValue: any, path: any) => {
    return path.some((option: any) => option.label.indexOf(inputValue) > -1);
  };

  const handleSearch = () => {
    setFilterDataOld(filterData);
    getFilterPeopleData({
      variables: {
        content: { ...filterData },
        pagingOption: {
          skip: skip,
          take: take,
        },
        isDelete: false,
      },
    }).then(({ data }) => {
      // 注意将页面恢复1
      setPagination((pre) => {
        return {
          ...pre,
          current: 1,
          pageSize: 5,
          total: data?.getPeopleDataFilter?.total,
        };
      });
    });
  };

  const handleSetPoliceStation = (e: any) => {
    setPoliceStationId(e);
    setPoliceValue(undefined);
    setFilterData((pre) => {
      return {
        ...pre,
        police_station_id: e,
      };
    });
  };

  // 数据输出到fliter中代码  针对input组件
  const handleFliterData = (a: any, dataName: string) => {
    let e = a.target.value;
    if (dataName === 'age' && e !== '') {
      e = Number(e);
    }
    if (e === '') {
      e = undefined;
    }
    setFilterData((pre: any) => {
      return {
        ...pre,
        [dataName]: e,
        person_classification: undefined,
        house_info: undefined,
        people: undefined,
        political_status: undefined,
      };
    });
  };
  // 数据输出到fliter中 针对select组件
  const handleFliterDataSelect = (a: any, dataName: string) => {
    if (dataName === 'house_info') {
      setFilterData((pre: any) => {
        return { ...pre, [dataName]: a };
      });
    } else {
      // 如果没有选择房子信息，则要将可视化传过来的参数去掉
      setFilterData((pre: any) => {
        return {
          ...pre,
          [dataName]: a,
          house_info: undefined,
        };
      });
    }
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
  };

  function formatLocalDate(aa: any) {
    if (aa) {
      let timestamp = parseInt(aa);
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } else return '--';
  }

  const exportInfo = () => {
    getFilterPeopleDataExport({
      variables: {
        isDelete: false,
        content: { ...filterData },
        pagingOption: {
          skip: 0,
          take: Number(pagination?.total),
        },
      },
    }).then(({ data }) => {
      console.log(data);
      const Data = data.getPeopleDataFilter.data;
      let volunteerArr: string[];
      let socailArr: string[];
      let exportData: any = [];
      Data.map((item: any, index: number) => {
        let people = item?.detail?.peopleData;
        let por = item?.detail?.peopleData?.propertyData[0];
        let sex = people.gender ? '女' : '男';
        console.log(por);

        let smoking_status = por.smoking_status === 0 ? '否' : '是';
        if (por?.volunteer_status) {
          volunteerArr = Object.values(por?.volunteer_status);
          volunteerArr = volunteerArr.map((item, index) => {
            return item[index + 1];
          });
        } else {
          volunteerArr = [];
        }

        if (por?.social_worker) {
          socailArr = Object.values(por?.social_worker);
          socailArr = socailArr.map((item, index) => {
            return item[index + 1];
          });
        } else {
          socailArr = [];
        }

        exportData.push({
          id: index,
          // 基础信息
          name: item?.detail?.peopleData?.name,
          card: item?.detail?.peopleData?.id_card,
          residence: item?.detail?.peopleData?.residence,
          spell: item?.detail?.peopleData?.pinyin,
          phone: item?.detail?.peopleData?.phone,
          currentAddress: item?.detail?.peopleData?.current_address,
          formerName: item?.detail?.peopleData?.former_name,
          nickName: item?.detail?.peopleData?.nickname,
          liveComeTime: formatLocalDate(item?.detail?.peopleData?.date_of_residence),
          age: item?.detail?.peopleData?.age,
          height: item?.detail?.peopleData?.height,
          sex: sex,
          // 专群结合
          level: item?.detail?.peopleData?.person_classification,
          reason: item?.detail?.peopleData?.classification_reason,
          petition: item?.detail?.peopleData?.petition,
          // 民政卫健
          child_number: item?.detail?.peopleData?.healthData?.child_number,
          marriage_status: item?.detail?.peopleData?.healthData?.marriage_status,
          health_insurance: item?.detail?.peopleData?.healthData?.health_insurance,
          pension_insurance: item?.detail?.peopleData?.healthData?.pension_insurance,
          vaccination_status: item?.detail?.peopleData?.healthData?.vaccination_status,
          proof_contraindication:
            item?.detail?.peopleData?.healthData?.proof_contraindication,
          other_conditions: item?.detail?.peopleData?.healthData?.other_conditions,
          special_group: item?.detail?.peopleData?.healthData?.special_group,
          supervisor: item?.detail?.peopleData?.healthData?.supervisor, // 监管
          disability_id: item?.detail?.peopleData?.disableData?.disability_id, // 残疾证编号
          disability_type: item?.detail?.peopleData?.disableData?.disability_type, // 残疾类型
          disability_subsidy: item?.detail?.peopleData?.disableData?.disability_subsidy, // 困难残疾补贴用0代表空
          severe_disability_subsidy:
            item?.detail?.peopleData?.disableData?.severe_disability_subsidy, // 重度残疾补贴
          disability_level: item?.detail?.peopleData?.disableData?.disability_level, // 残疾级别
          // 民生
          issue_level: item?.detail?.peopleData?.reportInfoArr?.issue_level,
          classification_basis:
            item?.detail?.peopleData?.reportInfoArr?.classification_basis,
          public_demand: item?.detail?.peopleData?.reportInfoArr?.public_demand,
          public_opinion: item?.detail?.peopleData?.reportInfoArr?.public_opinion,
          // 政治教育
          work_unit: item?.detail?.peopleData?.politicalData?.work_unit,
          position: item?.detail?.peopleData?.politicalData?.position,
          political_status: item?.detail?.peopleData?.politicalData?.political_status,
          party_organization: item?.detail?.peopleData?.politicalData?.party_organization,
          religion: item?.detail?.peopleData?.politicalData?.religion,
          nationality: item?.detail?.peopleData?.politicalData?.nationality,
          education: item?.detail?.peopleData?.politicalData?.education,
          military_service: item?.detail?.peopleData?.politicalData?.military_service,
          school: item?.detail?.peopleData?.politicalData?.school,
          // 种植
          plant_type: item?.detail?.peopleData?.economicData[0]?.plant_type, // 种植种类
          plant_quantity: item?.detail?.peopleData?.economicData[0]?.plant_quantity, // 种植数量
          planting_area: item?.detail?.peopleData?.economicData[0]?.planting_area, // 种植面积
          breeding_type: item?.detail?.peopleData?.economicData[0]?.breeding_type, // 养殖种类
          breeding_quantity: item?.detail?.peopleData?.economicData[0]?.breeding_quantity, // 养殖数量
          business_info: item?.detail?.peopleData?.economicData[0]?.business_info, // 营商情况(商户名称)
          business_location: item?.detail?.peopleData?.economicData[0]?.business_location, // 门面位置
          license_number: item?.detail?.peopleData?.economicData[0]?.license_number, // 营业执照编号
          fire_equipment_type:
            item?.detail?.peopleData?.economicData[0]?.fire_equipment_type, // 门面消防设备类型
          fire_equipment_quantity:
            item?.detail?.peopleData?.economicData[0]?.fire_equipment_quantity, // 门面消防设备数量
          surveillance_status:
            item?.detail?.peopleData?.economicData[0]?.surveillance_status, // 门面电子监控状态
          surveillance_quantity:
            item?.detail?.peopleData?.economicData[0]?.surveillance_quantity, //
          // 其他
          house_info: item?.detail?.peopleData?.propertyData[0]?.house_info, // 房子信息 开关没有暂时没用上
          house_owner: item?.detail?.peopleData?.propertyData[0]?.house_owner, // 房子产权人
          house_area: item?.detail?.peopleData?.propertyData[0]?.house_area, // 建筑面积 平方米
          house_type: item?.detail?.peopleData?.propertyData[0]?.house_type, // 房屋类型
          house_condition: item?.detail?.peopleData?.propertyData[0]?.house_condition, // 危房等级
          hobbies: item?.detail?.peopleData?.propertyData[0]?.hobbies, // 兴趣爱好
          smoking_status: smoking_status, // 吸烟是否  必选
          car_model: item?.detail?.peopleData?.propertyData[0]?.car_model, // 车型号（可选）
          car_color: item?.detail?.peopleData?.propertyData[0]?.car_color, // 车身颜色（可选）
          car_plate: item?.detail?.peopleData?.propertyData[0]?.car_plate, // 车牌照（可选）
          car_owner: item?.detail?.peopleData?.propertyData[0]?.car_owner, // 车辆所有人（可选）
          driving_license_type:
            item?.detail?.peopleData?.propertyData[0]?.driving_license_type, // 驾驶证类型（可选）
          volunteer_status: volunteerArr?.toString(),
          social_worker: socailArr?.toString(),
          // 包保人员
          gridPersonName: item?.detail?.peopleData?.bBData?.grid_user_name,
          // gridPersonId: item?.detail?.peopleData?.bBData?.grid_user_name,
          girdPersonPhone: item?.detail?.peopleData?.bBData?.grid_phone,
          policeName: item?.detail?.peopleData?.bBData?.police_name,
          policePhone: item?.detail?.peopleData?.bBData?.police_phone,
        });
      });
      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet('demo sheet');
      worksheet.properties.defaultRowHeight = 20;
      worksheet.columns = [
        { header: '序号', key: 'id', width: 12 },
        { header: '本人姓名', key: 'name', width: 12 },
        { header: '身份证号', key: 'card', width: 12 },
        { header: '绰号', key: 'nickName', width: 12 },
        { header: '姓名拼音', key: 'spell', width: 12 },
        { header: '联系方式', key: 'phone', width: 12 },
        { header: '曾用名', key: 'formerName', width: 12 },
        { header: '户籍所在地', key: 'residence', width: 12 },
        { header: '性别', key: 'sex', width: 12 },
        { header: '身高', key: 'height', width: 12 },
        { header: '年龄', key: 'age', width: 12 },
        { header: '现住址', key: 'currentAddress', width: 12 },
        { header: '何时来本地居住', key: 'liveComeTime', width: 12 },
        { header: '人员分级类别', key: 'level', width: 12 },
        { header: '分类依据', key: 'reason', width: 12 },
        { header: '上访诉求', key: 'petition', width: 12 },
        { header: '事情分级类别', key: 'issue_level', width: 12 },
        { header: '分类依据', key: 'classification_basis', width: 12 },
        { header: '群众需求', key: 'public_demand', width: 12 },
        { header: '群众意见建议', key: 'public_opinion', width: 12 },
        { header: '生育儿女数量', key: 'child_number', width: 12 },
        { header: '婚姻状态', key: 'marriage_status', width: 12 },
        { header: '医疗保险情况', key: 'health_insurance', width: 12 },
        { header: '养老保险情况', key: 'pension_insurance', width: 12 },
        { header: '疫苗接种情况', key: 'vaccination_status', width: 12 },
        { header: '禁忌证明', key: 'proof_contraindication', width: 12 },
        { header: '民政卫健其他情况', key: 'other_conditions', width: 12 },
        { header: '特殊群体', key: 'special_group', width: 12 },
        { header: '监护人姓名', key: 'supervisor', width: 12 },
        { header: '残疾证编号', key: 'disability_id', width: 12 },
        { header: '残疾类型', key: 'disability_type', width: 12 },
        { header: '困难残疾人生活补贴', key: 'disability_subsidy', width: 12 }, // ss
        { header: '重度残疾人护理补贴', key: 'severe_disability_subsidy', width: 12 },
        { header: '残疾等级', key: 'disability_level', width: 12 },
        { header: '工作单位', key: 'work_unit', width: 12 },
        { header: '职务', key: 'position', width: 12 },
        { header: '政治面貌', key: 'political_status', width: 12 },
        { header: '宗教信仰', key: 'religion', width: 12 },
        { header: '所属党组织', key: 'party_organization', width: 12 },
        { header: '民族', key: 'nationality', width: 12 },
        { header: '文化程度', key: 'education', width: 12 },
        { header: '入伍情况', key: 'military_service', width: 12 },
        { header: '毕业院校', key: 'school', width: 12 },
        { header: '种植种类', key: 'plant_type', width: 12 },
        { header: '种植数量', key: 'plant_quantity', width: 12 },
        { header: '种植面积', key: 'planting_area', width: 12 },
        { header: '养殖种类', key: 'breeding_type', width: 12 },
        { header: '养殖数量', key: 'breeding_quantity', width: 12 },
        { header: '商户名称', key: 'business_info', width: 12 },
        { header: '门面位置', key: 'business_location', width: 12 },
        { header: '营业执照编号', key: 'license_number', width: 12 },
        { header: '门面消防设备类型', key: 'fire_equipment_type', width: 12 },
        { header: '门面消防设备数量', key: 'fire_equipment_quantity', width: 12 },
        { header: '门面电子监控状态', key: 'surveillance_status', width: 12 },
        { header: '门面电子监控数量', key: 'surveillance_quantity', width: 12 },
        { header: '房子信息', key: 'house_info', width: 12 },
        { header: '房子产权人', key: 'house_owner', width: 12 },
        { header: '建筑面积', key: 'house_area', width: 12 },
        { header: '房屋类型', key: 'house_type', width: 12 },
        { header: '危房等级', key: 'house_condition', width: 12 },
        { header: '兴趣爱好', key: 'hobbies', width: 12 },
        { header: '吸烟与否', key: 'smoking_status', width: 12 },
        { header: '车型号', key: 'car_model', width: 12 },
        { header: '车身颜色', key: 'car_color', width: 12 },
        { header: '车牌号', key: 'car_plate', width: 12 },
        { header: '车辆所有人', key: 'car_owner', width: 12 },
        { header: '驾驶证类型', key: 'driving_license_type', width: 12 },
        { header: '志愿者', key: 'volunteer_status', width: 12 },
        { header: '社工', key: 'social_worker', width: 12 },
        { header: '网格员名称', key: 'gridPersonName', width: 12 },
        // { header: '网格员编号', key: 'gridPersonId', width: 12 },
        { header: '网格员联系方式', key: 'girdPersonPhone', width: 12 },
        { header: '民警姓名', key: 'policeName', width: 12 },
        { header: '民警联系方式', key: 'policePhone', width: 12 },
      ];
      worksheet.addRows(exportData);
      saveWorkbook(workbook, '人员信息.xlsx');
    });
  };
  // 添加水印
  const nowusername = getRealName();
  const nowuserid_card = getUserIdCard();
  return (
    <Layout className="CpLayout" style={{ height: '100%', overflow: 'auto' }}>
      <Watermark content={`${nowusername},${nowuserid_card}`} className="WaterMarkBox">
        <div className={styles.FlexColomnBox}>
          <div className={styles.TopBox}>
            <div className={styles.TopTitle}>人员管理</div>
            <div>
              <button className={styles.ClickShow} onClick={handleShowSearch}>
                {isshowSearch ? '收起筛选' : '展开筛选'}
              </button>
              <button className={styles.AddPeople} onClick={showMadal}>
                <span style={{ transform: ' scale(1.5)', display: 'inline-block' }}>
                  +
                </span>
                &nbsp;增加人员信息
              </button>
              <button className={styles.AddPeople} onClick={exportInfo}>
                导出人员信息
              </button>
            </div>
          </div>

          <div className={styles.TopSearchBox} id="TopSearchHidden">
            <div className={styles.TopSearchPadding}>
              <div>
                <div>
                  <span>公安局：</span>
                  {/* jiade */}
                  <Select
                    placeholder="选择公安局"
                    style={{ width: '60%' }}
                    allowClear
                    options={[{ value: 1, label: '漠河市公安局' }]}
                  ></Select>
                </div>
                <div>
                  <span>姓名：</span>
                  <Input
                    placeholder="请输入姓名"
                    allowClear
                    onChange={(a) => {
                      handleFliterData(a, 'name');
                    }}
                    value={filterData?.name}
                    style={{ width: '60%', display: 'flex' }}
                  ></Input>
                </div>
                <div>
                  <span>人口标识：</span>
                  <Select
                    placeholder="请输入人口标识"
                    allowClear
                    style={{ width: '60%' }}
                    onChange={(e) => {
                      handleFliterDataSelect(e, 'person_classification');
                    }}
                    options={[
                      { label: 'A', value: 'A', id: 'A' },
                      { label: 'B', value: 'B', id: 'B' },
                      { label: 'C', value: 'C', id: 'C' },
                      { label: 'D', value: 'D', id: 'D' },
                    ]}
                  ></Select>
                </div>
                <div>
                  <span>籍贯：</span>
                  <Cascader
                    options={city}
                    onChange={onChange}
                    changeOnSelect
                    placeholder="请输入或选择籍贯"
                    showSearch={filter}
                    style={{ width: '60%' }}
                  />
                </div>
                <div>
                  <span>录入日期：</span>
                  <ConfigProvider locale={zhCN}>
                    <RangePicker
                      style={{ width: '60%' }}
                      onChange={handleinTimeChange}
                      disabledDate={disabledDate}
                    />
                  </ConfigProvider>
                </div>
                <div>
                  <span>房屋类型：</span>
                  <Select
                    allowClear
                    onChange={(e) => {
                      handleFliterDataSelect(e, 'house_info');
                    }}
                    placeholder="选择房屋类型"
                    style={{ width: '60%' }}
                    options={[
                      { id: 1, label: '出租户', value: '出租户' },
                      { id: 2, label: '常住户', value: '常住户' },
                    ]}
                  ></Select>
                </div>
              </div>
              <div>
                <div>
                  <span>分县公安局</span>：
                  <Select
                    placeholder="选择分县公安局"
                    allowClear
                    style={{ width: '60%' }}
                    options={[{ value: 1, label: '漠河县公安局' }]}
                  ></Select>
                </div>
                <div>
                  <span>身份证号</span>：
                  <Input
                    placeholder="输入身份证号"
                    allowClear
                    onChange={(a) => {
                      handleFliterData(a, 'id_card');
                    }}
                    value={filterData?.id_card}
                    style={{ width: '60%', display: 'flex' }}
                  ></Input>
                </div>
                <div>
                  <span>手机号码</span>：
                  <Input
                    allowClear
                    placeholder="输入手机号码"
                    onChange={(a) => {
                      let e = a.target.value;
                      if (/^\d*$/.test(e)) {
                        setFilterData((pre: any) => {
                          return { ...pre, phone: e };
                        });
                      } else {
                        return;
                      }
                    }}
                    value={filterData?.phone}
                    style={{ width: '60%', display: 'flex' }}
                  ></Input>
                </div>
                <div>
                  <span>住址</span>：
                  <Input
                    placeholder="输入住址"
                    allowClear
                    onChange={(a) => {
                      handleFliterData(a, 'current_address');
                    }}
                    value={filterData?.current_address}
                    style={{ width: '60%', display: 'flex' }}
                  ></Input>
                </div>
                <div>
                  <span>修改日期</span>：
                  <ConfigProvider locale={zhCN}>
                    <RangePicker
                      style={{ width: '60%' }}
                      disabledDate={disabledDate}
                      onChange={handleTimeChange}
                    />
                  </ConfigProvider>
                </div>
                {isPolice && (
                  <div>
                    <span>AB类人员分类依据</span>：
                    <Select
                      showSearch
                      allowClear
                      onChange={(e) => {
                        handleFliterDataSelect(e, 'classification_reason');
                      }}
                      placeholder="输入或选择分类依据"
                      style={{ width: '60%' }}
                      options={classificationReason}
                    ></Select>
                  </div>
                )}
              </div>
              <div>
                <div>
                  <span>派出所</span>：
                  <Select
                    placeholder="选择派出所"
                    disabled={regionalSelect ? true : false}
                    onClear={() => {
                      setPoliceValue(undefined);
                      setFilterData((pre) => {
                        return { ...pre, police_user_id: undefined };
                      });
                    }}
                    allowClear
                    style={{ width: '60%' }}
                    onChange={handleSetPoliceStation}
                    options={policeStationData?.getSelectPoliceStation?.selectPoliceStation?.map(
                      (item: any) => {
                        return { value: item?.id, label: item?.name };
                      },
                    )}
                  ></Select>
                </div>
                <div>
                  <span>性别</span>：
                  <Select
                    placeholder="选择性别"
                    allowClear
                    onChange={(e) => {
                      handleFliterDataSelect(e, 'gender');
                    }}
                    options={[
                      { value: true, label: '女' },
                      { value: false, label: '男' },
                    ]}
                    style={{ width: '60%' }}
                  ></Select>
                </div>
                <div>
                  <span>行政区域</span>：
                  <Select
                    disabled={policeStationId || gridSelect ? true : false}
                    placeholder="行政区域"
                    value={regionalSelect}
                    onChange={(e) => {
                      setRegionalSelect(e);
                      handleFliterDataSelect(e, 'administrative_area_id');
                    }}
                    style={{ width: '60%' }}
                    allowClear
                    options={regional?.getSelectAdmin?.selectAdmin?.map((item: any) => {
                      return { value: item?.id, label: item?.name };
                    })}
                  ></Select>
                </div>
                <div>
                  <span>宗教信仰</span>：
                  <Select
                    placeholder="请选择宗教"
                    options={religion}
                    onChange={(e) => {
                      handleFliterDataSelect(e, 'religion');
                    }}
                    allowClear
                    style={{ width: '60%' }}
                  ></Select>
                </div>
                <div>
                  <span>绰号</span>：
                  <Input
                    placeholder="输入绰号"
                    allowClear
                    onChange={(a) => {
                      handleFliterData(a, 'nickname');
                    }}
                    value={filterData?.nickname}
                    style={{ width: '60%', display: 'flex' }}
                  ></Input>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div>
                  <span>警员</span>：
                  <Select
                    placeholder="选择警员"
                    value={policeValue}
                    disabled={regionalSelect ? true : false}
                    allowClear
                    style={{ width: '60%' }}
                    onChange={(e) => {
                      setPoliceValue(e);
                      handleFliterDataSelect(e, 'police_user_id');
                    }}
                    options={police?.getSelectPolicer?.selectPolicer?.map((item: any) => {
                      return { value: item?.id, label: item?.name };
                    })}
                  ></Select>
                </div>
                <div>
                  <span>民族</span>：
                  <Select
                    showSearch
                    allowClear
                    onChange={(e) => {
                      handleFliterDataSelect(e, 'nationality');
                    }}
                    placeholder="输入或选择民族"
                    style={{ width: '60%' }}
                    options={nationality}
                  ></Select>
                </div>
                <div>
                  <span>网格</span>：
                  <Select
                    mode="tags"
                    style={{ width: '60%' }}
                    placeholder="输入网格编号或选择网格"
                    optionFilterProp="children"
                    value={gridSelect}
                    onChange={(e) => {
                      if (e?.length > 0 && e?.length < 2) {
                        setGridSelect(e);
                        let grid = Number(e[0]);
                        handleFliterDataSelect(grid, 'grid_id');
                        console.log(typeof e);
                      }
                    }}
                    onClear={() => {
                      setGridSelect(undefined);
                      handleFliterDataSelect(undefined, 'grid_id');
                    }}
                    onDeselect={() => {
                      handleFliterDataSelect(undefined, 'grid_id');
                      setGridSelect(undefined);
                    }}
                    allowClear
                    options={gridData?.getSelectGrid?.selectGrid?.map((item: any) => {
                      return { value: item?.id, label: item?.name };
                    })}
                  />
                </div>

                <div>
                  <span>年龄</span>：
                  <Input
                    placeholder="输入年龄"
                    allowClear
                    onChange={(a) => {
                      handleFliterData(a, 'age');
                    }}
                    // value={filterData?.age}
                    style={{ width: '60%', display: 'flex' }}
                  ></Input>
                </div>
                <div>
                  <span>特殊群体</span>：
                  <Select
                    allowClear
                    onChange={(e) => {
                      handleFliterDataSelect(e, 'special_group');
                    }}
                    placeholder="选择群体"
                    style={{ width: '60%' }}
                    options={special_group}
                  ></Select>
                </div>
                <div style={{ justifyContent: 'end' }}>
                  <button onClick={handleSearch}>
                    <img src={SearchIcon} />
                    &nbsp;查询
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 具体内容区域 */}
          <div className={styles.BottomShowList}>
            <Spin size={'large'} delay={50} spinning={loading}>
              {pagination?.total === 0 || error ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Empty />
                </div>
              ) : (
                <BasicShowList
                  BasicShowListData={datalist()}
                  currentPage={current}
                  onePageTotal={pageSize}
                ></BasicShowList>
              )}
            </Spin>
          </div>
          <div className={styles.PaginationBox}>
            <Pagination
              className={styles.Pagination}
              onShowSizeChange={changePage}
              showSizeChanger
              onChange={currentChange}
              showTotal={(total) => `共 ${total} 条`}
              {...pagination}
              pageSizeOptions={[5, 10, 15, 20]}
            />
          </div>
        </div>
      </Watermark>
    </Layout>
  );
};

export default SearchBasic;
