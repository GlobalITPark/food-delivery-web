import React from 'react'
import {Route,Redirect,withRouter} from 'react-router-dom'
// import { Router, Route,hashHistory,Link,Redirect,withRouter} from 'react-router'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    console.log("fake authenticate")
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <div>
        <p>You must log in to view the page</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

const PrivateRoute = ({ component: Component,isLoggedIn, ...rest }) => (
  <Route {...rest} render={(props) => (
    isLoggedIn === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <li>
      {/* <Link><a onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Logout</a></Link> */}
    </li>
  ) : (
    <p>You are not logged in.</p>
  )
))

export  {AuthButton,PrivateRoute,Login,fakeAuth}