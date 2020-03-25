import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import formatDate from '@/utils/formatDate';

class Center extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        let {userList} = this.props;
        return ( 
            <div>
                {/* <Link to='/personInfo'>设置</Link> */}
                {/* <img src={this.props.userList ? require('@/' + this.props.userList.img[0].url) : require('@/statics/img/title.png')} /> */}
                <img src={this.props.userList.img ? this.props.userList.img[0].url : require('@/statics/img/title.png')} width='200px' alt='头像' />
                {userList.name}
                {formatDate(userList.createDate)}加入
                关注 {userList.concernList}
                粉丝 {userList.fanList} 
            </div>
        );
    }
    componentDidMount() {
        console.log(this.props.userList)
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(information) {
            dispatch(actionCreators.saveUserList(information));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Center);