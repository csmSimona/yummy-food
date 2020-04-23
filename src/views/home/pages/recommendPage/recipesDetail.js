import React, { Component } from 'react';
import Header from '@/components/header';
import { getRecipesDetail, addCollectRecipes } from '@/api/recipesApi';
import { sendComment, getRecipeComment, deleteComment, addCommentInform } from '@/api/informApi';
import { getDynamicById, addLikeDynamic } from '@/api/dynamicApi';
import { getUserInfo, addConcernUser } from '@/api/userApi';
import { RecipesDetailWrapper, Border, SelectIcon, CollectionIcon, Input, SelectContent } from './style';
import formatDate from '@/utils/formatDate';
import formatTime from '@/utils/formatTime';
import { Toast, Button, Modal } from 'antd-mobile';
import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { CSSTransition } from 'react-transition-group';

const selectIcon = ['&#xe738;', '&#xe666;', '&#xe606;', '&#xe633;'];
const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';
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

class RecipesDetail extends Component {
    longPressInterval = 600;     //longPressInterval长按的毫秒数
    longPressItemTimeOut;      //setTimeOut的返回值    为了清掉定时器
    constructor(props) {
        super(props);
        this.state = { 
            showBigModal: false,
            showBigUrl: '',
            recipesDetail: {},
            writer: {},
            followDynamicList: [],
            commentInput: '',
            recipeCommentList: [],
            modal: false,
            select: null,
            placeholder: "评论",
            send: false,
            commentNumber: 0
        }
        this.handleCollectionClick = this.handleCollectionClick.bind(this);
        this.handleConcernClick = this.handleConcernClick.bind(this);
        this.followRecipe = this.followRecipe.bind(this);
        this.goBack = this.goBack.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    render() { 
        let {recipesDetail, writer, followDynamicList, recipeCommentList} = this.state;
        let userList = this.props.userList;
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: recipesDetail.recipeName,
            right: ''
        };
        const AlbumPhoto = <img 
            className='album' 
            src={recipesDetail.album ? recipesDetail.album[0].url.substring(0, 4) === 'http' ? recipesDetail.album[0].url : require('@/' + recipesDetail.album[0].url) : require('@/statics/img/blank.jpeg')} 
            alt="" 
            onClick={() => {
                this.setState({
                    showBigModal: true,
                    showBigUrl: recipesDetail.album[0].url.substring(0, 4) === 'http' ? recipesDetail.album[0].url : require('@/' + recipesDetail.album[0].url)
                })
            }}/>
        const AlbumVideo = <video src={recipesDetail.videoUrl} controls="controls" width='100%'>
            您的浏览器不支持 video 标签。
        </video>
        return (
            <RecipesDetailWrapper>
                <div className='recipesDetailContent'>
                    <Header header={header} leftClick={this.goBack}></Header>
                    { recipesDetail.videoUrl ? AlbumVideo : AlbumPhoto }
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
                    <CSSTransition 
                        in={this.state.showBigModal}
                        timeout={200}
                        classNames='slide'
                        appear={true}
                    >
                        <div className='showBig' style={{display: this.state.showBigModal ? 'block' : 'none'}} onClick={() => {this.setState({showBigModal: false})}}>
                            <img src={this.state.showBigUrl} alt="查看图片" width="100%" />
                        </div>
                    </CSSTransition>
                    <p className='recipeName'>{recipesDetail.recipeName}</p>
                    <p className='createDate'>
                        {formatDate(recipesDetail.createDate)}
                        {recipesDetail.collectionNumber !== 0 ? ` · ${recipesDetail.collectionNumber} 收藏` : ''}
                        {recipesDetail.followNumber !== 0 ? ` · ${recipesDetail.followNumber} 跟做` : ''}
                    </p>
                    <div className='writer'>
                        <img 
                            className='avatar' 
                            src={writer.img ? writer.img[0].url.substring(0, 4) === 'http' ? writer.img[0].url : require('@/' + writer.img[0].url) : ''} 
                            alt=""
                            onClick={() => this.gotoUserDetail(writer)} />
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
                    <Border/>
                    <div className='select' style={{display: recipesDetail.selected ? 'flex' : 'none'}}>
                        {
                            recipesDetail.selected && recipesDetail.selected.map((item, index) => {
                                if (item.substring(0, 1) === '请') {
                                    return ''
                                } else {
                                    return (
                                        <div key={index} className='icon'>
                                            <SelectIcon 
                                                className="iconfont"
                                                dangerouslySetInnerHTML={{__html: selectIcon[index]}}
                                            />
                                            <span>{item}</span>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <Border style={{display: recipesDetail.selected ? 'block' : 'none'}}/>
                    <p className='story'>{recipesDetail.recipeStory}</p>
                    <Border/>
                    <div className='materials'>
                        <p className='subject'>用料</p>
                        {
                            recipesDetail.materials && recipesDetail.materials.map((item, index) => {
                                return (
                                    <div key={index} className='materialItem'>
                                        <div>{item.ingredients}</div>
                                        <div>{item.quantities}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Border/>
                    <div className='cookSteps'>
                        <p className='subject'>烹饪步骤</p>
                        {
                            recipesDetail.cookSteps && recipesDetail.cookSteps.map((item, index) => {
                                return (
                                    <div key={index} className='stepItem'>
                                        <div className='stepNumber'>步骤{index+1}</div>
                                        <LazyLoad offset={100}>
                                            <img 
                                                className='album' 
                                                src={item.img[0].url.substring(0, 4) === 'http' ? item.img[0].url : require('@/' + item.img[0].url)} 
                                                alt=""
                                                onClick={() => {
                                                    this.setState({
                                                        showBigModal: true,
                                                        showBigUrl: item.img[0].url.substring(0, 4) === 'http' ? item.img[0].url : require('@/' + item.img[0].url)
                                                    })
                                                }}/>
                                        </LazyLoad>
                                        <div className='stepDesc'>{item.step}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Border/>
                    <div className='cookSteps' style={{display: recipesDetail.recipeTips ? 'block' : 'none'}}>
                        <p className='subject'>小贴士</p>
                        <p className='tips'>{recipesDetail.recipeTips}</p>
                    </div>
                    <Border/>
                    <div className='cookSteps'>
                        <p className='subject'>对这道菜的评论</p>
                        {
                            recipeCommentList && recipeCommentList.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className='comment'>
                                            <img className='avatar' src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)} onClick={() => this.gotoUserDetail(item.writer)}/>
                                            <div className='user' onTouchStart={() => this.onItemTouchStart(index)} onTouchEnd={this.onItemTouchEnd}>
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
                          <img className='avatar' src={userList.img ? userList.img[0].url.substring(0, 4) === 'http' ? userList.img[0].url : require('@/' + userList.img[0].url) : require('@/statics/img/blank.jpeg')} alt=""/>
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
                    <div className='cookSteps' style={{display: recipesDetail.followNumber ? 'block' : 'none'}}>
                        <p className='subject'>大家做的这道菜</p>
                        <div className='followDynamic'>
                            {
                                followDynamicList && followDynamicList.map((item, index) => {
                                    return (
                                        <div className='dynamic' key={index}>
                                            <img src={require('@/' + item.imgs[0].url)} onClick={this.getFollowDynamicDetail(item._id)} alt="" />
                                            <div className='title' onClick={this.getFollowDynamicDetail(item._id)} >{item.dynamicName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)}  className='avatar' alt="" onClick={() => this.gotoUserDetail(item.writer)}/>
                                                    <span className='userName' onClick={() => this.gotoUserDetail(item.writer)}>{item.userName}</span>
                                                </div>
                                                <div className='collection'>
                                                    <CollectionIcon 
                                                        className="iconfont" 
                                                        onClick={this.handleLikeClick(item._id, index, item.like)}
                                                        dangerouslySetInnerHTML={{__html: item.like}} 
                                                        style={{
                                                            color: item.like === UNLIKE ? '#888888' : '#FB6650'
                                                        }} 
                                                    />
                                                    <span>{item.likeNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='fixedFooter'>
                    <div 
                        className='fixedIcon' 
                        onClick={() => this.handleCollectionClick(recipesDetail._id, recipesDetail.collect)}
                        style={{
                            color: recipesDetail.collect === UNCOLLECT ? '#000000' : '#FB6650'
                        }}
                    >
                        <span 
                            className='iconfont'
                            dangerouslySetInnerHTML={{__html: recipesDetail.collect}} 
                            style={{
                                color: recipesDetail.collect === UNCOLLECT ? '#000000' : '#FB6650'
                            }}
                        />{recipesDetail.collectionNumber === 0 ? '收藏' : recipesDetail.collectionNumber}
                    </div>
                    <div className='fixedIcon' onClick={this.followRecipe}><span className='iconfont'>&#xe778;</span>传作品</div>
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
        let commentId = this.state.recipeCommentList[this.state.select]._id;
        deleteComment({commentId}).then(res => {
            if (res.data.code === 200) {
                Toast.success('删除成功', 1);
                this.setState({
                    modal: false
                })
                this.getRecipeComment();
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
        let comment = this.state.recipeCommentList[this.state.select];
        this.setState({
          placeholder: `回复${comment.userName}`,
          send: true
        })
    }
      
    handleLikeClick = (dynamicId, index, like) => () => {
        let userInfo = this.props.userList;
        let newLikeNumber = this.state.followDynamicList[index].likeNumber;
        let newLikeList = this.state.followDynamicList[index].likeList;
        let type;
        let writerId = this.state.followDynamicList[index].userId;

        if (like === UNLIKE) {
            type = 'add';
            newLikeNumber++;
            newLikeList.push(userInfo._id);
            if (userInfo.likeDynamic) {
                userInfo.likeDynamic.push(dynamicId);
            } else {
                userInfo.likeDynamic = [dynamicId];
            }
        } else {
            type = 'delete';
            newLikeNumber--;
            newLikeList.forEach((item, i) => {
                if (item === userInfo._id) {
                    newLikeList.splice(i, 1);
                    i--;
                }
            })
            userInfo.likeDynamic.forEach((item, i) => {
                if (item === dynamicId) {
                    userInfo.likeDynamic.splice(i, 1);
                    i--;
                }
            })
        }
        
        this.props.saveUserList(userInfo);
        
        addLikeDynamic({
            userId: userInfo._id,
            dynamicId: dynamicId,
            likeDynamic: userInfo.likeDynamic,
            likeNumber: newLikeNumber,
            likeList: newLikeList,
            type,
            writerId
        }).then(res => {
            let newData = this.state.followDynamicList;
            newData[index].likeNumber = newLikeNumber;
            newData[index].likeList = newLikeList;
            newData[index].like = like === UNLIKE ? LIKE : UNLIKE;
            this.setState({
                followDynamicList: newData
            })
        })
    }
    
    getFollowDynamicDetail = (dynamicId) => () => {
        this.props.history.push({
            pathname: '/dynamicDetail/' + dynamicId
        })
    }
    
    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/center/myRecipes',
          userDetail: userData
        })
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

    goBack() {
        if (this.props.location.type === 'create') {
            this.props.history.replace('/tab/release')
        } else if (this.props.location.type === 'situation') {
            this.props.history.replace('/tab/information')
        } else if (this.props.location.searchInput) {
            this.props.history.replace({
                pathname: '/searchDetail',
                searchInput: this.props.location.searchInput
            })
        } else {
            window.history.go(-1);
        }
    }

    followRecipe() {
        this.props.history.replace({
            pathname: '/createDynamic',
            collectRecipe: this.state.recipesDetail
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
            type: type
        }).then(res => {
            // console.log('res.data', res.data)
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

    handleCollectionClick(recipeId, collect) {
        let user = this.props.userList;
        let newCollectionNumber = this.state.recipesDetail.collectionNumber;
        let newCollectionList = this.state.recipesDetail.collectionList;
        let type;
      
        if (collect === UNCOLLECT) {
            type = 'add';
            newCollectionNumber++;
            newCollectionList.push(user._id);
            if (user.collectRecipes) {
                user.collectRecipes.push(recipeId);
            } else {
                user.collectRecipes = [recipeId];
            }
        } else {
            type = 'delete';
            newCollectionNumber--;
            newCollectionList.forEach((item, i) => {
                if (item === user._id) {
                    newCollectionList.splice(i, 1);
                    i--;
                }
            })
            user.collectRecipes.forEach((item, i) => {
                if (item === recipeId) {
                    user.collectRecipes.splice(i, 1);
                    i--;
                }
            })
        }
        this.props.saveUserList(user);

        addCollectRecipes({
            writerId: this.state.recipesDetail.userId,
            userId: user._id,
            recipeId: recipeId,
            collectRecipes: user.collectRecipes,
            collectionNumber: newCollectionNumber,
            collectionList: newCollectionList,
            type
        }).then(() => {
            var newRecipesDetail = this.state.recipesDetail;
            newRecipesDetail.collectionNumber = newCollectionNumber;
            newRecipesDetail.collectionList = newCollectionList;
            newRecipesDetail.collect = collect === UNCOLLECT ? COLLECTED : UNCOLLECT;
            this.setState({
                recipesDetail: newRecipesDetail
            })
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    getDynamicById(idList) {
        let actionArr = [];
        let action = [];
        let followDynamicList = [];
        let userInfo = this.props.userList;
        idList.forEach(item => {
            actionArr.push(getDynamicById({id: item}))
        })
        Promise.all(actionArr).then(function (res) {
            for (var i = 0; i < res.length; i++) {
                let followDynamicDetail = res[i].data.data;
                if (!followDynamicDetail.likeNumber) {
                    followDynamicDetail.likeNumber = 0;
                }
                if (!followDynamicDetail.likeList) {
                    followDynamicDetail.likeList = [];
                }
                if (userInfo.likeDynamic instanceof Array) {
                    if (userInfo.likeDynamic.length !== 0) {
                        var liked = userInfo.likeDynamic.some(val => {
                            if (val === followDynamicDetail._id) {
                                return true
                            }
                        })
                        if (liked) {
                            followDynamicDetail.like = LIKE
                        } else {
                            followDynamicDetail.like = UNLIKE
                        }
                    } else {
                        followDynamicDetail.like = UNLIKE
                    }
                } else {
                    followDynamicDetail.like = UNLIKE
                }
                action.push(getUserInfo({userId: followDynamicDetail.userId}))
                followDynamicList.push(followDynamicDetail);
            }
        }).then(() => {
            Promise.all(action).then(res => {
                for (var i = 0; i < res.length; i++) {
                    var userData = res[i].data.data[0];
                    followDynamicList[i].writer = userData;
                    followDynamicList[i].userName = userData.name;
                    followDynamicList[i].avatar = userData.img[0].url;
                }
            }).then(() => {
                this.setState({
                    followDynamicList: followDynamicList
                })
            })
        }).catch(function (err) {
            console.log('err',err);
            Toast.fail('未知错误', 1);
        })
    }

    getRecipesDetail() {
        getRecipesDetail({
            id: this.props.match.params.id
        }).then(res => {
            if (res.data.code === 200) {
                let recipesDetail = res.data.data;
                if (recipesDetail.album[0].url.substring(0, 13) === 'statics/video') {
                    recipesDetail.videoUrl = require('@/' + recipesDetail.album[0].url)
                }
                if (!recipesDetail.collectionNumber) {
                    recipesDetail.collectionNumber = 0;
                }
                if (!recipesDetail.collectionList) {
                    recipesDetail.collectionList = [];
                }
                if (!recipesDetail.followNumber) {
                    recipesDetail.followNumber = 0;
                }
                let selected = recipesDetail.selected.every((item) => {
                    if (item.substring(0, 1) === '请') {
                        return true
                    } else {
                        return false
                    }
                })
                if (selected) {
                    delete recipesDetail.selected
                }
                if (this.props.userList.collectRecipes instanceof Array) {
                    if (this.props.userList.collectRecipes.length !== 0) {
                        this.props.userList.collectRecipes.forEach(val => {
                            if (val === recipesDetail._id) {
                                recipesDetail.collect = COLLECTED
                            } else {
                                recipesDetail.collect = UNCOLLECT
                            }
                        })
                    } else {
                        recipesDetail.collect = UNCOLLECT
                    }
                } else {
                    recipesDetail.collect = UNCOLLECT
                }
                this.setState({
                    recipesDetail: recipesDetail
                })
                this.getUserInfo(recipesDetail.userId);
                if (recipesDetail.followNumber) {                
                    this.getDynamicById(recipesDetail.followList);
                }
                console.log(recipesDetail);
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
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    sendComment() {
        if (this.state.commentInput) {
            let placeholder = this.state.placeholder;
            let comment = {
                userId: this.props.userList._id,
                recipeId: this.state.recipesDetail._id,
                content: this.state.commentInput,
                writerId: this.state.writer._id
            }

            if (placeholder.substring(0, 2) === '回复') {
                comment.replyId = this.state.recipeCommentList[this.state.select]._id;
            }
            sendComment({comment}).then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        commentInput: ''
                    })
                    // this.getRecipeComment();
                }

                // 如果没有replyId，就发消息给该菜谱的作者 ，如果有就发给这条评论的作者
                let commentInform = {
                    userId: comment.replyId ? this.state.recipeCommentList[this.state.select].userId : comment.writerId,
                    writerId: this.props.userList._id,
                    commentId: res.data.data._id
                }

                return addCommentInform({commentInform})
            }).then(res => {
                if (res.data.code === 200) {
                    this.getRecipeComment();
                }
            }).catch(err => {
                console.log('err', err);
                Toast.fail('未知错误', 1);
            })
        } else {
            Toast.info('评论内容不能为空', 1)
        }

    }

    getRecipeComment() {
        getRecipeComment({recipeId: this.props.match.params.id}).then(res => {
            if (res.data.code === 200) {
                let recipeComment = res.data.data;
                let recipeCommentList = [];
                // console.log('getRecipeComment', recipeComment);

                let actionArr = [];
                if (recipeComment.length !== 0) {
                    recipeComment.forEach(item => {
                        actionArr.push(getUserInfo({userId: item.userId}));
                    })
                }
                Promise.all(actionArr).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        recipeComment[i].writer = userData;
                        recipeComment[i].userName = userData.name;
                        recipeComment[i].avatar = userData.img[0].url;
                    }
                }).then(() => {
                    recipeComment.forEach(item => {
                        // 回复 与 回复楼中楼
                        if (item.replyId) {
                            let index = recipeCommentList.findIndex((val) => {
                                return val._id === item.replyId
                            })
                            if (recipeCommentList[index].reply) {
                                recipeCommentList[index].reply.push(item);
                            } else {
                                recipeCommentList[index].reply = [item];
                            }
                        } else {
                            recipeCommentList.push(item);
                        }
                    })
                    this.setState({
                        recipeCommentList: recipeCommentList,
                        commentNumber: recipeComment.length ? recipeComment.length : 0
                    })
                    // console.log('update RecipeComment', recipeCommentList)
                }).catch(function (err) {
                    console.log('err'. err)
                })
            }
        })
    }

    componentDidMount() {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        
        this.getRecipesDetail();
        this.getRecipeComment();
    
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

export default connect(mapStateToProps, mapDispatchToProps)(RecipesDetail);