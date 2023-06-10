/* eslint-disable react-hooks/exhaustive-deps */
import { Timeline } from 'antd';
import { useEffect, useState } from 'react';

import styles from './style.module.less';

type ItemConfigType = {
    id: number;
    name: string;
    href: string;
};
// 不包含外层的布局  时间线含滑动同步功能
function LeftTimeLine(props: any) {
    const [activeNum, setActiveNum] = useState(1);

    // 节流函数
    const throttle = (func: any, delay: any) => {
        let timeoutId: any;
        let lastExecTime = 0;

        return (...args: any) => {
            const currentTime = Date.now();

            const execute = () => {
                func.apply(null, args);
                lastExecTime = currentTime;
            };

            if (currentTime - lastExecTime > delay) {
                execute();
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(execute, delay);
            }
        };
    };



    const HandleScrollEvent = (scrollContainer: any) => {
        const sections = scrollContainer?.querySelectorAll('section');
        let currentSectionIndex = 1;

        // 找到当前可见的区域
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const rect = section?.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2) {
                currentSectionIndex = i + 1;
            }
        }
        setActiveNum(currentSectionIndex);
    };

    useEffect(() => {
        const scrollContainer = document.getElementById(props?.dataID);
        const throttledHandleScrollEvent = throttle(HandleScrollEvent, 50); // 使用自定义的节流函数

        const handleScroll = () => {
            throttledHandleScrollEvent(scrollContainer);
        };

        scrollContainer?.addEventListener('scroll', handleScroll);

        return () => {
            scrollContainer?.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const transformItems = (items: ItemConfigType[]) => {
        return items?.map((item: ItemConfigType) => {
            return {
                dot: activeNum === item.id ? '' : <div className={styles.CommonDot}></div>,
                children: <a href={`#${item.href}`}
                    style={activeNum === item.id ? { color: '#1677ff' } : {}}>{item.name}</a>
            };
        });
    };

    return (
        <>
            <div id="fyLeftAnchor">
                <Timeline
                    className={styles.TimeLineStyle}
                    items={transformItems(props?.menuConfig)}
                />
            </div>
        </>
    );
}

export default LeftTimeLine;
