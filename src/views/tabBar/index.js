import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { Iconfont, IconfontSelected, TabBarWrapper } from './style';
import { themeColor, textColor } from '../../styles/color';
import { checkUser } from '../../api/userApi';
import { renderRoutes } from 'react-router-config';

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
      selectedTab: this.props.location.selectedTab ? this.props.location.selectedTab : 'home',
      route: props.route
    };
  }

  render() {
    return (
      <TabBarWrapper>
        <div style={{ position: 'fixed', height: 'calc(100% - 3.125rem)', width: '100%', top: 0, marginBottom: '3.125rem' }}>
          {renderRoutes(this.state.route.children)}
        </div>
        <div style={{ position: 'fixed', height: '3.125rem', width: '100%', bottom: 0 }}>
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
                  </TabBar.Item>
              )
            }
          </TabBar>
        </div>
      </TabBarWrapper>
    );
  }

  gotoLogin() {
    if (this.state.selectedTab === 'home') {
      this.props.history.replace('/tab/home')
    }
    if (this.state.selectedTab === 'shop') {
      this.props.history.replace('/tab/shop')
    }
    if (this.state.selectedTab === 'message') {
      this.props.history.replace('/login')
    }
    if (this.state.selectedTab === 'center' || this.state.selectedTab === 'release') {
      var token = localStorage.getItem('token');
      var user_name = localStorage.getItem('user_name');

      checkUser({token, user_name})
        .then(res => {
            console.log('checkUser', res)
            this.props.history.replace('/tab/' + this.state.selectedTab)
        }).catch((err) => {
          console.log('error', err);
          this.props.history.push('/login');
        })
    }
  }
}

export default TabBarExample;
