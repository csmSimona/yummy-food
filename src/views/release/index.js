import React, { Component } from 'react';
import {  Slogan, ReleaseMenu, create } from './style';
import { Link } from 'react-router-dom';

class Release extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };

    // this.cancelLogin = this.cancelLogin.bind(this);
  }

  render() {
    return (
      <div style={{position: 'relative'}}>
          <Slogan>分享的人是厨房里的天使</Slogan>
          <ReleaseMenu>
            <div className='releaseButton'>
              <Link to='/createRecipes'>
                <img src={require('../../statics/img/创建菜谱.png')} style={create} alt="创建菜谱" ></img>
              </Link>
              <div>传菜谱</div>
            </div>
            <div className='releaseButton'>
              <Link to='/createDynamic'>
                <img src={require('../../statics/img/创建动态.png')} style={create} alt="创建动态" ></img>
              </Link>
              <div>晒美食</div>
            </div>
          </ReleaseMenu>
        {/* <Cancel onClick={this.cancelLogin}>取消</Cancel> */}
      </div>
    );
  }
//   cancelLogin() {
//     this.props.history.push({
//         pathname: '/tab/home/recommend',
//         selectedTab: 'home'
//     })
//   }
}

export default Release;
