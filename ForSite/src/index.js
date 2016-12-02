import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router'
import reduxThunk from 'redux-thunk'


import App from './components/app';
import requireAuth from './components/require_auth';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import SignupForm from './components/signup/signupForm';
import Feature from './components/feature';
import Support from './components/support';
import LoginIssue from './components/login_issue';
import BookOrder from './components/book_order';
import reducers from './reducers';
import { AUTH_USER } from './actions/types'

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers, window.devToolsExtension ? window.devToolsExtension() : f => f)

const token = localStorage.getItem('token')
if (token) {
  store.dispatch({ type: AUTH_USER })
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Signin}/>
        <Route path='signin' component={Signin}/>
        <Route path='signout' component={Signout}/>
        <Route path='signup' component={SignupForm}/>
        <Route path='feature' component={requireAuth(Feature)}/>
        <Route path='support' component={requireAuth(Support)}/>
        <Route path='book_order' component={requireAuth(BookOrder)}/>
        <Route path='login_issue' component={requireAuth(LoginIssue)}/>
      </Route>
    </Router>
  </Provider>
  , document.querySelector('.container'));
