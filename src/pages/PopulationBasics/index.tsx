import Watermark from 'antd/es/watermark';

import BasicsInfomation from './BasicsInformation';
import styles from './style.module.less';
import LeftTimeLine from './TimeLine/LeftTimeLine';

function IndexHome() {
    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div className={styles.LeftBox}>
                {/* 左侧同步锚点  需要传入滑动区域的id */}
                <LeftTimeLine dataID="informationBasics"></LeftTimeLine>
            </div>

            {/* 如果想要去除水印环衬div就行*/}
            <Watermark content="漠河市基层社会治理智管平台" rotate={-40} gap={[40, 120]}
                className={styles.WaterMarkBox}>
                <div id="informationBasics" className={styles.RightBox}>
                    <section id="basicsInformation1">
                        {/* 个人基础信息 */}
                        <BasicsInfomation></BasicsInfomation>

                    </section>
                    <section id="combination2">
                        <h1>专群结合</h1>
                        <p className="lead">INFORMATION</p>
                    </section>
                    <section id="wellbeing3">
                        <h1>民生</h1>
                        <p className="lead">STAFF</p>
                    </section>
                    <section id="administration4">
                        <h1>民政卫健</h1>
                        <p className="lead">WORLD</p>
                    </section>
                    <section id="production5">
                        <h1>生产经营情况</h1>
                        <p className="lead">MEDIA</p>
                    </section>
                    <section id="otherInformation6">
                        <h1>其他情况</h1>
                        <p className="lead">MEDIA</p>
                    </section>
                    <section id="warrantor7">
                        <h1>包保人员信息</h1>
                        <p className="lead">MEDIA</p>
                    </section>
                </div>
            </Watermark>
        </div >
    );
}

export default IndexHome;
