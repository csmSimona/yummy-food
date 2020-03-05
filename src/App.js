import React, { Component } from "react";
import { getUser, addUser } from './utils/api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    // 增加数据
    var user = {
      "name": "王五",
      "gender": "女",
      "age": 18,
      "hobbies": "跳舞"
    }
    addUser(user).then(res => {
      console.log('addUser', res);
    }).catch((err) => {
      console.log('error', err);
    })

    // 查询数据
    getUser().then(res => {
      return this.setState({ apiResponse: JSON.stringify(res.data) })
    }).catch((err) => {
      console.log('error', err);
    })
  }

  componentDidMount() {
    this.callAPI();
  }

  
  render() {
    return (
      <div>
        <div>I'M READY TO USE THE BACK END APIS! :-)</div>
        <p>{this.state.apiResponse}</p>
      </div>
    );
  }
}

export default App;
