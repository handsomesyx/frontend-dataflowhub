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
import Watermark from 'antd/es/watermark';
import * as ExcelJs from 'exceljs';
import { useEffect, useState } from 'react';

import { GetAllUserLoginLogs } from '@/apis';
import { getUserIdCard, getUserName } from '@/store/SaveToken';
import { saveWorkbook } from '@/utils/ExportExcel';
export function LoginLog() {
  type TableData = {
    id: number;
    operation: number;
    status: number;
    number: number;
    user_agent: string;
    ip: string;
    username: string;
    create_time: string;
    creator_id: number;
  };
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  // 记录导出Excel弹窗状态
  const [visibleExcel, setVisibleExcel] = useState(false);
  // 点击确认Excel加载
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  // 表格加载
  // const [loading, setLoading] = useState<boolean>(false);
  // 记录详情弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  // 记录所在行数据
  const [colRecod, setColRecord] = useState<TableData>();
  // 记录搜索内容
  const [searchContent, setSearchContent] = useState<String>();
  // 记录获取到的用户登录日志表格数据
  const [userLoginLogsTable, setUserLoginLogsTable] = useState<TableData[]>();
  // 分页查询相关数据
  // 用来记录总数
  const [total, setTotal] = useState<number>(0);
  // 用来记录页码
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: total,
    showTotal: (total) => `共 ${total} 条`,
    pageSizeOptions: ['5', '10', '15', '20'],
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
  const [getExceldata] = useLazyQuery(GetAllUserLoginLogs, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      data: { data: searchContent || '' },
      skip: 0,
      take: 100000,
    },
  });
  // 获取用户登录日志数据
  const { data: userLoginLogsData, loading } = useQuery(GetAllUserLoginLogs, {
    variables: {
      data: { data: searchContent || '' },
      skip: skip,
      take: take,
    },
    onCompleted: (_data) => {
      setTotal(_data.getAllUserLoginLogs.total);
      setUserLoginLogsTable(_data.getAllUserLoginLogs.data);
    },
  });
  useEffect(() => {
    if (userLoginLogsData) {
      setTotal(userLoginLogsData.getAllUserLoginLogs.total);
      setUserLoginLogsTable(userLoginLogsData.getAllUserLoginLogs.data);
    }
  }, [userLoginLogsData]);
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
  const success = () => {
    messageApi.open({
      type: 'success',
      content: '查找完毕',
    });
  };
  // const error = () => {
  //   messageApi.open({
  //     type: 'error',
  //     content: '查找失败',
  //   });
  // };
  const handleSearch = () => {
    setSearchContent(form.getFieldValue('searchContent'));
    setPagination({
      current: 1,
      pageSize: pagination.pageSize,
      total: total,
      showTotal: (total) => `共 ${total} 条`,
    });
    if (pagination) {
      success();
    }
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
      const datas = exceldata?.getAllUserLoginLogs?.data;
      for (let i = 0; i < datas?.length; ++i) {
        exportData.push({
          id: i + 1,
          username: datas[i].username,
          operation: datas[i].operation === 1 ? '用户登录' : '',
          // status:
          //   datas[i].status === 0
          //     ? '失败'
          //     : datas[i].status === 1
          //     ? '成功'
          //     : datas[i].status === 2
          //     ? '账号已锁定'
          //     : '',
          ip: datas[i].ip,
          create_time: datas[i].create_time,
        });
      }
      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet('demo sheet');
      worksheet.properties.defaultRowHeight = 20;
      worksheet.columns = [
        { header: '日志编号', key: 'id', width: 12 },
        { header: '用户名', key: 'username', width: 30 },
        { header: '用户操作', key: 'operation', width: 30 },
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
      saveWorkbook(workbook, '登录日志.xlsx');
    });
  };

  const columns = [
    {
      key: 'id',
      title: '序号',
      width: 50,
      render: (_text: any, _record: any, index: any) =>
        `${(current - 1) * pageSize + index + 1} `,
      align: 'center' as 'center',
    },
    {
      key: 'username',
      title: '用户名',
      width: 70,
      dataIndex: 'username',
      align: 'center' as 'center',
    },
    {
      key: 'operation',
      title: '用户操作',
      width: 70,
      dataIndex: 'operation',
      align: 'center' as 'center',
      render: (text: number) => {
        return text === 1 ? '用户登录' : '';
      },
    },
    // {
    //   key: 'status',
    //   title: '状态',
    //   width: 60,
    //   dataIndex: 'status',
    //   align: 'center' as 'center',
    //   render: (text: number) => {
    //     return text === 0 ? '失败' : text === 1 ? '成功' : text === 2 ? '账号已锁定' : '';
    //   },
    // },
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
    {
      key: 'create_time',
      title: '创建时间',
      width: 200,
      render: (_value: any, record: any) => {
        const mysqlDate = new Date(record.create_time);
        const year = mysqlDate.getFullYear();
        const month = String(mysqlDate.getMonth() + 1).padStart(2, '0');
        const day = String(mysqlDate.getDate()).padStart(2, '0');
        const hours = String(mysqlDate.getHours()).padStart(2, '0');
        const minutes = String(mysqlDate.getMinutes()).padStart(2, '0');
        const seconds = String(mysqlDate.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
      },
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
        <Watermark
          content={'漠河市基层社会治理智管平台'}
          // rotate={-20}
          // gap={[50, 120]}
          // className="WaterMarkBox"
        >
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
                      placeholder="用户名或者IP地址"
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
              dataSource={userLoginLogsTable}
              pagination={pagination}
              onChange={tablePageChange}
              loading={loading}
              // showQuickJumper: true,
              // showSizeChanger: true,
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
                <Descriptions.Item label="用户名">{colRecod?.username}</Descriptions.Item>
                <Descriptions.Item label="用户代理">
                  {colRecod?.user_agent}
                </Descriptions.Item>
                <Descriptions.Item label="用户操作">
                  {colRecod?.operation}
                </Descriptions.Item>
                <Descriptions.Item label="操作IP">{colRecod?.ip}</Descriptions.Item>
                {/* <Descriptions.Item label="状态">{colRecod?.status}</Descriptions.Item> */}
                <Descriptions.Item label="创建时间">
                  {colRecod?.create_time}
                </Descriptions.Item>
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
        </Watermark>
      </div>
    </>
  );
}
