import React, {Component} from 'react'
import { Router, IndexRoute, Route, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import requireAuth from './services/require_auth'
import * as actions from './Auth/actions'
import App from './App'
import { Shop } from './Shop'
import { Auth } from './Auth'
import { UserAccount } from './UserAccount'
import { CstIv } from './CustomerInvoices'
import { CustomerLists } from './CustomerLists'
import Feature from './Feature'



class Routers extends Component {
  componentWillMount(){
    this.props.fetchUserInfo()
  }
  requireLogin = (nextState, replace) => {
    const token = localStorage.getItem('token')
    if (!token) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }
  render(){
    const {auth} = this.props
    return(
      <Router history={browserHistory}>
        {auth.user
          && (
            <Route path='/' component={App} auth={auth}>
              <IndexRoute component={Feature} onEnter={this.requireLogin}/>
              <Route path="login" component={Auth} />
              <Route path="logout" component={Auth} />
              <Route path='feature' component={requireAuth(Feature)}/>
              <Route path='shop' component={requireAuth(Shop)}/>
              <Route path='account' component={requireAuth(UserAccount)}/>
              <Route path='cst-iv-list' component={requireAuth(CstIv)}/>
              <Route path='cst-list' component={requireAuth(CustomerLists)}/>
            </Route>
          )
        }
      </Router>
    )
  }
}

function mapStateToProps(state){
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(Routers)
