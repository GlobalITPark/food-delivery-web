/*eslint array-callback-return: "off"*/
import React, { Component } from 'react';
import firebase from '../config/database';
import Config from   './../config/app';
import Card from './../ui/template/Card';
import Image from './../components/fields/Image';
import Input from './../components/fields/Input';
import SkyLight from 'react-skylight';


var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class User extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      user: {},
      password: "",
      confirmPass: "",
      title: '',
      description: ''
    }

    this.authListener = this.authListener.bind(this);
    this.setUpName = this.setUpName.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.viewVendorRequestdialog = this.viewVendorRequestdialog.bind(this);
    this.cancelviewVendorRequestdialog = this.cancelviewVendorRequestdialog.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);

  }

  componentDidMount(){
    this.authListener();
  }
  
  authListener(){
    const setUser=(user)=>{
    this.setState({user:user})
    }

    //Now do the listner
    firebase.app.auth().onAuthStateChanged(function(user) {
    if (user) {
        setUser(user);
        // User is signed in.
        console.log("User has Logged  in Master");
        console.log(user.email);
        
    } else {
        // No user is signed in.
        console.log("User has logged out Master");
    }
    });
  }
  //Setup user display name
  setUpName(displayName){
    console.log("got --- "+displayName)
    var user=firebase.app.auth().currentUser;
    this.setState({user:user});
    user.updateProfile({
      displayName: displayName
    }).then(function() {
      console.log("Updated")
    }).catch(function(error) {
      console.log("error "+error.message)
    });
  }

  //Setup user image
  setUpUserImage(linkToImage){
    firebase.app.auth().currentUser.updateProfile({
      photoURL: linkToImage
    })
  }
  
  //Reset password 
  resetPassword(){
    if(this.state.password.length > 4){
      if(this.state.password === this.state.confirmPass){
        firebase.app.auth().currentUser.updatePassword(this.state.password).then(function() {
          alert("Your password has been sucesfully updated");
        }).catch(function(error) {
          alert(error.message)
        });
      }else{
        alert("Password fields doesn't match")
      }
    }else{
      alert("Please fill out password fields. Minimum required in 5 characters")
    }
  }

viewVendorRequestdialog(){
  this.refs.viewVendorRequest.show();
}

cancelviewVendorRequestdialog(){
  this.refs.viewVendorRequest.hide();
}

handleChangeTitle(event){
  this.setState({ title: event.target.value }); 
}   

handleChangeDescription(event) {
  this.setState({ description: event.target.value });
}

createRestaurant(event){
  var _this =this;

  const restaurantRef = firebase.app.firestore().collection('restaurant_collection').doc();
  restaurantRef.set({
    title:this.state.title,
    description:this.state.description,
    owner:this.state.user.email,
    image:"https://i.imgur.com/80vu1wL.jpg",
    status:0
  }).then(function(){
    const ref = firebase.app.firestore().collection("users");
    ref.where('email','==',_this.state.user.email).get()
    .then(snapshot=>{
      if(snapshot.empty){
        console.log('No matching documents.');
        return;
      }
      snapshot.forEach(doc => {
        var id = doc.id;
        const userRef = firebase.app.firestore().collection("users").doc(id);
        userRef.update({
          userRole:"vendor"
        }).then(function(){
          _this.refs.viewVendorRequest.hide();
          firebase.app.auth().signOut();
        }).catch(function(error){
          console.log(error.message);
        })
      });
    })
  }).catch(function(error){
    console.log(error.message);
  })

  event.preventDefault();
}


render() {
  var userPhoto=this.state.user.photoURL?this.state.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.state.user.email+"")+"?s=512";

    return (
      <div className="wrapper wrapper-full-page">
        <div className="full-page landing-page">
            <div className="content">
                <div className="section intro-section">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-10">
                    <div className="row">
                      <Card 
                        class="col-md-3 col-md-offset-2"
                        name={"userDataRight"}
                        title={"User Info"}
                        showAction={false}
                        >
                        <row>
                          <br /><br />
                          <div className="col-md-12">
                            <div className="col-md-6 col-md-3">
                              <Image 
                                class="img-circle"
                                wrapperClass=" "
                                theKey="image"
                                value={userPhoto}
                                updateAction={(imageName,linkToImage)=>{this.setUpUserImage(linkToImage)}}
                                >
                              </Image>
                            </div>
                            <div className="clearfix"></div>
                            <div className="col-md-8 col-md-2">
                              <h4 className="text-center">{this.state.user.displayName}</h4>
                              <p className="text-center"><b>{this.state.user.email}</b></p>
                              {this.props.currentUser==="visitor" ?
                                <a className="btn btn-sm" onClick={()=>this.viewVendorRequestdialog()}>Vendor Registration</a>
                                :
                                ""
                              }
                            </div>
                          </div>
                          
                          
                        </row>
                      </Card>
                      <div className="col-md-7">
                        <div className="row">
                        <Card 
                          class="col-md-12"
                          name={"userDataRight"}
                          title={"My Profile"}
                          showAction={false}
                          >
                          <div className="row">
                            <div className="form-group-md col-md-10 col-md-offset-1">
                              <div className="row">
                                <label htmlFor="firstName" className="col-md-3 col-form-label labelUserProfile">Full Name</label>
                                <div className="col-md-7">
                                  <ConditionalDisplay condition={this.state.user.email}>
                                    <Input 
                                      class="col-md-7"
                                      theKey="name"
                                      value={this.state.user.displayName}
                                      updateAction={(nameKey,displayName)=>{this.setUpName(displayName)}}
                                      >
                                      </Input>
                                    </ConditionalDisplay>
                                  </div>
                                </div>
                                <br /><br />
                              </div>
                            </div>
                          </Card>
                          <Card 
                          class="col-md-12"
                          name={"userPassword"}
                          title={"Reset Password"}
                          showAction={false}
                          >
                          <div className="row">
                            <div className="form-group-md col-md-10 col-md-offset-1">
                              <div className="row">
                                <label htmlFor="password" className="col-md-3 col-form-label labelUserProfile">New Password</label>
                                  <div className="col-md-7">
                                    <Input 
                                      class="col-md-7"
                                      theKey="password"
                                      value={this.state.password}
                                      type={"password"}
                                      updateAction={(nameKey,newpassword)=>{
                                        this.setState({
                                          password: newpassword
                                        })
                                      }}
                                      >
                                      </Input>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group-md col-md-10 col-md-offset-1">
                                <div className="row">
                                  <label htmlFor="passwordConfirmation" className="col-md-3 col-form-label labelUserProfile">New Password Confirmation</label>
                                  <div className="col-md-7">
                                    <Input 
                                      class="col-md-7"
                                      theKey="passwordConfirm"
                                      value={this.state.confirmPass}
                                      type={"password"}
                                      updateAction={(nameKey,newpassword)=>{
                                        this.setState({
                                          confirmPass: newpassword
                                          })
                                      }}
                                      >
                                      </Input>
                                    </div>
                                </div>
                                <br /><br />
                                <a type="submit" onClick={this.resetPassword} className={"btn "+Config.designSettings.submitButtonClass}>Change password</a>
                                </div>
                            </div>
                          </Card>
                          <div style={{textAlign: "center"}} className="col-md-8 col-md-offset-7">
                            <br />
                            <br />
                            {/* <a className="button" href="/">Go Back</a> */}
                            <br />
                            <br />
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                </div>
                </div>
                </div>

                
            
            </div>
        
        </div>
        <SkyLight dialogStyles={{height:'60%'}} hideOnOverlayClicked ref="viewVendorRequest" title="">
          {/* <h4>Your QRCode</h4> */}
          <div className="col-md-12">
            <form onSubmit={this.createRestaurant}>
              <div className="card card-login">
                  <div style={{background:'#211c54'}} className="card-header text-center" data-background-color="#0B3C5D">
                      <h4 style={{marginTop:'0px',marginBottom:'0px'}} className="card-title">Submit Restaurant details</h4>
                  </div>
                  <div className="card-content">
                      <h4>{this.props.error}</h4>
                      <div className="input-group">
                          <span className="input-group-addon">
                              <i className="material-icons">how_to_reg</i>
                          </span>
                          <div className="form-group">
                              <label className="control-label">Title</label>
                              <input type="text" value={this.state.title} onChange={this.handleChangeTitle} className="form-control" />
                          </div>
                      </div>
                      <div className="input-group">
                          <span className="input-group-addon">
                              <i className="material-icons">work</i>
                          </span>
                          <div className="form-group">
                              <label className="control-label">Description</label>
                              <input type="text" value={this.state.description} onChange={this.handleChangeDescription} className="form-control" />
                          </div>
                      </div>
                  </div>
                  <div className="footer text-center">
                    <a onClick={this.cancelviewVendorRequestdialog} className="btn btn-info">Cancel</a>
                    <input type="submit" className="btn btn-danger" />
                      
                  </div>
              </div>
          </form> 
          </div>
        </SkyLight>
    </div>
    )
  }
}
