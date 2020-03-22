import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionCreators } from './store';

class Center extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>个人中心页
                {/* <Link to='/personInfo'>设置</Link> */}
                <div>{localStorage.getItem('user_name')}</div>
                <div>{console.log('userList', this.props.userList)}</div>
            </div>
        );
    }
    componentDidMount() {
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Center);