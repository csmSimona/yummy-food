import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { Iconfont, IconfontSelected, TabBarWrapper } from './style';
import { themeColor, textColor } from '@/styles/color';
import { checkUser } from '@/api/userApi';
import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '../center/store';
import { actionCreators } from './store';
import { getUnreadCommentNumber, getUnreadFanNumber, getUnreadCollectNumber, getUnreadLikeNumber } from '@/api/informApi';

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
                    badge={item.key === 'message' ? this.props.unReadNumber : ''}
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
      // var userPhone = localStorage.getItem('userPhone');
      var userId = localStorage.getItem('userId');
      checkUser({token, userId})
        .then(res => {
            localStorage.setItem('token', res.data.token);
            // localStorage.setItem('userPhone', res.data.userList[0].phone);
            localStorage.setItem('userId', res.data.userList[0]._id);
            this.props.saveUserList(res.data.userList[0]);
            this.getUnreadNumber();
        }).catch((err) => {
          console.log('error', err);
          this.props.history.push('/login');
        })
    }

    getUnreadNumber() {
        let that = this;
        let actionArr = [
          getUnreadCommentNumber({userId: this.props.userList._id}),
          getUnreadFanNumber({writerId: this.props.userList._id}),
          getUnreadCollectNumber({writerId: this.props.userList._id}),
          getUnreadLikeNumber({writerId: this.props.userList._id})
        ];
        Promise.all(actionArr).then(function (res) {
          that.props.saveUnReadCommentNumber(res[0].data.data);
          that.props.saveUnReadFanNumber(res[1].data.data);
          that.props.saveUnReadCollectNumber(res[2].data.data);
          that.props.saveUnReadLikeNumber(res[3].data.data);
          that.props.saveUnReadNumber(res[0].data.data + res[1].data.data + res[2].data.data + res[3].data.data);
        }).catch(err => {
          console.log('err', err);
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
      selectedTab: state.getIn(['tab', 'selectedTab']),
      unReadNumber: state.getIn(['tab', 'unReadNumber']),
      unReadCollectNumber: state.getIn(['tab', 'unReadCollectNumber']),
      unReadCommentNumber: state.getIn(['tab', 'unReadCommentNumber']),
      unReadLikeNumber: state.getIn(['tab', 'unReadLikeNumber']),
      unReadFanNumber: state.getIn(['tab', 'unReadFanNumber']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      saveUserList(userList) {
          dispatch(centerActionCreators.saveUserList(userList));
      },
      saveSelectedTab(selectedTab) {
        dispatch(actionCreators.saveSelectedTab(selectedTab));
      },
      saveUnReadNumber(unReadNumber) {
        dispatch(actionCreators.saveUnReadNumber(unReadNumber));
      },
      saveUnReadCollectNumber(unReadCollectNumber) {
        dispatch(actionCreators.saveUnReadCollectNumber(unReadCollectNumber));
      },
      saveUnReadCommentNumber(unReadCommentNumber) {
        dispatch(actionCreators.saveUnReadCommentNumber(unReadCommentNumber));
      },
      saveUnReadLikeNumber(unReadLikeNumber) {
        dispatch(actionCreators.saveUnReadLikeNumber(unReadLikeNumber));
      },
      saveUnReadFanNumber(unReadFanNumber) {
        dispatch(actionCreators.saveUnReadFanNumber(unReadFanNumber));
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBarExample);