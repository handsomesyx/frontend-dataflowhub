/* eslint-disable max-len */
// Card,  Row
import { BellOutlined, CalendarOutlined, ProfileOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Badge, Card, Layout, Popover, Radio, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { modifyTheEventInformation } from '@/apis';
import {
  getRefreshToken,
  getUserId,
  getUserName,
  getUserType,
  logout,
} from '@/store/SaveToken';

import TopIcon from '../../assets/top.svg';
import IncidentsAreReportedModal from '../IncidentManagement/components/Model/incidentsAreReportedModal';
import ProcessingModal from '../IncidentManagement/components/Model/ProcessingModal';
import TobeEvaluatedViewModal from '../IncidentManagement/components/Model/tobeEvaluatedViewModal';
import type { eventData } from '../IncidentManagement/type';
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
  reportinfo_id: number;
  reportinfo: eventData;
};

// type Reportinfo = {
//   classification_basis: string | null;
//   create_time: date;
//   creator_id: number | null;
//   id: number;
//   image_url: string | null;
//   is_delete: boolean | null;
//   issue_level: string | null;
//   police_id: number | null;
//   police_opinion: string | null;
//   priority: number | null | string;
//   processing_status: string | null;
//   processing_time: date | null;
//   public_demand: string | null;
//   public_opinion: string | null;
//   report_address: string | null;
//   report_time: date | null;
//   report_user: user | null;
//   reporter_evaluate: string | null;
//   reporter_id: number | null;
//   reporter_star_rating: number | null;
//   update_time: date | null;
//   updater_id: number | null;
// };

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
  // 这里用来记录ws对象
  const [socket, setSocket] = useState<Socket | null>(null);
  const [hintChoose, setHintChoose] = useState('1');
  // 未处理事件的个数
  const [_unHandledNumber, setUnHandledNumber] = useState(0);
  // 已处理事件的个数
  const [_HandledNumber, setHandledNumber] = useState(0);
  // 未处理事件的数据信息
  const [unHandleSource, setUnhandleSource] = useState<EventData[]>([]);
  // 已处理事件的数据信息
  const [handleSource, setHandleSource] = useState<EventData[]>([]);

  // 变更人口弹窗显示状态
  const [visibleDetail, setVisibleDetail] = useState(false);
  // 设置当前点击的card的auditrecordsId
  const [rightnowAuditrecordsId, setRightnowAuditrecordsId] = useState(0);
  // 设置当前点击的变更人口事件数据
  const [currentEventData, setCurrentEventData] = useState<EventData>();

  // 设置当前点击的事件上报数据
  const [currentReportData, setCurrentReportData] = useState<eventData>({} as eventData);
  // 设置reportId
  const [reportInfoId, setReportInfoId] = useState<number>(-1);

  const [modifyReportInfo] = useMutation(modifyTheEventInformation); // 除了添加以为，包括删除在内的函数均为此函数触发
  // 设置已上报组件状态显示
  const [IncidentsAreReportedModalVisibel, setIncidentsAreReportedModalVisibel] =
    useState(false);
  // 设置处理中组件状态显示
  const [ProcessingModalVisibel, setProcessingModalVisibel] = useState(false);
  // 设置待评价组件状态显示
  const [TobeEvaluatedViewModalVisibel, setTobeEvaluatedViewModalVisibel] =
    useState(false);
  // 事件上报组件的reloading
  const [reloading, setReloading] = useState(false);

  // 获取未处理数据
  // const { data: unhandleData, refetch: unhandledDataRefetch } = useQuery(
  //   GetAllUnhandledEvents,
  //   {
  //     variables: {
  //       data: { ID: Number(getUserId()) },
  //     },
  //     onCompleted: () => {
  //       // setUnhandleSource(data.getAllUnhandledEvents);
  //       // setUnHandledNumber(
  //       //   data.getAllUnhandledEvents === null
  //       //     ? data.getAllUnhandledEvents.length
  //       //     : 0,
  //       // );
  //       console.log(unhandleData);
  //     },
  //   },
  // );
  // 获取已处理数据
  // const { data: handleData, refetch: handledDataRefetch } = useQuery(
  //   GetAllHandledEvents,
  //   {
  //     variables: {
  //       data: { ID: Number(getUserId()) },
  //     },
  //     onCompleted: () => {
  //       // setHandleSource(data.getAllHandledEvents);
  //       // setHandledNumber(
  //       //   data.getAllHandledEvents === null
  //       //     ? data.getAllHandledEvents.length
  //       //     : 0,
  //       // );
  //       console.log(handleData);
  //     },
  //   },
  // );

  // 获取当前登录用户的信息
  const user = {
    id: Number(getUserId()),
    role: getUserType(),
    numberRole: getUserType() === 'gridMember' ? 2 : 1,
  };
  // 连接websocket
  const connectWs = () => {
    if (socket === null) {
      const ws = io('http://127.0.0.1:7001/event-system', {
        transports: ['websocket'],
        query: user,
      });
      setSocket(ws);
      // 在连接建立时的处理
      ws.on('connect', () => {
        console.log('已成功连接');
        // 在连接成功后主动发起请求获取事件
        ws.emit('getAllUnhandledEvents', user, (data: any) => {
          setUnhandleSource(data);
          setUnHandledNumber(data === null ? data.length : 0);
          console.log('获取未处理事件', data);
        });
        ws.emit('getAllHandledEvents', user, (data: any) => {
          setHandleSource(data);
          setHandledNumber(data === null ? data.length : 0);
          console.log('获取已处理事件', data);
        });
      });
      ws.on('error', (error) => {
        console.log('连接失败', error);
      });
    }
    socket?.on('sendUnhandleEventsToClient', (data: any) => {
      setUnhandleSource(data);
      setUnHandledNumber(data === null ? data.length : 0);
      console.log('后端发送未处理事件', data);
    });
    socket?.on('sendHandleEventsToClient', (data: any) => {
      setHandleSource(data);
      setHandledNumber(data === null ? data.length : 0);
      console.log('后端发送已处理事件', data);
    });
  };

  // websocket
  useEffect(() => {
    connectWs();
  });

  // 定时轮询
  // useEffect(() => {
  //   setInterval(() => {
  //     unhandledDataRefetch(); // 重新发起查询
  //   }, 5000); // 每隔5秒发送一次查询
  //   setInterval(() => {
  //     handledDataRefetch(); // 重新发起查询
  //   }, 60000); // 每隔60秒发送一次查询
  // }, [unhandledDataRefetch, handledDataRefetch]);

  // useEffect(() => {
  //   if (hintChoose === '1') {
  //     unhandledDataRefetch({
  //       data: { ID: Number(getUserId()) },
  //     });
  //   } else if (hintChoose === '2') {
  //     handledDataRefetch({
  //       data: { ID: Number(getUserId()) },
  //     });
  //   }
  // }, [hintChoose, handledDataRefetch, unhandledDataRefetch]);

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
                      : item.auditrecords?.action_type === '4'
                      ? `变更家庭成员 ${item.auditrecords.person_info?.name} 的群众信息`
                      : item.auditrecords?.action_type === '5'
                      ? `变更家庭成员 ${item.auditrecords.person_info?.name} 的群众信息`
                      : item.reportinfo
                      ? `${item.reportinfo?.classification_basis}的事件处理`
                      : ''}
                  </Row>
                  <Row>事件类型:{item.event_type}</Row>
                  <Row>
                    发起时间:
                    {transferTime(item.create_time)}
                  </Row>
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
            return (
              <Card
                key={index}
                hoverable
                style={{ margin: '1vh' }}
                size="small"
                onClick={() => {
                  if (item.audit_records_id) {
                    setVisibleDetail(true);
                    setCurrentEventData(item);
                    setRightnowAuditrecordsId(item.audit_records_id);
                  }
                  if (item.reportinfo_id) {
                    setReportInfoId(item.reportinfo_id);
                    setCurrentReportData(item.reportinfo);
                    if (item.reportinfo.processing_status === '已上报') {
                      setIncidentsAreReportedModalVisibel(true);
                    } else if (item.reportinfo.processing_status === '处理中') {
                      setProcessingModalVisibel(true);
                    } else if (item.reportinfo.processing_status === '待评价') {
                      setTobeEvaluatedViewModalVisibel(true);
                    }
                  }
                }}
              >
                <Row>
                  消息描述:
                  {item.auditrecords?.action_type === '1'
                    ? `新增姓名为 ${item.auditrecords.request_data?.name} 的群众信息`
                    : item.auditrecords?.action_type === '2'
                    ? `删除姓名为 ${item.auditrecords.person_info?.name} 的群众信息`
                    : item.auditrecords?.action_type === '3'
                    ? `修改姓名为 ${item.auditrecords.person_info?.name} 的群众信息`
                    : item.auditrecords?.action_type === '4'
                    ? `变更家庭成员 ${item.auditrecords.person_info?.name} 的群众信息`
                    : item.auditrecords?.action_type === '5'
                    ? `变更家庭成员 ${item.auditrecords.person_info?.name} 的群众信息`
                    : item.reportinfo
                    ? `${item.reportinfo?.classification_basis}的事件处理`
                    : ''}
                </Row>
                <Row>事件类型:{item?.event_type}</Row>
                <Row>
                  发起时间:
                  {transferTime(item.create_time)}
                </Row>
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
      {/* 已上报组件 */}
      <IncidentsAreReportedModal
        role={user.numberRole}
        id={reportInfoId}
        disable={true}
        visible={IncidentsAreReportedModalVisibel}
        setVisible={setIncidentsAreReportedModalVisibel}
        level={1}
        data={currentReportData}
        reloading={reloading}
        setReloading={setReloading}
        updata={modifyReportInfo}
      />
      {/* 处理中组件 */}
      <ProcessingModal
        role={user.numberRole}
        id={reportInfoId}
        disable={true}
        visible={ProcessingModalVisibel}
        reloading={reloading}
        setVisible={setProcessingModalVisibel}
        setReloading={setReloading}
        level={2}
        data={currentReportData}
        updata={modifyReportInfo}
      />
      {/* 待评价组件 */}
      <TobeEvaluatedViewModal
        reloading={reloading}
        setReloading={setReloading}
        data={currentReportData}
        updata={modifyReportInfo}
        role={user.numberRole}
        level={3}
        visible={TobeEvaluatedViewModalVisibel}
        id={reportInfoId}
        disable={true}
        setVisible={setTobeEvaluatedViewModalVisibel}
      />
      {/* 已完结组件 */}
      {/* <FinishModal
        role={user.numberRole}
        level={4}
        visible={visible}
        id={reportInfoId}
        disable={true}
        setVisible={setVisible}
        data={currentReportData}
      /> */}
    </>
  );
}
export default HomePage;
