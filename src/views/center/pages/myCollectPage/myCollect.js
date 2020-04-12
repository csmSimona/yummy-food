import React, { Component } from 'react';
import { BlankWrapper } from '../../style';
import { CollectRecipesListWrapper, SelectContent } from './style';
import { connect } from 'react-redux';
import { actionCreators } from '../../store';
import { actionCreators as tabActionCreators} from '@/views/tabBar/store';
import { Toast, ActivityIndicator, Icon, Modal } from 'antd-mobile';
import { addCollectRecipes, getCollectRecipesList } from '@/api/recipesApi';
import { getUserInfo } from '@/api/userApi';
import { finishLoading } from '@/utils/loading';
import LazyLoad from 'react-lazyload';

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

class MyCollect extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            collectRecipesList: [],
            animating: true,
            modal: false,
            select: 0
        }
        this.showMore = this.showMore.bind(this);
        this.followRecipe = this.followRecipe.bind(this);
        this.cancelCollect = this.cancelCollect.bind(this);
    }
    render() { 
        const CollectRecipesList = <CollectRecipesListWrapper>
            {
                this.state.collectRecipesList.map((item, index) => {
                    return (
                        <div className='recipesListContent' key={index}>
                            <LazyLoad offset={100}>
                                { item.videoUrl ? 
                                    <video 
                                        onClick={this.getRecipesDetail(item._id)}
                                        src={item.videoUrl} 
                                        controls="controls" 
                                        width='40%'
                                    >
                                        您的浏览器不支持 video 标签。
                                    </video> : 
                                    <img 
                                        src={require('@/' + item.album[0].url)} 
                                        className='album'  
                                        key={index} 
                                        onClick={this.getRecipesDetail(item._id)} 
                                        alt=""/> 
                                }
                            </LazyLoad>
                            <div className='center'>
                                <div className='recipeName' onClick={this.getRecipesDetail(item._id)} >{item.recipeName}</div>
                                <div className='desc'>
                                    <span>{item.collectionNumber === 0 ? '' : `${item.collectionNumber} 人收藏`} </span>
                                    <span> {item.followNumber === 0 ? '' : `${item.followNumber} 人跟做`}</span>
                                </div>
                                <div className='writer'>
                                    <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)} className='avatar' alt=""/>
                                    <span>{item.userName}</span>
                                </div>
                            </div>
                            {
                                this.props.location.userDetail ? '' :
                                <div className='right'>
                                    <Icon 
                                        type="ellipsis" 
                                        style={{'transform': 'rotate(90deg)'}}
                                        onClick={this.showModal(index)}
                                    />
                                </div>
                            }
                        </div>
                    )
                })
            }
        </CollectRecipesListWrapper>
        const Blank = this.props.location.userDetail ? 
        <BlankWrapper>
            <p>还未收藏过菜谱</p>
        </BlankWrapper> : 
        <BlankWrapper>
            <p>你好像还未收藏过菜谱</p>
            <p className='create' onClick={() => {
                this.props.history.replace('/tab/home/recommend');
                this.props.saveSelectedTab('home');
            }}>去逛逛菜谱</p>
        </BlankWrapper>
        return ( 
            <div>
                <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'500px'}}>
                    <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                </div>
                { this.state.collectRecipesList.length === 0 ? Blank : CollectRecipesList }
                <Modal
                    visible={this.state.modal}
                    transparent
                    onClose={this.onClose('modal')}
                    title="更多"
                    // footer={[{ text: '取消', onPress: () => { this.onClose('modal')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <div>
                        <SelectContent onClick={this.followRecipe}>上传我做的这道菜</SelectContent>
                        <SelectContent onClick={this.cancelCollect}>取消收藏</SelectContent>
                    </div>
                </Modal>
            </div>
         );
    }

    followRecipe() {
        var index = this.state.select;
        var collectRecipesList = this.state.collectRecipesList;
        this.props.history.replace({
            pathname: '/createDynamic',
            collectRecipe: collectRecipesList[index]
        })
    }

    cancelCollect() {
        var userList = this.props.userList;
        var index = this.state.select;
        var newCollectRecipesList = this.state.collectRecipesList;
        var recipesDetail = newCollectRecipesList[index];

        userList.collectRecipes.splice(index, 1);
        recipesDetail.collectionNumber--;
        recipesDetail.collectionList.forEach((item, index) => {
            if (item === userList._id) {
                recipesDetail.collectionList.splice(index, 1);
                index--;
                return
            }
        })

        addCollectRecipes({
            userId: userList._id,
            recipeId: recipesDetail._id,
            collectRecipes: userList.collectRecipes,
            collectionNumber: recipesDetail.collectionNumber,
            collectionList: recipesDetail.collectionList
        }).then((res) => {
            if (res.data.code === 200) {
            console.log('recipesDetail', recipesDetail)
                newCollectRecipesList.splice(index, 1);
                this.setState({
                    collectRecipesList: newCollectRecipesList,
                    modal: false
                }, () => {
                    console.log('collectRecipesList', this.state.collectRecipesList)
                    Toast.success('取消收藏成功', 1);
                });
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    showMore = (index) => () => {
        console.log('index', index)
        this.setState({
            select: index
        });
        this.showModal('modal');
    }

    showModal = index => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          modal: true,
          select: index
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
    

    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId
        })
    }
    
    getCollectRecipesList() {
        let collectRecipes = [];
        if (this.props.location.userDetail) {
            collectRecipes = this.props.location.userDetail.collectRecipes;
        } else {
            collectRecipes = this.props.userList.collectRecipes;
        }
        getCollectRecipesList({collectRecipes}).then(res => {
            if (res.data.code === 200) {
                var collectRecipesList = res.data.data;
                var actionArr = []
                collectRecipesList.forEach(item => {
                    if (item.album[0].url.substring(0, 13) === 'statics/video') {
                        item.videoUrl = require('@/' + item.album[0].url)
                    }
                    if (!item.followNumber) {
                        item.followNumber = 0;
                    }
                    if (!item.collectionNumber) {
                        item.collectionNumber = 0;
                    }
                    if (!item.collectionList) {
                        item.collectionList = [];
                    }
                    actionArr.push(getUserInfo({userId: item.userId}))
                })

                Promise.all(actionArr).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        collectRecipesList[i].userName = userData.name;
                        collectRecipesList[i].avatar = userData.img[0].url;
                    }
                }).then(() => {
                    this.setState({
                        collectRecipesList: collectRecipesList
                    })
                    console.log('collectRecipesList', collectRecipesList);
                    finishLoading(this)
                }).catch(function (err) {
                    Toast.fail('未知错误', 1);
                })

            } else {
                Toast.fail('未知错误', 1);
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    componentDidMount() {
        // if ((this.props.collectRecipesList instanceof Array) && (this.props.collectRecipesList.length === this.props.userList.collectRecipes.length)) {
        if (this.props.location.userDetail) {
            console.log('myCollect userDetail', this.props.location.userDetail);
            this.getCollectRecipesList();
        } else {
            if (this.props.collectRecipesList instanceof Array) {
                this.setState({
                    collectRecipesList: this.props.collectRecipesList
                })
                finishLoading(this);
            } else {
                this.getCollectRecipesList();
            }
        }
    }
    
    componentWillUnmount() {
        if (!this.props.location.userDetail) {
            let collectRecipesList = this.state.collectRecipesList;
            this.props.saveCollectRecipesList(collectRecipesList);
        }
    }
}


const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        selectedTab: state.getIn(['tab', 'selectedTab']),
        collectRecipesList: state.getIn(['center', 'collectRecipesList'])
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(actionCreators.saveUserList(userList));
        },
        saveSelectedTab(selectedTab) {
            dispatch(tabActionCreators.saveSelectedTab(selectedTab));
        },
        saveCollectRecipesList(collectRecipesList) {
            dispatch(actionCreators.saveCollectRecipesList(collectRecipesList));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCollect);
