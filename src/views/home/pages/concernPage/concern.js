import React, { Component } from 'react';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { connect } from 'react-redux';
import { Toast, Carousel } from 'antd-mobile';
import { getConcernList } from '@/api/userApi';
import { getDynamicDetailByUserId, addLikeDynamic } from '@/api/dynamicApi';
import { ConcernListWrapper, Border, Icon, Input } from './style';
import formatDate from '@/utils/formatDate';
import LazyLoad from 'react-lazyload';
import { getDynamicComment, sendComment, addCommentInform } from '@/api/informApi';
import { getUserInfo } from '@/api/userApi';

const UNLIKE = '&#xe63a;';
const LIKE = '&#xe60c;';

class Concern extends Component {
    constructor(props) {
        super(props);
        this.state = {
          concernList: [],
          dynamicList: [],
          commentInput: '',
          select: null,
          send: false
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
                    <LazyLoad offset={100}>
                      <img className='avatar' src={item.writer.img ? require('@/' + item.writer.img[0].url) : require('@/statics/img/blank.jpeg')} alt="" onClick={() => this.gotoUserDetail(item.writer)}/>
                    </LazyLoad>
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
                              <Icon className='iconfont' onClick={this.getDynamicDetail(item._id)}>&#xe648;</Icon>{item.commentNumber === 0 ? '评论' : item.commentNumber}
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
                      <div className='commentContent'>
                          {
                              item.commentList && item.commentList.map((val, i) => {
                                  return (
                                      <div key={i} style={{marginBottom: '.5rem'}}>
                                          <div className='comment'>
                                              <div className='user'>
                                                  <span className='name'>
                                                      {val.userName}
                                                      {val.userId === item.writer._id ? '（作者）' : ''}：
                                                  </span>
                                                  <span>{val.content}</span>
                                              </div>
                                          </div>
                                      </div>
                                  )
                              })
                          }
                          <div className='comment'>
                              <img className='avatar' src={require('@/' + userList.img[0].url)} alt=""/>
                              <Input 
                                ref={ref => this.index = ref} 
                                placeholder="写评论"
                                value={this.state.commentInput}  
                                onChange={(value) => {
                                    this.setState({
                                        commentInput: value
                                    })
                                }} 
                                onFocus={
                                    () => {
                                      console.log('index', index)
                                        this.setState({
                                            send: true,
                                            select: index
                                        })
                                    }
                                }
                                onBlur={
                                    () => {
                                        this.setState({
                                            select: null,
                                            send: false
                                        })
                                    }
                                }
                                clear
                            />
                          </div>
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

    sendComment() {
      if (this.state.commentInput) {
          let dynamicList = this.state.dynamicList;
          let comment = {
              userId: this.props.userList._id,
              dynamicId: dynamicList[this.state.select]._id,
              content: this.state.commentInput,
              writerId: dynamicList[this.state.select].writer._id
          }

          sendComment({comment}).then(res => {
              if (res.data.code === 200) {
                  this.setState({
                      commentInput: ''
                  })
              }
              let commentInform = {
                  userId: comment.writerId,
                  writerId: this.props.userList._id,
                  commentId: res.data.data._id
              }
              return addCommentInform({commentInform})
          }).then(res => {
              if (res.data.code === 200) {
                return getDynamicComment({dynamicId: dynamicList[this.state.select]._id})
              }
          }).then((res) => {
            let dynamicComment = res.data.data;
            let actionArr = [];
            if (dynamicComment.length !== 0) {
                dynamicComment.forEach(item => {
                    actionArr.push(getUserInfo({userId: item.userId}));
                })
            }
            Promise.all(actionArr).then(function (res) {
                for (var i = 0; i < res.length; i++) {
                    var userData = res[i].data.data[0];
                    dynamicComment[i].writer = userData;
                    dynamicComment[i].userName = userData.name;
                    dynamicComment[i].avatar = userData.img[0].url;
                }
            })
            dynamicList[this.state.select].commentList = dynamicComment;
            dynamicList[this.state.select].commentNumber = dynamicComment.length ? dynamicComment.length : 0;
          }).then(() => {
            this.setState({
              dynamicList: dynamicList
            })
          }).catch(err => {
              console.log('err', err);
              Toast.fail('未知错误', 1);
          })
      } else {
          Toast.info('评论内容不能为空', 1)
      }
    }

    gotoUserDetail(userData) {
      this.props.history.replace({
        pathname: '/tab/center/myRecipes',
        userDetail: userData
      })
    }

    handleLikeClick(dynamicId, index, like) {
        let user = this.props.userList;
        let dynamicList =  this.state.dynamicList;
        let newLikeNumber = dynamicList[index].likeNumber;
        let newLikeList = dynamicList[index].likeList;
        let type;
        let writerId = dynamicList[index].userId;

        if (like === UNLIKE) {
            type = 'add';
            newLikeNumber++;
            newLikeList.push(user._id);
            if (user.likeDynamic) {
                user.likeDynamic.push(dynamicId);
            } else {
                user.likeDynamic = [dynamicId];
            }
        } else {
            type = 'delete';
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
            likeList: newLikeList,
            writerId,
            type
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
      let dynamicList = [];
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
          let action = [];
          dynamicList.forEach(item => {
            action.push(getDynamicComment({dynamicId: item._id}));
          })
          return Promise.all(action);
      }).then(res => {
        for (var i = 0; i < res.length; i++) {
          let dynamicComment = res[i].data.data;
          // let dynamicCommentList = [];
          let actionArr = [];
          if (dynamicComment.length !== 0) {
              dynamicComment.forEach(item => {
                  actionArr.push(getUserInfo({userId: item.userId}));
              })
          }
          Promise.all(actionArr).then(function (res) {
              for (var i = 0; i < res.length; i++) {
                  var userData = res[i].data.data[0];
                  dynamicComment[i].writer = userData;
                  dynamicComment[i].userName = userData.name;
                  dynamicComment[i].avatar = userData.img[0].url;
              }
          })
          dynamicList[i].commentList = dynamicComment;
          dynamicList[i].commentNumber = dynamicComment.length ? dynamicComment.length : 0;
        }
      }).then(() => {
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
      // console.log(this.props.userList);
      this.getConcernList();
      // this.getDynamicComment();

      document.body.addEventListener('keyup', (e) => {
          if (window.event) {
              e = window.event
          }
          let code = e.charCode || e.keyCode;
          if (code === 13) {
              if (this.state.commentInput) {
                  this.sendComment();
              } else {
                  return
              }
          }		
      })
    }

    componentWillMount() {
        document.body.removeEventListener('keyup', () => {});
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