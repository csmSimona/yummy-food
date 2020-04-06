import React, { Component } from 'react';
import Header from '@/components/header';
import { getRecipesDetail, addCollectRecipes } from '@/api/recipesApi';
import { getUserInfo, addConcernUser } from '@/api/userApi';
import { RecipesDetailWrapper, Border, SelectIcon } from './style';
import formatDate from '@/utils/formatDate';
import { Toast, Button, Modal } from 'antd-mobile';
// import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '@/views/center/store';

const selectIcon = ['&#xe738;', '&#xe666;', '&#xe606;', '&#xe633;'];
const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';

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
    constructor(props) {
        super(props);
        this.state = { 
            showBigModal: false,
            showBigUrl: '',
            recipesDetail: {},
            writer: {}
        }
        this.handleCollectionClick = this.handleCollectionClick.bind(this);
        this.handleConcernClick = this.handleConcernClick.bind(this);
        this.followRecipe = this.followRecipe.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    render() { 
        let {recipesDetail, writer} = this.state;
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: recipesDetail.recipeName,
            right: ''
        };
        const AlbumPhoto = <img 
            className='album' 
            src={recipesDetail.album ? require('@/' + recipesDetail.album[0].url) : require('@/statics/img/title.png')} 
            alt="" 
            onClick={() => {
                this.setState({
                    showBigModal: true,
                    showBigUrl: require('@/' + recipesDetail.album[0].url)
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
                    <Modal
                        visible={this.state.showBigModal}
                        transparent
                        maskClosable={true}
                        onClose={this.onClose('showBigModal')}
                        title="查看图片"
                        footer={[{ text: '关闭', onPress: () => { this.onClose('showBigModal')(); } }]}
                        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    >
                        <img src={this.state.showBigUrl} alt="查看图片" width="100%" height="100%" />
                    </Modal>
                    <p className='recipeName'>{recipesDetail.recipeName}</p>
                    <p className='createDate'>
                        {formatDate(recipesDetail.createDate)}
                        {recipesDetail.collectionNumber !== 0 ? ` · ${recipesDetail.collectionNumber} 收藏` : ''}
                        {recipesDetail.followNumber !== 0 ? ` · ${recipesDetail.followNumber} 跟做` : ''}
                    </p>
                    <div className='writer'>
                        <img 
                            className='avatar' 
                            src={writer.img ? require('@/' + writer.img[0].url) : ''} 
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
                    <div className='select'>
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
                    <Border/>
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
                                        <img 
                                            className='album' 
                                            src={require('@/' + item.img[0].url)} 
                                            alt=""
                                            onClick={() => {
                                                this.setState({
                                                    showBigModal: true,
                                                    showBigUrl: require('@/' + item.img[0].url)
                                                })
                                            }}/>
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
                    </div>
                    <Border/>
                    <div className='cookSteps'>
                        <p className='subject'>大家做的这道菜</p>
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
                    <div className='fixedIcon'><span className='iconfont'>&#xe648;</span>评论</div>
                </div>
            </RecipesDetailWrapper>
       )
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

    goBack() {
        if (this.props.location.type === 'look') {
            window.history.go(-1);
        } else {
            this.props.history.replace('/tab/release')
        }
    }

    followRecipe() {
        this.props.history.replace({
            pathname: '/createDynamic',
            collectRecipe: this.state.recipesDetail
        })
    }

    handleConcernClick() {
        var writer = this.state.writer;
        var user = this.props.userList;
        if (writer.concern) {
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
            fanList: writer.fanList
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
        console.log('userList', this.props.userList);

        var user = this.props.userList;
        var newCollectionNumber = this.state.recipesDetail.collectionNumber;
        var newCollectionList = this.state.recipesDetail.collectionList;
      
        if (collect === UNCOLLECT) {
            newCollectionNumber++;
            newCollectionList.push(user._id);
            if (user.collectRecipes) {
                user.collectRecipes.push(recipeId);
            } else {
                user.collectRecipes = [recipeId];
            }
        } else {
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
            userId: user._id,
            recipeId: recipeId,
            collectRecipes: user.collectRecipes,
            collectionNumber: newCollectionNumber,
            collectionList: newCollectionList
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
                // console.log(recipesDetail)
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

    componentDidMount() {
        this.getRecipesDetail();
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