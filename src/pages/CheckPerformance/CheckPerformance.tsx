// yarn lint --fix 如果import出现问题，就在终端执行该指令
//  git commit -m [审计模块] --no-verify

import './index.css';
// import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { ApolloProvider, gql, useLazyQuery, useQuery } from '@apollo/client';
import { ApolloClient, createHttpLink,InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import type { MenuProps } from 'antd';
import { Button, DatePicker, Input, Layout, Menu, Select, Table } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import ExcelJS from 'exceljs';
import React, { useState } from 'react';

const { Column } = Table;

const { RangePicker } = DatePicker;

const httpLink = createHttpLink({
  uri: 'http://localhost:7000/graphql',
});

// 获取存储的accessToken
const accessToken = localStorage.getItem('accessToken');

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


// // 解码JWT令牌，获取载荷中的角色信息
// const decodedToken = jwt_decode(token);
// const userRoles = decodedToken.roles;

// // 检查用户角色是否包含superAdmin
// const isSuperAdmin = userRoles.includes('superAdmin');

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

// 一系列城市-镇-网格的数据，后面肯定需要修改，才能实现后端说的递归查询
// 应该是每个label的value都是一个Int，这样方便GQL查询，到时候需要修改，并且修改状态
const cityOptionData = [
  {
    label: '漠河市',
    value: 'MoHeCity',
  },
];

const townOptionData = [
  {
    label: '西林吉镇',
    value: 'XiLinJi',
  },
  {
    label: '古莲镇',
    value: 'GuLian',
  },
  {
    label: '图强镇',
    value: 'TuQiang',
  },
  {
    label: '阿木尔镇',
    value: 'AMuEr',
  },
  {
    label: '北极镇',
    value: 'BeiJi',
  },
  {
    label: '兴安镇',
    value: 'XingAn',
  },
];

// area_id
const xiLinJiOptionData = [
  {
    label: '名苑社区',
    value: 1,
  },
  {
    label: '其他等等社区',
    value: 2,
  },
];

const guLianOptionsData = [
  {
    label: '古莲社区',
    value: 3,
  },
  {
    label: '其他等等社区',
    value: 4,
  },
];

const tuQiangOptionsData = [
  {
    label: '图强社区',
    value: 5,
  },
  {
    label: '其他等等社区',
    value: 6,
  },
];

const aMuErOptionsData = [
  {
    label: '阿尔姆社区',
    value: 7,
  },
  {
    label: '其他等等社区',
    value: 8,
  },
];

const beiJiOptionsData = [
  {
    label: '北极村',
    value: 9,
  },
  {
    label: '洛古河村',
    value: 10,
  },
  {
    label: '北红村',
    value: 11,
  },
];

const xingAnOptionsData = [
  {
    label: '兴安社区',
    value: 12,
  },
  {
    label: '其他等等社区',
    value: 13,
  },
];

// 当前权限
// const Auth = {
//   superAdmin: 1,
//   filmPolice: 2,
//   communityDirector: 3,
//   gridMember: 4,
//   Director: 5,
//   gridLength: 6,
// };


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


const CheckPerformance: React.FC = () => {
  const [current, setCurrent] = useState('mail');

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    console.log(e);
    setMenuState(e.key as unknown as number); // 这段代码明明是从AntD官网抄的，居然会报错，忽略就行
    switch (e.key) {
      case 'gridMember':
        setCurrentAuth(4);
        setIsDefault(true);
        setIsSuperAdmin(true);
        break;
      case 'filmPolice':
        setCurrentAuth(2);
        setIsDefault(true);
        setIsSuperAdmin(true);
        break;
      default:
        setCurrentAuth(0);
    }
  };

  // 一系列状态Hook，用来存储表单
  const [menuState, setMenuState] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('default');
  const [town, setTown] = useState('default');
  const [grid, setGrid] = useState('default');
  // const [gridID, setGridID] = useState(0);
  const [beginTime, setBeginTime] = useState();
  const [endTime, setEndTime] = useState();
  // 同样是一系列状态Hook，Auth负责管理权限，isDefault负责展示初始表单，isSuperAdmin负责判断是否可以导出数据
  const [currentAuth, setCurrentAuth] = useState(0);
  const [isDefault, setIsDefault] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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
        // console.log('no menu selected');
        alert('请选择网格员或民警');
      } else {
        setIsDefault(false);
        fetchData({
          variables: {
            role_id: currentAuth,
            area_id: 0 | parseInt(grid, 10),
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
  const getTownOptions = (city: string) => {
    switch (city) {
      case 'MoHeCity':
        return townOptionData;
      default:
        return [];
    }
  };

  const getGridOptions = (town: string) => {
    switch (town) {
      case 'XiLinJi':
        return xiLinJiOptionData;
      case 'GuLian':
        return guLianOptionsData;
      case 'TuQiang':
        return tuQiangOptionsData;
      case 'AMuEr':
        return aMuErOptionsData;
      case 'BeiJi':
        return beiJiOptionsData;
      case 'XingAn':
        return xingAnOptionsData;
      default:
        return [];
    }
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

  // 抽取接口得到的data，这是我们需要填入表单中的数据
  const DefaultData = 
    SearchedOrigin &&
    SearchedOrigin.queryUserLogOperationList &&
    SearchedOrigin.queryUserLogOperationList.data;

  const TableData =
    SearchedData &&
    SearchedData.queryUserLogOperationList &&
    SearchedData.queryUserLogOperationList.data;
  
  const UsedData = isDefault? DefaultData : TableData;

  // 前端实现导出excel文档的设计，后端的嘛。。。不知道怎么调用
  const handleExport = async () => {
    if (isSuperAdmin) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      const headerRow =
      worksheet.addRow(['编号', '姓名', '登陆次数', '查找次数', '新增群众数', '提交事件数', '群众信息变更数', '开始时间', '结束时间']);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };

      // 假设您的数据存储在一个数组中
      const data = UsedData;

      data.forEach((item: any, index: any) => {
        worksheet.getCell(`A${index + 2}`).value = item.id;
        worksheet.getCell(`B${index + 2}`).value = item.name;
        worksheet.getCell(`C${index + 2}`).value = item.login_times;
        worksheet.getCell(`D${index + 2}`).value = item.query_count;
        worksheet.getCell(`E${index + 2}`).value = item.add_person_count;
        worksheet.getCell(`F${index + 2}`).value = item.submit_event_count;
        worksheet.getCell(`G${index + 2}`).value = item.modify_person_count;
        worksheet.getCell(`H${index + 2}`).value = item.beginTime;
        worksheet.getCell(`I${index + 2}`).value = item.endTime;
        // 设置其他单元格...
        // id
        // name
        // login_count
        // modify_person_count = infoChanged
        // query_count = searchTimes
        // submit_event_count
        // add_person_count = newPeople
        // begin_time
        // end_time
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

  return (
    <ApolloProvider client={client}>
      <Layout className="CpLayout">
      {/* Serial Experiments
      <div>
        权限管理：
        <Button onClick={() => {
            // setCurrentAuth(Auth.superAdmin);
            setIsSuperAdmin(true);
        }}>超级管理员</Button>
        <Button onClick={() => setCurrentAuth(Auth.Director)}>所长</Button>
        <Button onClick={() => setCurrentAuth(Auth.filmPolice)}>民警</Button>
        <Button onClick={() => setCurrentAuth(Auth.communityDirector)}>社区主任</Button>
        <Button onClick={() => setCurrentAuth(Auth.gridLength)}>网格长</Button>
        <Button onClick={() => setCurrentAuth(Auth.gridMember)}>网格员</Button>
        <Button
          onClick={() => {
            console.log(currentAuth);
          }}
        >
          Console.log权限
        </Button>
        <Button onClick={() => { 
          console.log(DefaultData);
        }}>Default Test</Button>
        <Button onClick={() => { 
          console.log(TableData);
          console.log(SearchedOrigin);
          console.log(SearchedData);
        }}>Data Test</Button>
        <Button onClick={() => {
          console.log(client);
          console.log(accessToken);
          }}>header</Button>
      </div> */}
        {/* 网格员 警员 菜单 */}
      <Menu
        onClick={onMenuClick}
        selectedKeys={[current]}
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
        {/* <Input placeholder="城市占位" className="BlockType" /> */}
        <Select
          placeholder="请选择城市"
          className="BlockTypeGrid"
          options={cityOptionData}
          onSelect={(value) => {
            // Find the selected option based on the value
            const selectedOption = cityOptionData.find(
              (option) => option.value === value,
            );
            if (selectedOption) {
              setCity(selectedOption.value);
              setTown('default');
              setGrid('default');
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
              (option) => option.value === value,
            );
            if (selectedOption) {
              setTown(selectedOption.value);
              setGrid('default');
            }
          }}
          value={town !== 'default' ? town : null || null}
          />
          {/* 这里有warning，但是不要随便修改 */}
        <Select
          placeholder="请选择网格"
          className="BlockTypeGrid"
          options={getGridOptions(town)}
          onSelect={(value) => {
            // Find the selected option based on the value
            const selectedOption = getGridOptions(town).find(
              (option) => option.value === value,
            );
            if (selectedOption) {
              setGrid(selectedOption.value);
            }
            }}
          value={grid !== 'default' ? grid : null || null}
          // Set the value to the first option's value only if grid is not 'default'
          // 当重新选择上一个Select选项后，该选项需要重新选择
        />
        {/*
        // 备选的时间选择模块，但由于需要判断开始时间时候比结束时间晚，所以用了AntD中省事的RangePicker
         <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
          placeholder="开始时间"
          className="DateBlockType"
        />
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
          placeholder="结束时间"
          className="DateBlockType"
        /> */}
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
            dataIndex="id"
            key="id"
            align="center"
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
            dataIndex="begin_Time"
            key="begin_Time"
            align="center"
          />
          <Column
            title={<div style={{ textAlign: 'center' }}>结束时间</div>}
            dataIndex="end_Time"
            key="end_Time"
            align="center"
          />
        </Table>
      </div>
    </Layout>
    </ApolloProvider>
    
  );
};

export default CheckPerformance;