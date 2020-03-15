import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { Iconfont, IconfontSelected } from './style';
import { themeColor, textColor } from '../../styles/color';
import Home from '../home';
import Shop from '../shop';
import Release from '../release';
import Message from '../message';
import Center from '../center';

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
    title: "发布",
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
      selectedTab: this.props.location.selectedTab ? this.props.location.selectedTab : 'home'
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

  gotoLogin() {
    if (this.state.selectedTab === 'message') {
      this.props.history.replace('/login')
    }
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
                    }, () => {
                      this.gotoLogin()
                    });
                  }}
                >
                  {this.renderContent(item.key)}
                </TabBar.Item>
            )
          }
        </TabBar>
      </div>
    );
  }
}

export default TabBarExample;
