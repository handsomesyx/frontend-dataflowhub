// yarn lint --fix 如果import出现问题，就在终端执行该指令
//  git commit -m [审计模块] --no-verify

import './index.css';
// import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import type { MenuProps } from 'antd';
import { Button, DatePicker, Input, Layout, Menu, Select, Table } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import ExcelJS from 'exceljs';
import { DateTime } from 'luxon';
import React, { useState } from 'react';

import { getUserType } from '../../store/SaveToken';

const { Column } = Table;

const { RangePicker } = DatePicker;

const loginAuth = getUserType();

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

// Query查询
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

const GET_DEFAULT_TABLEDATA = gql`
query GetUserLogOperations(
    $role_id: Int!
    $skip: Int
    $take: Int
  ) {
    queryUserLogOperationList(
      getOperationInput: {
        role_id: $role_id
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
  const [name, setName] = useState('');
  const [city, setCity] = useState(0);
  const [town, setTown] = useState(0);
  const [grid, setGrid] = useState(0);
  const [beginTime, setBeginTime] = useState();
  const [endTime, setEndTime] = useState();
  // 同样是一系列状态Hook，Auth负责管理权限，isDefault负责展示初始表单，isSuperAdmin负责判断是否可以导出数据
  const [currentAuth, setCurrentAuth] = useState(4);
  const [isDefault, setIsDefault] = useState(true);
  const areaID = grid !== 0
  ? grid
  : (town !== 0 ? town : city);

  // Datetime
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
        console.log('menu');
      } else {
        setIsDefault(false);
        fetchData({
          variables: {
            role_id: currentAuth,
            area_id: areaID,
            name: name,
            begin_time: beginTime,
            end_time: endTime,
            skip: 1,
            take: 10,
          },
        });
      }
    }
  };

  // 这里的Select级联使用了switch的思想，使用useState得到的city town 进行选择，调取相应的数组
  // 如果想要加入新的区划，直接const创建新数组，然后再switch加入新条件即可
  const getTownOptions = (city: number) => {
  // Filter level2Areas based on parent_id matching with city
  const townOptions = level2Areas.filter(area => area.parent_id === city);
  // Map townOptions to options format with label and value properties
  return townOptions.map(town => ({ label: town.name, value: town.id }));
  };
  

  const getGridOptions = (town: number) => {
  // Filter level3Areas based on parent_id matching with town
    const gridOptions = level3Areas.filter(area => area.parent_id === town); 
    // Map gridOptions to options format with label and value properties
    return gridOptions.map(grid => ({ label: grid.name, value: grid.id })); 
  };
  

  // 调用GQL语句，向后端查询数据
  const [fetchData, { error, data: SearchedData }] = useLazyQuery(
    GET_USER_LOG_OPERATIONS,
  );

  const { data: SearchedOrigin } = useQuery(GET_DEFAULT_TABLEDATA, {
  variables: {
    role_id: currentAuth,
    skip: 1,
    take: 10,
    }
  });

  const { data: AreaData } = useQuery(GET_AREAS_QUERY);
  const level1Areas = [];
  const level2Areas = [];
  const level3Areas = [];

  if (AreaData && AreaData.getArea) {
  AreaData.getArea.forEach((area: { level: number; }) => {
    if (area.level === 1) {
      level1Areas.push(area);
    } else if (area.level === 2) {
      level2Areas.push(area);
    } else if (area.level === 3) {
      level3Areas.push(area);
    }
  });     
  }
  

  // 抽取接口得到的data，这是我们需要填入表单中的数据
  const DefaultData = 
    SearchedOrigin &&
    SearchedOrigin.queryUserLogOperationList &&
    SearchedOrigin.queryUserLogOperationList.data;

  const TableData =
    SearchedData &&
    SearchedData.queryUserLogOperationList &&
    SearchedData.queryUserLogOperationList.data;
  
  const UsedData = isDefault ? DefaultData : TableData;

  // 前端实现导出excel文档的设计，后端的嘛。。。不知道怎么调用
  const handleExport = async () => {
    if (loginAuth === 'superAdmin') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      const headerRow =
      worksheet.addRow(['编号', '姓名', '登陆次数', '查找次数', '新增群众数', '提交事件数', '群众信息变更数', '开始时间', '结束时间']);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };

      // 假设您的数据存储在一个数组中
      const data = UsedData;

      data.forEach((item: any, index: any) => {
        worksheet.getCell(`A${index + 2}`).value = index + 1;
        worksheet.getCell(`B${index + 2}`).value = item.name;
        worksheet.getCell(`C${index + 2}`).value = item.login_count;
        worksheet.getCell(`D${index + 2}`).value = item.query_count;
        worksheet.getCell(`E${index + 2}`).value = item.add_person_count;
        worksheet.getCell(`F${index + 2}`).value = item.submit_event_count;
        worksheet.getCell(`G${index + 2}`).value = item.modify_person_count;
        worksheet.getCell(`H${index + 2}`).value = DateTime.fromMillis(item.begin_time).toFormat('yyyy-MM-dd HH:mm:ss');
        worksheet.getCell(`I${index + 2}`).value = DateTime.fromMillis(item.end_time).toFormat('yyyy-MM-dd HH:mm:ss');
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

      const blob = new Blob([buffer],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.xlsx';
      link.click();

      URL.revokeObjectURL(url);
    }
    else { 
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
          options={level1Areas.map(area => ({ label: area.name, value: area.id }))}
          onSelect={(value) => {
            // Find the selected option based on the value
            const selectedOption = level1Areas.find(area => area.id === value);
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
            const selectedOption = getTownOptions(city).find(option => option.value === value);
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
              option => option.value === value);       
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
        <Table dataSource={UsedData} style={{ margin: '0px 0.5vw' }}>
          <Column
            title={<div style={{ textAlign: 'center' }}>编号</div>}
            // dataIndex="id"
            // key="id"
            align="center"
            render={(text, record, index) => index + 1}
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
      </div>
    </Layout>
  );
};

export default CheckPerformance;