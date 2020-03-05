import React, { Component } from "react";
// import axios from 'axios';
import { getUser } from './utils/api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    // fetch("http://localhost:9000/users/getUser")
    //   .then(res => res.text())
    //   .then(res => {
    //     console.log('res', res)
    //     return this.setState({ apiResponse: res })
    //   });
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
