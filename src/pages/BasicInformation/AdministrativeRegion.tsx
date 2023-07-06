import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { useMount } from 'ahooks';
import {
  Button,
  Card,
  Cascader,
  Col,
  Drawer,
  Form,
  // Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tree,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
// import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';

import {
  // CountGrid,
  CreateArea,
  CreateGrid,
  DeleteArea,
  DeleteGrid,
  FindManyArea,
  FindManyGrid,
  FindUser,
  UpdateArea,
  UpdateGrid,
} from '@/apis';

// import wanggeyuan from '../../assets/wanggeyuan_bianji.svg';

interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
  commit: string;
  police: string;
}
export interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
}
const AdministrativeRegion: React.FC = () => {
  // const { Option } = Select;
  // 添加网格抽屉
  const [open, setOpen] = useState(false);
  // 修改网格抽屉
  const [update_open, setUpdate_Open] = useState(false);
  // 添加行政区域
  const [modalAddVisible, setModalAddVisible] = useState(false);
  // 删除行政区域
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  // 修改行政区域
  const [modalRenameVisible, setModalRenameVisible] = useState(false);
  // 删除网格区域
  const [modalDeleteGrid, setModalDeleteGrid] = useState(false);
  // 行政区域右键点击弹出框
  const [editlevel, setEditlevel] = useState(false);
  // 网格名称
  const [gridName, setGridName] = useState();
  // 网格长名称
  const [gridleaderName, setGridleaderName] = useState();
  // 行政区域名称
  // const [areaName, setAreaName] = useState();
  // 行政区域ID
  const [areaId, setAreaId] = useState<number>();
  // 行政区域层级
  const [level, setLevel] = useState<number>(1);
  // 网格区域数据
  const [griddata, setGriddata] = useState([]);
  // 网格ID
  const [GridId, setGridId] = useState();
  // 用户ID
  const [userid, setUserID] = useState();
  // 用户名字
  const [searchName, setSearchName] = useState('');
  // 用户角色
  const [searchRole, setSearchRole] = useState('');
  // 网格长信息
  const [gridleader, setGridleader] = useState(false);
  const [gridleaderloading, setGridleaderloading] = useState(true);
  // 社区主任信息
  const [communityleader, setCommunityleader] = useState(false);
  const [communityleaderloading, setCommunityleaderloading] = useState(true);
  // 搜索的用户信息
  const [informationRole, setInformationRole] = useState([]);
  const [search, setSearch] = useState(false);
  // 右键时添加区域的父ID，是当前所选的ID
  const [parentID, setParentID] = useState<number>();
  // 当前所选区域的父节点ID
  const [areaparentID, setAreaParentID] = useState<number>();
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  // const [form] = Form.useForm();
  const [formSubmit] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formAddArea] = Form.useForm();
  const [formRename] = Form.useForm();
  const [total, setTotal] = useState<number>(0);
  // 分页参数
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  // 当前页与每页条数
  const current: any = pagination.current;
  const pageSize: any = pagination.pageSize;
  // 跳过指定数据
  const skip = (current - 1) * pageSize;
  // 每页获取的数据数
  const take = pageSize;

  // 分页相关
  const fetchData = (params: Params = {}) => {
    setPagination({
      ...params.pagination,
      total: total,
    });
  };
  useMount(() => {
    fetchData({ pagination });
  });

  const columns: ColumnsType<DataType> = [
    {
      title: '网格名称',
      dataIndex: 'name',
      key: 'name',
    },
    // {
    //   title: '网格员名称',
    //   dataIndex: 'user_name',
    //   key: 'user_name',
    //   // render: (text) => <a style={{ color: 'black' }}>{text}
    //   //   <Image src={wanggeyuan}
    //   //     preview={false} /></a>
    // },
    {
      title: '所属网格长',
      dataIndex: 'grid_leader_name',
      key: 'grid_leader_name',
    },
    {
      title: '所属社区',
      dataIndex: 'area_name',
      key: 'area_name',
    },
    {
      title: '所属社区主任',
      dataIndex: 'area_leader_name',
      key: 'area_leader_name',
    },
    {
      title: '操作',
      key: 'action',
      render: (text) => (
        <Space size="middle">
          <a
            onClick={() => {
              formUpdate.setFieldsValue({
                Gridname: text.name,
                Areaname: text.area_name,
                leader: text.grid_leader_name,
              });
              // setGridName(text.name);
              // setGridleaderName(text.grid_leader_name);
              setUpdate_Open(true);
              setAreaId(parseInt(text.area_id));
              setUserID(text.grid_leader_id);
              // setAreaName(text.area_name);
              setGridId(text.id);
            }}
          >
            修改
          </a>
          <span>|</span>
          <a
            onClick={() => {
              setGridId(text.id);
              setModalDeleteGrid(true);
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
              if (searchRole === '网格长') {
                setGridleader(false);
              } else {
                setCommunityleader(false);
              }
            }}
          >
            选择
          </Button>
        </Space>
      ),
    },
  ];
  // parent_id 上级行政区域ID
  // level行政区域级别 1市 2镇 3社区（村）
  const { data: Areadata } = useQuery(FindManyArea, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      take: 100,
      skip: 0,
    },
  });
  // 网格数据
  const { data: Griddata } = useQuery(FindManyGrid, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      // take: pagination.pageSize,
      // skip: skip,
      take: take,
      skip: skip,
      select: {
        area_ids: checkedKeys,
      },
    },
  });
  // 用户数据
  const { data: searchNamedata } = useQuery(FindUser, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      name: searchName,
      role: searchRole,
    },
  });

  useEffect(() => {
    if (Griddata) {
      let grid_data = Griddata.findManyGrid.data;
      let data = grid_data.map((item: any) => {
        if (item.grid_leader_info) {
          let grid_leader_name = item.grid_leader_info.real_name;
          let grid_leader_id = item.grid_leader_info.id;
          let grid_name = item.name;
          let area_name = item.area_info.name;
          let area_leader_name = item.area_leader_info.real_name;
          let id = item.id;
          let area_id = item.area_info.id;
          return {
            name: grid_name,
            grid_leader_name: grid_leader_name,
            area_name: area_name,
            area_id: area_id,
            area_leader_name: area_leader_name,
            grid_leader_id: grid_leader_id,
            id: id,
          };
        } else {
          let grid_name = item.name;
          let area_name = item.area_info.name;
          let area_leader_name = item.area_leader_info.real_name;
          let id = item.id;
          let area_id = item.area_info.id;
          return {
            name: grid_name,
            grid_leader_name: ' ',
            area_name: area_name,
            area_id: area_id,
            area_leader_name: area_leader_name,
            grid_leader_id: ' ',
            id: id,
          };
        }
      });
      setGriddata(data);

      // let grid_data = [];

      setTotal(Griddata.findManyGrid.count);
      setPagination((pagination) => {
        return {
          ...pagination,
          total: Griddata.findManyGrid.count,
        };
      });
    }
  }, [Griddata]);

  useEffect(() => {
    if (searchNamedata) {
      setInformationRole(searchNamedata.findUser);
      if (searchRole === '网格长') {
        setGridleaderloading(false);
      } else {
        setCommunityleaderloading(false);
      }
    }
  }, [searchNamedata, searchRole]);

  useEffect(() => {
    if (gridName) {
      setGridName(gridName);
    }
  }, [gridName]);

  useEffect(() => {
    if (gridleaderName) {
      setGridleaderName(gridleaderName);
    }
  }, [gridleaderName]);

  // 删除
  const [deleteArea] = useMutation(DeleteArea);
  const [deleteGrid] = useMutation(DeleteGrid);

  // 添加
  const [addArea] = useMutation(CreateArea);
  const [addGrid] = useMutation(CreateGrid);

  // 编辑
  const [updateArea] = useMutation(UpdateArea);
  const [updateGrid] = useMutation(UpdateGrid);

  // 表格分页变化
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchData({
      pagination: newPagination,
    });
  };
  const handleCancel_editlevel = () => {
    setEditlevel(false);
    formAddArea.resetFields();
  };
  // 取消添加
  const handle_cancelAdd = () => {
    setModalAddVisible(false);
    formAddArea.resetFields();
  };

  // 取消修改
  const handle_cancelRename = () => {
    setModalRenameVisible(false);
    formRename.resetFields();
  };

  // 取消删除
  const handle_cancelDelete = () => {
    setModalDeleteVisible(false);
  };
  const handle_cancelDeleteGrid = () => {
    setModalDeleteGrid(false);
  };
  const showDrawer = () => {
    setOpen(true);
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
        parentId,
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
      // let areaLeaderName = item.leader.real_name;
      let leader = item.leader;
      let dict = {};
      dict = {
        title: name,
        key: key,
        parentId,
        children: [],
        level: 3,
        // areaLeaderName: areaLeaderName,
        leader: leader,
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
  const onClose = () => {
    setOpen(false);
    formSubmit.resetFields();
  };
  const onupdate_Close = () => {
    setUpdate_Open(false);
    formUpdate.resetFields();
  };

  // 右键分类方法
  const rigthChecked = (e: any) => {
    let level = e.node.level;
    let key = parseInt(e.node.key);
    let parentid = parseInt(e.node.parentId);
    if (level === 3) {
      let area_leader_name = e.node.leader.real_name;
      let area_leader_id = e.node.leader.id;
      formRename.setFieldsValue({
        areaname: e.node.title,
        CommunityLeadername: area_leader_name,
      });
      setUserID(area_leader_id);
    } else {
      formRename.setFieldsValue({ areaname: e.node.title });
    }

    // setAreaName(e.node.title);
    setEditlevel(true);
    setLevel(level);
    setParentID(key);
    setAreaParentID(parentid);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    let res = checkedKeysValue.map((item: any) => {
      return parseInt(item);
    });
    setCheckedKeys(res);
  };
  const onAddGrid = async () => {
    if (!search) {
      message.info('请根据您输入的网格长姓名进行搜索选择！');
      return;
    }
    setSearch(false);
    let name = formSubmit.getFieldValue('Areaname');
    let areaid = parseInt(name[name.length - 1]);
    const addGriddata: any = await addGrid({
      variables: {
        data: {
          area_id: areaid,
          name: formSubmit.getFieldValue('Gridname'),
          grid_leader_id: userid,
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: ['findManyGrid'], // 重新查询
      // refetchQueries: [
      //   {
      //     query: FindManyGrid,
      //     variables: {
      //       take: 12,
      //       skip: 0,
      //       select: {
      //         area_ids: checkedKeys
      //       }
      //     }
      //   }
      // ],
    });
    if (addGriddata.data.createGrid.id) {
      message.success('添加成功');
    } else {
      message.error('添加失败');
    }
    setOpen(false);
    formSubmit.resetFields();
  };
  const onUpdateGrid = async () => {
    if (!search) {
      message.info('请根据您输入的网格长姓名进行搜索选择！');
      return;
    }
    setSearch(false);
    let name = formUpdate.getFieldValue('Areaname');
    let areaid;
    if (typeof name === 'string') {
      areaid = areaId;
    } else {
      areaid = parseInt(name[name.length - 1]);
    }

    const updateGriddata: any = await updateGrid({
      variables: {
        new_data: {
          area_id: areaid,
          name: formUpdate.getFieldValue('Gridname'),
          grid_leader_id: userid,
        },
        rightnow_grid_id: GridId,
      },
      awaitRefetchQueries: true,
      refetchQueries: ['findManyGrid'], // 重新查询
      // refetchQueries: [
      //   {
      //     query: FindManyGrid,
      //     variables: {
      //       take: 12,
      //       skip: 0,
      //       select: {
      //         area_ids: checkedKeys
      //       }
      //     }
      //   }
      // ],
    });
    if (updateGriddata.data.updateGrid === 1) {
      message.success('修改成功');
    } else {
      message.error('修改失败');
    }
    setUpdate_Open(false);
    formUpdate.resetFields();
  };
  return (
    <>
      <Row gutter={16} style={{ height: '100%' }}>
        <Col span={5} style={{ height: '100%' }}>
          <Card
            style={{ height: '100%' }}
            title={
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: 'MicrosoftYaHeiUI',
                  color: '#000000',
                  lineHeight: '24px',
                }}
              >
                行政区域
              </div>
            }
            bordered={false}
          >
            <Tree
              checkable
              // treeData={treeData}
              // onExpand={onExpand}
              // expandedKeys={expandedKeys}
              // autoExpandParent={autoExpandParent}
              // @ts-ignore
              onCheck={onCheck}
              height={600}
              // checkedKeys={checkedKeys}
              // onSelect={onSelect}
              // selectedKeys={selectedKeys}
              onRightClick={rigthChecked}
              treeData={Areadata ? flatToTree(Areadata.findManyArea) : []}
            />
          </Card>
        </Col>
        <Col style={{ backgroundColor: 'white', borderRadius: '4px' }} span={19}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '2vh',
              marginLeft: '1vw',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontFamily: 'MicrosoftYaHeiUI',
                color: '#000000',
                lineHeight: '24px',
              }}
            >
              网格区域
            </div>
            <Row justify={'end'} style={{ marginRight: '1vw', columnGap: '20px' }}>
              <Button
                style={{
                  background: '#0757CB',
                  color: '#FFFFFF',
                }}
                onClick={showDrawer}
              >
                + 添加网格
              </Button>
            </Row>
          </div>
          <Table
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: total,
              showTotal: (total) => `共 ${total} 条`,
            }}
            onChange={handleTableChange}
            style={{ paddingTop: '1vh' }}
            columns={columns}
            dataSource={griddata}
          />
        </Col>
      </Row>
      <Drawer
        mask={false}
        size={'default'}
        title="添加网格"
        placement="right"
        onClose={onClose}
        open={open}
        footer={
          <Row justify={'end'}>
            <Space>
              <Button
                onClick={() => {
                  setGridleader(false);
                  setOpen(false);
                  formSubmit.resetFields();
                }}
              >
                取消
              </Button>
              <Button
                style={{
                  background: '#0757CB',
                  color: 'white',
                }}
                onClick={onAddGrid}
              >
                确认
              </Button>
            </Space>
          </Row>
        }
      >
        <Form style={{ width: '100%' }} layout="vertical" form={formSubmit}>
          <Form.Item
            name="Gridname"
            label="网格名称"
            rules={[{ required: true, message: '请输入网格名称' }]}
          >
            <Input placeholder="请输入网格名称" />
          </Form.Item>
          <Form.Item
            name="Areaname"
            label="所属社区"
            rules={[{ required: true, message: '请选择所属社区' }]}
          >
            <Cascader
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              options={Areadata ? flatToTree(Areadata.findManyArea) : []}
              placeholder="请选择所属社区"
            />
          </Form.Item>
          <Form.Item
            name="Gridleader"
            label="所属网格长"
            extra={
              <div style={{ color: 'red' }}>
                注意：输入完请点击搜索进行网格长信息查询并选择
              </div>
            }
          >
            <Input
              placeholder="请输入网格长名称"
              suffix={
                <SearchOutlined
                  onClick={() => {
                    let name = formSubmit.getFieldValue('Gridleader');
                    if (!name) {
                      message.info('请输入网格长名称');
                      return;
                    }
                    let role = '网格长';
                    setGridleader(true);
                    setGridleaderloading(true);
                    setSearchName(name);
                    setSearchRole(role);
                  }}
                />
              }
            />
          </Form.Item>
        </Form>
      </Drawer>
      <Drawer
        mask={false}
        size={'default'}
        title="修改网格"
        placement="right"
        onClose={onupdate_Close}
        open={update_open}
        footer={
          <Row justify={'end'}>
            <Space>
              <Button
                onClick={() => {
                  setUpdate_Open(false);
                  setGridleader(false);
                  formUpdate.resetFields();
                }}
              >
                取消
              </Button>
              <Button
                style={{ background: '#0757CB', color: 'white' }}
                onClick={onUpdateGrid}
              >
                确认
              </Button>
            </Space>
          </Row>
        }
      >
        <Form
          style={{ width: '100%' }}
          layout="vertical"
          // initialValues={{
          //   Gridname: gridName,
          //   Areaname: areaName,
          //   leader: gridleaderName,
          // }}
          form={formUpdate}
        >
          <Form.Item
            name="Gridname"
            label="网格名称"
            rules={[{ required: true, message: '请输入网格名称' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="Areaname"
            label="所属社区"
            rules={[{ required: true, message: '请选择所属社区' }]}
          >
            <Cascader
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              options={Areadata ? flatToTree(Areadata.findManyArea) : []}
              placeholder="请选择所属社区"
            />
          </Form.Item>
          <Form.Item
            name="leader"
            label="所属网格长"
            extra={
              <div style={{ color: 'red' }}>
                注意：输入完请点击搜索进行网格长信息查询并选择
              </div>
            }
          >
            <Input
              placeholder="请输入网格长名称"
              suffix={
                <SearchOutlined
                  onClick={() => {
                    let name = formUpdate.getFieldValue('leader');
                    if (!name) {
                      message.info('请输入网格长名称');
                      return;
                    }
                    let role = '网格长';
                    setGridleader(true);
                    setGridleaderloading(true);
                    setSearchName(name);
                    setSearchRole(role);
                  }}
                />
              }
            />
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        open={editlevel}
        onCancel={handleCancel_editlevel}
        closable={false}
        centered
        footer={null}
        width={'150px'}
        style={{ borderRadius: '50px', overflow: 'auto' }}
      >
        <div style={{ textAlign: 'center' }}>
          {level === 1 ? (
            <>
              <PlusOutlined
                style={{ marginLeft: 10, fontSize: 20 }}
                onClick={() => {
                  setModalAddVisible(true);
                  setEditlevel(false);
                }}
              />
            </>
          ) : level === 2 ? (
            <>
              <EditOutlined
                style={{ marginLeft: 10, fontSize: 20 }}
                onClick={() => {
                  setModalRenameVisible(true);
                  setEditlevel(false);
                }}
              />
              <PlusOutlined
                style={{ marginLeft: 10, fontSize: 20 }}
                onClick={() => {
                  setModalAddVisible(true);
                  setEditlevel(false);
                }}
              />
              <DeleteOutlined
                style={{ marginLeft: 10, fontSize: 20 }}
                onClick={() => {
                  setModalDeleteVisible(true);
                  setEditlevel(false);
                }}
              />
            </>
          ) : (
            <>
              <EditOutlined
                style={{ marginLeft: 10, fontSize: 20 }}
                onClick={() => {
                  setModalRenameVisible(true);
                  setEditlevel(false);
                }}
              />
              <span> </span>
              <DeleteOutlined
                style={{ marginLeft: 10, fontSize: 20 }}
                onClick={() => {
                  setModalDeleteVisible(true);
                  setEditlevel(false);
                }}
              />
            </>
          )}
        </div>
      </Modal>

      <Modal
        title="添加行政区域"
        getContainer={false}
        open={modalAddVisible}
        onOk={() => {
          // const user_id = formAddArea.getFieldValue('CommunityLeadername')
          // const areadata = await addArea({
          //   variables: {
          //     data: {
          //       level: level + 1,
          //       name: formAddArea.getFieldValue('Areaname'),
          //       parent_id: parentID,
          //       user_id: userid,
          //     }
          //   },
          //   awaitRefetchQueries: true,
          //   refetchQueries: ['findManyArea'],
          // });
          // //console.log('areadata', areadata);
          if (!search && level === 2) {
            message.info('请根据您输入的网格长姓名进行搜索选择！');
            return;
          }
          setSearch(false);
          addArea({
            variables: {
              data: {
                level: level + 1,
                name: formAddArea.getFieldValue('Areaname'),
                parent_id: parentID,
                user_id: userid,
              },
            },
            awaitRefetchQueries: true,
            refetchQueries: ['findManyArea'],
          })
            .then(() => {
              message.success('添加成功');
              formAddArea.resetFields();
              setModalAddVisible(false);
            })
            .catch((res) => {
              message.error('' + res);
              setModalAddVisible(false);
            });
          // setModalAddVisible(false);
          formAddArea.resetFields();
        }}
        onCancel={handle_cancelAdd}
        okText="确认"
        cancelText="取消"
      >
        <Row
          style={{
            marginTop: '0.5%',
            paddingTop: '1%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Form
            form={formAddArea}
            style={{
              width: '100%',
              marginTop: '0.5%',
              marginBottom: '0.5%',
              paddingTop: '3%',
              paddingBottom: '1%',
              paddingLeft: '10%',
              paddingRight: '1%',
            }}
            preserve={false}
          >
            <Form.Item
              label="行政区域"
              name="Areaname"
              rules={[
                {
                  required: true,
                  message: '请输入行政区域',
                },
              ]}
            >
              <Input placeholder="请输入行政区域" style={{ width: '20vw' }} />
            </Form.Item>
            {level === 2 ? (
              <Form.Item
                label="社区主任"
                name="CommunityLeadername"
                rules={[
                  {
                    required: true,
                    message: '请输入社区主任',
                  },
                ]}
                extra={
                  <div style={{ color: 'red' }}>
                    注意：输入完请点击搜索进行社区主任信息查询并选择
                  </div>
                }
              >
                <Input
                  placeholder="请输入社区主任"
                  style={{ width: '20vw' }}
                  suffix={
                    <SearchOutlined
                      onClick={() => {
                        let name = formAddArea.getFieldValue('CommunityLeadername');
                        if (!name) {
                          message.info('请输入社区主任名称');
                          return;
                        }
                        let role = '社区主任';
                        setCommunityleader(true);
                        setCommunityleaderloading(true);
                        setSearchName(name);
                        setSearchRole(role);
                      }}
                    />
                  }
                />
              </Form.Item>
            ) : (
              <></>
            )}
          </Form>
        </Row>
      </Modal>
      <Modal
        title="修改行政区域"
        open={modalRenameVisible}
        getContainer={false}
        onOk={() => {
          if (!search && level === 3) {
            message.info('请根据您输入的社区主任姓名进行搜索选择！');
            return;
          }
          setSearch(false);
          updateArea({
            awaitRefetchQueries: true,
            refetchQueries: ['findManyArea', 'findManyGrid'], // 重新查询
            variables: {
              new_data: {
                level: level,
                name: formRename.getFieldValue('areaname'),
                parent_id: areaparentID,
                user_id: userid,
              },
              rightnow_area_id: parentID,
            },
          })
            .then((r) => {
              if (r.data.updateArea === 1) {
                message.success('修改成功');
                formRename.resetFields();
              } else if (r.data.updateArea === 0) {
                message.error('修改失败');
                formRename.resetFields();
              }
              setModalRenameVisible(false);
              // if ()
            })
            .catch((res: any) => {
              message.error(res);
            });
        }}
        onCancel={handle_cancelRename}
        okText="确认"
        cancelText="取消"
      >
        <Form form={formRename}>
          <Form.Item
            name="areaname"
            label="区域名称"
            rules={[
              {
                required: true,
                message: '请输入行政区域名称',
              },
            ]}
          >
            <Input placeholder="请输入行政区域名称" />
          </Form.Item>
          {level === 3 ? (
            <Form.Item
              label="社区主任"
              name="CommunityLeadername"
              rules={[
                {
                  required: true,
                  message: '请输入社区主任',
                },
              ]}
              extra={
                <div style={{ color: 'red' }}>
                  注意：输入完请点击搜索进行社区主任信息查询并选择
                </div>
              }
            >
              <Input
                placeholder="请输入社区主任"
                suffix={
                  <SearchOutlined
                    onClick={() => {
                      let name = formRename.getFieldValue('CommunityLeadername');
                      if (!name) {
                        message.info('请输入社区主任名称');
                        return;
                      }
                      let role = '社区主任';
                      setCommunityleader(true);
                      setCommunityleaderloading(true);
                      setSearchName(name);
                      setSearchRole(role);
                    }}
                  />
                }
              />
            </Form.Item>
          ) : (
            <></>
          )}
        </Form>
      </Modal>
      <Modal
        title="删除行政区域"
        open={modalDeleteVisible}
        onOk={() => {
          deleteArea({
            awaitRefetchQueries: true,
            refetchQueries: ['findManyArea', 'findManyGrid'], // 重新查询
            variables: {
              id: parentID,
            },
          })
            .then((r) => {
              if (r.data.deleteArea === 1) {
                message.success('删除成功');
              } else if (r.data.deleteArea === 0) {
                message.error('删除失败');
              }
              setModalDeleteVisible(false);
              // if ()
            })
            .catch((res: any) => {
              message.error(res);
            });
        }}
        onCancel={handle_cancelDelete}
        okText="确认"
        cancelText="取消"
      >
        <Row
          style={{
            marginTop: '0.5%',
            paddingTop: '1%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p>该操作会删除该行政区域下的所有子区域和信息，您确认要删除这个行政区域吗？</p>
        </Row>
      </Modal>
      <Modal
        title="删除网格区域"
        open={modalDeleteGrid}
        onOk={() => {
          deleteGrid({
            awaitRefetchQueries: true,
            refetchQueries: ['findManyGrid'], // 重新查询
            variables: {
              id: GridId,
            },
          })
            .then((r) => {
              if (r.data.deleteGrid === 1) {
                message.success('删除成功');
              } else if (r.data.deleteGrid === 0) {
                message.error('删除失败');
              }
              setModalDeleteGrid(false);
              if (total - 1 && current > total / pageSize && total % pageSize === 1) {
                setTotal(total);
                setPagination({
                  current: current - 1,
                  pageSize: pageSize,
                });
              }
            })
            .catch((res: any) => {
              message.error(res);
            });
        }}
        onCancel={handle_cancelDeleteGrid}
        okText="确认"
        cancelText="取消"
      >
        <Row
          style={{
            marginTop: '0.5%',
            paddingTop: '1%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p>该操作会删除网格区域下的所有信息，您确认要删除这条网格吗？</p>
        </Row>
      </Modal>
      <Modal
        // style={{z-index:"1"}}
        zIndex={1}
        title={'网格长信息'}
        open={gridleader}
        onCancel={() => {
          setSearchName('');
          setGridleader(false);
          setInformationRole([]);
        }}
        footer={null}
      >
        <Table
          // style={{ overflow: 'hidden' }}
          columns={columnsRole}
          loading={gridleaderloading}
          dataSource={informationRole}
        />
      </Modal>
      <Modal
        title={'社区主任信息'}
        // key={Math.random()}
        open={communityleader}
        onCancel={() => {
          setSearchName('');
          setCommunityleader(false);
          setInformationRole([]);
        }}
        footer={null}
      >
        <Table
          style={{ overflow: 'hidden' }}
          columns={columnsRole}
          loading={communityleaderloading}
          dataSource={informationRole}
        />
      </Modal>
    </>
  );
};

export default AdministrativeRegion;
