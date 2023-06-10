import type { ReactElement } from 'react';

import AnchorHome from '@/utils/PopulationBasics';

import BasicsInfomation from './BasicsInformation';


type ItemConfigType = {
    id: number;
    name: string;
    href: string;
    elem: ReactElement
};

function InformationShow() {
    const itemConfig: ItemConfigType[] = [
        { id: 1, name: '基础信息', href: 'basicsInformation1', elem: <BasicsInfomation /> },
        { id: 2, name: '专群结合', href: 'combination2', elem: <BasicsInfomation /> },
        { id: 3, name: '民生', href: 'wellbeing3', elem: <BasicsInfomation /> },
        { id: 4, name: '民政卫健', href: 'administration4', elem: <BasicsInfomation /> },
        { id: 5, name: '生产经营情况', href: 'production5', elem: <BasicsInfomation /> },
        { id: 6, name: '其他情况', href: 'otherInformation6', elem: <BasicsInfomation /> },
        { id: 7, name: '包保人员信息', href: 'warrantor7', elem: <BasicsInfomation /> },
    ];

    return (
        <>
            <AnchorHome itemData={itemConfig}></AnchorHome>
        </>
    );
}

export default InformationShow;
