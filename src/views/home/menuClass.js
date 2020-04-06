import React, { Component } from 'react';
import Header from '@/components/header';
import { getClassification } from '@/api/searchApi';
import { Drawer, List, Tag } from 'antd-mobile';
import { MenuClassWrapper } from './style';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '菜谱分类',
    right: ''
}

class MenuClass extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            docked: true,
            classificationList: [],
            picked: '',
            pickList: []
        };
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    onDock = (d) => {
        this.setState({
          [d]: !this.state[d],
        });
      }

    render() { 
        const { classificationList, pickList } = this.state;
        const sidebar = (
            <List style={{overflowY: 'hidden'}}>
                {classificationList.map((item, index) => {
                    return (
                    <List.Item key={index} onClick={() => {
                        this.setState({
                            picked: item.name,
                            pickList: item.list
                        })
                    }} className={this.state.picked === item.name ? 'picked' : ''}>{item.name}</List.Item>
                    );
                })}
            </List>);

        return ( 
            <div>
                <Header header={header} leftClick={this.handleBackClick}></Header>
                <MenuClassWrapper>
                    <Drawer
                        className="my-drawer"
                        style={{ minHeight: document.documentElement.clientHeight }}
                        contentStyle={{ marginTop: '3.5rem'}}
                        sidebarStyle={{ marginTop: '3.5rem', background: '#ccc' }}
                        sidebar={sidebar}
                        docked={this.state.docked}
                    >
                        <div className='pickContent'>
                            {
                                pickList && pickList.map((val, i) => {
                                    return (
                                        <Tag key={i} onChange={this.getSearchDetail(val)}>{val.name}</Tag>
                                    )
                                })
                            }
                        </div>
                    </Drawer>
                </MenuClassWrapper>
            </div>
         );
    }

    getSearchDetail = (val) => () => {
        let historySearch = JSON.parse(localStorage.getItem('historySearch'));
        let searchInput = val.name
        this.props.history.replace({
            pathname: '/searchDetail',
            searchInput: searchInput
        })
        if (historySearch) {
            if (historySearch.indexOf(searchInput) === -1) {
                historySearch.push(searchInput);
            }
        } else {
            historySearch = [searchInput];
        }
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    }

    handleBackClick() {
        this.props.history.replace('/tab/home/recommend');
    }
    
    getClassification() {
        getClassification().then(res => {
            if (res.data.code === 200) {
                let classificationList = res.data.data
                this.setState({
                    classificationList: classificationList,
                    picked: classificationList[0].name,
                    pickList: classificationList[0].list
                })
            }
        }).catch((err) => {
            console.log('error', err);
        })
    }
    componentDidMount() {
        this.getClassification();
    }
}
 
export default MenuClass;