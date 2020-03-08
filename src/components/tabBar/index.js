import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { Iconfont, IconfontSelected } from './style';
import { themeColor, textColor } from '../../styles/color';
import Home from '../../views/home';
import Shop from '../../views/shop';
import Release from '../../views/release';
import Message from '../../views/message';
import Center from '../../views/center';
let tabBarList=[
  {
    title: "首页",
    key: "home",
    icon: "&#xe60e;"
  },
  {
    title: "市集",
    key: "shop",
    icon: "&#xe610;"
  },
  {
    title: "",
    key: "release",
    icon: "&#xe66f;"
  },
  {
    title: "消息",
    key: "message",
    icon: "&#xe6a5;"
  },
  {
    title: "我",
    key: "center",
    icon: "&#xe612;"
  }
];

class TabBarExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home'
    };
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        { pageText === 'home' && <Home/> }
        { pageText === 'shop' && <Shop/> }
        { pageText === 'release' && <Release/> }
        { pageText === 'message' && <Message/> }
        { pageText === 'center' && <Center/> }
      </div>
    );
  }

  render() {
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="black"
          tintColor={themeColor}
          barTintColor="white"
        >
          {
            tabBarList.map((item) =>
                <TabBar.Item
                  title={item.title}
                  key={item.key}
                  icon={
                    <Iconfont className="iconfont" dangerouslySetInnerHTML={{__html: item.icon}} style={{ color: item.key === 'release' ? themeColor : textColor}}></Iconfont>
                  }
                  selectedIcon={
                    <IconfontSelected className="iconfont" dangerouslySetInnerHTML={{__html: item.icon}}></IconfontSelected>
                  }
                  selected={this.state.selectedTab === item.key}
                  onPress={() => {
                    this.setState({
                      selectedTab: item.key,
                    });
                  }}
                >
                  {/* { pathname === ( '/' + item.key ) ? children : null } */}
                  {this.renderContent(item.key)}
                  {/* <TabPane tab="Third Tab" key="thirdTab">
                    <Route exact path="/my/url/thirdTab" component={ThirdComponent}/>
                  </TabPane> */}
                </TabBar.Item>
            )
          }
        </TabBar>
      </div>
    );
  }
}

export default TabBarExample;
