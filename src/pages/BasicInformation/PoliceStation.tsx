import './index.css';

import { SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Cascader,
  Col,
  Empty,
  Form,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Watermark from 'antd/es/watermark';
import { useEffect, useState } from 'react';

import {
  AddPolice,
  CreatePolicestation,
  DeletePolice,
  DeletePolicestation,
  FindManyArea,
  FindManyPolicestation,
  FindUser,
  GetPoliceInfo,
  UpdatePolicestation,
} from '@/apis';

import shanchu from '../../assets/delete.svg';
import xiugai from '../../assets/xiugai.svg';
export default function PoliceStation() {
  interface DataType {
    key: string;
    real_name: string;
    mobile: string;
    id_card: string;
  }
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'real_name',
      key: 'real_name',
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '身份证',
      dataIndex: 'id_card',
      key: 'id_card',
    },
    {
      title: '操作',
      key: 'action',
      render: (value) => (
        <Space size="middle">
          <a
            onClick={() => {
              setUserID(value.id);
              setDeletePoliceInfo(true);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];
  const columnsRole: any = [
    {
      title: '姓名',
      dataIndex: 'real_name',
      key: 'real_name',
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '身份证号',
      dataIndex: 'id_card',
      key: 'id_card',
    },
    {
      title: '操作',
      key: 'action',
      render: (value: any) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSearch(true);
              setSearchName('');
              setUserID(value.id);
              if (searchRole === '民警') {
                setPoliceState(false);
                formAddPolice.setFieldsValue({
                  name: value.real_name,
                  idcard: value.id_card,
                  mobile: value.mobile,
                });
              } else {
                setPoliceLeaderStation(false);
              }
            }}
          >
            选择
          </Button>
        </Space>
      ),
    },
  ];
  const [formAddPolice] = Form.useForm();
  const [formupdatePoliceStation] = Form.useForm();
  const [formAddPoliceStation] = Form.useForm();
  const [onSearchForm] = Form.useForm();
  const [search, setSearch] = useState(false);
  // 获取的警局信息
  const [policeStation, setPoliceStation] = useState([]);
  // 查看具体信息
  const [visitInfo, setVisitInfo] = useState(false);
  // 增加警员
  const [addPolice, setAddPolice] = useState(false);
  // const [, setAddPoliceloading] = useState(false);
  // 删除警员
  const [deletePoliceInfo, setDeletePoliceInfo] = useState(false);
  // 增加警局
  const [addPoliceStation, setAddPoliceStation] = useState(false);
  // 删除警局
  const [deletePoliceStation, setDeletePoliceStation] = useState(false);
  // 查询用户信息（所长/警员等）
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  // 用户ID（所长/警员等）
  const [userID, setUserID] = useState<any>();
  // 警员具体信息
  const [policeInfo, setPoliceInfo] = useState();
  // 警员信息弹窗状态
  const [policeState, setPoliceState] = useState(false);
  // 所长信息
  const [policeLeaderStation, setPoliceLeaderStation] = useState(false);
  const [policeStationLeaderName, setPoliceStationLeaderName] = useState();
  // 筛选的镇的条件
  // const [town, setTown] = useState([]);
  // const [townID, setTownID] = useState<number>();
  // 筛选的村或社区条件
  const [community, setCommunity] = useState([]);
  // const [communityID, setCommunityID] = useState<number>();
  // 筛选状态
  const [searchState, setSearchState] = useState(false);
  const [selectid, setSelectid] = useState<number[]>([]);
  // 修改派出所
  const [updateState, setUpdateState] = useState(false);
  // 派出所ID
  const [policeStationId, setPoliceStationId] = useState<number>();
  // 警员信息
  const [policeDetail, setPoliceDetail] = useState();
  const [policeStationloading, setPoliceStationLoading] = useState(true);
  const [policeDetailloading, setPoliceDetailloading] = useState(true);
  const [updateLoading, setupdateLoading] = useState(false);
  const { SHOW_CHILD } = Cascader;
  // 总数
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
  });
  const skip = (pagination.current - 1) * pagination.pageSize;
  // const { Option } = Select;

  // 设置筛选逻辑
  let selectObject;
  if (searchState) {
    selectObject = {
      select: { area_id: selectid, role: 2 },
      take: pagination.pageSize,
      skip: skip,
    };
  } else {
    selectObject = {
      select: { area_id: [], role: 2 },
      take: pagination.pageSize,
      skip: skip,
    };
  }

  // 查询行政区域
  const { data: Areadata } = useQuery(FindManyArea, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      take: 100,
      skip: 0,
    },
  });
  // 查询警局信息
  const { data: Policestationdata } = useQuery(FindManyPolicestation, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: selectObject,
  });
  // 查询所长、警员等用户信息
  const { data: searchNamedata, loading } = useQuery(FindUser, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      name: searchName,
      role: searchRole,
    },
  });
  // 查询警局的具体警员信息
  const { data: policeDetailData } = useQuery(GetPoliceInfo, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      rightnow_policestation_id: policeStationId,
      role: 2,
    },
  });

  // 增加派出所
  const [addPoliceStationInfo] = useMutation(CreatePolicestation);
  // 删除派出所
  const [Delete_Police] = useMutation(DeletePolicestation);
  // 修改派出所
  const [updatePoliceStation] = useMutation(UpdatePolicestation);
  // 增加警员
  const [addPoliceInfo] = useMutation(AddPolice);
  // 删除警员
  const [deletePolice] = useMutation(DeletePolice);

  useEffect(() => {
    if (policeDetailData) {
      setPoliceDetail(policeDetailData.getPoliceInfo);
      setPoliceDetailloading(false);
    }
  }, [policeDetailData]);

  useEffect(() => {
    if (Policestationdata) {
      setPoliceStation(Policestationdata.findManyPolicestation.data);
      setTotal(Policestationdata.findManyPolicestation.count);
      if (!updateLoading) {
        setPoliceStationLoading(false);
      }
    }
  }, [Policestationdata, updateLoading]);

  useEffect(() => {
    if (Areadata) {
      let data = Areadata.findManyArea;
      const townData: any = [];
      const communityData: any = [];
      data.map((item: any) => {
        if (item.level === 2) {
          townData.push({ name: item.name, id: parseInt(item.id) });
        } else if (item.level === 3) {
          communityData.push({ name: item.name, id: parseInt(item.id) });
        }
      });
      // setTown(townData);
      setCommunity(communityData);
    }
  }, [Areadata]);

  useEffect(() => {
    if (searchNamedata) {
      setPoliceInfo(searchNamedata.findUser);
    }
  }, [searchNamedata]);

  const changePage = (_current: any) => {
    setTotal(total);
    setPagination({
      current: _current,
      pageSize: pagination.pageSize,
    });
  };
  const VisitInfo_handleCancel = () => {
    setVisitInfo(false);
  };
  // 增加警员
  const AddPolice_handleOk = () => {
    if (!search) {
      message.info('请根据您输入的警员姓名进行搜索选择！');
      return;
    }
    setSearch(false);
    setAddPolice(false);
    setPoliceStationLoading(true);
    setupdateLoading(true);
    addPoliceInfo({
      variables: {
        rightnow_policestation_id: policeStationId,
        // community_id: 0,
        user_id: userID,
      },
      awaitRefetchQueries: true,
      // refetchQueries: ['getPoliceInfo'],// 重新查询
      refetchQueries: [
        {
          query: GetPoliceInfo,
          variables: {
            rightnow_policestation_id: policeStationId,
            role: 2,
          },
        },
        'findManyPolicestation',
      ],
    }).then((r) => {
      if (r.data.addPolice === 1) {
        formAddPolice.resetFields();
        message.success(
          '添加成功',
          (onclose = () => {
            setPoliceStationLoading(false);
            setupdateLoading(false);
          }),
        );
      } else {
        formAddPolice.resetFields();
        message.success(
          '添加失败',
          (onclose = () => {
            setPoliceStationLoading(false);
            setupdateLoading(false);
          }),
        );
      }
    });
  };
  // 取消增加警员
  const AddPolice_handleCancel = () => {
    setAddPolice(false);
    formAddPolice.resetFields();
  };
  // 确认增加派出所
  const AddPoliceStation_handleOk = () => {
    if (!search) {
      message.info('请根据您输入的所长姓名进行搜索选择！');
      return;
    }
    setSearch(false);
    let administrative_area_idArr = formAddPoliceStation.getFieldValue('area');
    let administrative_area_id: any = [];
    administrative_area_idArr.map((item: any) => {
      administrative_area_id.push(parseInt(item[item.length - 1]));
    });
    addPoliceStationInfo({
      variables: {
        data: {
          administrative_area_id: administrative_area_id,
          // community_id: 0,
          name: formAddPoliceStation.getFieldValue('name'),
          user_id: userID,
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: ['findManyPolicestation'], // 重新查询
    }).then((r) => {
      if (r.data.createPolicestation === null) {
        message.error('添加失败');
        formAddPoliceStation.resetFields();
      } else {
        formAddPoliceStation.resetFields();
        // setUserID();
        message.success('添加成功');
      }
    });
    setAddPoliceStation(false);
  };
  // 取消增加派出所
  const AddPoliceStation_handleCancel = () => {
    setSearchName('');
    setPoliceLeaderStation(false);
    setAddPoliceStation(false);
    formAddPoliceStation.resetFields();
  };
  // 筛选条件：镇
  // const onChangetown = (value: number) => {
  //     let id: any = [];
  //     id.push(value);
  //     // setTownID(value);
  //     setSelectid(id);
  // };
  // 筛选条件：村或社区
  const onChangecommunity = (value: number) => {
    let id: any = [];
    id.push(value);
    // setCommunityID(value);
    setSelectid(id);
  };
  // 筛选
  const searchPoliceStation = () => {
    let data = onSearchForm.getFieldsValue();
    // 从表单中获取镇ID
    // let town = data['town'];
    // 从表单中获取社区ID
    let community = data['community'];
    if (community === undefined) {
      message.error('请选择一个条件');
    } else {
      let arr: number[] = [];
      // if (town) {
      //     arr.push(town);
      // }
      if (community) {
        arr.push(community);
      }
      setSearchState(true);
      setSelectid(arr);
      // 将页码重置
      setPagination({
        current: 1,
        pageSize: pagination.pageSize,
      });
    }
  };
  // 重置
  const onReset = () => {
    onSearchForm.resetFields();
    setSearchState(false);
  };
  // 扁平化数据转树
  const flatToTree = (data: any) => {
    // 先初始化这个数组，将根节点加进去，有几个parent_id为null，就有几个根节点
    // 第一层
    // 主要考虑表中的这个节点顺序可能是没有顺序的，不固定
    let res: any = [];
    for (let i = 0; i !== data.length; i++) {
      if (!data[i].parent_id) {
        let dict = {
          title: data[i].name,
          key: data[i].id,
          children: [],
          level: 1,
        };
        res.push(dict);
      }
    }
    if (res.length === 0) {
      message.error('没有根节点');
      return [];
    }
    // 第二层
    for (const item of data) {
      let name = item.name;
      let level = item.level;
      let parentId = item.parent_id;
      let key = item.id;
      let dict = {};
      dict = {
        title: name,
        key: key,
        children: [],
        level: 2,
      };
      // 判断是第几层
      if (level === 2) {
        // 获取当前parentId在数组中的索引
        res.map((item: any, index: number) => {
          if (parseInt(item['key']) === parentId) {
            res[index]['children'].push(dict);
            return;
          }
        });
      }
    }

    // 第三层
    for (const item of data) {
      let name = item.name;
      let level = item.level;
      let parentId = item.parent_id;
      let key = item.id;
      let dict = {};
      dict = {
        title: name,
        key: key,
        children: [],
        level: 3,
      };
      // 判断是第几层
      if (level === 3) {
        // 获取当前parentId在数组中的索引
        res.map((item: any, index1: number) => {
          let children = item.children;
          children.map((item: any, index2: number) => {
            if (parseInt(item['key']) === parentId) {
              res[index1]['children'][index2]['children'].push(dict);
              return;
            }
          });
        });
      }
    }
    return res;
  };
  // 警局信息卡片
  const PoliceStation_card = policeStation.map((item: any, index) => {
    return (
      <>
        <Col span={6}>
          <Card
            hoverable
            style={{ marginBottom: '1vh' }}
            key={index}
            actions={[
              // eslint-disable-next-line react/jsx-key
              <Tooltip placement="bottom" title="修改">
                <a
                  onClick={() => {
                    let area = item.area.map((v: any) => {
                      let arr = v.map((item: any) => {
                        return item.toString();
                      });
                      return arr;
                    });
                    formupdatePoliceStation.setFieldsValue({
                      policeStationname: item.name,
                      policeStationLeader: item.policeleader_name,
                      area: area,
                    });
                    setUserID(item.user_id);
                    setPoliceStationLeaderName(item.policeleader_name);
                    setPoliceStationId(parseInt(item.id));
                    setUpdateState(true);
                  }}
                >
                  <Image src={xiugai} preview={false} />
                </a>
              </Tooltip>, // eslint-disable-next-line react/jsx-key
              <Tooltip placement="bottom" title="删除">
                <a
                  onClick={() => {
                    setDeletePoliceStation(true);
                    setPoliceStationId(parseInt(item.id));
                  }}
                >
                  <Image src={shanchu} preview={false} />
                </a>
              </Tooltip>,
            ]}
          >
            <div className="CardContent">
              <div className="CardContentRow">
                <span className="CardContentHead">派出所名称：</span>
                <span className="CardContentContent">{item.name}</span>
              </div>
              <div className="CardContentRow">
                <span className="CardContentHead">所长名称：</span>
                <span className="CardContentContent">{item.policeleader_name}</span>
              </div>
              <div className="CardContentRow">
                <span className="CardContentHead">警员数量：</span>
                <span className="CardContentContent">{item.police_count}</span>
                <span
                  style={{
                    color: '#0B62DF',
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    setVisitInfo(true);
                    setPoliceStationId(parseInt(item.id));
                  }}
                >
                  查看具体信息
                </span>
                <span
                  style={{
                    color: '#0B62DF',
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    setAddPolice(true);
                    setPoliceStationId(parseInt(item.id));
                  }}
                >
                  增加警员
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </>
    );
  });

  return (
    <Watermark
      content={'漠河市基层社会治理智管平台'}
      style={{ height: '100%' }}
      // rotate={-20}
      // gap={[50, 120]}
      // className="WaterMarkBox"
    >
      <div>
        <div
          style={{
            marginLeft: '1vw',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Form form={onSearchForm}>
            <Row gutter={16} style={{ columnGap: '20px' }}>
              {/* <Col>
                            <Form.Item name="town">
                                <Select
                                    allowClear
                                    showSearch
                                    onChange={onChangetown}
                                    style={{ width: '180px' }}
                                    placeholder="请选择镇"
                                    optionFilterProp="children"
                                    options={town.map((item: any) => {
                                        return {
                                            key: item.id,
                                            label: item.name,
                                            value: item.id,
                                        };
                                    })} />

                            </Form.Item>
                        </Col> */}
              <Col>
                <Form.Item name="community">
                  <Select
                    allowClear
                    showSearch
                    onChange={onChangecommunity}
                    placeholder="请选择村或者社区"
                    style={{ width: '180px' }}
                    optionFilterProp="children"
                    options={community.map((item: any) => {
                      return {
                        key: item.id,
                        label: item.name,
                        value: item.id,
                      };
                    })}
                  />
                </Form.Item>
              </Col>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: '#0757CB',
                    fontSize: '14px',
                    fontFamily: 'MicrosoftYaHei',
                  }}
                  onClick={searchPoliceStation}
                >
                  筛选
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: '#0757CB',
                    fontSize: '14px',
                    fontFamily: 'MicrosoftYaHei',
                  }}
                  onClick={onReset}
                >
                  重置
                </Button>
              </Form.Item>
            </Row>
          </Form>
          <Button
            type="primary"
            style={{
              background: '#0757CB',
            }}
            onClick={() => {
              setAddPoliceStation(true);
            }}
          >
            + 添加派出所
          </Button>
        </div>
        <Spin spinning={policeStationloading}>
          {policeStation.length !== 0 ? (
            <>
              <Row style={{ marginLeft: '0.5vw' }} gutter={16}>
                {PoliceStation_card}
              </Row>
              <Pagination
                className="Pagination"
                // showSizeChanger={true}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={total}
                showTotal={(total) => `总共 ${total} 条`}
                onChange={(_current) => {
                  changePage(_current);
                }}
              />
            </>
          ) : (
            <Empty />
          )}
        </Spin>
        <Modal
          title="警员信息"
          open={visitInfo}
          onCancel={VisitInfo_handleCancel}
          footer={null}
          width="60vw"
          getContainer={false}
        >
          <Table
            style={{ paddingTop: '1vh' }}
            columns={columns}
            loading={policeDetailloading}
            dataSource={policeDetail}
          />
        </Modal>
        <Modal
          title="增加警员"
          open={addPolice}
          onOk={AddPolice_handleOk}
          onCancel={AddPolice_handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form form={formAddPolice} layout="vertical">
            <Form.Item
              name="nameInfo"
              extra={
                <div style={{ color: 'red' }}>
                  注意：输入完请点击搜索进行警员信息查询并选择
                </div>
              }
            >
              <Input
                placeholder="请输入搜索关键字"
                suffix={
                  <SearchOutlined
                    onClick={() => {
                      let name = formAddPolice.getFieldValue('nameInfo');
                      if (!name) {
                        message.info('请输入警员名称');
                        return;
                      }
                      let role = '民警';
                      setSearchName(name);
                      setSearchRole(role);
                      setPoliceState(true);
                    }}
                  />
                }
              />
            </Form.Item>
            <Form.Item label="姓名" name="name">
              <Input placeholder="姓名" disabled />
            </Form.Item>
            <Form.Item label="身份证号" name="idcard">
              <Input placeholder="身份证号" disabled />
            </Form.Item>
            <Form.Item label="手机号" name="mobile">
              <Input disabled placeholder="手机号" />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="添加派出所"
          open={addPoliceStation}
          getContainer={false}
          onOk={AddPoliceStation_handleOk}
          onCancel={AddPoliceStation_handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form form={formAddPoliceStation} layout="vertical">
            <Row justify={'center'}>
              <Col span={23}>
                <Form.Item
                  name="name"
                  label="派出所名称"
                  rules={[
                    {
                      required: true,
                      message: '请输入派出所名称',
                    },
                  ]}
                >
                  <Input placeholder="请输入派出所名称" />
                </Form.Item>
                <Form.Item
                  name="username"
                  label="所长名称"
                  rules={[
                    {
                      required: true,
                      message: '请输入所长名称',
                    },
                  ]}
                  extra={
                    <div style={{ color: 'red' }}>
                      注意：输入完请点击搜索进行所长信息查询并选择
                    </div>
                  }
                >
                  <Input
                    placeholder="请输入所长名称"
                    suffix={
                      <SearchOutlined
                        onClick={() => {
                          let name = formAddPoliceStation.getFieldValue('username');
                          if (!name) {
                            message.info('请输入所长名称');
                            return;
                          }
                          let role = '所长';
                          setPoliceLeaderStation(true);
                          setSearchName(name);
                          setSearchRole(role);
                        }}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="area"
                  label="行政区域"
                  rules={[
                    {
                      required: true,
                      message: '请输入行政区域',
                    },
                  ]}
                >
                  <Cascader
                    fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                    options={Areadata ? flatToTree(Areadata.findManyArea) : []}
                    // onChange={onChange}
                    multiple
                    showCheckedStrategy={SHOW_CHILD}
                    placeholder="请选择所属行政区域"
                    // changeOnSelect
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title={'警员信息'}
          open={policeState}
          onCancel={() => {
            setSearchName('');
            setPoliceState(false);
          }}
          footer={null}
        >
          <Table columns={columnsRole} loading={loading} dataSource={policeInfo} />
        </Modal>
        <Modal
          title={'所长信息'}
          open={policeLeaderStation}
          onCancel={() => {
            setSearchName('');
            setPoliceLeaderStation(false);
          }}
          footer={null}
        >
          <Table
            style={{ overflow: 'hidden' }}
            columns={columnsRole}
            loading={loading}
            dataSource={policeInfo}
          />
        </Modal>
        <Modal
          title="修改派出所信息"
          open={updateState}
          getContainer={false}
          onOk={async () => {
            if (
              policeStationLeaderName !==
              formupdatePoliceStation.getFieldValue('policeStationLeader')
            ) {
              if (!search) {
                message.info('请根据您输入的所长姓名进行搜索选择！');
                return;
              }
            }
            setSearch(false);
            setPoliceStationLoading(true);
            setupdateLoading(true);
            setUpdateState(false);
            let administrative_area_idArr = formupdatePoliceStation.getFieldValue('area');
            let administrative_area_id: any = [];
            administrative_area_idArr.map((item: any) => {
              administrative_area_id.push(parseInt(item[item.length - 1]));
            });
            const updatepolicestationdata: any = await updatePoliceStation({
              variables: {
                new_data: {
                  administrative_area_id: administrative_area_id,
                  // community_id: 0,
                  name: formupdatePoliceStation.getFieldValue('policeStationname'),
                  user_id: userID,
                },
                rightnow_pstation_id: policeStationId,
              },
              awaitRefetchQueries: true,
              refetchQueries: ['findManyPolicestation'], // 重新查询
            });
            if (updatepolicestationdata.data.updatePolicestation === 1) {
              formupdatePoliceStation.resetFields();
              message.success(
                '修改成功',
                (onclose = () => {
                  setPoliceStationLoading(false);
                  setupdateLoading(false);
                }),
              );
            } else {
              // formupdatePoliceStation.resetFields();
              message.success(
                '修改失败',
                (onclose = () => {
                  setPoliceStationLoading(false);
                  setupdateLoading(false);
                }),
              );
            }
          }}
          onCancel={() => {
            formupdatePoliceStation.resetFields();
            setUpdateState(false);
            setSearchName('');
            setPoliceLeaderStation(false);
          }}
          okText="确认"
          cancelText="取消"
        >
          <Form {...layout} form={formupdatePoliceStation}>
            <Form.Item
              name="policeStationname"
              label="派出所名称"
              rules={[{ required: true, message: '请输入派出所名称' }]}
            >
              <Input placeholder="请输入派出所名称" />
            </Form.Item>
            <Form.Item
              name="policeStationLeader"
              label="所长名称"
              rules={[{ required: true, message: '请输入所长名称' }]}
              extra={
                <div style={{ color: 'red' }}>
                  注意：输入完请点击搜索进行所长信息查询并选择
                </div>
              }
            >
              <Input
                placeholder="请输入所长名称"
                suffix={
                  <SearchOutlined
                    onClick={() => {
                      let name =
                        formupdatePoliceStation.getFieldValue('policeStationLeader');
                      if (!name) {
                        message.info('请输入所长名称');
                        return;
                      }
                      let role = '所长';
                      setPoliceLeaderStation(true);
                      setSearchName(name);
                      setSearchRole(role);
                    }}
                  />
                }
              />
            </Form.Item>
            <Form.Item
              name="area"
              label="行政区域"
              rules={[
                {
                  required: true,
                  message: '请输入行政区域',
                },
              ]}
            >
              <Cascader
                fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                options={Areadata ? flatToTree(Areadata.findManyArea) : []}
                multiple
                showCheckedStrategy={SHOW_CHILD}
                placeholder="请选择所属行政区域"
                // changeOnSelect
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="删除派出所"
          open={deletePoliceStation}
          onOk={() => {
            Delete_Police({
              awaitRefetchQueries: true,
              refetchQueries: ['findManyPolicestation'], // 重新查询
              variables: {
                id: policeStationId,
              },
            })
              .then((r) => {
                if (r.data.deletePolicestation === 1) {
                  message.success('删除成功');
                } else if (r.data.deletePolicestation === 0) {
                  message.error('删除失败');
                }
                setDeletePoliceStation(false);
                if (
                  total - 1 &&
                  pagination.current > total / pagination.pageSize &&
                  total % pagination.pageSize === 1
                ) {
                  setTotal(total);
                  setPagination({
                    current: pagination.current - 1,
                    pageSize: pagination.pageSize,
                  });
                }
              })
              .catch((res: any) => {
                message.error(res);
                setDeletePoliceStation(false);
              });
          }}
          onCancel={() => {
            setDeletePoliceStation(false);
          }}
          okText="确认"
          cancelText="取消"
        >
          <p>该操作会删除警局下的所有信息，您确认要删除该警局吗？</p>
        </Modal>
        <Modal
          title="删除警员"
          open={deletePoliceInfo}
          onOk={() => {
            deletePolice({
              variables: {
                user_id: userID,
              },
              awaitRefetchQueries: true,
              refetchQueries: [
                {
                  query: GetPoliceInfo,
                  variables: {
                    rightnow_policestation_id: policeStationId,
                    role: 2,
                  },
                },
                'findManyPolicestation',
              ],
            })
              .then((r) => {
                if (r.data.deletePolice === 1) {
                  message.success('删除成功');
                } else if (r.data.deletePolice === 0) {
                  message.error('删除失败');
                }
                setDeletePoliceInfo(false);
                setVisitInfo(false);
              })
              .catch((res: any) => {
                message.error(res);
                setDeletePoliceInfo(false);
              });
          }}
          onCancel={() => {
            setDeletePoliceInfo(false);
          }}
          okText="确认"
          cancelText="取消"
        >
          <p>该操作会从警局中删除该警员信息，您确认要删除该警员吗？</p>
        </Modal>
      </div>
    </Watermark>
  );
}
