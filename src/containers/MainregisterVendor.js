import React, {Component} from 'react';
import firebase from '../config/database'
import Config from '../config/app';
import MainregisterVendorUI from '../ui/template/MainregisterVendor';
import * as firebaseCLASS from 'firebase';
import {Redirect} from 'react-router-dom'
require("firebase/firestore");
import fire from 'firebase';

class MainregisterVendor extends Component {

    constructor(props){
        super(props);

        this.state = {
            error:'',
            isRegistered:false,
        };

        this.authenticateRegister = this.authenticateRegister.bind(this);
        this.writeUserData = this.writeUserData.bind(this);

    }

  authenticateRegister(username, password, displayName, userRole, title, description) 
  {
    const _this = this;
    const displayError = (error) => {
      this.setState({ error: error });
    }

    const changeIsRegistered=()=>{
      this.setState({
        isRegistered:true
      });
    }

    firebase.app.auth().createUserWithEmailAndPassword(username, password)
      .then(
        function (data) {
          var userId = data.user.uid;
          var email = data.user.email;
          firebase.app.auth().currentUser.sendEmailVerification().then(function(){

          console.log("1 charu userid,email",userId," ",email);
          firebase.app.firestore().collection("users").doc(userId).set({
              username: email,
              email:email,
              fullName: "",
              userRole: "vendor",
              dateofbirth:"",
              gender:"",
              telephone:"",
              nationality:"",
              job:"",
              iscomplete:0
          })
          
          const db = firebase.app.firestore();
    
          const batch = db.batch();
          const userStatsRef = firebase.app.firestore().collection('users').doc('--user_stats--');
          const increment = fire.firestore.FieldValue.increment(1);
          batch.set(userStatsRef,{user_count:increment},{merge:true});
          batch.commit().then(function(){
            firebase.app.firestore().collection('users').doc('--user_stats--').get()
            .then(doc => {
              console.log("2 userid,email",userId," ",email);
              if (!doc.exists) {
                console.log('No such document!');
              } else {
                console.log('Document data:', doc.data().user_count);
                console.log("3 userid,email",userId," ",email);
                var userID = doc.data().user_count;
                firebase.app.database().ref('meta/config/allowedUsers/'+userID).set({
                  email: username,
                  type: 'euser'

                }).then(function(){
                  if(title !== '' && title !== null) {
                    const restaurantRef = firebase.app.firestore().collection('restaurant_collection').doc();
                    restaurantRef.set({
                      title: title,
                      description: description,
                      owner: email,
                      image:"https://i.imgur.com/80vu1wL.jpg",
                      status:0,
                      count:1
                    });
                  }
                  
                  alert("Registered successfully. Press back button and sign in to continue!");
                  firebase.app.auth().signOut();
                })
              }
            })
          })
          }).catch(function(error){
            console.log(error.message);
            alert(error.message);
          })
        }
      )
      .catch(function (error) {
        // Handle Errors here.
        console.log(error.message);
        alert(error.message);

      });

    
      
  }

  writeUserData(userId,email) {
    console.log("userid,email",userId," ",email);
    var usersRef = firebase.app.firestore().collection("users").doc(userId);
    usersRef.set({
        email: email,
    })
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

    render(){
      if(this.props.isLoggedIn === true && this.props.isRegisteredUser){
        return(
          <Redirect to="/"/>
        )
      }

      console.log("isRegistered"+this.state.isRegistered)
        return(
            <MainregisterVendorUI
            showGoogleLogin={this.showGoogleLogin}
            authenticate={this.authenticateRegister}
            error={this.state.error}
            isRegister={!this.state.isLogin}
            // changeIsLogin={this.changeIsRegistered}
            sendPasswordResetLink={this.sendPasswordResetLink}
            />
        )
    }
}

export default MainregisterVendor;