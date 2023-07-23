import './index.css';

import { useNavigate } from 'react-router-dom';

function Right(Props: RightType) {
  const navigate = useNavigate();
  const changeRoute = () => {
    if (Props.route) {
      navigate(Props.route);
    }
  };
  return (
    <div className="ComponentRight">
      <div className="Header" onClick={changeRoute}>
        <div className="HeaderText">{Props.name}</div>
        <img className="HeaderLeft" alt="箭头" src="/》.png" />
        <img className="HeaderRight" alt="header-right" src="/header-right.png" />
      </div>
      <div className="RightContent">
        {Props.data.map((item: RightMapData) => {
          return (
            <div key={`${item.left.url}-${item.left.name}`}>
              <div className="RightLeftList">
                <div className="RightContentLine">
                  <img className="IconOnTheLeft" alt="" src={`/${item.left.url}`} />
                  <div className="ListName">{item.left.name}</div>
                </div>
                {Props.loading ? (
                  <div className="RightListCount Loading"></div>
                ) : (
                  <div className="RightListCount">{item.left.count}</div>
                )}
              </div>
              <img className="RightMiddle" alt="中间的横线" src="/｜.png" />
              <div className="RightRightList">
                <div className="RightContentLine">
                  <img className="IconOnTheLeft" alt="" src={`/${item.right.url}`} />
                  <div className="ListName">{item.right.name}</div>
                </div>
                {Props.loading ? (
                  <div className="RightListCount Loading"></div>
                ) : (
                  <div className="RightListCount">{item.right.count}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Right;
