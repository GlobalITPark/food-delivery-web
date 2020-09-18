/*eslint no-useless-constructor: "off"*/
import React, {Component} from 'react';
import NavBar from './../ui/template/NavBar';
// import NavBarDefault from './../ui/template/NavBarDefault'

class RedeemGift extends Component {
  constructor(props){
    super(props);

    this.state={
        token:''
    }

    this.handleChangeToken = this.handleChangeToken.bind(this);
  }

  handleChangeToken(event){
    this.setState({ token: event.target.value }); 
} 

  render() {
    const{token} = this.state;
    const isInvalid = token ===''; 

    return (
      <div className="content">
        <NavBar/>

        <div className="card">
            <div style={{margin:"20px"}} className="card-body">
            <div className="card-title"><h4 style={{marginBottom:"0px"}}>Redeem Gift</h4></div>
            <hr/>

            <form>
                <div className="col-lg-3 col-md-3 col-xs-3">
                </div>
                <div className="col-lg-6 col-md-6 col-xs-6">
                    <div className="card-content">
                        <div className="form-group">
                            <input type="text" value={this.state.token} onChange={this.handleChangeToken} className="form-control text-center" placeholder="Enter token here" />
                        </div>
                    </div>
                    <div className="footer text-center">
                        <button disabled={isInvalid} className="btn btn-primary">Redeem Code</button>
                    </div>
                </div>
                <div className="col-lg-3 col-md-3 col-xs-3">
                </div>
                
            </form>
            </div>
        </div>

        
       
      </div>

    )
  }
}

export default RedeemGift;
