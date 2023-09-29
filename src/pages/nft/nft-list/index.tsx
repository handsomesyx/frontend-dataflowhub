import './index.less';

import Bottom from './list-bottom/bottom';
import Top from './list-top/top';

// NFT列表
export default function NFTList() {
  return (
    <div className="nft-list-container">
      {/* 上半部分：筛选 */}
      <div className="nft-list-top">
        <Top />
      </div>

      {/* 下半部分：NFT列表的展示 */}
      <div className="nft-list-bottom">
        <Bottom />
      </div>
    </div>
  );
}
