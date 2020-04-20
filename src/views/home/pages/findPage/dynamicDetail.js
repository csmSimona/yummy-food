import React, { Component } from 'react';
import { getDynamicDetail, addLikeDynamic } from '@/api/dynamicApi';
import { getUserInfo, addConcernUser } from '@/api/userApi';
import formatDate from '@/utils/formatDate';
import { Toast, Button, InputItem, Carousel, Modal } from 'antd-mobile';
import Header from '@/components/header';
import { RecipesDetailWrapper, Border, Input, SelectContent } from '../recommendPage/style';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { sendComment, getDynamicComment, deleteComment, addCommentInform } from '@/api/informApi';
import formatTime from '@/utils/formatTime';

const UNLIKE = '&#xe63a;';
const LIKE = '&#xe60c;';

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
}

class DynamicDetail extends Component {
    longPressInterval = 600;     //longPressInterval长按的毫秒数
    longPressItemTimeOut;      //setTimeOut的返回值    为了清掉定时器
    constructor(props) {
        super(props);
        this.state = {
            showBigModal: false,
            showBigUrl: '',
            dynamicDetail: {},
            writer: {},
            imgHeight: 176,
            commentInput: '',
            dynamicCommentList: [],
            modal: false,
            select: null,
            placeholder: "评论",
            send: false,
            commentNumber: 0
        }
        this.handleLikeClick = this.handleLikeClick.bind(this);
        this.handleConcernClick = this.handleConcernClick.bind(this);
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    render() {
        let {dynamicDetail, writer, dynamicCommentList} = this.state;
        let userList = this.props.userList;
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: dynamicDetail.dynamicName,
            right: ''
        };
        return (
          <RecipesDetailWrapper>
              <div className='recipesDetailContent'>
                <Header header={header}></Header>
                <Carousel
                    style={{touchAction: 'none'}}
                    autoplay
                    infinite
                    frameOverflow="visible"
                >
                    {dynamicDetail.imgs && dynamicDetail.imgs.map((val, index) => (
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
                            onClick={() => {
                                this.setState({
                                    showBigModal: true,
                                    showBigUrl: require('@/' + val.url)
                                })
                            }}
                        />
                    ))}
                </Carousel>
                {/* <Modal
                    visible={this.state.showBigModal}
                    transparent
                    maskClosable={true}
                    onClose={this.onClose('showBigModal')}
                    title="查看图片"
                    footer={[{ text: '关闭', onPress: () => { this.onClose('showBigModal')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <img src={this.state.showBigUrl} alt="查看图片" width="100%" height="100%" />
                </Modal> */}
                
                <div className='showBig' style={{display: this.state.showBigModal ? 'block' : 'none'}} onClick={() => {this.setState({showBigModal: false})}}>
                    <img src={this.state.showBigUrl} alt="查看图片" width="100%" />
                </div>
                <p className='recipeName'>{dynamicDetail.dynamicName}</p>
                <p className='createDate'>
                    {formatDate(dynamicDetail.createDate)}
                    {dynamicDetail.likeNumber ? ` · ${dynamicDetail.likeNumber} 点赞` : ''}
                </p>
                <div className='writer'>
                    <img 
                        className='avatar' 
                        src={writer.img ? writer.img[0].url.substring(0, 4) === 'http' ? writer.img[0].url : require('@/' + writer.img[0].url) : require('@/statics/img/blank.jpeg')} 
                        alt=""
                        onClick={() => this.gotoUserDetail(writer)}/>
                    <div className='writerName' onClick={() => this.gotoUserDetail(writer)}>
                        <p>{writer.name}</p>
                        <p>{writer.profile}</p>
                    </div>
                    <Button 
                        type='primary' 
                        className='concern' 
                        size='small' 
                        onClick={this.handleConcernClick}
                    >{writer.concern ? '已关注' : '关注'}</Button>
                </div>
                <p className='story'>{dynamicDetail.dynamicStory}</p>
                <div 
                    style={{display: dynamicDetail.followRecipes ? 'block' : 'none'}}
                    className='followRecipes' 
                    onClick={this.getRecipesDetail}
                >
                    来自：{dynamicDetail.followRecipes ? dynamicDetail.followRecipes.recipeName : ''}
                </div>
                <div className='cookSteps'>
                    <p className='subject'>评论</p>
                    {
                        dynamicCommentList && dynamicCommentList.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className='comment'>
                                        <img 
                                            className='avatar' 
                                            src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)} 
                                            onClick={() => this.gotoUserDetail(item.writer)}
                                        />
                                        <div 
                                            className='user' 
                                            onTouchStart={() => this.onItemTouchStart(index)} 
                                            onTouchEnd={this.onItemTouchEnd}
                                        >
                                            <div className='name'>
                                                {item.userName}
                                                {item.userId === writer._id ? '（作者）' : ''} 
                                            </div>
                                            <p>{item.content}</p>
                                            <div className='name'>{formatTime(item.createDate)}</div>
                                        </div>
                                        {/* <span className='iconfont' style={{fontSize: '1.25rem', alignItem: 'center'}}>&#xe63a;</span> */}
                                    </div>
                                    {
                                        item.reply ? 
                                        item.reply.map((val, i) => {
                                            return (
                                                <div style={{display: 'flex'}} key={i}>
                                                    <div style={{width: '3rem'}}></div>
                                                    <div className='reply' key={i}>
                                                        <span className='name' onClick={() => this.gotoUserDetail(item.writer)}>
                                                            {val.userName}
                                                            {val.userId === writer._id ? '（作者）' : ''}：
                                                        </span>
                                                        <span>{val.content}</span>
                                                    </div>
                                                </div>
                                            )
                                        }) : ''
                                    }
                                </div>
                            )
                        })
                    }
                    <div className='commentInput'>
                        <img className='avatar' src={userList.img[0].url.substring(0, 4) === ' http' ? userList.img[0].url : require('@/' + userList.img[0].url)} alt=""/>
                        <Input 
                            ref={ref => this.searchInput = ref} 
                            placeholder={this.state.placeholder} 
                            value={this.state.commentInput}  
                            onChange={(value) => {
                                this.setState({
                                    commentInput: value
                                })
                            }} 
                            onFocus={
                                () => {
                                    this.setState({
                                        send: true
                                    })
                                }
                            }
                            onBlur={
                                () => {
                                    this.setState({
                                        placeholder: '评论',
                                        select: null,
                                        send: false
                                    })
                                }
                            }
                            clear
                        />
                        {/* <div 
                        className='send' 
                        style={{display: this.state.send ? 'block' : 'none'}}
                        onClick={() => {this.searchInput.focus();this.sendComment();}}
                          >发送</div> */}
                    </div>
                </div>
                <Border/>
            </div>
            <div className='fixedFooter'>
              <div className='fixedIcon' style={{flex: '2'}}>
                <InputItem
                  // {...getFieldProps('input3')}
                  placeholder="写评论..."
                />
              </div>
                <div 
                    className='fixedIcon' 
                    onClick={() => this.handleLikeClick(dynamicDetail._id, dynamicDetail.like)}
                    style={{
                        color: dynamicDetail.like === UNLIKE ? '#000000' : '#FB6650'
                    }}
                >
                    <span 
                        className='iconfont'
                        dangerouslySetInnerHTML={{__html: dynamicDetail.like}} 
                        style={{
                            color: dynamicDetail.like === UNLIKE ? '#000000' : '#FB6650'
                        }}
                    />{dynamicDetail.likeNumber === 0 ? '赞' : dynamicDetail.likeNumber}
                </div>
                <div className='fixedIcon' onClick={() => {
                    this.searchInput.focus();
                    this.setState({
                        send: true
                    })
                }}>
                    <span className='iconfont'>&#xe648;</span>{this.state.commentNumber === 0 ? '评论' : this.state.commentNumber}
                </div>
            </div>
            <Modal
                visible={this.state.modal}
                transparent
                onClose={this.onClose('modal')}
                title="更多"
                footer={[{ text: '取消', onPress: () => { this.onClose('modal')(); } }]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
            >
                <div>
                    <SelectContent>举报</SelectContent>
                    <SelectContent onClick={this.deleteComment}>删除</SelectContent>
                </div>
            </Modal>
          </RecipesDetailWrapper>
        )
    }

    
    deleteComment() {
        let commentId = this.state.dynamicCommentList[this.state.select]._id;
        deleteComment({commentId}).then(res => {
            if (res.data.code === 200) {
                Toast.success('删除成功', 1);
                this.setState({
                    modal: false
                })
                this.getDynamicComment();
            }
        }).catch(err => {
            console.log('err', err)
        })
    }
    
    onItemTouchStart = index => {
        this.startTime = +new Date();
        this.setState({
            select: index,
        });
        this.longPressItemTimeOut = setTimeout(
          () => this.onLongPressItem(index),
          this.longPressInterval
        );
    };

    onLongPressItem(index) {
        this.setState({
            modal: true
        });
    }

    onItemTouchEnd = (e) => {
        this.endTime = +new Date();
        const interval = this.endTime - this.startTime;   //长按时长
        
        if (interval < this.longPressInterval) {      //按键时长<600,默认是点击事件
          // TODO click操作  点击进入对应的Item
          clearTimeout(this.longPressItemTimeOut);
          this.replyComment(e);
        } else {        //按键时长>600   长按
          // TODO 长按操作
        }
    };

    replyComment(e) {
        e.preventDefault();
        this.searchInput.focus();
        let comment = this.state.dynamicCommentList[this.state.select];
        this.setState({
          placeholder: `回复${comment.userName}`,
          send: true
        })
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/tab/center/myRecipes',
          userDetail: userData
        })
    }
    
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
    }

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    getRecipesDetail() {
        let recipeId = this.state.dynamicDetail.followRecipes.recipeId
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId
        })
    }

    handleConcernClick() {
        let writer = this.state.writer;
        let user = this.props.userList;
        let type;
        if (writer.concern) {
            type = 'delete';
            writer.fanList.forEach((item, i) => {
                if (item === user._id) {
                    writer.fanList.splice(i, 1);
                    i--;
                    return;
                }
            })
            user.concernList.forEach((item, i) => {
                if (item === writer._id) {
                    user.concernList.splice(i, 1);
                    i--;
                    return;
                }
            })
        } else {
            type = 'add';
            writer.fanList.push(user._id);
            if (user.concernList) {
                user.concernList.push(writer._id);
            } else {
                user.concernList = [writer._id];
            }
        }

        addConcernUser({
            writerId: writer._id, 
            userId: user._id,
            concernList: user.concernList,
            fanList: writer.fanList,
            type
        }).then(res => {
            if (res.data.code === 200) {
                this.props.saveUserList(user);
                writer.concern = !writer.concern
                this.setState({
                    writer: writer
                })
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    handleLikeClick(dynamicId, like) {
        console.log('userList', this.props.userList);

        let user = this.props.userList;
        let newLikeNumber = this.state.dynamicDetail.likeNumber;
        let newLikeList = this.state.dynamicDetail.likeList;
        let type;
        let writerId = this.state.dynamicDetail.userId;

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
            type,
            writerId
        }).then(() => {
            var newDynamicDetail = this.state.dynamicDetail;
            newDynamicDetail.likeNumber = newLikeNumber;
            newDynamicDetail.likeList = newLikeList;
            newDynamicDetail.like = like === UNLIKE ? LIKE : UNLIKE;
            this.setState({
              dynamicDetail: newDynamicDetail
            })
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    getDynamicDetail() {
      getDynamicDetail({
            id: this.props.match.params.id
        }).then(res => {
            if (res.data.code === 200) {
                let dynamicDetail = res.data.data;

                if (!dynamicDetail.likeNumber) {
                  dynamicDetail.likeNumber = 0;
                }
                if (!dynamicDetail.likeList) {
                    dynamicDetail.likeList = [];
                  }
                if (this.props.userList.likeDynamic instanceof Array) {
                    if (this.props.userList.likeDynamic.length !== 0) {
                        this.props.userList.likeDynamic.forEach(val => {
                            if (val === dynamicDetail._id) {
                              dynamicDetail.like = LIKE
                            } else {
                              dynamicDetail.like = UNLIKE
                            }
                        })
                    } else {
                      dynamicDetail.like = UNLIKE
                    }
                } else {
                  dynamicDetail.like = UNLIKE
                }

                this.setState({
                  dynamicDetail: dynamicDetail
                })
                this.getUserInfo(dynamicDetail.userId);
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    getUserInfo(userId) {
        getUserInfo({userId: userId}).then(res => {
            let writer = res.data.data[0];

            var user = this.props.userList;
            if (writer.fanList instanceof Array) {
                if (writer.fanList.length !== 0) {
                    writer.fanList.forEach(item => {
                        if (item === user._id) {
                            writer.concern = true;
                        } else {
                            writer.concern = false;
                        }
                    })
                } else {
                    writer.concern = false;
                }
            } else {
                writer.concern = false;
                writer.fanList = [];
            }
            this.setState({
              writer: writer
            })
            console.log('writer', writer);
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    sendComment() {
        if (this.state.commentInput) {
            let placeholder = this.state.placeholder;
            let comment = {
                userId: this.props.userList._id,
                dynamicId: this.state.dynamicDetail._id,
                content: this.state.commentInput,
                writerId: this.state.writer._id
            }

            if (placeholder.substring(0, 2) === '回复') {
                comment.replyId = this.state.dynamicCommentList[this.state.select]._id
            }
            sendComment({comment}).then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        commentInput: ''
                    })
                    // this.getDynamicComment();
                }
                // 如果没有replyId，就发消息给该菜谱的作者 ，如果有就发给这条评论的作者
                let commentInform = {
                    userId: comment.replyId ? this.state.dynamicCommentList[this.state.select].userId : comment.writerId,
                    writerId: this.props.userList._id,
                    commentId: res.data.data._id
                }
                return addCommentInform({commentInform})
            }).then(res => {
                if (res.data.code === 200) {
                    this.getDynamicComment();
                }
            }).catch(err => {
                console.log('err', err);
                Toast.fail('未知错误', 1);
            })
        } else {
            Toast.info('评论内容不能为空', 1)
        }

    }

    getDynamicComment() {
        getDynamicComment({dynamicId: this.props.match.params.id}).then(res => {
            if (res.data.code === 200) {
                let dynamicComment = res.data.data;
                let dynamicCommentList = [];
                // console.log('getDynamicComment', dynamicComment);

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
                }).then(() => {
                    dynamicComment.forEach(item => {
                        // 回复 与 回复楼中楼
                        if (item.replyId) {
                            let index = dynamicCommentList.findIndex((val) => {
                                return val._id === item.replyId
                            })
                            if (dynamicCommentList[index].reply) {
                                dynamicCommentList[index].reply.push(item);
                            } else {
                                dynamicCommentList[index].reply = [item];
                            }
                        } else {
                            dynamicCommentList.push(item);
                        }
                    })
                    this.setState({
                        dynamicCommentList: dynamicCommentList,
                        commentNumber: dynamicComment.length ? dynamicComment.length : 0
                    })
                    // console.log('update dynamicCommentList', dynamicCommentList)
                }).catch(function (err) {
                    console.log('err'. err)
                })
            }
        })
    }

    componentDidMount() {
        this.getDynamicDetail();
        this.getDynamicComment();

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
      userList: state.getIn(['center', 'userList'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      saveUserList(information) {
          dispatch(centerActionCreators.saveUserList(information));
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DynamicDetail);