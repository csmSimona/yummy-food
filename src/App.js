import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
// import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { routes } from './routes';
import { renderRoutes } from 'react-router-config';
import { GrobalStyle } from './styles/style';
import { GrobalIconStyle } from './statics/iconfont/iconfont';
import store from './store';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Switch } from 'react-router-dom';
import './styles/AnimatedSwitch.less';
import { createHashHistory } from 'history';
const history = createHashHistory()

class App extends Component {
  render() {
    return (
      <div>
        <GrobalStyle />
        <GrobalIconStyle />
        <Provider store={store}>
          <Router history={history}>
          {/* {renderRoutes(routes)} */}
              <Route
                render={({ location }) => (
                  <TransitionGroup>
                    <CSSTransition
                      key={location.pathname}
                      timeout={2000}
                      classNames='fade'
                      appear={true}
                    >
                      <Switch location={location} key={location.pathname}>{renderRoutes(routes)}</Switch>
                    </CSSTransition>
                  </TransitionGroup>
                )}
              />
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
