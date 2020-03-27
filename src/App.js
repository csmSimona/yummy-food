import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// import { BrowserRouter as Router, Redirect } from 'react-router-dom';
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
            {/* <Redirect path="/" to="/tab/home/recommend" /> */}
            {/* <Redirect path="/tab" to="/tab/home/recommend" /> */}
            {/* <Redirect path="/tab/home" to="/tab/home/recommend" /> */}
            {/* <Redirect path="/tab/center" to="/tab/center/myRecipes" /> */}
            {renderRoutes(routes)}
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
