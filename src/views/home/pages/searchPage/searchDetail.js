import React, { Component } from 'react';
import { HeaderFix, Border, IconFont, SearchRecipesListWrapper, BlankWrapper } from './style';
import { SearchBar, ActivityIndicator, Toast, Tabs } from 'antd-mobile';
import { searchRecipes } from '@/api/searchApi';
import { getUserInfo } from '@/api/userApi';
import { finishLoading } from '@/utils/loading';

const tabs = [
    {
      title: '智能排序',
      path: '/searchDetail',
      id: 0
    },
    { 
      title: '跟做最多',
      path: '/searchDetail',
      id: 1
    },
    { 
      title: '收藏最多',
      path: '/searchDetail',
      id: 2
    },
    { 
      title: '视频菜谱',
      path: '/searchDetail',
      id: 3
    }
];

class SearchDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          searchContent: this.props.location.searchInput ? this.props.location.searchInput : '',
          searchRecipesList: [],
          animating: true,
        }
        this.getSearchDetail = this.getSearchDetail.bind(this);
    }
    render() { 
        let { searchRecipesList } = this.state;
        const Blank = <BlankWrapper>
            <p>没有你想找的这道菜</p>
            <p className='create' onClick={() => {
                this.props.history.replace('/tab/home/recommend');
            }}>去别的地方看看吧</p>
        </BlankWrapper>
        const SearchRecipesList = <SearchRecipesListWrapper>
            {
                searchRecipesList && searchRecipesList.map((item, index) => {
                    return (
                        <div className='recipesListContent' key={index}>
                            {/* <img src={require('@/' + item.album[0].url)} className='album' key={index} onClick={this.getRecipesDetail(item._id)} alt=""/> */}

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
                            <div className='center'>
                                <div className='recipeName' onClick={this.getRecipesDetail(item._id)} >{item.recipeName}</div>
                                <div className='desc'>
                                    <span>{item.collectionNumber === 0 ? '' : `${item.collectionNumber} 人收藏`} </span>
                                    <span> {item.followNumber === 0 ? '' : `${item.followNumber} 人跟做`}</span>
                                </div>
                                <div className='writer' onClick={() => this.gotoUserDetail(item.writer)}>
                                    <img src={require('@/' + item.avatar)} className='avatar' alt=""/>
                                    <span>{item.userName}</span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </SearchRecipesListWrapper>
        return ( 
            <div>
                <HeaderFix>
                    <IconFont 
                        className='iconfont back' 
                        onClick={() => {
                        this.props.history.replace('/tab/home/recommend')
                    }}>&#xe61f;</IconFont>
                    <SearchBar 
                        ref={ref => this.searchInput = ref} 
                        placeholder="搜索菜谱、食材"
                        onCancel={() => {
                            this.props.history.replace('/tab/home/recommend')
                        }}
                        cancelText=" "
                        value={this.state.searchContent}
                        onChange={(val) => {
                            this.setState({
                                searchContent: val
                            })
                        }}
                    />
                    <div className='searchButton' onClick={this.getSearchDetail}>搜索</div>
                </HeaderFix>
                <Tabs tabs={tabs}
                    initialPage={0}
                    onTabClick={(tab, index) => { 
                        // console.log('onTabClick', index, tab);
                        this.searchRecipes(index);
                    }}
                />
                <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'600px'}}>
                    <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                </div>
                { this.state.searchRecipesList.length === 0 ? Blank : SearchRecipesList }
            </div>
         );
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/tab/center/myRecipes',
          userDetail: userData
        })
    }

    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId
        })
    }

    getSearchDetail() {
        let val = this.state.searchContent;
        let historySearch = JSON.parse(localStorage.getItem('historySearch'));

        this.props.history.replace({
            pathname: '/searchDetail',
            searchInput: val
        })
        if (historySearch) {
            if (historySearch.indexOf(val) === -1) {
                historySearch.push(val);
            }
        } else {
            historySearch = [val];
        }
        this.searchRecipes(0);
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    }

    searchRecipes(index) {
        searchRecipes({searchContent: this.state.searchContent, type: index}).then(res => {
            if (res.data.code === 200) {
                var searchRecipesList = res.data.data;
                var actionArr = []
                searchRecipesList.forEach(item => {
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
                        searchRecipesList[i].writer = userData;
                        searchRecipesList[i].userName = userData.name;
                        searchRecipesList[i].avatar = userData.img[0].url;
                    }
                }).then(() => {
                    this.setState({
                        searchRecipesList: searchRecipesList
                    })
                    console.log('searchRecipesList', searchRecipesList);
                    finishLoading(this);
                }).catch(function (err) {
                    Toast.fail('未知错误', 1);
                })

            } else {
                Toast.fail('未知错误', 1);
            }
        }).catch(err => {
            console.log('err', err);
        })
    }

    componentDidMount() {
        this.searchRecipes(0);
    }
}
 
export default SearchDetail;