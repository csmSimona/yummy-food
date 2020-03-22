import React, { Component } from 'react';
import { IconFont, HeaderFix, Border, HomeWrapper, PageWrapper } from './style';
import { SearchBar, Tabs } from 'antd-mobile';
import { renderRoutes } from 'react-router-config';

const tabs = [
  {
    title: '关注',
    path: '/tab/home/concern'
  },
  { 
    title: '推荐',
    path: '/tab/home/recommend'
  },
  { 
    title: '发现',
    path: '/tab/home/find'
  },
];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          route: props.route
        };
        this.onMenuClick = this.onMenuClick.bind(this);
    }
    render() { 
        return ( 
        <HomeWrapper>
            <div style={{position: 'fixed', top: '0', width: '100%', zIndex: '999'}}>
              <HeaderFix>
                <IconFont className="iconfont" onClick={this.onMenuClick}>&#xe62f;</IconFont>
                <SearchBar placeholder="搜索菜谱、食材"/>
              </HeaderFix>
              <Border></Border>
              <Tabs tabs={tabs}
                initialPage={1}
                style={{fontWeight: 'bold'}}
                onTabClick={tab => { 
                  this.props.history.replace(tab.path)
                }}
              />
            </div>
            <PageWrapper>
              {renderRoutes(this.state.route.children)}
            </PageWrapper>
        </HomeWrapper>
        );
    }
    onMenuClick() {
        this.props.history.replace('/menuClass')
    }
}
 
export default Home;