import React, { Component } from 'react';
import Header from '@/components/header';
import { getRecipesDetail, addCollectRecipes } from '@/api/recipesApi';
import { getUserInfo, addConcernUser } from '@/api/userApi';
import { RecipesDetailWrapper, Border, SelectIcon } from './style';
import formatDate from '@/utils/formatDate';
import { Toast, Button } from 'antd-mobile';
// import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '@/views/center/store';

const selectIcon = ['&#xe738;', '&#xe666;', '&#xe606;', '&#xe633;'];
const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';

class RecipesDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            recipesDetail: {},
            writer: {}
        }
        this.handleCollectionClick = this.handleCollectionClick.bind(this);
        this.handleConcernClick = this.handleConcernClick.bind(this);
    }

    render() { 
        let {recipesDetail, writer} = this.state;
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: recipesDetail.recipeName,
            right: ''
        };
       return (
            <RecipesDetailWrapper>
                <div className='recipesDetailContent'>
                    <Header header={header}></Header>
                    {/* <LazyLoad height={200}> */}
                        {/* <img className='album' src={recipesDetail.album ? require('@/' + recipesDetail.album[0].url) : require('@/statics/img/title.png')} alt=""/> */}
                        <img className='album' src={recipesDetail.album ? recipesDetail.album[0].url : require('@/statics/img/title.png')} alt=""/>
                    {/* </LazyLoad> */}
                    <p className='recipeName'>{recipesDetail.recipeName}</p>
                    <p className='createDate'>
                        {formatDate(recipesDetail.createDate)}
                        {recipesDetail.collectionNumber !== 0 ? ` · ${recipesDetail.collectionNumber} 收藏` : ''}
                        {recipesDetail.followNumber !== 0 ? ` · ${recipesDetail.followNumber} 跟做` : ''}
                    </p>
                    <div className='writer'>
                        <img className='avatar' src={writer.img ? require('@/' + writer.img[0].url) : require('@/statics/img/title.png')} alt=""/>
                        <div className='writerName'>
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
                                        {/* <img className='album' src={require('@/' + item.img[0].url)} alt=""/> */}
                                        <img className='album' src={item.img[0].url} alt=""/>
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
                    <div className='fixedIcon'><span className='iconfont'>&#xe778;</span>传作品</div>
                    <div className='fixedIcon'><span className='iconfont'>&#xe648;</span>评论</div>
                </div>
            </RecipesDetailWrapper>
       )
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
      
        if (collect === UNCOLLECT) {
            newCollectionNumber++;
            if (user.collectRecipes) {
                user.collectRecipes.push(recipeId);
            } else {
                user.collectRecipes = [recipeId];
            }
        } else {
            newCollectionNumber--;
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
            collectionNumber: newCollectionNumber
        }).then(() => {
            var newRecipesDetail = this.state.recipesDetail;
            newRecipesDetail.collectionNumber = newCollectionNumber;
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
                if (!recipesDetail.collectionNumber) {
                    recipesDetail.collectionNumber = 0;
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
            console.log('writer', writer);
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