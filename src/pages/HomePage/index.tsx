/* eslint-disable max-len */
import { BellOutlined, CalendarOutlined, ProfileOutlined } from '@ant-design/icons';
// Card,  Row
import { useQuery } from '@apollo/client';
import { Badge, Card, Layout, Popover, Radio, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { GetAllHandledEvents, GetAllUnhandledEvents } from '@/apis';
import { getRefreshToken, getUserId, getUserName, logout } from '@/store/SaveToken';

import TopIcon from '../../assets/top.svg';
import Detail from '../ReviewPage/Detail';
import styles from './HomePage.module.less';
import Time from './Time';
import Menu from './TopMenuItem';

type EventData = {
  create_time: Date;
  creator_id: number;
  event_type: string;
  id: number;
  is_delete: Boolean;
  link: string;
  receiver_id: number;
  sender_id: number;
  status: string;
  update_time: Date;
  updater_id: number;
  audit_records_id: number;
  auditrecords: AuditRecords;
};

type AuditRecords = {
  action_type: string;
  create_time: Date;
  creatod_id: number;
  id: string;
  is_delete: Boolean;
  officer_info: any;
  person_info: any;
  priority: number;
  request_data: any;
  description: string;
};

function HomePage() {
  const local = useLocation();
  function transferTime(time: Date) {
    const mysqlDate = new Date(time);
    const year = mysqlDate.getFullYear();
    const month = String(mysqlDate.getMonth() + 1).padStart(2, '0');
    const day = String(mysqlDate.getDate()).padStart(2, '0');
    const hours = String(mysqlDate.getHours()).padStart(2, '0');
    const minutes = String(mysqlDate.getMinutes()).padStart(2, '0');
    const seconds = String(mysqlDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
  }
  useEffect(() => {
    if (local.pathname === '/home/index') {
      const elem = document.getElementById('headerBox');
      if (elem) {
        elem.style.background = 'none';
      }
    } else {
      const elem = document.getElementById('headerBox');
      if (elem) {
        elem.style.background = 'linear-gradient(180deg, #082366 0%, #021042 40%)';
      }
    }
  }, [local]);
  const token = getRefreshToken();
  if (!token) {
    logout();
  }

  const [hintChoose, setHintChoose] = useState('1');
  // const [userId, setUserId] = useState(1169); // 目前是写死的id
  const [_unHandledNumber, setUnHandledNumber] = useState(0);
  // _unHandledNumber
  const [_HandledNumber, setHandledNumber] = useState(0);
  // _HandledNumber,
  const [unHandleSource, setUnhandleSource] = useState<EventData[]>([]);
  const [handleSource, setHandleSource] = useState<EventData[]>([]);

  // 点击card弹窗显示状态
  const [visibleDetail, setVisibleDetail] = useState(false);
  // 设置当前点击的card的auditrecordsId
  const [rightnowAuditrecordsId, setRightnowAuditrecordsId] = useState(0);
  // 设置当前点击的事件数据
  const [currentEventData, setCurrentEventData] = useState<EventData>();
  // 获取未处理数据
  const { data: unhandleData, refetch: unhandledDataRefetch } = useQuery(
    GetAllUnhandledEvents,
    {
      variables: {
        data: { ID: Number(getUserId()) },
      },
      onCompleted: (data) => {
        setUnhandleSource(data.getAllUnhandledEvents);
        setUnHandledNumber(
          data.getAllUnhandledEvents === null ? data.getAllUnhandledEvents.length : 0,
        );
        console.log(unhandleData);
      },
    },
  );
  // 获取已处理数据
  const { data: handleData, refetch: handledDataRefetch } = useQuery(
    GetAllHandledEvents,
    {
      variables: {
        data: { ID: Number(getUserId()) },
      },
      onCompleted: (data) => {
        setHandleSource(data.getAllHandledEvents);
        setHandledNumber(
          data.getAllHandledEvents === null ? data.getAllHandledEvents.length : 0,
        );
        console.log(handleData);
      },
    },
  );
  // 定时轮询
  useEffect(() => {
    setInterval(() => {
      unhandledDataRefetch(); // 重新发起查询
    }, 5000); // 每隔5秒发送一次查询
    setInterval(() => {
      handledDataRefetch(); // 重新发起查询
    }, 60000); // 每隔60秒发送一次查询
  }, [unhandledDataRefetch, handledDataRefetch]);

  useEffect(() => {
    if (hintChoose === '1') {
      unhandledDataRefetch({
        data: { ID: Number(getUserId()) },
      });
    } else if (hintChoose === '2') {
      handledDataRefetch({
        data: { ID: Number(getUserId()) },
      });
    }
  }, [hintChoose, handledDataRefetch, unhandledDataRefetch]);

  const IsHandled = (
    <>
      {handleSource.length !== 0
        ? handleSource.map((item: EventData, index: any) => {
            // 根据事件类型路由跳转
            const getEventPageRoute = (eventType: string) => {
              switch (eventType) {
                case '事件上报':
                  return '/event-management';
                case '人口变更':
                  return '/population-manager/pending';
                default:
                  return '/default-route'; // 默认的路由
              }
            };
            const eventPageRoute = getEventPageRoute(item.event_type);
            // 将时间类型有String转换为Date
            // const timeDATE = new Date(item.create_time);
            return (
              <Card key={index} hoverable style={{ margin: '1vh' }} size="small">
                <Link
                  to={eventPageRoute}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Row>
                    消息描述:
                    {item.auditrecords?.action_type === '1'
                      ? `新增姓名为 ${item.auditrecords.request_data?.name} 的群众信息`
                      : item.auditrecords?.action_type === '2'
                      ? `删除姓名为 ${item.auditrecords.person_info?.name} 的群众信息`
                      : item.auditrecords?.action_type === '3'
                      ? `修改姓名为 ${item.auditrecords.person_info?.name} 的群众信息`
                      : ''}
                  </Row>
                  <Row>事件类型:{item.event_type}</Row>
                  <Row>
                    发起时间:
                    {transferTime(item.create_time)}
                    {/* {timeDATE
                      .toISOString()
                      .replace('T', ' ')
                      .replace(/\.\d{3}Z/, '')} */}
                  </Row>
                  {/* <Row justify="end">{item.sender_id}</Row> */}
                </Link>
              </Card>
            );
          })
        : '暂无信息'}
    </>
  );

  const NotHandled = (
    <>
      {unHandleSource.length !== 0
        ? unHandleSource?.map((item: EventData, index: any) => {
            // const getEventPageRoute = (eventType: string) => {
            //   switch (eventType) {
            //     case '事件上报':
            //       return '/event-management';
            //     case '人口变更':
            //       return '/population-manager/pending';
            //     default:
            //       return '/default-route'; // 默认的路由
            //   }
            // };

            // const eventPageRoute = getEventPageRoute(item.event_type);
            // const timeDATE = new Date(item.create_time);
            return (
              <Card
                key={index}
                hoverable
                style={{ margin: '1vh' }}
                size="small"
                onClick={() => {
                  setVisibleDetail(true);
                  setRightnowAuditrecordsId(item.audit_records_id);
                  setCurrentEventData(item);
                }}
              >
                {/* <Link
                  to={eventPageRoute}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                > */}
                <Row>
                  消息描述:
                  {item.auditrecords?.action_type === '1'
                    ? `新增姓名为 ${item.auditrecords.request_data?.name} 的群众信息`
                    : item.auditrecords?.action_type === '2'
                    ? `删除姓名为 ${item.auditrecords.person_info?.name} 的群众信息`
                    : item.auditrecords?.action_type === '3'
                    ? `修改姓名为 ${item.auditrecords.person_info?.name} 的群众信息`
                    : ''}
                </Row>
                <Row>事件类型:{item?.event_type}</Row>
                <Row>
                  发起时间:
                  {/* {timeDATE
                    .toISOString()
                    .replace('T', ' ')
                    .replace(/\.\d{3}Z/, '')} */}
                  {transferTime(item.create_time)}
                </Row>

                {/* <Row justify="end">{item.sender_id}</Row> */}
                {/* </Link> */}
              </Card>
            );
          })
        : '暂无信息'}
    </>
  );
  const content = (
    <div
      style={{
        fontWeight: 900,
        color: 'rgb(127,125,142)',
        maxHeight: '40vh',
        // overflow: 'scroll',
        overflow: 'auto',
        minWidth: '400px',
      }}
    >
      <Radio.Group defaultValue="1" style={{ width: '100%' }} buttonStyle="solid">
        <Radio.Button
          value="1"
          onClick={() => {
            if (hintChoose === '1') return;
            else setHintChoose('1');
          }}
          style={{ width: '50%', textAlign: 'center' }}
        >
          <Badge count={_unHandledNumber} size="small">
            <CalendarOutlined
              style={{
                marginRight: '8px',
                marginTop: '-4px',
                fontSize: 18,
              }}
            />
            未处理{unHandleSource.length}条
          </Badge>
        </Radio.Button>
        <Radio.Button
          value="2"
          onClick={() => {
            if (hintChoose === '2') return;
            else setHintChoose('2');
          }}
          style={{ width: '50%', textAlign: 'center' }}
        >
          <Badge count={_HandledNumber} size="small">
            <ProfileOutlined
              style={{
                marginRight: '8px',
                marginTop: '-4px',
                fontSize: 18,
              }}
            />
            已处理{handleSource.length}条
          </Badge>
        </Radio.Button>
      </Radio.Group>
      {hintChoose === '1' ? <>{NotHandled}</> : <> {IsHandled} </>}
    </div>
  );
  return (
    <>
      {token ? (
        <Layout className={styles.LayoutBox}>
          <header className={styles.HeaderBox} id="headerBox">
            <img src={TopIcon} className={styles.TopIcon} />
            <div className={styles.TopBox}>
              <div>
                <span>欢迎您，{getUserName()}</span>
                <Time></Time>
              </div>
              <div style={{ color: '#fff' }}>
                <Popover placement="bottomRight" content={content}>
                  <Badge
                    offset={[-2, 7]}
                    style={{
                      marginRight: '23px',
                      // backgroundColor: '#52c41a',
                    }}
                    count={unHandleSource.length}
                    size="small"
                  >
                    <BellOutlined
                      style={{
                        position: 'relative',
                        top: '6px',
                        marginRight: '30px',
                        color: 'white',
                        fontSize: 20,
                      }}
                    />
                  </Badge>
                </Popover>
              </div>
            </div>
            <Menu></Menu>
          </header>
          <Content>
            <div className={styles.ContentBox}>
              <Outlet></Outlet>
            </div>
          </Content>
        </Layout>
      ) : (
        ''
      )}
      <Detail
        visibleDetail={visibleDetail}
        setVisibleDetail={setVisibleDetail}
        rightnowAuditrecordsId={rightnowAuditrecordsId}
        setRightnowAuditrecordsId={setRightnowAuditrecordsId}
        currentEventData={currentEventData}
      />
    </>
  );
}
export default HomePage;
