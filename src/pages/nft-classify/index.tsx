import './index.less';

import { RightOutlined } from '@ant-design/icons';
import type { SelectProps, TablePaginationConfig } from 'antd';
import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tree,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import type { Key } from 'react';
import React, { useState } from 'react';

const { Option } = Select;
interface DataType {
  // [x: string]: any;
  id: number;
  propertyName: string;
  inputMode: string;
  selectType: string;
  optionalValue: string;
}
export default function NtfClassify() {
  const [formSubmit] = Form.useForm();
  const [modalCreateProperty, setModalCreateProperty] = useState(false);
  const [total] = useState<number>(0);
  // 分页参数
  const [pagination] = useState<TablePaginationConfig>({
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
  console.log(skip, take);
  // 树状态相关的
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkedKeys, _setCheckedKeys] = useState<React.Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (
    checked:
      | Key[]
      | {
          checked: Key[];
          halfChecked: Key[];
        },
  ) => {
    console.log('onCheck', checked);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  const treeData: DataNode[] = [
    {
      title: '一级标签',
      key: '0-0',
      children: [
        {
          title: '二级标签',
          key: '0-0-0',
          children: [
            { title: '三级标签', key: '0-0-0-0' },
            { title: '三级标签', key: '0-0-0-1' },
            { title: '三级标签', key: '0-0-0-2' },
          ],
        },
        {
          title: '二级标签',
          key: '0-0-1',
          children: [
            { title: '三级标签', key: '0-0-1-0' },
            { title: '三级标签', key: '0-0-1-1' },
            { title: '三级标签', key: '0-0-1-2' },
          ],
        },
        {
          title: '二级标签',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '一级标签',
      key: '0-1',
      children: [
        { title: '二级标签', key: '0-1-0-0' },
        { title: '二级标签', key: '0-1-0-1' },
        { title: '二级标签', key: '0-1-0-2' },
      ],
    },
    {
      title: '一级标签',
      key: '0-2',
    },
  ];
  const columns: ColumnsType<DataType> = [
    {
      key: 'id',
      title: '编号',
      render: (_text: any, _record: any, index: any) =>
        `${(current - 1) * pageSize + index + 1} `,
      align: 'center' as 'center',
      className: 'table-color',
    },
    {
      title: '属性名',
      dataIndex: 'propertyName',
      key: 'propertyName',
      align: 'center' as 'center',
      className: 'table-color',
    },
    {
      title: '录入方式',
      dataIndex: 'inputMode',
      key: 'inputMode',
      align: 'center' as 'center',
      className: 'table-color',
    },
    {
      title: '选择类型',
      dataIndex: 'selectType',
      key: 'selectType',
      align: 'center' as 'center',
      className: 'table-color',
    },
    {
      title: '可选值',
      dataIndex: 'optionalValue',
      key: 'optionalValue',
      align: 'center' as 'center',
      className: 'table-color',
    },
    {
      title: '操作',
      key: 'action',
      className: 'table-color',
      render: (text) => (
        <Space size="middle">
          <a
          // onClick={() => {
          //     formUpdate.setFieldsValue({
          //         Gridname: text.name,
          //         Areaname: text.area_name,
          //         leader: text.grid_leader_name,
          //     });
          //     setUpdate_Open(true);
          //     setPoliceStation(text?.policeStation);
          //     setAreaId(parseInt(text.area_id));
          //     setUserID(text.grid_leader_id);
          //     setGridId(text.id);
          // }}
          >
            修改
          </a>
          <a
            onClick={() => {
              console.log(text);
              // setGridId(text.id);
              // setModalDeleteGrid(true);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  const showAddModal = () => {
    setModalCreateProperty(true);
  };
  const options: SelectProps['options'] = [];

  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }
  return (
    <div className="nft-classify-container">
      {/* 上半部分：头部导航 */}
      <div className="nft-classify-top">
        <div className="nft-classify-nft-first">
          <div style={{ color: 'gray' }}>
            NFT <RightOutlined />
          </div>
          <div style={{ paddingLeft: '6px' }}>NFT分类</div>
        </div>
        <div className="nft-classify-top-second">NFT分类</div>
      </div>
      {/* 下半部分：订单列表的展示 */}
      <div className="nft-classify-bottom">
        {/* 树选择框 */}
        <Row gutter={14} style={{ height: '100%' }}>
          <Col span={5} style={{ height: '100%', overflow: 'scroll' }}>
            <Tree
              className="nft-tree"
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </Col>
          <Col
            style={{
              borderRadius: '4px',
              height: '100%',
              overflow: 'auto',
            }}
            span={19}
          >
            <Row justify={'end'} style={{ marginRight: '1vw', columnGap: '20px' }}>
              <Button
                style={{
                  background: '#376DF1FF',
                  color: '#FFFFFF',
                }}
                onClick={showAddModal}
              >
                + 添加属性
              </Button>
            </Row>
            <Table
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: total,
                showTotal: (total) => `共 ${total} 条`,
              }}
              // onChange={handleTableChange}
              style={{ paddingTop: '1vh' }}
              columns={columns}
              // dataSource={griddata}
            />
          </Col>
        </Row>
      </div>
      <Modal
        title="创建属性"
        open={modalCreateProperty}
        onOk={() => {
          setModalCreateProperty(false);
        }}
        onCancel={() => {
          setModalCreateProperty(false);
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form style={{ width: '100%' }} layout="vertical" form={formSubmit}>
          <Form.Item
            name="propertyName"
            label="属性名"
            rules={[{ required: true, message: '请输入属性名' }]}
          >
            <Input placeholder="请输入属性名" />
          </Form.Item>
          <Form.Item
            name="inputMode"
            label="录入方式"
            rules={[{ required: true, message: '请选择录入方式' }]}
          >
            <Select placeholder="请选择录入方式" allowClear>
              <Option value="manual">手工录入</Option>
              <Option value="auto">自动录入</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="selectType"
            label="选择类型"
            rules={[{ required: true, message: '请选择选择类型' }]}
          >
            <Select placeholder="请选择选择类型" allowClear>
              <Option value="single">唯一</Option>
              <Option value="multiple">多选</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="optionalValue"
            label="可选值"
            rules={[{ required: true, message: '请选择可选值' }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择可选值"
              defaultValue={['a10', 'c12']}
              // onChange={handleChange}
              options={options}
            />
          </Form.Item>
          <Form.Item
            name="标签"
            label="label"
            rules={[{ required: true, message: '请选择标签' }]}
          >
            <Cascader
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              options={treeData}
              placeholder="请选择标签"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
