import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { routes } from './routes';
import { renderRoutes } from 'react-router-config';
import { GrobalStyle } from './styles/style';
import { GrobalIconStyle } from './statics/iconfont/iconfont';
import store from './store';

class App extends Component {
  render() {
    return (
      <div>
        <GrobalStyle />
        <GrobalIconStyle />
        <Provider store={store}>
          <Router>
            {/* 先关了，不然刷新就跑首页，难受 */}
            {/* <Redirect path="/" to="/tab/home/recommend" />
            <Redirect path="/tab" to="/tab/home/recommend" />
            <Redirect path="/tab/home" to="/tab/home/recommend" /> */}
            {renderRoutes(routes)}
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
