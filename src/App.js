import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { GrobalStyle } from './styles/style';
import { GrobalIconStyle } from './statics/iconfont/iconfont';
import store from './store';
import TabBar from './views/tabBar';
import Login from './views/login';
import PhoneRegister from './views/login/phoneRegister';
import SmsCheck from './views/login/smsCheck';
import PersonInfo from './views/center/personInfo';

class App extends Component {
  render() {
    return (
      <div>
        <GrobalStyle />
        <GrobalIconStyle />
        <Provider store={store}>
          <Router>
            <div>
              <Route path='/' exact component={TabBar}></Route>
              <Route path='/login' exact component={Login}></Route>
              <Route path='/phoneRegister' exact component={PhoneRegister}></Route>
              <Route path='/smsCheck' exact component={SmsCheck}></Route>
              <Route path='/personInfo' exact component={PersonInfo}></Route>
            </div>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
