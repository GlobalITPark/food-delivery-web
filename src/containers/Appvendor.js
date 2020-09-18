/*eslint no-useless-constructor: "off"*/
import React, {Component} from 'react';
import NavBar from './../ui/template/NavBar';
// import NavBarDefault from './../ui/template/NavBarDefault'

class Appvendor extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="content">
        <NavBar/>

        <div>Vendor DASHBOARD</div>
       
      </div>

    )
  }
}

export default Appvendor;
