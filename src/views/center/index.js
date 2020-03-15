import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Center extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <Link to='/personInfo'>设置</Link>
            </div>
        );
    }
    // componentDidMount() {
    //     this.props.history.push('/login')
    // }
}
 
export default Center;