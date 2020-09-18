import React, { Component } from 'react';

import Master from './containers/Master';
import App from './containers/App';
import Fireadmin from './containers/Fireadmin';
import Firestoreadmin from './containers/Firestoreadmin';
import Push from './containers/Push';
import User from './containers/User';
import Raffle from './containers/RaffleDraw';

import { Router, Route,hashHistory} from 'react-router'

class Admin extends Component {

  render() {

    return (
      <Router history={hashHistory}>
          <Route path="/account" component={User}></Route>
          <Route component={Master} >
            {/* make them children of `Master` */}
            <Route path={"/"} component={App}></Route>
            <Route path="/app" component={App}/>
            <Route path="/raffle" component={Raffle}/>
            <Route path="/push" component={Push}/>
            <Route path="/fireadmin" component={Fireadmin}/>
            <Route path="/fireadmin/:sub" component={Fireadmin}/>
            <Route path="/firestoreadmin" component={Firestoreadmin}/>
            <Route path="/firestoreadmin/:sub" component={Firestoreadmin}/>


          </Route>
        </Router>
    );

   }

    
  }


export default Admin;
