import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/users/getUser")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
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
