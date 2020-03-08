import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { GrobalStyle } from './styles/style';
import { GrobalIconStyle } from './statics/iconfont/iconfont';
import Login from './views/login';
import TabBar from './components/tabBar';
import store from './store';

class App extends Component {
  render() {
    return (
      <div>
        <GrobalStyle />
        <GrobalIconStyle />
        <Provider store={store}>
          <Router>
            <div>
              <Route path='/' exact component={TabBar}>
              </Route>
              <Route path='/login' exact component={Login}></Route>
            </div>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
