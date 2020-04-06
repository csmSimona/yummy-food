import React, { Component } from 'react';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { connect } from 'react-redux';
import { Toast, Carousel } from 'antd-mobile';
import { getConcernList } from '@/api/userApi';
import { getDynamicDetailByUserId, addLikeDynamic } from '@/api/dynamicApi';
import { ConcernListWrapper, Border, Icon, Input } from './style';
import formatDate from '@/utils/formatDate';

const UNLIKE = '&#xe63a;';
const LIKE = '&#xe60c;';

class Concern extends Component {
    constructor(props) {
        super(props);
        this.state = {
          concernList: [],
          dynamicList: []
        }
    }
    
    render() {
      let { dynamicList } = this.state;
      let userList = this.props.userList;
      return (
        <div>
          {
            dynamicList && dynamicList.map((item, index) => {
              return (
                <ConcernListWrapper key={index}>
                  <div className='writer'>
                    <img className='avatar' src={item.writer.img ? require('@/' + item.writer.img[0].url) : require('@/statics/img/title.png')} alt="" onClick={() => this.gotoUserDetail(item.writer)}/>
                    <p onClick={() => this.gotoUserDetail(item.writer)}>{item.writer.name}</p>
                  </div>
                  <Carousel
                      style={{touchAction: 'none'}}
                      autoplay
                      infinite
                      frameOverflow="visible"
                    >
                      {item.imgs && item.imgs.map((val, index) => (
                          <img
                              src={require('@/' + val.url)}
                              alt=""
                              style={{ width: '100%', verticalAlign: 'top' }}
                              onLoad={() => {
                              // fire window resize event to change height
                              window.dispatchEvent(new Event('resize'));
                                  this.setState({ imgHeight: 'auto' });
                              }}
                              key={index}
                              onClick={this.getDynamicDetail(item._id)}
                          />
                      ))}
                  </Carousel>
                  <div className='concernContent'>
                      <div className='concernDesc'>
                          <div className='concernDate'>{formatDate(item.createDate)}</div>
                          <div className='collection'>
                              <Icon 
                                  className="iconfont" 
                                  onClick={() => this.handleLikeClick(item._id, index, item.like)}
                                  dangerouslySetInnerHTML={{__html: item.like}} 
                                  style={{
                                      color: item.like === UNLIKE ? '#888888' : '#FB6650'
                                  }} 
                              />
                              <span 
                                  style={{
                                      color: item.like === UNLIKE ? '#888888' : '#FB6650',
                                      marginRight: '1rem'
                                  }} >{item.likeNumber}</span>
                              <Icon className='iconfont'>&#xe648;</Icon>评论
                          </div>
                      </div>
                      <div>
                          <p>{item.dynamicName}</p>
                          <p>{item.dynamicStory}</p>
                          <div 
                              style={{display: item.followRecipes ? 'block' : 'none'}}
                              className='followRecipes' 
                              onClick={this.getDynamicDetail(item._id)}
                          >
                              来自：{item.followRecipes ? item.followRecipes.recipeName : ''}
                          </div>
                      </div>
                      <div className='comment'>
                          <img className='avatar' src={require('@/' + userList.img[0].url)} alt=""/>
                          <Input placeholder="写评论"/>
                      </div>
                      <Border/>
                  </div>
                </ConcernListWrapper>
              )
            })
          }
        </div>
      )
    }

    gotoUserDetail(userData) {
      this.props.history.replace({
        pathname: '/tab/center/myRecipes',
        userDetail: userData
      })
    }

    handleLikeClick(dynamicId, index, like) {
        var user = this.props.userList;
        var dynamicList =  this.state.dynamicList;
        var newLikeNumber = dynamicList[index].likeNumber;
        var newLikeList = dynamicList[index].likeList;

        if (like === UNLIKE) {
            newLikeNumber++;
            newLikeList.push(user._id);
            if (user.likeDynamic) {
                user.likeDynamic.push(dynamicId);
            } else {
                user.likeDynamic = [dynamicId];
            }
        } else {
            newLikeNumber--;
            newLikeList.forEach((item, i) => {
                if (item === user._id) {
                    newLikeList.splice(i, 1);
                    i--;
                }
            })
            user.likeDynamic.forEach((item, i) => {
                if (item === dynamicId) {
                    user.likeDynamic.splice(i, 1);
                    i--;
                }
            })
        }
        this.props.saveUserList(user);
        addLikeDynamic({
            userId: user._id,
            dynamicId: dynamicId,
            likeDynamic: user.likeDynamic,
            likeNumber: newLikeNumber,
            likeList: newLikeList
        }).then(() => {
            // var newDynamicDetail = this.state.dynamicDetail;
            dynamicList[index].likeNumber = newLikeNumber;
            dynamicList[index].likeList = newLikeList;
            dynamicList[index].like = like === UNLIKE ? LIKE : UNLIKE;
            this.setState({
              dynamicList: dynamicList
            })
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    getDynamicDetail = (recipeId) => () => {
      this.props.history.push({
          pathname: '/dynamicDetail/' + recipeId
      })
    }

    getConcernList() {
      let userList = this.props.userList;
      let that = this;
      getConcernList({concernIdList: userList.concernList}).then(res => {
          if (res.data.code === 200) {
              let concernList = res.data.data;

              var actionArr = [];
              concernList.forEach(item => {
                  // let index = item.concernList.indexOf(userList._id);
                  // if (index) {
                  //     item.concern = '互相关注'
                  // } else {
                  //     item.concern = '已关注'
                  // }
                  actionArr.push(getDynamicDetailByUserId({ userId: item._id }))
              })
              // console.log('concernList', concernList);
              this.setState({
                concernList: concernList
              })
          }
          return Promise.all(actionArr);
      }).then(function (res) {
          let dynamicList = [];
          for (var i = 0; i < res.length; i++) {
            let dynamicDetail = res[i].data.data;
            if (JSON.stringify(dynamicDetail) !== []) {
              dynamicDetail.forEach(item => {
                item.writer = that.state.concernList[i];
                if (!item.likeNumber) {
                  item.likeNumber = 0;
                }
                if (!item.likeList) {
                  item.likeList = [];
                  }
                if (userList.likeDynamic instanceof Array) {
                    if (userList.likeDynamic.length !== 0) {
                        userList.likeDynamic.forEach(val => {
                            if (val === item._id) {
                              item.like = LIKE
                            } else {
                              item.like = UNLIKE
                            }
                        })
                    } else {
                      item.like = UNLIKE
                    }
                } else {
                  item.like = UNLIKE
                }
              })
            }
            dynamicList = dynamicList.concat(dynamicDetail);
          }
          dynamicList.sort(function(a, b){
              return a.createDate < b.createDate ? 1 : -1
          });
          console.log('dynamicList', dynamicList);
          that.setState({
            dynamicList: dynamicList
          })
      }).catch(function (err) {
          Toast.fail('未知错误', 1);
          console.log('err', err)
      })
    }

    componentDidMount() {
      console.log(this.props.userList);
      this.getConcernList();
    }
}
 
const mapStateToProps = (state) => {
  return {
      userList: state.getIn(['center', 'userList']),
      // recipesList: state.getIn(['home', 'recipesList']),
      // leftData: state.getIn(['home', 'leftData']),
      // rightData: state.getIn(['home', 'rightData'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      saveUserList(userList) {
          dispatch(centerActionCreators.saveUserList(userList));
      },
      // saveRecipesList(recipesList) {
      //     dispatch(actionCreators.saveRecipesList(recipesList));
      // },
      // saveLeftData(leftData) {
      //     dispatch(actionCreators.saveLeftData(leftData));
      // },
      // saveRightData(rightData) {
      //     dispatch(actionCreators.saveRightData(rightData));
      // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Concern);