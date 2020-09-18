import React, { Component } from 'react';
import firebase from './config/database'
import Config from './config/app';
import LoginUI from './ui/template/Login'
import * as firebaseCLASS from 'firebase';
require("firebase/firestore");


class Login extends Component {

  constructor(props) {

    super(props);

    this.state = {
      error: '',
      isLogin: true,
    };
    this.authenticateLogin = this.authenticateLogin.bind(this);
    this.authenticateRegister = this.authenticateRegister.bind(this);
    this.changeIsLogin = this.changeIsLogin.bind(this);
    

    //var ref = firebase.databaseRef().ref("users/");
    //var usersRef = ref.child("users");
    

  }

  /**
   * update login/register state 
   * @param {boolean} isLogin 
   */
  changeIsLogin(isLogin) {
    this.setState({
      isLogin: isLogin
    })
  }

  authenticateLogin(username, password, displayName) {
    const displayError = (error) => {
      this.setState({ error: error });
 
    }


    if (Config.adminConfig.allowedUsers != null && Config.adminConfig.allowedUsers.indexOf(username) === -1) {
      //Error, this user is not allowed anyway
      displayError("This user doens't have access to this admin panel!");
    } else {
      firebase.app.auth().signInWithEmailAndPassword(username, password)
        .then(
          function (data) {
            console.log("Yes, user is logged in");
          }
        )
        .catch(function (error) {
          // Handle Errors here.
          console.log(error.message);
          displayError(error.message);

        });
    }
  }

  /**
   * Send password reset link
   * @param {String} emailAddress 
   */
  
  sendPasswordResetLink(emailAddress){

  //   firebase.app.firestore().collection("Users").doc("LA").set({
  //     name: "Los Angeles",
  //     state: "CA",
  //     country: "USA"
  // })
  // .then(function() {
  //     console.log("Document successfully written!");
  // })
  // .catch(function(error) {
  //     console.error("Error writing document: ", error);
  // });
    firebase.app.auth().sendPasswordResetEmail(emailAddress).then(function() {
      alert("Password reset email is sent on your email "+emailAddress);
    }).catch(function(error) {
      alert(error.message)
    });
  }

  authenticateRegister(username, password, displayName) {
    const displayError = (error) => {
      this.setState({ error: error });
    }

    firebase.app.auth().createUserWithEmailAndPassword(username, password)
      .then(
        function (data) {
          firebase.app.auth().currentUser.updateProfile({
            displayName: displayName
          })
          console.log("ok ");
          var usersRef = firebase.app.database().ref("users");
          var newUsersRef = usersRef.push();
          
         
            newUsersRef.set({
            
              email: username,
              full_name: displayName,
              role: "end-user",
              iscomplete:0
            
          });
        }
        

      )
      .catch(function (error) {
        // Handle Errors here.
        console.log(error.message);
        displayError(error.message);

      });

  }

  authWithGoogle() {
    var provider = new firebaseCLASS.auth.GoogleAuthProvider();
    firebase.app.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //var token = result.credential.accessToken;
      // The signed-in user info.
      //var user = result.user;
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      //var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //var credential = error.credential;
      console.log(errorMessage);
      // ...
    });
  }

  showGoogleLogin() {
    console.log(Config.adminConfig);
    if (Config.adminConfig.allowedUsers != null && Config.adminConfig.allowedUsers.length > 0 && Config.adminConfig.allowGoogleAuth) {
      return (<div>
        <p className="category text-center">
          <a onClick={this.authWithGoogle} className="btn btn-social btn-fill btn-google">
            <i className="fa fa-google"></i>&nbsp;&nbsp;&nbsp;Login with google
            </a>
        </p>
        <br />
        <p className="category text-center">Or login using email</p>
      </div>)
    } else {
      return (<div></div>)
    }
  }

  render() {
    return (
      <LoginUI
        showGoogleLogin={this.showGoogleLogin}
        authenticate={this.state.isLogin ? this.authenticateLogin : this.authenticateRegister}
        error={this.state.error}
        isRegister={!this.state.isLogin}
        changeIsLogin={this.changeIsLogin}
        sendPasswordResetLink={this.sendPasswordResetLink}
      />
    );
  }
}

export default Login;
