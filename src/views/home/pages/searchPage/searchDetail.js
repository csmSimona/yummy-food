import React, { Component } from 'react';
import { HeaderFix, Border, IconFont, SearchRecipesListWrapper, BlankWrapper, Ingredient } from './style';
import { SearchBar, ActivityIndicator, Toast, Tabs } from 'antd-mobile';
import { searchRecipes, getIngredient } from '@/api/searchApi';
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
          ingredient: {}
        }
        this.getSearchDetail = this.getSearchDetail.bind(this);
        this.getIngredientDetail = this.getIngredientDetail.bind(this);
    }
    render() { 
        let { searchRecipesList, ingredient } = this.state;
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
                            { item.videoUrl ? 
                                <video 
                                    onClick={this.getRecipesDetail(item._id)}
                                    src={item.videoUrl} 
                                    controls="controls" 
                                >
                                    您的浏览器不支持 video 标签。
                                </video> : 
                                <img 
                                    src={require('@/' + item.album[0].url)} 
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
                                    <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)} className='avatar' alt=""/>
                                    <span>{item.userName}</span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </SearchRecipesListWrapper>
        return ( 
            <div style={{ overflow: 'hidden'}}>
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
                {
                    ingredient && 
                    <Ingredient onClick={this.getIngredientDetail}>
                        {ingredient.img && <img src={require('@/' + ingredient.img)} /> }
                        <div className='desc'>
                            <div className='name'>{ingredient.name}</div>
                            <div className='introduce'>{ingredient.introduce}</div>
                        </div>
                    </Ingredient>
                }
                { this.state.searchRecipesList.length === 0 ? Blank : SearchRecipesList }
            </div>
         );
    }

    getIngredientDetail() {
        this.props.history.replace({
            pathname: '/ingredientDetail',
            ingredientDetail: this.state.ingredient
        })
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/center/myRecipes',
          userDetail: userData
        })
    }

    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId,
            searchInput: this.state.searchContent
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
        this.getIngredient();
        this.searchRecipes(0);
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    }

    getIngredient() {
        getIngredient({name: this.state.searchContent}).then(res => {
            if (res.data.code === 200) {
                this.setState({
                    ingredient: res.data.data
                })
            } else {
                Toast.fail('未知错误', 1);
            }
        }).catch(err => {
            console.log('err', err);
        })
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
        this.getIngredient();
        this.searchRecipes(0);

        document.body.addEventListener('keyup', (e) => {
            if (window.event) {
                e = window.event
            }
            let code = e.charCode || e.keyCode;
            if (code === 13) {
                this.getIngredient();
                this.searchRecipes(0);
            }
        })
    }

    componentWillMount() {
        document.body.removeEventListener('keyup', () => {})
    }
}
 
export default SearchDetail;