import React, { Component } from 'react';
import { ShowBigWrapper } from './style';

class ShowBigPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <ShowBigWrapper style={{display: this.state.showBigModal ? 'block' : 'none'}} onClick={() => {this.setState({showBigModal: false})}}>
                <img src={this.state.showBigUrl} alt="查看图片" width="100%" />
            </ShowBigWrapper>
        );
    }
}
 
export default ShowBigPhoto;