import './index.css';
function Left(Props: LeftType) {
  return (
    <div className="ComponentLeft">
      <div className="Header">
        <div className="HeaderText">{Props.name}</div>
        <img className="HeaderLeft" alt="箭头" src="/》.png" />
        <img className="HeaderRight" alt="header-right" src="/header-right.png" />
      </div>
      <div className="LeftContent">
        {Props.data.map((item: MapData) => {
          return (
            <div className="OneList" key={item.name}>
              <div className="LeftContentLine">
                <img className="IconOnTheLeft" alt="" src={`/${item.url}`} />
                <div className="ListName">{item.name}</div>
              </div>
              {Props.loading ? (
                <div className="ListCount Loading"></div>
              ) : (
                <div className="ListCount">{item.count}</div>
              )}

              <img className="IconLeftBottom" alt="底部横线" src="/-.png" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Left;
