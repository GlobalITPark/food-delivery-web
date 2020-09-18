/*eslint no-useless-escape: "off"*/
import React, {Component} from 'react'
import NavItem from '../components/NavItem'
import Config from   '../config/app';
import firebase from './../config/database'
import HomeUI from './../ui/template/Home'
import MasterUI from './../ui/template/Master';
var md5 = require('md5');

 
  

/**
 * Home View,  Represents the main navigation
 */
class Home extends Component {

  constructor(props) {

    super(props);

    this.state = {
      error: '',
      // isLoggedIn: false,
    };
   
  }

  render() {
    return (
      <HomeUI
      isLoggedIn={this.state.isLoggedIn}
      children={this.props.children}
      />
    )
  }
  
}


export default Home;
