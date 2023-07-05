import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { useLazyQuery, useQuery } from '@apollo/client';
import type { TablePaginationConfig } from 'antd';
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Table,
} from 'antd';
import * as ExcelJs from 'exceljs';
import { useEffect, useState } from 'react';

import { GetAllUserOperateLogs } from '@/apis';
import { saveWorkbook } from '@/utils/ExportExcel';

export function OperateLog() {
  type TableData = {
    id: number;
    operation: number;
    request_query: string;
    request_type: string;
    request_params: string;
    request_time: string;
    user_agent: string;
    ip: string;
    status: number;
    creator_name: string;
    create_time: string;
    creator_id: number;
    update_time: string;
    updater_id: number;
    is_delete: boolean;
  };
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  // 记录导出Excel弹窗状态
  const [visibleExcel, setVisibleExcel] = useState(false);
  // 点击确认Excel加载
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  // 记录详情弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  // 记录所在行数据
  const [colRecod, setColRecord] = useState<TableData>();
  // 记录搜索内容
  const [searchContent, setSearchContent] = useState<String>();
  // 记录获取到的用户登录日志表格数据
  const [userOperateLogsTable, setUserOperateLogsTable] = useState<TableData[]>();
  // 分页查询相关数据
  // 用来记录总数
  const [total, setTotal] = useState<number>(0);
  // 用来记录页码
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: total,
    showTotal: (total) => `共 ${total} 条`,
  });
  // 当前页数
  const current: any = pagination.current;
  // 每页条数
  const pageSize: any = pagination.pageSize;
  // 跳过多少个数据
  const skip: number = (current - 1) * pageSize;
  // 一页显示多少个数据
  const take: number = pageSize;
  // 添加取消Excel弹窗方法
  const handleCancelExcel = () => {
    // 设置弹窗状态关闭
    setVisibleExcel(false);
  };
  //  添加确认导出Excel方法
  const handleOkExcel = () => {
    onExportBasicExcel();
    setConfirmLoading(true);
    setTimeout(() => {
      setVisibleExcel(false);
      setConfirmLoading(false);
    }, 500);
  };
  // 获取导出的登录日志数据
  const [getExceldata] = useLazyQuery(GetAllUserOperateLogs, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      data: { data: searchContent || '' },
      skip: 0,
      take: 100000,
    },
  });
  // 获取用户登录日志数据
  const { data: userOperateLogsData, loading } = useQuery(GetAllUserOperateLogs, {
    variables: {
      data: { data: searchContent || '' },
      skip: skip,
      take: take,
    },
    onCompleted: (_data) => {
      setTotal(_data.getAllUserOperateLogs.total);
      setUserOperateLogsTable(_data.getAllUserOperateLogs.data);
    },
  });
  useEffect(() => {
    if (userOperateLogsData) {
      setTotal(userOperateLogsData.getAllUserOperateLogs.total);
      setUserOperateLogsTable(userOperateLogsData.getAllUserOperateLogs.data);
    }
  }, [userOperateLogsData]);
  useEffect(() => {
    if (total) {
      setPagination((pagination) => {
        return {
          ...pagination,
          total: total,
          showTotal: (total) => `共 ${total} 条`,
        };
      });
    }
  }, [total]);
  // 表格页码发生变化时触发的方法
  const tablePageChange = (pagination: TablePaginationConfig) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: total,
      showTotal: (total) => `共 ${total} 条`,
    });
  };
  // 查找操作
  const handleSearch = () => {
    setSearchContent(form.getFieldValue('searchContent'));
    setPagination({
      current: 1,
      pageSize: pagination.pageSize,
      total: total,
      showTotal: (total) => `共 ${total} 条`,
    });
  };
  const onModalClose = () => {
    setModalOpen(false);
  };

  // 查看详情
  const showColumnDetailModal = (record: TableData) => {
    setColRecord(record);
    setModalOpen(true);
  };

  // 导出Excel函数
  const onExportBasicExcel = () => {
    let int = setInterval(() => {
      messageApi.open({
        key: 'updatable',
        type: 'loading',
        content: `正在导出,大约需要${total > 10000 ? '2~3' : '1~2'}分钟`,
      });
    });
    let exportData: any = [];
    getExceldata().then(({ data: exceldata }) => {
      const datas = exceldata?.getAllUserOperateLogs?.data;
      for (let i = 0; i < datas?.length; ++i) {
        exportData.push({
          id: i + 1,
          creator_name: datas[i].creator_name,
          operation:
            datas[i].operation === 0
              ? '用户登录'
              : datas[i].operation === 1
              ? '用户退出'
              : '',
          request_query: datas[i].request_query,
          request_type: datas[i].request_type,
          request_params: datas[i].request_params,
          request_time: datas[i].request_time,
          status:
            datas[i].status === 0
              ? '失败'
              : datas[i].status === 1
              ? '成功'
              : datas[i].status === 2
              ? '账号已锁定'
              : '',
          ip: datas[i].ip,
          create_time: datas[i].create_time,
        });
      }
      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet('demo sheet');
      worksheet.properties.defaultRowHeight = 20;
      worksheet.columns = [
        { header: '日志编号', key: 'id', width: 12 },
        { header: '用户名', key: 'creator_name', width: 30 },
        { header: '操作描述', key: 'operation', width: 30 },
        { header: '请求URL', key: 'request_query', width: 80 },
        { header: '请求方式', key: 'request_type', width: 30 },
        { header: '请求参数', key: 'request_params', width: 50 },
        { header: '请求时长', key: 'request_time', width: 50 },
        // { header: '状态', key: 'status', width: 80 },
        { header: '操作IP', key: 'ip', width: 80 },
        { header: '创建时间', key: 'create_time', width: 30 },
      ];
      worksheet.addRows(exportData);
      clearInterval(int);
      setTimeout(() => {
        messageApi.open({
          type: 'success',
          content: '导出成功',
          duration: 2,
        });
      });
      saveWorkbook(workbook, '操作日志.xlsx');
    });
  };
  const columns = [
    {
      key: 'id',
      title: '序号',
      width: 50,
      dataIndex: 'id',
      render: (_textL: any, _record: any, index: any) =>
        `${(current - 1) * pageSize + index + 1} `,

      align: 'center' as 'center',
    },
    {
      key: 'creator_name',
      title: '用户名',
      width: 70,
      dataIndex: 'creator_name',
      align: 'center' as 'center',
    },
    {
      key: 'operation',
      title: '操作描述',
      width: 70,
      dataIndex: 'operation',
      align: 'center' as 'center',
      render: (text: number) => {
        return text === 0 ? '用户登录' : text === 1 ? '用户退出' : '';
      },
    },
    {
      key: 'request_query',
      title: '请求URL',
      width: 150,
      dataIndex: 'request_query',
      align: 'center' as 'center',
      render: (_text: any, record: any) => {
        let temp = record.request_query;
        return (
          <Popover placement="top" title="请求URL" content={temp}>
            <p>{temp.substring(0, 35)}</p>
          </Popover>
        );
      },
    },
    {
      key: 'request_type',
      title: '请求方式',
      width: 70,
      dataIndex: 'request_type',
      align: 'center' as 'center',
    },
    {
      key: 'request_params',
      title: '请求参数',
      width: 150,
      dataIndex: 'request_params',
      align: 'center' as 'center',
      render: (_text: any, record: any) => {
        let temp = record.request_params;
        return (
          <Popover placement="top" title="请求参数" content={temp}>
            <p>{temp.substring(0, 35)}</p>
          </Popover>
        );
      },
    },
    {
      key: 'request_time',
      title: '请求时长',
      width: 150,
      dataIndex: 'request_time',
      align: 'center' as 'center',
    },
    {
      key: 'ip',
      title: '操作IP',
      width: 150,
      dataIndex: 'ip',
      align: 'center' as 'center',
      render: (_text: any, record: any) => {
        let temp = record.ip;
        return (
          <Popover placement="top" title="操作IP" content={temp}>
            <p>{temp.substring(0, 35)}</p>
          </Popover>
        );
      },
    },
    // {
    //   key: 'status',
    //   title: '状态',
    //   width: 150,
    //   dataIndex: 'status',
    //   align: 'center' as 'center',
    //   render: (text: number) => {
    //     return text === 0 ? '失败' : text === 1 ? '成功' : text === 2 ? '账号已锁定' : '';
    //   },
    // },
    {
      key: 'create_time',
      title: '创建时间',
      width: 200,
      dataIndex: 'create_time',
      align: 'center' as 'center',
    },
    {
      title: '操作',
      width: 50,
      align: 'center' as 'center',
      render: (_record: TableData) => (
        <>
          <a onClick={() => showColumnDetailModal(_record)}>查看详情</a>
        </>
      ),
    },
  ];
  return (
    <>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div
          style={{
            margin: '10px  22px 22px 22px ',
          }}
        >
          <Form form={form}>
            <Row justify="start" gutter={[8, 8]} align="middle">
              <Col span={4}>
                <Form.Item name="searchContent">
                  <Input
                    placeholder="全局模糊查找"
                    style={{ width: '15vw' }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '5vw' }}
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                  >
                    查找
                  </Button>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {contextHolder}
                  <Button
                    type="primary"
                    onClick={() => {
                      setVisibleExcel(true);
                    }}
                    style={{ width: '5vw' }}
                    icon={<UploadOutlined />}
                  >
                    导出
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={userOperateLogsTable}
            pagination={pagination}
            onChange={tablePageChange}
            loading={loading}
            //   showQuickJumper: true,
            //   // showSizeChanger: true,
            scroll={{ x: 800, y: 800 }}
          />
          <Modal
            title="查看详情"
            open={modalOpen}
            onCancel={onModalClose}
            width={750}
            footer={false}
            destroyOnClose
            style={{ paddingTop: 100 }}
          >
            <Descriptions bordered column={2} style={{ paddingBottom: 20 }}>
              <Descriptions.Item label="用户名">
                {colRecod?.creator_name}
              </Descriptions.Item>
              <Descriptions.Item label="请求时长">
                {colRecod?.request_time}
              </Descriptions.Item>
              <Descriptions.Item label="请求URL">
                {colRecod?.request_query}
              </Descriptions.Item>
              <Descriptions.Item label="用户代理">
                {colRecod?.user_agent}
              </Descriptions.Item>
              <Descriptions.Item label="请求方式">
                {colRecod?.request_type}
              </Descriptions.Item>
              <Descriptions.Item label="操作IP">{colRecod?.ip}</Descriptions.Item>
              <Descriptions.Item label="请求参数">
                {colRecod?.request_params}
              </Descriptions.Item>
              {/* <Descriptions.Item label="状态">{colRecod?.status}</Descriptions.Item> */}
            </Descriptions>
            <Space style={{ position: 'relative', left: 550 }}>
              <Button onClick={() => setModalOpen(false)}>取消</Button>
              <Button type="primary" onClick={() => setModalOpen(false)}>
                确认
              </Button>
            </Space>
          </Modal>
          {/* 添加Excel弹窗 */}
          <Modal
            title="导出"
            open={visibleExcel}
            confirmLoading={confirmLoading}
            onCancel={handleCancelExcel}
            width="600px"
            footer={null}
          >
            <div>总记录数:{total as number}个, 您确认要导出吗？</div>
            <Row justify={'end'}>
              <Space size={8}>
                <Col>
                  <Button
                    onClick={() => {
                      handleCancelExcel();
                    }}
                  >
                    取消
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={() => {
                      handleOkExcel();
                    }}
                    type={'primary'}
                  >
                    确定
                  </Button>
                </Col>
              </Space>
            </Row>
          </Modal>
        </div>
      </div>
    </>
  );
}
