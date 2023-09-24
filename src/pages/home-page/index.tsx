import './index.less';

function HomePage() {
  return (
    <div className="container">
      <div className="left-div">
        <div className="left-top">
          <div className="left-top-left">
            <div className="left-top-left-top">left-top-left-top</div>
            <div className="left-top-left-bottom">left-top-left-bottom</div>
          </div>
          <div className="left-top-right">left-top-right</div>
        </div>
        <div className="left-down">left-down</div>
      </div>
      <div className="right-div">
        <div className="right-top">
          <div className="right-top-left">
            <div className="right-top-left-top">right-top-left-top</div>
            <div className="right-top-left-tobottomp">right-top-left-bottom</div>
          </div>
          <div className="right-top-right">
            <div className="right-top-right-top">right-top-right-top</div>
            <div className="right-top-right-bottom">right-top-right-bottom</div>
          </div>
        </div>
        <div className="right-bottom">right-bottom</div>
      </div>
    </div>
  );
}

export default HomePage;
