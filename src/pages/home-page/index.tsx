import './index.less';
// 首页
function HomePage() {
  return (
    <div className="index-container">
      <div className="index-left-div">
        <div className="index-left-top">
          <div className="index-left-top-left">
            <div className="index-left-top-left-top">left-top-left-top</div>
            <div className="index-left-top-left-bottom">left-top-left-bottom</div>
          </div>
          <div className="index-left-top-right">left-top-right</div>
        </div>
        <div className="index-left-down">left-down</div>
      </div>
      <div className="index-right-div">
        <div className="index-right-top">
          <div className="index-right-top-left">
            <div className="index-right-top-left-top">right-top-left-top</div>
            <div className="index-right-top-left-bottom">right-top-left-bottom</div>
          </div>
          <div className="index-right-top-right">
            <div className="index-right-top-right-top">right-top-right-top</div>
            <div className="index-right-top-right-bottom">right-top-right-bottom</div>
          </div>
        </div>
        <div className="index-right-bottom">right-bottom</div>
      </div>
    </div>
  );
}

export default HomePage;
