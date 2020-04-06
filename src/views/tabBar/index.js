import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { Iconfont, IconfontSelected, TabBarWrapper } from './style';
import { themeColor, textColor } from '@/styles/color';
import { checkUser } from '@/api/userApi';
import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '../center/store';
import { actionCreators } from './store';

let tabBarList=[
  {
    title: "首页",
    key: "home",
    icon: "&#xe60e;"
  },
  {
    title: "资讯",
    key: "information",
    icon: "&#xe619;"
  },
  {
    title: "",
    key: "release",
    icon: "&#xe66f;"
  },
  {
    title: "通知",
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
      route: props.route,
      selectedTab: 'home'
    };
  }

  render() {
    return (
      <TabBarWrapper>
        <div style={{ height: 'calc(100% - 3.125rem)', width: '100%', marginBottom: '3.125rem' }}>
          {renderRoutes(this.state.route.children)}
        </div>
        <div style={{ position: 'fixed', height: '3.125rem', width: '100%', bottom: 0, zIndex: '999'}}>
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
                    selected={this.props.selectedTab === item.key}
                    onPress={() => {
                      // this.setState({
                      //   selectedTab: item.key,
                      // }, () => {
                      //   this.gotoLogin()
                      // });
                      this.props.saveSelectedTab(item.key);
                      setTimeout(() => {
                        this.gotoLogin();
                      })
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
      // this.checkUser();
      let tab = this.props.selectedTab

      if (tab === 'home') {
        this.props.history.replace('/tab/home/recommend')
      }
      if (tab === 'information') {
        this.props.history.replace('/tab/information')
      }
      if (tab === 'message') {
        this.props.history.replace('/tab/message')
      }
      if (tab === 'center') {
        this.props.history.replace('/tab/center/myRecipes')
      }
      if (tab === 'release') {
        this.props.history.replace('/tab/release')
      }
    }

    checkUser() {
      var token = localStorage.getItem('token');
      var userPhone = localStorage.getItem('userPhone');
      var userId = localStorage.getItem('userId');
      checkUser({token, userPhone, userId})
        .then(res => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userPhone', res.data.userList[0].phone);
            localStorage.setItem('userId', res.data.userList[0]._id);
            this.props.saveUserList(res.data.userList[0]);
        }).catch((err) => {
          console.log('error', err);
          this.props.history.push('/login');
        })
    }

    componentDidMount() {
      var pathname = this.props.location.pathname;
      if (pathname === '/tab/information') {
        this.props.saveSelectedTab('information');
      }
      if (pathname === '/tab/release') {
        this.props.saveSelectedTab('release');
      }
      if (pathname === '/tab/message') {
        this.props.saveSelectedTab('message');
      }
      if (pathname.substring(0, 11) === '/tab/center') {
        this.props.saveSelectedTab('center');
      }
      this.checkUser();
    }

}

const mapStateToProps = (state) => {
  return {
      userList: state.getIn(['center', 'userList']),
      selectedTab: state.getIn(['tab', 'selectedTab'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      saveUserList(userList) {
          dispatch(centerActionCreators.saveUserList(userList));
      },
      saveSelectedTab(selectedTab) {
        dispatch(actionCreators.saveSelectedTab(selectedTab));
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBarExample);