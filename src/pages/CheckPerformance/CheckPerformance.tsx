// yarn lint --fix 如果import出现问题，就在终端执行该指令
//  git commit -m [审计模块] --no-verify

import './index.css';
// import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import type { MenuProps, TablePaginationConfig } from 'antd';
import { Pagination } from 'antd';
import { Button, DatePicker, Input, Layout, Menu, Select, Table } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import ExcelJS from 'exceljs';
// 如果是时间戳格式的DateTime，解锁luxon
import { DateTime } from 'luxon';
import React, { useState } from 'react';

import { getUserType } from '../../store/SaveToken';

const { Column } = Table;

const { RangePicker } = DatePicker;

// 获取当前登录用户的role
const loginAuth = getUserType();

// 菜单选项
const items: MenuProps['items'] = [
  {
    label: '网格员',
    key: 'gridMember',
    className: 'UpperMenuItem',
  },
  {
    label: '民 警',
    key: 'filmPolice',
    className: 'UpperMenuItem',
  },
];

// Query查找查询
const GET_USER_LOG_OPERATIONS = gql`
  query GetUserLogOperations(
    $role_id: Int!
    $area_id: Int
    $name: String
    $begin_time: DateTime
    $end_time: DateTime
    $skip: Int
    $take: Int
  ) {
    queryUserLogOperationList(
      getOperationInput: {
        role_id: $role_id
        area_id: $area_id
        name: $name
        begin_time: $begin_time
        end_time: $end_time
      }
      skip: $skip
      take: $take
    ) {
      data {
        id
        name
        login_count
        modify_person_count
        query_count
        submit_event_count
        add_person_count
        begin_time
        end_time
      }
      total
    }
  }
`;

// 点击menu option后，默认出现的数据
const GET_DEFAULT_TABLEDATA = gql`
  query GetUserLogOperations($role_id: Int!, $skip: Int, $take: Int) {
    queryUserLogOperationList(
      getOperationInput: { role_id: $role_id }
      skip: $skip
      take: $take
    ) {
      data {
        id
        name
        login_count
        modify_person_count
        query_count
        submit_event_count
        add_person_count
        begin_time
        end_time
      }
      total
    }
  }
`;

// 查询所有的area
const GET_AREAS_QUERY = gql`
  query GetAreas {
    getArea {
      id
      level
      name
      parent_id
    }
  }
`;

const CheckPerformance: React.FC = () => {
  const [current, setCurrent] = useState('');

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    console.log(e);
    setMenuState(e.key as unknown as number); // 这段代码明明是从AntD官网抄的，居然会报错，忽略就行
    switch (e.key) {
      case 'gridMember':
        setCurrentAuth(4);
        setIsDefault(true);
        break;
      case 'filmPolice':
        setCurrentAuth(2);
        setIsDefault(true);
        break;
    }
  };

  // 一系列状态Hook，用来存储表单
  const [menuState, setMenuState] = useState(0);

  // name:String
  const [name, setName] = useState('');

  // 存储city的area_id
  const [city, setCity] = useState(0);

  // 存储town的area_id
  const [town, setTown] = useState(0);

  // 存储grid的area_id
  const [grid, setGrid] = useState(0);

  // 存储开始与结束时间
  const [beginTime, setBeginTime] = useState();
  const [endTime, setEndTime] = useState();

  // 同样是一系列状态Hook，Auth负责管理点击菜单所确定的role_id，isDefault负责展示初始表单，
  const [currentAuth, setCurrentAuth] = useState(4);
  const [isDefault, setIsDefault] = useState(true);

  // 获取准确的area_id
  const areaID = grid !== 0 ? grid : town !== 0 ? town : city;

  // 设置分页，获取当前的页码
  const [pagination, setPagination] = useState<any>({
    current: 1, // 默认为第一页
    pageSize: 1, // 测试用的页大小，按需修改
  });

  // 处理分页，参考了刘康的分页方法，但最后自己修改了绝大部分
  // 因为由于导出的特殊性，导出就得导出所有数据，不可能只导出当前页面的数据
  // 所以无法让后端排队按skip take送数据，只能一次全拿出来
  // 所以这里采用的是前端的slice方式，分割显示
  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({ current: page, pageSize: pageSize || 1 });
  };

  // 每次点击标签页进行的改变，主要是改变了页码数
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  // Datetime处理函数
  const handleRangeChange = (values: any) => {
    if (values) {
      const [start, end] = values;
      const beginTimeString = start ? start.format('YYYY-MM-DDTHH:mm:ssZ') : undefined;
      const endTimeString = end ? end.format('YYYY-MM-DDTHH:mm:ssZ') : undefined;
      setBeginTime(beginTimeString);
      setEndTime(endTimeString);
    } else {
      // Handle the case when values is null
      setBeginTime(undefined);
      setEndTime(undefined);
    }
  };

  // 上传查找表单
  // 注意判零思想，如果表单的数据为空，则默认返回所有数据
  // select * from table;
  const handleSearch = () => {
    // console.log(beginTime, endTime);
    // if (loading) {
    //   // 查询正在进行中
    //   console.log('Loading...');
    //   // alert('Loading...');
    // } else
    if (error) {
      // 查询发生错误
      console.error('Error:', error);
      alert(error.message);
    }
    // else if (grid === 'default') {
    //   alert('请选择网格！');
    // }
    else {
      // 查询成功
      const tempMenu = menuState;
      if (tempMenu === 0) {
        // console.log('no menu selected');
        // alert('请选择网格员或民警');
      } else {
        setIsDefault(false);
        fetchData({
          variables: {
            role_id: currentAuth,
            area_id: areaID,
            name: name,
            begin_time: beginTime,
            end_time: endTime,
            skip: 0,
            take: 100000,
          },
        });
        console.log(UsedDataLength);
      }
    }
  };

  // 这里的Select级联使用了switch的思想，使用useState得到的city town 进行选择，调取相应的数组
  const getTownOptions = (city: number) => {
    // Filter level2Areas based on parent_id matching with city
    const townOptions = level2Areas.filter(
      (area: { parent_id: number }) => area.parent_id === city,
    );
    // Map townOptions to options format with label and value properties
    return townOptions.map((town: { name: any; id: any }) => ({
      label: town.name,
      value: town.id,
    }));
  };

  const getGridOptions = (town: number) => {
    // Filter level3Areas based on parent_id matching with town
    const gridOptions = level3Areas.filter(
      (area: { parent_id: number }) => area.parent_id === town,
    );
    // Map gridOptions to options format with label and value properties
    return gridOptions.map((grid: { name: any; id: any }) => ({
      label: grid.name,
      value: grid.id,
    }));
  };

  // 调用GQL语句，向后端查询数据
  const [fetchData, { error, data: SearchedData }] = useLazyQuery(
    GET_USER_LOG_OPERATIONS,
  );

  const { data: SearchedOrigin } = useQuery(GET_DEFAULT_TABLEDATA, {
    variables: {
      role_id: currentAuth,
      skip: 0,
      take: 100000,
    },
  });

  // 利用level 将area分为三类 市 镇 社区
  const { data: AreaData } = useQuery(GET_AREAS_QUERY);
  const level1Areas: any = [];
  const level2Areas: any = [];
  const level3Areas: any = [];

  if (AreaData && AreaData.getArea) {
    AreaData.getArea.forEach((area: { level: number }) => {
      if (area.level === 1) {
        level1Areas.push(area);
      } else if (area.level === 2) {
        level2Areas.push(area);
      } else if (area.level === 3) {
        level3Areas.push(area);
      }
    });
  }

  // 抽取接口得到的data，这是我们需要填入Table中的数据
  const DefaultData =
    SearchedOrigin &&
    SearchedOrigin.queryUserLogOperationList &&
    SearchedOrigin.queryUserLogOperationList.data;

  const TableData =
    SearchedData &&
    SearchedData.queryUserLogOperationList &&
    SearchedData.queryUserLogOperationList.data;

  const DefaultDataLength =
    SearchedOrigin &&
    SearchedOrigin.queryUserLogOperationList &&
    SearchedOrigin.queryUserLogOperationList.total;

  const TableDataLength =
    SearchedData &&
    SearchedData.queryUserLogOperationList &&
    SearchedData.queryUserLogOperationList.total;

  const UsedData = isDefault ? DefaultData : TableData;
  const ExcelData = isDefault ? DefaultData : TableData;
  const UsedDataLength = isDefault ? DefaultDataLength : TableDataLength;

  // 前端实现导出excel文档的设计，后端的嘛。。。不知道怎么调用
  const handleExport = async () => {
    if (loginAuth === 'superAdmin') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      const headerRow = worksheet.addRow([
        '编号',
        '姓名',
        '登陆次数',
        '查找次数',
        '新增群众数',
        '提交事件数',
        '群众信息变更数',
        '开始时间',
        '结束时间',
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };

      // 假设您的数据存储在一个数组中
      const data = ExcelData;

      data.forEach((item: any, index: any) => {
        worksheet.getCell(`A${index + 2}`).value = index + 1;
        worksheet.getCell(`B${index + 2}`).value = item.name;
        worksheet.getCell(`C${index + 2}`).value = item.login_count;
        worksheet.getCell(`D${index + 2}`).value = item.query_count;
        worksheet.getCell(`E${index + 2}`).value = item.add_person_count;
        worksheet.getCell(`F${index + 2}`).value = item.submit_event_count;
        worksheet.getCell(`G${index + 2}`).value = item.modify_person_count;

        // 这里的后端代码没有统一，有时间戳格式的，有年月日格式的，非常吊诡
        // 这是默认直接输出
        // worksheet.getCell(`H${index + 2}`).value = item.begin_time;
        // worksheet.getCell(`I${index + 2}`).value = item.end_time;

        // 这是时间戳模式的，不要忘记解锁import luxon
        // luxon这小玩意确实有用
        worksheet.getCell(`H${index + 2}`).value = DateTime.fromMillis(
          item.begin_time,
        ).toFormat('yyyy-MM-dd HH:mm:ss');
        worksheet.getCell(`I${index + 2}`).value = DateTime.fromMillis(
          item.end_time,
        ).toFormat('yyyy-MM-dd HH:mm:ss');

        // 这是年月日格式的
        // worksheet.getCell(`H${index + 2}`).value = DateTime.fromMillis(
        //   parseInt(item.begin_time)).toFormat('yyyy-MM-dd HH:mm:ss');
        // worksheet.getCell(`I${index + 2}`).value = DateTime.fromMillis(
        //   parseInt(item.end_time)).toFormat('yyyy-MM-dd HH:mm:ss');
      });

      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 10;
      worksheet.getColumn(3).width = 10;
      worksheet.getColumn(4).width = 10;
      worksheet.getColumn(5).width = 15;
      worksheet.getColumn(6).width = 15;
      worksheet.getColumn(7).width = 15;
      worksheet.getColumn(8).width = 20;
      worksheet.getColumn(9).width = 20;
      // 设置其他列宽...

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.xlsx';
      link.click();

      URL.revokeObjectURL(url);
    } else {
      alert('您没有权限导出！');
    }
  };

  // 时间戳转换
  const formatTimestamp = (timestamp: any) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Layout className="CpLayout">
      {/* 网格员 警员 菜单 */}
      <Menu
        onClick={onMenuClick}
        // @ts-ignore
        selectedKeys={current ? [current] : [items[0].key]}
        mode="horizontal"
        items={items}
        className="UpperMenu"
        style={{
          borderStyle: 'hidden',
          fontSize: 'bold',
        }}
      />
      <div className="InputBlock" style={{ margin: '0px 0.15vw' }}>
        <Input
          placeholder="姓名"
          className="BlockTypeName"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <Select
          placeholder="请选择城市"
          className="BlockTypeGrid"
          options={level1Areas.map((area: { name: any; id: any }) => ({
            label: area.name,
            value: area.id,
          }))}
          onSelect={(value) => {
            // Find the selected option based on the value
            const selectedOption = level1Areas.find(
              (area: { id: any }) => area.id === value,
            );
            if (selectedOption) {
              setCity(selectedOption.id);
              setTown(0);
              setGrid(0);
            }
          }}
        />
        <Select
          placeholder="请选择镇"
          className="BlockTypeGrid"
          options={getTownOptions(city)}
          onSelect={(value) => {
            // Find the selected option based on the value
            const selectedOption = getTownOptions(city).find(
              (option: { value: number }) => option.value === value,
            );
            if (selectedOption) {
              setTown(selectedOption.value);
              setGrid(0);
            }
          }}
          value={town !== 0 ? town : null || null}
        />
        <Select
          placeholder="请选择社区"
          className="BlockTypeGrid"
          options={getGridOptions(town)}
          onSelect={(value) => {
            // Find the selected option based on the value
            const selectedOption = getGridOptions(town).find(
              (option: { value: number }) => option.value === value,
            );
            if (selectedOption) {
              setGrid(selectedOption.value);
            }
          }}
          value={grid !== 0 ? grid : null || null}
          // Set the value to the first option's value only if grid is not 'default'
          // 当重新选择上一个Select选项后，该选项需要重新选择
        />

        <RangePicker
          showTime
          locale={locale}
          className="RangePicker"
          onChange={handleRangeChange}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="ButtonType"
          onClick={handleSearch}
        >
          <span>查找</span>
        </Button>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="ButtonType"
          onClick={handleExport}
        >
          <span>导出</span>
        </Button>
      </div>
      <div style={{ backgroundColor: '#fff' }}>
        <Table
          dataSource={
            Array.isArray(UsedData)
              ? UsedData.slice(
                  (pagination.current - 1) * pagination.pageSize,
                  pagination.current * pagination.pageSize,
                )
              : []
          }
          // 怎么可能为未定义？
          // dataSource={UsedData}
          style={{ margin: '0px 0.5vw' }}
          onChange={handleTableChange}
          pagination={false}
        >
          <Column
            title={<div style={{ textAlign: 'center' }}>编号</div>}
            // dataIndex="id"
            // key="id"
            align="center"
            render={(_text, _record, index) => index + 1}
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>姓名</div>}
            dataIndex="name"
            key="name"
            align="center"
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>登录次数</div>}
            dataIndex="login_count"
            key="login_count"
            align="center"
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>查找次数</div>}
            dataIndex="query_count"
            key="query_count"
            align="center"
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>新增群众数</div>}
            dataIndex="add_person_count"
            key="add_person_count"
            align="center"
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>提交事件数</div>}
            dataIndex="submit_event_count"
            key="submit_event_count"
            align="center"
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>群众信息变更数</div>}
            dataIndex="modify_person_count"
            key="modify_person_count"
            align="center"
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>开始时间</div>}
            dataIndex="begin_time"
            key="begin_Time"
            align="center"
            render={(text) => formatTimestamp(text)}
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>结束时间</div>}
            dataIndex="end_time"
            key="end_Time"
            align="center"
            render={(text) => formatTimestamp(text)}
          />
        </Table>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={UsedDataLength}
          style={{
            float: 'right',
            margin: '10px auto',
          }}
          onChange={handlePageChange}
        />
      </div>
    </Layout>
  );
};

export default CheckPerformance;
