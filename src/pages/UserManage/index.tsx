// import { message } from 'antd';
import './style.module.less';

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
// import { LoadingOutlined,PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import type { TablePaginationConfig } from 'antd';
import { message, Upload } from 'antd';
import { Col } from 'antd';
import { Row } from 'antd';
import { Select } from 'antd';
import { Divider } from 'antd';
import { Form, Input } from 'antd';
import { Modal } from 'antd';
import { Space } from 'antd';
import { Button } from 'antd';
import { Table } from 'antd';
// import type { UploadChangeParam } from 'antd/es/upload';
// import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';

import {
  CreatePerson,
  DeletePerson,
  GetArea,
  GetGrid,
  GetPerson,
  GetPolice,
  GetPolicestation,
  GetRole,
  // GetUserInfo,
  UpdatePerson,
} from '@/apis';
import { getUserName, getUserType } from '@/store/SaveToken';

import type { Area, DataType, Grid, Police, SelectObject } from './types';

export default function PersonManage() {
  // 检查参数
  // const [p, setP] = useState<number>();

  const user_role = getUserType();
  const user_name = getUserName();

  const [role_id, setRole_id] = useState<number>();

  const [select_role_id, setSelect_Role_id] = useState<number>();

  const [loading, setLoading] = useState(false);

  // 增加记录的弹窗,visibleAdd记录是否显示弹窗modal
  const [visibleAdd, setVisibleAdd] = useState(false);
  // 删除记录的弹窗,
  const [visibleDel, setVisibleDel] = useState(false);
  // 修改记录的弹窗,
  const [visibleUpd, setVisibleUpd] = useState(false);

  // 表格中的一条记录
  // const [record, setRecord] = useState<DataType>()

  // 是否等待服务器完成操作，confirmLoading来记录状态，例如防止多次点击确定按钮
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 设置分页，获取当前的页码
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
  });
  // 每次点击标签页进行的改变，主要是改变了页码数
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  // 记录表格页码数
  const current: any = pagination.current;
  const pageSize: any = pagination.pageSize;
  let skip = (current - 1) * pageSize;
  const take = pageSize;

  // 筛选框旁的网格下拉框
  const [gridList, setGridList] = useState<[Grid]>();
  // 筛选按钮选择的网格id
  const [gridId, setGridId] = useState<number>();
  // 行政区域下拉框
  const [administrationAreaList, setAdministrationAreaList] = useState<[Area]>();
  // 社区下拉框
  const [communityList, setCommunityList] = useState<[Area]>();

  // 创建网格员时行政区域下拉框
  const [createAreaList, setcreateAreaList] = useState<[Area]>();
  // 创建网格员时社区下拉框
  const [createCommunityList, setCreateCommunityList] = useState<[Area]>();
  const [createGridList, setCreateGridList] = useState<[Grid]>();
  const [createPoliceList, setCreatePoliceList] = useState<[Police]>();

  // 增加和修改时的gridid
  const [gridIdInput, setGridIdInput] = useState<number>();
  // 增加和修改时的policeid
  const [policeId, setPoliceId] = useState<number>();

  // 记录筛选按钮的username
  const [username, setUsername] = useState<string>('');

  // 筛选条件
  const [selectObject, setSelectObject] = useState<SelectObject>({
    username: '',
    area_id: undefined,
    community_id: undefined,
    grid_id: undefined,
    role_id: undefined,
  });

  // 记录表格中的一行数据，方便修改和删除当前记录
  const [record, setRecord] = useState<DataType>();
  // form的实例，用于操作弹窗中的表单，获取和清空数据
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  // 表格属性
  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (_text, _record, index) => `${(current - 1) * pageSize + index + 1} `,
      width: '10%',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: '10%',
      align: 'center',
    },
    {
      title: '用户角色',
      dataIndex: 'role_name',
      width: '10%',
      align: 'center',
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      width: '10%',
      align: 'center',
    },
    {
      title: '创建时间',
      width: '20%',
      render: (_value, record) => {
        const mysqlDate = new Date(record.create_time);
        const year = mysqlDate.getUTCFullYear();
        const month = String(mysqlDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(mysqlDate.getUTCDate()).padStart(2, '0');
        const hours = String(mysqlDate.getUTCHours()).padStart(2, '0');
        const minutes = String(mysqlDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(mysqlDate.getUTCSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
      },
      dataIndex: 'create_time',
      align: 'center',
    },
    {
      title: '修改时间',
      width: '20%',
      render: (_value, record) => {
        const mysqlDate = new Date(record.update_time);
        const year = mysqlDate.getUTCFullYear();
        const month = String(mysqlDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(mysqlDate.getUTCDate()).padStart(2, '0');
        const hours = String(mysqlDate.getUTCHours()).padStart(2, '0');
        const minutes = String(mysqlDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(mysqlDate.getUTCSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
      },
      dataIndex: 'update_time',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '20%',
      render: (_text, record) => (
        <Space size="middle">
          <a onClick={() => showUpdataModal(_text, record)}>修改</a>|
          <a onClick={() => showDeleteModal(_text, record)}>删除</a>
        </Space>
      ),
    },
  ];

  // 打开或者关闭删除弹窗
  const showDeleteModal = (_text: any, record: DataType) => {
    if (record.role_id === 1) {
      message.error('不能删除超级管理员的信息');
    } else {
      setVisibleDel(true);
      setRecord(record);
    }
  };

  // 打开或者关闭修改弹窗
  const showUpdataModal = (_text: any, record: DataType) => {
    if (record.role_id === 1) {
      message.error('不能修改超级管理员的信息');
    } else {
      setRecord(record);
      form2.setFieldsValue(record);
      form2.setFieldValue('password', undefined);
      setImageUrl(record.head_url);
      setRole_id(record.role_id);
      setVisibleUpd(true);
    }
  };

  // 点击添加用户信息按钮后的处理函数，显示添加弹窗
  const showModalAdd = () => {
    setVisibleAdd(true);
    setConfirmLoading(true);
    setConfirmLoading(false);
    setPagination(() => {
      return { ...pagination };
    });
  };

  // 增加一条记录
  const [creatPerson] = useMutation(CreatePerson);

  // 删除一条记录
  const [deletePerson] = useMutation(DeletePerson);

  // 修改一条信息
  const [updatePerson] = useMutation(UpdatePerson);

  const { data: policestation } = useQuery(GetPolicestation, {
    variables: {
      username: user_name,
      role: user_role,
    },
  });

  // 获取当前登录用户的一些信息
  // const { data: userInfo } = useQuery(GetUserInfo,{
  //   variables: {
  //     username: user_name,
  //     role: user_role,
  //   }
  // });
  // useEffect(()=>{
  //   if (userInfo) {
  //     setSelectObject({
  //       username: '',
  //       area_id: undefined,
  //       community_id: undefined,
  //       grid_id: undefined,
  //       role_id: undefined,
  //     });
  //   }
  // },[userInfo]);

  // 查询信息
  const { data: db, refetch } = useQuery(GetPerson, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: skip,
      take: take,
      selectOption: selectObject,
      user_role: user_role,
      user_name: user_name,
    },
    onCompleted: () => {
      setLoading(false);
    },
  });

  // data发生变化
  useEffect(() => {
    // 只要data不为空就可以，就对pagination进行设置
    // if (data) {
    if (db) {
      setPagination((pagination) => {
        return {
          ...pagination,
          // total: data.sensitiveRules.total,
          total: db?.getPerson.total,
        };
      });
    } else {
      setLoading(true);
    }
  }, [db]);

  // 获取角色表的信息
  const { data: role } = useQuery(GetRole, {
    variables: {
      user_role: user_role,
    },
  });
  // 获取警员信息
  const { data: police, refetch: refetch2 } = useQuery(GetPolice, {
    fetchPolicy: 'no-cache',
    variables: {
      username: user_name,
      role: user_role,
    },
  });
  useEffect(() => {
    if (police) {
      setCreatePoliceList(police?.getPolice);
      console.log(police?.getPolice);
    }
  }, [police]);
  // 获取网格信息
  const { data: grid } = useQuery(GetGrid, {
    fetchPolicy: 'no-cache',
    variables: {
      username: user_name,
      role: user_role,
    },
  });
  useEffect(() => {
    if (grid) {
      setGridList(grid?.getGrid);
      setCreateGridList(grid?.getGrid);
    }
  }, [grid]);

  // 获取行政区域信息（三级）
  const { data: area } = useQuery(GetArea, {
    variables: {
      username: user_name,
      role: user_role,
    },
  });
  // 将行政区域划分为镇和社区
  useEffect(() => {
    if (area) {
      // console.log('行政区域长度', area?.getArea);
      const areaData = area?.getArea.filter((item: Area) => {
        return item.level === 2;
      });
      const communityData = area?.getArea.filter((item: Area) => {
        return item.level === 3;
      });
      setAdministrationAreaList(areaData);
      setcreateAreaList(areaData);
      setCommunityList(communityData);
      setCreateCommunityList(communityData);
      // console.log('行政区域',areaData);
      // console.log('社区',communityData);
    }
  }, [area]);

  // 点击添加用户弹窗的确定按钮之后，提交数据的处理函数
  const handleOkAdd = () => {
    form.validateFields().then((value) => {
      // console.log(value.userName);
      let ipt2 = {};
      // if (value.role_id === 4) {
      //   ipt2 = {
      //     role_id: value.role_id,
      //     grid_id: gridIdInput,
      //     police_user_id: policeId,
      //   };
      // } else {
      //   ipt2 = {
      //     role_id: value.role_id,
      //   };
      // }
      // 网格员
      if (value.role_id === 4) {
        ipt2 = {
          role_id: value.role_id,
          grid_id: gridIdInput,
          police_user_id: policeId,
        };
      }
      // 民警
      if (value.role_id === 2) {
        ipt2 = {
          role_id: value.role_id,
          police_station_id: value.policestation,
        };
      }
      // 网格长
      if (value.role_id === 6) {
        ipt2 = {
          role_id: value.role_id,
          grid_id: -1,
        };
      }
      if (value.role_id === 3) {
        ipt2 = {
          role_id: value.role_id,
        };
      }
      if (value.role_id === 5) {
        ipt2 = {
          role_id: value.role_id,
        };
      }
      creatPerson({
        variables: {
          input: {
            head_url: imageUrl,
            // head_url: 'http',
            id_card: value.id_card,
            mobile: value.mobile,
            password: value.password,
            username: value.userName,
            real_name: value.real_name,
          },
          input2: ipt2,
        },
        //   插入完数据后，重新调用查询接口，获取最新数据
        onCompleted: () => {
          console.log('执行了完成插入函数');
          console.log('skip的值', skip, 'take的值', take);
          console.log('select的值', selectObject);
          refetch({
            skip: skip,
            take: take,
            selectOption: {
              username: username,
              area_id: administrionAreaId,
              grid_id: gridId,
              community_id: firstCommunity,
              role_id: select_role_id,
            },
            user_role: user_role,
            user_name: user_name,
          });
          refetch2();
          form.resetFields();
          setImageUrl('');
          // setFirstCommunity(undefined);
          setVisibleAdd(false);
        },
      })
        .then(() => {
          message.success('添加成功');
          form.resetFields();
        })
        .catch((e) => {
          console.log(e);

          message.error('重复添加');
          // form.resetFields();
        });
    });
  };

  // 点击添加用户弹窗的取消按钮之后，关闭弹窗
  const handleCancelAdd = () => {
    setImageUrl('');
    form.resetFields();
    setVisibleAdd(false);
  };

  // 点击删除用户弹窗的确定按钮之后，提交数据的处理函数
  const handleOkDel = () => {
    setConfirmLoading(true);
    // 调用后端的删除方法执行;
    deletePerson({
      variables: { id: record?.id, user_role: record?.role_id },
      onCompleted: () => {
        console.log('执行了成功删除');
        console.log('skip的值', skip, 'take的值', take);
        console.log('select的值', selectObject);
        if (pagination.total === skip + 1) {
          skip = skip - pageSize;
        }
        refetch({
          skip: skip,
          take: take,
          selectOption: {
            username: username,
            area_id: administrionAreaId,
            grid_id: gridId,
            community_id: firstCommunity,
            role_id: select_role_id,
          },
          user_role: user_role,
          user_name: user_name,
        });
        refetch2();
      },
    })
      .then(() => {
        message.success('删除成功');
      })
      .catch(() => {
        message.error('删除失败');
      });
    setTimeout(() => {
      setVisibleDel(false);
      setConfirmLoading(false);
    }, 500);
  };

  // 点击删除用户弹窗的取消按钮之后，关闭弹窗
  const handleCancelDel = () => {
    setVisibleDel(false);
  };

  // 点击修改用户弹窗的确定按钮之后，提交数据的处理函数
  const handleOkUpd = () => {
    // console.log('record_id',record?.id);
    // console.log('record的值',record);
    form2.validateFields().then(() => {
      // form.setFieldsValue(record);
      const newRecord: any = form2.getFieldsValue();
      // console.log('newRecord的值', newRecord);
      let ipt2 = {};
      // 网格员
      if (newRecord.role_id === 4) {
        ipt2 = {
          role_id: newRecord.role_id,
          grid_id: gridIdInput,
          police_user_id: policeId,
        };
      }
      // 民警
      if (newRecord.role_id === 2) {
        ipt2 = {
          role_id: newRecord.role_id,
          police_station_id: newRecord.policestation,
        };
      }
      // 网格长
      if (newRecord.role_id === 6) {
        ipt2 = {
          role_id: newRecord.role_id,
          grid_id: gridIdInput,
        };
      }
      if (newRecord.role_id === 3) {
        ipt2 = {
          role_id: newRecord.role_id,
        };
      }
      if (newRecord.role_id === 5) {
        ipt2 = {
          role_id: newRecord.role_id,
        };
      }
      updatePerson({
        variables: {
          id: record?.id,
          input: {
            head_url: imageUrl,
            // head_url: 'http',
            id_card: newRecord.id_card,
            mobile: newRecord.mobile,
            password: newRecord.password ? newRecord.password : record?.password,
            username: newRecord.username,
            real_name: newRecord.real_name,
          },
          input2: ipt2,
        },
        onCompleted: () => {
          refetch({
            skip: skip,
            take: take,
            selectOption: {
              username: username,
              area_id: administrionAreaId,
              grid_id: gridId,
              community_id: firstCommunity,
              role_id: select_role_id,
            },
            user_role: user_role,
            user_name: user_name,
          });
          refetch2();
          setImageUrl('');
          form2.resetFields();
        },
      })
        .then(() => {
          message.success('修改成功');
          form2.resetFields();
          setImageUrl('');
        })
        .catch(() => {
          message.error('修改失败');
          form2.resetFields();
          setImageUrl('');
        });
      setConfirmLoading(true);
      setTimeout(() => {
        setVisibleUpd(false);
        setConfirmLoading(false);
      }, 500);
    });
  };

  // 点击修改用户弹窗的取消按钮之后，关闭弹窗
  const handleCancelUpd = () => {
    setImageUrl('');
    form2.resetFields();
    setVisibleUpd(false);
  };

  // 添加用户时选择角色记录
  const selectRole = (p: number) => {
    setRole_id(p);
  };

  // 联级，选择第一级之后自动选择第二级第一个
  const [firstCommunity, setFirstCommunity] = useState<number>();
  const [administrionAreaId, setAdministrionAreaId] = useState<number>();
  // 选择行政区域
  const selectAdministrionArea = (value: number) => {
    setGridId(undefined);
    // 将administrionAreaId设置为下拉菜单选择的内容
    setAdministrionAreaId(value);
    setFirstCommunity(undefined);
    // setP(value);
    const newCommunityList = area?.getArea.filter((item: Area) => {
      return item.parent_id === value;
    });
    if (newCommunityList.length > 0) {
      setCommunityList(newCommunityList);
      // setFirstCommunity(newCommunityList[0].id);
      const newGridList = grid?.getGrid.filter((item: any) => {
        return item.area_id === value || item.area_id === newCommunityList[0].id;
      });
      setGridList(newGridList);
      // 联级
    } else {
      setFirstCommunity(undefined);
      setCommunityList(undefined);
      message.error('该行政区域下没有社区');
    }
  };

  // 设置社区id
  const selectCommunity = (value: number) => {
    setGridId(undefined);
    setFirstCommunity(value);
    const newGridList = grid?.getGrid.filter((item: any) => {
      return item.area_id === value || item.area_id === administrionAreaId;
    });
    const communityData = area?.getArea.filter((item: Area) => {
      return item.id === value;
    });
    const areaDate = area?.getArea.filter((item: Area) => {
      return item.id === communityData[0].parent_id;
    });
    setGridList(newGridList);
    setAdministrionAreaId(areaDate[0].id);
  };
  // 选择网格
  const selectGrid = (p: number) => {
    // 设置查询的gridId
    setGridId(p);
  };

  // 创建网格员时候的联级，选择第一级之后自动选择第二级第一个
  const [firstCommunityCreate, setFirstCommunityCreate] = useState<number>();
  const [administrionAreaIdCreate, setAdministrionAreaIdCreate] = useState<number>();
  const selectAreaCreate = (value: number) => {
    setGridIdInput(undefined);
    // 将administrionAreaId设置为下拉菜单选择的内容
    setAdministrionAreaIdCreate(value);
    setFirstCommunityCreate(undefined);
    // setP(value);
    const newPoliceList = police?.getPolice.filter((item: Police) => {
      if (item.areaid.includes(value)) {
        return item;
      }
    });
    const newCommunityList = area?.getArea.filter((item: Area) => {
      return item.parent_id === value;
    });
    if (newPoliceList.length > 0) {
      setCreatePoliceList(newPoliceList);
    } else {
      setCreatePoliceList(undefined);
      message.error('行政区域下无警员');
    }
    if (newCommunityList.length > 0) {
      setCreateCommunityList(newCommunityList);
      setFirstCommunityCreate(newCommunityList[0].id);
      const newGridList = grid?.getGrid.filter((item: any) => {
        return item.area_id === value || item.area_id === newCommunityList[0].id;
      });
      setCreateGridList(newGridList);
      // 联级
    } else {
      setFirstCommunityCreate(undefined);
      setCreateCommunityList(undefined);
      message.error('该行政区域下没有社区');
    }
  };

  // 创建网格员时设置社区id
  const selectCommunityCreate = (value: number) => {
    setGridIdInput(undefined);
    setFirstCommunityCreate(value);
    const newGridList = grid?.getGrid.filter((item: any) => {
      return item.area_id === value || item.area_id === administrionAreaId;
    });
    const communityData = area?.getArea.filter((item: Area) => {
      return item.id === value;
    });
    const areaDate = area?.getArea.filter((item: Area) => {
      return item.id === communityData[0].parent_id;
    });
    setCreateGridList(newGridList);
    setAdministrionAreaIdCreate(areaDate[0].id);
  };

  // 获取输入的username
  const changeUsername = (e: any) => {
    setUsername(e.target.value);
    // console.log('e.target.value', e.target.value);
    // console.log('usernameInput', username);
  };

  const selectRoleid = (value: number) => {
    setSelect_Role_id(value);
  };

  // 记录筛选按钮的点击状态
  const [isSelected, setIsSelected] = useState(false);
  // 点击筛选按钮之后的处理函数
  const selectClick = () => {
    console.log('username', username);
    console.log('gridid', gridId);
    console.log('communityid', firstCommunity);
    // setUsername('haha');
    // 取消状态screenDataState的值为true,点击取消,重新查询
    if (isSelected) {
      setGridId(undefined);
      setFirstCommunity(undefined);
      setAdministrionAreaId(undefined);
      setUsername('');
      setSelect_Role_id(undefined);
      setSelectObject({
        username: '',
        area_id: undefined,
        community_id: undefined,
        grid_id: undefined,
        role_id: undefined,
        // police_station_id: userInfo?.getUserInfo.police_station_id,
        // role_community_id: userInfo?.getUserInfo.communityId,
        // role_grid_id: userInfo?.getUserInfo.gridId,
      });
      setIsSelected(!isSelected);
      setPagination(() => {
        return {
          current: 1,
          pageSize: pageSize,
        };
      });
      refetch({
        skip: 0,
        take: pageSize,
        selectOption: {
          username: '',
          area_id: undefined,
          community_id: undefined,
          grid_id: undefined,
          role_id: undefined,
        },
        user_name: user_name,
        user_role: user_role,
      });
    } else {
      console.log('用户名改没改啊', username);
      if (
        username !== '' ||
        gridId ||
        administrionAreaId ||
        firstCommunity ||
        select_role_id
      ) {
        console.log('执行了筛选');
        setIsSelected(!isSelected);
        setPagination(() => {
          return {
            current: 1,
            pageSize: pageSize,
          };
        });
        setSelectObject({
          username: username,
          area_id: administrionAreaId,
          grid_id: gridId,
          community_id: firstCommunity,
          role_id: select_role_id,
          // police_station_id: userInfo?.getUserInfo.police_station_id,
          // role_community_id: userInfo?.getUserInfo.communityId,
          // role_grid_id: userInfo?.getUserInfo.gridId,
        });
        refetch({
          skip: 0,
          take: pageSize,
          selectOption: {
            username: username,
            area_id: administrionAreaId,
            grid_id: gridId,
            community_id: firstCommunity,
            role_id: select_role_id,
          },
          user_name: user_name,
          user_role: user_role,
        });
        console.log('查询的数据', db?.getPerson.data);
      } else {
        message.error('没有筛选条件！');
      }
    }
  };

  // useEffect(() => {
  //   setPagination(() => {
  //     return {
  //       current: 1,
  //       pageSize: pageSize,
  //     };
  //   });
  // }, [isSelected, pageSize]);

  // 保存图片的base64编码
  const [imageUrl, setImageUrl] = useState('');
  // const [loading, setLoading] = useState(false);

  const { Option } = Select;
  const handleUploadSuccess = (file: any) => {
    const reader = new FileReader(); // 创建FileReader实例
    reader.readAsDataURL(file); // 将文件读入内存中
    // 当读取文件完成时执行该函数
    reader.onload = () => {
      // setLoading(true);
      // 保存编码
      if (reader.result) {
        setImageUrl(reader.result.toString());
        // console.log(imageUrl);
      }
    };
  };

  // 没有上传头像时显示的文字和图标
  const uploadButton = (
    <div>
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <div style={{ marginTop: 8 }}>上传头像{'(<2MB)'}</div>
    </div>
  );

  // 上传之前检查文件类型和大小
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
      return false;
    }
    return true;
  };

  const selectPoliceInput = (value: number) => {
    setPoliceId(value);
  };
  const selectGridInput = (value: number) => {
    setGridIdInput(value);
  };

  return (
    <div className="UserManage">
      {/* 添加按钮 */}
      <div>
        <Row>
          <Col span={12}>
            <span style={{ fontWeight: '700', fontSize: '16px' }}>用户管理</span>
          </Col>
          {/* <Col span={2} offset={9}> */}
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              // style={{ marginRight: '-100px' }}
              type="primary"
              onClick={showModalAdd}
            >
              +添加用户信息
            </Button>
          </Col>
        </Row>
      </div>
      <Divider />
      {/* 筛选 */}
      <div>
        <Row>
          <Col span={4}>
            <span>数据总数({db?.getPerson.total})</span>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <Space>
              <Select
                placeholder="请选择行政区域"
                style={{ width: '150px', textAlign: 'left' }}
                onChange={selectAdministrionArea}
                value={administrionAreaId}
              >
                {administrationAreaList?.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="请选择社区"
                style={{ width: '150px', textAlign: 'left' }}
                onChange={selectCommunity}
                value={firstCommunity}
              >
                {communityList?.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="请选择网格"
                style={{ width: '150px', textAlign: 'left' }}
                value={gridId}
                onChange={selectGrid}
              >
                {gridList?.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>

              {user_role === 'superAdmin' ? (
                <Select
                  placeholder="请选择角色"
                  style={{ width: '150px', textAlign: 'left' }}
                  onChange={selectRoleid}
                  value={select_role_id}
                >
                  {role?.getRole.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.remark}
                    </Option>
                  ))}
                </Select>
              ) : (
                <></>
              )}

              <Input
                style={{ width: '150px', textAlign: 'left' }}
                placeholder="请输入姓名"
                value={username}
                onChange={changeUsername}
              />

              <Button type="primary" onClick={selectClick}>
                {isSelected ? '取消' : '筛选'}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 主体部分 */}
      <div className="UserBody">
        {/* 添加用户信息的弹框 */}
        <div className="addUser">
          <Modal
            title="添加用户信息"
            open={visibleAdd}
            onOk={handleOkAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancelAdd}
            okText="确认"
            cancelText="取消"
          >
            <Form form={form}>
              <Form.Item
                name="role_id"
                label="请选择角色"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: '请选择角色',
                  },
                ]}
              >
                {/* <span>请选择角色：</span><br/> */}
                <Select placeholder="请选择" onChange={selectRole}>
                  {role?.getRole.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.remark}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="userName"
                label="用户名"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ]}
              >
                {/* <span>用户名：</span><br/> */}
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                name="real_name"
                label="真实姓名"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: '请输入真实姓名',
                  },
                ]}
              >
                {/* <span>用户名：</span><br/> */}
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
              <Form.Item
                name="id_card"
                label="身份证:"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    pattern: /^\d{17}[\dXx]$/,
                    required: true,
                    message: '请输入合法身份证号',
                  },
                ]}
                validateTrigger={['onBlur']}
              >
                {/* <span>身份证：</span><br/> */}
                <Input placeholder="请输入身份证号" />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码:"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    // pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    min: 8,
                    message: '密码长度不少于8位',
                  },
                ]}
                validateTrigger={['onBlur']}
              >
                {/* <span>密码：</span><br/> */}
                <Input.Password
                  placeholder="请输入密码"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="mobile"
                label="手机号码:"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    required: true,
                    message: '请输入合法手机号码',
                  },
                ]}
                validateTrigger={['onBlur']}
              >
                {/* <span>手机号：</span><br/> */}
                <Input placeholder="请输入手机号码" />
              </Form.Item>

              {role_id === 4 && (
                <Form.Item
                  name="area_id"
                  label="请选择行政区域"
                  labelCol={{ span: 6 }}
                  rules={[
                    {
                      required: false,
                      // message: '请选择行政区域',
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择行政区域"
                    onChange={selectAreaCreate}
                    value={administrionAreaIdCreate}
                  >
                    {createAreaList?.map((item: any) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {role_id === 4 && (
                <Form.Item
                  name="community_id"
                  label="请选择社区"
                  labelCol={{ span: 6 }}
                  rules={[
                    {
                      required: false,
                      // message: '请选择社区',
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择社区"
                    onChange={selectCommunityCreate}
                    value={firstCommunityCreate}
                  >
                    {createCommunityList?.map((item: any) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {/* {(role_id === 6) && (
                <Form.Item
                  name="grid_id"
                  label="请选择网格"
                  labelCol={{ span: 6 }}
                  rules={[
                    {
                      required: true,
                      message: '请选择网格',
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择网格"
                    onChange={selectGridInput}
                    value={gridIdInput}
                    mode="multiple"
                  >
                    {createGridList?.map((item: any) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )} */}

              {role_id === 4 && (
                <>
                  <Form.Item
                    name="grid_id"
                    label="请选择网格"
                    labelCol={{ span: 6 }}
                    rules={[
                      {
                        required: true,
                        message: '请选择网格',
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择网格"
                      onChange={selectGridInput}
                      value={gridIdInput}
                    >
                      {createGridList?.map((item: any) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="police"
                    label="请选择警员"
                    labelCol={{ span: 6 }}
                    rules={[
                      {
                        required: true,
                        message: '请选择警员',
                      },
                    ]}
                  >
                    <Select placeholder="请选择警员" onChange={selectPoliceInput}>
                      {createPoliceList?.map((item: any) => (
                        <Option key={item.police_user_id} value={item.police_user_id}>
                          {item.real_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              )}

              {role_id === 2 && (
                <Form.Item
                  name="policestation"
                  label="请选择派出所"
                  labelCol={{ span: 6 }}
                  rules={[
                    {
                      required: true,
                      message: '请选择派出所',
                    },
                  ]}
                >
                  <Select placeholder="请选择派出所" onChange={selectPoliceInput}>
                    {policestation?.getPolicestation.map((item: any) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                name="head_url"
                label="头像:"
                labelCol={{ span: 6 }}
                // rules={[
                // {
                //     required: true,
                //     message: '上传头像',
                // },
                // ]}
              >
                {/* <span>头像：</span><br></br> */}
                <Upload
                  customRequest={({ file }) => {
                    handleUploadSuccess(file);
                  }}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                >
                  <div
                    style={{
                      border: '1px dashed',
                      backgroundColor: '#F6F6F6',
                      width: '120px',
                      height: '90px',
                      textAlign: 'center',
                      // paddingTop:'40px',
                      // marginTop:'30px'
                    }}
                  >
                    {imageUrl === '' ? (
                      uploadButton
                    ) : (
                      <div>
                        <img src={imageUrl} width={'120px'} height={'90px'}></img>
                      </div>
                    )}
                  </div>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>

      {/* 删除的弹窗 */}
      <Modal
        title="删除用户信息"
        open={visibleDel}
        onOk={handleOkDel}
        confirmLoading={confirmLoading}
        onCancel={handleCancelDel}
        okText="确认"
        cancelText="取消"
      >
        <h2>确定删除吗？</h2>
        <span style={{ color: 'red' }}>
          一旦删除将无法使用该账号绑定的身份证、手机号登注册新账号
        </span>
        <br />
        <span style={{ color: 'red' }}>同时也将无法查看该账号的所有日志记录等信息</span>
      </Modal>

      {/* 修改的弹窗 */}
      {/* 添加用户信息的弹框 */}
      {/* <div className='addUser'> */}
      <Modal
        title="修改用户信息"
        open={visibleUpd}
        onOk={handleOkUpd}
        confirmLoading={confirmLoading}
        onCancel={handleCancelUpd}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form2}>
          <Form.Item
            name="role_id"
            label="请选择角色"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
                message: '请选择角色',
              },
            ]}
          >
            {/* <span>请选择角色：</span><br/> */}
            <Select
              placeholder="请选择"
              onChange={selectRole}
              disabled={true}
              // value={record?.role_id}
            >
              {role?.getRole.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.remark}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            {/* <span>用户名：</span><br/> */}
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="real_name"
            label="真实姓名"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
                message: '请输入真实姓名',
              },
            ]}
          >
            {/* <span>用户名：</span><br/> */}
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item
            name="id_card"
            label="身份证:"
            labelCol={{ span: 6 }}
            rules={[
              {
                pattern: /^\d{17}[\dXx]$/,
                required: true,
                message: '请输入合法身份证号',
              },
            ]}
            validateTrigger={['onBlur']}
          >
            {/* <span>身份证：</span><br/> */}
            <Input placeholder="请输入身份证号" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码:"
            labelCol={{ span: 6 }}
            rules={[
              {
                // required: true,
                // pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                min: 8,
                message: '密码长度不少于8位',
              },
            ]}
            validateTrigger={['onBlur']}
          >
            {/* <span>密码：</span><br/> */}
            <Input.Password
              placeholder="请输入密码"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="手机号码:"
            labelCol={{ span: 6 }}
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                required: true,
                message: '请输入合法手机号码',
              },
            ]}
            validateTrigger={['onBlur']}
          >
            {/* <span>手机号：</span><br/> */}
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          {role_id === 4 && (
            <Form.Item
              name="area_id"
              label="请选择行政区域"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: false,
                  // message: '请选择行政区域',
                },
              ]}
            >
              <Select
                placeholder="请选择行政区域"
                onChange={selectAreaCreate}
                value={administrionAreaIdCreate}
              >
                {createAreaList?.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {role_id === 4 && (
            <Form.Item
              name="community_id"
              label="请选择社区"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: false,
                  // message: '请选择社区',
                },
              ]}
            >
              <Select
                placeholder="请选择社区"
                onChange={selectCommunityCreate}
                value={firstCommunityCreate}
              >
                {createCommunityList?.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* {(role_id === 6) && (
            <Form.Item
              name="grid_id"
              label="请选择网格"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: true,
                  message: '请选择网格',
                },
              ]}
            >
              <Select
                placeholder="请选择网格"
                onChange={selectGridInput}
                value={gridIdInput}
                mode="multiple"
              >
                {createGridList?.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )} */}

          {role_id === 4 && (
            <>
              {' '}
              <Form.Item
                name="grid_id"
                label="请选择网格"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: '请选择网格',
                  },
                ]}
              >
                <Select
                  placeholder="请选择网格"
                  onChange={selectGridInput}
                  value={gridIdInput}
                  // mode="multiple"
                >
                  {createGridList?.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="police_user_id"
                label="请选择警员"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: '请选择警员',
                  },
                ]}
              >
                <Select placeholder="请选择警员" onChange={selectPoliceInput}>
                  {createPoliceList?.map((item: any) => (
                    <Option key={item.police_user_id} value={item.police_user_id}>
                      {item.real_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {role_id === 2 && (
            <Form.Item
              name="policestation"
              label="请选择派出所"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: true,
                  message: '请选择派出所',
                },
              ]}
            >
              <Select placeholder="请选择派出所" onChange={selectPoliceInput}>
                {policestation?.getPolicestation.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="head_url"
            label="头像:"
            labelCol={{ span: 6 }}
            // rules={[
            // {
            //     required: true,
            //     message: '上传头像',
            // },
            // ]}
          >
            {/* <span>头像：</span><br></br> */}
            <Upload
              customRequest={({ file }) => {
                handleUploadSuccess(file);
              }}
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              <div
                style={{
                  border: '1px dashed',
                  backgroundColor: '#F6F6F6',
                  width: '120px',
                  height: '90px',
                  textAlign: 'center',
                  // paddingTop:'40px',
                  // marginTop:'30px'
                }}
              >
                {imageUrl === '' ? (
                  uploadButton
                ) : (
                  <div>
                    <img src={imageUrl} width={'120px'} height={'90px'}></img>
                  </div>
                )}
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Divider></Divider>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={db?.getPerson.data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        // scroll={{ y: 200 }}
      ></Table>
    </div>
  );
}
