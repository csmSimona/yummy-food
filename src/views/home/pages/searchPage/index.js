import React, { Component } from 'react';
import { HeaderFix, Border, IconFont, SearchRecordWrapper } from './style';
import { SearchBar, Tag } from 'antd-mobile';

const hotSearch = ["蛋挞", "蛋糕", "面包", "豆腐", "茄子", "红烧肉", "披萨", "青团", "早餐", "鸡胸肉", "可乐鸡翅", "雪媚娘", "土豆", "手抓饼", "牛奶", "包子", "排骨", "鸡翅", "吐司", "虾"];

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          searchContent: '',
          historySearch: []
        }
        this.getSearchDetail = this.getSearchDetail.bind(this);
        this.clearHistorySearch = this.clearHistorySearch.bind(this);
    }
    render() { 
        let { searchContent, historySearch} = this.state;
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
                        value={searchContent}
                        onChange={(val) => {
                            this.setState({
                                searchContent: val
                            })
                        }}
                    />
                    <div className='searchButton' onClick={this.getSearchDetail(searchContent)}>搜索</div>
                </HeaderFix>
                <Border></Border>
                <SearchRecordWrapper>
                    <div style={{display: historySearch ? 'block' : 'none'}}>
                        <p>最近搜索</p>
                        <span onClick={this.clearHistorySearch}>清空</span>
                        <div className='tagSearch'>
                            {
                                historySearch && historySearch.map((item, index) => {
                                    return (
                                        <Tag key={index} onChange={this.getSearchDetail(item)}>{item}</Tag>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <p>热门搜索</p>
                        <div className='tagSearch'>
                            {
                                hotSearch && hotSearch.map((item, index) => {
                                    return (
                                        <Tag selected key={index} onChange={this.getSearchDetail(item)}>{item}</Tag>
                                    )
                                })
                            }
                        </div>
                    </div>
                </SearchRecordWrapper>
            </div>
         );
    }

    clearHistorySearch() {
        localStorage.removeItem('historySearch');
        this.setState({
            historySearch: undefined
        })
    }

    getSearchDetail = (val) => () => {
        let historySearch = this.state.historySearch;
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
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    }

    componentDidMount() {
        this.searchInput.focus();
        let historySearch = JSON.parse(localStorage.getItem('historySearch'));
        this.setState({
            historySearch
        })
    }
}
 
export default Search;