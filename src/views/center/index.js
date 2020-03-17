import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Center extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>这是个人中心页
                {/* <Link to='/personInfo'>设置</Link> */}
            </div>
        );
    }
    componentDidMount() {
    }
}
 
export default Center;