import React, {Component} from 'react';
import firebase from '../config/database'
import Config from '../config/app';
import MainregisterUI from '../ui/template/Mainregister';
import * as firebaseCLASS from 'firebase';
import {Redirect} from 'react-router-dom'
// import {Redirect} from 'react-router'
require("firebase/firestore");
import fire from 'firebase';

class Mainregister extends Component {

    constructor(props){
        super(props);

        this.state = {
            error:'',
            isRegistered:false,
        };

        this.authenticateRegister = this.authenticateRegister.bind(this);
        this.writeUserData = this.writeUserData.bind(this);
        // this.changeIsRegistered = this.changeIsRegistered.bind(this);

    }

    /**
   * update login/register state 
   * @param {boolean} isLogin 
   */
  // changeIsRegistered(isRegistered) {
  //   this.setState({
  //     isRegistered: isRegistered
  //   })
  // }

  authenticateRegister(username, password, displayName, userRole) {
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

          console.log("1 userid,email",userId," ",email);
          firebase.app.firestore().collection("users").doc(userId).set({
              username: email,
              email:"",
              fullName: "",
              userRole: "visitor",
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
                  // _this.setState({
                  //   isRegistered:true
                  // });
                  
                  alert("Registered successfully. Press back button and sign in to continue!");
                  firebase.app.auth().signOut();
                })
              }
            })
          })
          }).catch(function(error){
            console.log(error.message);
            // displayError(error.message);
            alert(error.message);
          })
          // firebase.app.auth().currentUser.updateProfile({
          //   userRole: userRole
          // })

          
          // console.log("ok ");
          // var usersRef = firebase.app.database().ref("users");
          // var newUsersRef = usersRef.push();
          
          //   newUsersRef.set({
          //     email: username,
          //     fullName: displayName,
          //     userRole: userRole,
          //     iscomplete:0
          //   })

          

        }
      )
      .catch(function (error) {
        // Handle Errors here.
        console.log(error.message);
        // displayError(error.message);
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
      // if(this.state.isRegistered===true){
      //   console.log("isRegistered"+this.state.isRegistered)
      //   return(
      //     <Redirect to='/login'/>
      //   )
      // }
      if(this.props.isLoggedIn === true && this.props.isRegisteredUser){
        return(
          <Redirect to="/"/>
        )
      }

      console.log("isRegistered"+this.state.isRegistered)
        return(
            <MainregisterUI
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

export default Mainregister;