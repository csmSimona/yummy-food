import React, { Component } from 'react';
import {  Slogan, ReleaseMenu, create } from './style';
import { Link } from 'react-router-dom';

class Release extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  render() {
    return (
      <div style={{position: 'relative'}}>
          <Slogan>分享的人是厨房里的天使</Slogan>
          <ReleaseMenu>
            <div className='releaseButton'>
              <Link to='/createName'>
                <img src={require('@/statics/img/createrecipes.png')} style={create} alt="创建菜谱" ></img>
              </Link>
              <div>传菜谱</div>
            </div>
            <div className='releaseButton'>
              <Link to='/createDynamic'>
                <img src={require('@/statics/img/createdynamic.png')} style={create} alt="创建动态" ></img>
              </Link>
              <div>晒美食</div>
            </div>
          </ReleaseMenu>
      </div>
    );
  }
}

export default Release;
