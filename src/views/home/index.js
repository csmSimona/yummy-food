import React, { Component } from 'react';
import { IconFont, HeaderFix, Border, HomeWrapper, PageWrapper } from './style';
import { SearchBar, Tabs } from 'antd-mobile';
import { renderRoutes } from 'react-router-config';

const tabs = [
  {
    title: '关注',
    path: '/tab/home/concern',
    id: 0
  },
  { 
    title: '推荐',
    path: '/tab/home/recommend',
    id: 1
  },
  { 
    title: '发现',
    path: '/tab/home/find',
    id: 2
  },
];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          route: props.route,
          homeTab: 1
        };
        this.onMenuClick = this.onMenuClick.bind(this);
    }
    render() { 
        return ( 
        <HomeWrapper>
            <div style={{position: 'fixed', top: '0', width: '100%', zIndex: '999'}}>
              <HeaderFix>
                <IconFont className="iconfont" onClick={this.onMenuClick}>&#xe62f;</IconFont>
                <SearchBar placeholder="搜索菜谱、食材" onFocus={() => {
                  this.props.history.replace('/search')
                }}/>
              </HeaderFix>
              <Border></Border>
              <Tabs 
                tabs={tabs}
                // initialPage={1}
                page={this.state.homeTab}
                style={{fontWeight: 'bold'}}
                onTabClick={tab => { 
                  this.setState({
                    homeTab: tab.id
                  })
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
    componentDidMount() {
      var pathname = this.props.location.pathname
      if (pathname === '/tab/home/concern') {
        this.setState({
          homeTab: 0
        })
      }
      if (pathname === '/tab/home/recommend') {
        this.setState({
          homeTab: 1
        })
      }
      if (pathname === '/tab/home/find') {
        this.setState({
          homeTab: 2
        })
      }
    }
}
 
export default Home;