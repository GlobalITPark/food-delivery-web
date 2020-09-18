import React, {Component} from 'react';
import firebase from '../config/database'
import MainloginUI from '../ui/template/Mainlogin';
import * as firebaseCLASS from 'firebase';
import {Redirect} from 'react-router-dom'
// import {Redirect} from 'react-router'
require("firebase/firestore");
var randomString = require('randomstring');
import fire from 'firebase';

class Mainlogin extends Component {

    constructor(props){
        super(props);

        this.state = {
            error:"",
            isLogin:true,
            isRegistered:false,
            user:{},
           
        };

        this.authenticateLogin = this.authenticateLogin.bind(this);
        this.createUser = this.createUser.bind(this);
        this.changeIsLogin = this.changeIsLogin.bind(this);
        this.showGoogleLogin = this.showGoogleLogin.bind(this);
       
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
      } 
    });
    }

    login = () =>{
      console.log("button clicked"+this.props.isLoggedIn)
      this.props.authlogin();
    
        // fakeAuth.authenticate(()=>{
          // this.setState(()=>({
          //   redirectToReferrer:true
          // }))
        // })
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

    firebase.app.auth().signInWithEmailAndPassword(username, password)
    .then(    
      // authlogin(userRole)
      displayError("")
    )
    .catch(function (error) {
      // Handle Errors here.
      console.log(error.message);
      displayError(error.message);

    });

    // const userRef = firebase.app.firestore().collection("users");
    // const allowedRef = firebase.app.database().ref(`/meta/config/allowedUsersWeb`);
    // userRef.where('email','==',username).get()
    // .then(snapshot => {
    //   if(snapshot.empty){
    //     firebase.app.auth().signInWithEmailAndPassword(username, password)
    //       .then(    
    //         // authlogin(userRole)
    //       )
    //       .catch(function (error) {
    //         // Handle Errors here.
    //         console.log(error.message);
    //         displayError(error.message);

    //       });

    //   }
    //   snapshot.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data());
    //     var email = doc.data().email;
    //     var userRole = doc.data().userRole;
    //     if(email===username && userRole==="visitor"){
    //       console.log("userRole :"+userRole)
    //       firebase.app.auth().signInWithEmailAndPassword(username, password)
    //       .then(    
    //         // authlogin(userRole)
    //       )
    //       .catch(function (error) {
    //         // Handle Errors here.
    //         console.log(error.message);
    //         displayError(error.message);

    //       });
    //     }else if(email===username && userRole==="vendor"){
    //       console.log("userRole :"+userRole)
    //       allowedRef.orderByChild("email").equalTo(username).once("value")
    //       .then(snap => {
    //         if(snap.val()){
    //           firebase.app.auth().signInWithEmailAndPassword(username, password)
    //           .then(    
    //             // authlogin(userRole),
    //           )
    //           .catch(function (error) {
    //             // Handle Errors here.
    //             console.log(error.message);
    //             displayError(error.message);
  
    //           });
    //         }else{
    //           displayError("This user doens't have access to this vendor panel!");
    //         }
    //       })

    //     } else if(email===username && userRole==="admin"){
    //       console.log("userRole :"+userRole)
    //       allowedRef.orderByChild("email").equalTo(username).once("value")
    //       .then(snap => {
    //         if(snap.val()){
    //           firebase.app.auth().signInWithEmailAndPassword(username, password)
    //           .then(    
    //             // authlogin(userRole),
                
    //           )
    //           .catch(function (error) {
    //             // Handle Errors here.
    //             console.log(error.message);
    //             displayError(error.message);
  
    //           });
    //         }else{
    //           displayError("This user doens't have access to this admin panel!");
    //         }
    //       })
    //     }
    //   });
    // })
    // .catch(function (error) {
    //   // Handle Errors here.
    //   console.log(error.message);
    //   displayError(error.message);

    // });

    const authlogin=(userRole) =>{
      this.props.authlogin(userRole)
    } 

  }

  /**
   * Send password reset link
   * @param {String} emailAddress 
   */
  sendPasswordResetLink(emailAddress){
    firebase.app.auth().sendPasswordResetEmail(emailAddress).then(function() {
      alert("Password reset email is sent on your email "+emailAddress);
    }).catch(function(error) {
      alert(error.message)
    });
  }

  // authenticateRegister(username, password, displayName) {
  //   const displayError = (error) => {
  //     this.setState({ error: error });
  //   }

  //   firebase.app.auth().createUserWithEmailAndPassword(username, password)
  //     .then(
  //       function (data) {
  //         firebase.app.auth().currentUser.updateProfile({
  //           displayName: displayName
  //         })
  //       }
  //     )
  //     .catch(function (error) {
  //       // Handle Errors here.
  //       console.log(error.message);
  //       displayError(error.message);

  //     });

  // }


  authWithGoogle() {
    const displayError = (error) => {
      this.setState({ error: error });
    }
    const authlogin=(userRole) =>{
      this.props.authlogin(userRole)
    } 

    var provider = new firebaseCLASS.auth.GoogleAuthProvider();
    firebase.app.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log("USER"+user.email);
      // const userRef = firebase.app.database().ref(`/users`);
      // userRef.orderByChild("email").equalTo(user.email).once("value")
      // .then(snapshot => {
      //   if(snapshot.val()){
      //     console.log("USER have registered");
      //   }else{
      //     // firebase.app.auth().signOut();
      //     console.log("USER not registered");
      //   }
     
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
    // console.log(Config.adminConfig);
    // if (Config.adminConfig.allowedUsers != null && Config.adminConfig.allowedUsers.length > 0 && Config.adminConfig.allowGoogleAuth) {
    //   return (<div>
    //     <p className="category text-center">
    //       <a onClick={this.authWithGoogle} className="btn btn-social btn-fill btn-google">
    //         <i className="fa fa-google"></i>&nbsp;&nbsp;&nbsp;Login with google
    //         </a>
    //     </p>
    //     <br />
    //     <p className="category text-center">Or login using email</p>
    //   </div>)
    // } else {
    //   return (<div></div>)
    // }

    return(
      <div>
        <p className="category text-center">
          <a onClick={this.authWithGoogle} className="btn btn-social btn-fill btn-google">
            <i className="fa fa-google"></i>&nbsp;&nbsp;&nbsp;Login with google
            </a>
        </p>
        <br />
        <p className="category text-center">Login using email</p>
      </div>
    )
   
  }

  createUser(fullName,dob,gender,tele,nationality,job){
    // console.log("MAIN LOGIN : createUser ")
    const _this = this;

    
    // const db = firebase.app.firestore();
    
    // const batch = db.batch();
    // const userStatsRef = firebase.app.firestore().collection('users').doc('--user_stats--');
    // const increment = fire.firestore.FieldValue.increment(1);
    // batch.set(userStatsRef,{user_count:increment},{merge:true});
    // batch.commit().then(function(){
    //   firebase.app.firestore().collection('users').doc('--user_stats--').get()
    //   .then(doc => {
    //     if (!doc.exists) {
    //       console.log('No such document!');
    //     } else {
    //       console.log('Document data:', doc.data().user_count);
    //       var userID = doc.data().user_count;
    //       firebase.app.database().ref('meta/config/allowedUsers/'+userID).set({
    //         email: _this.state.user.email,
    //         type: 'visitor'
    //       });
    //     }
    //   })
    // })
    var userId = this.state.user.uid;

    var usersRef = firebase.app.firestore().collection("users").doc(userId);
    usersRef.set({
      username:this.state.user.email,
      email: this.state.user.email,
      fullName: fullName,
      userRole: "visitor",
      dateofbirth:dob,
      gender:gender,
      telephone:tele,
      nationality:nationality,
      job:job,
      iscomplete:0
    })
    .then(function(){
      const refQR = firebase.app.firestore().collection("qrcode_collection").doc(userId);
      refQR.get()
      .then(doc => {
        if (!doc.exists) {
          refQR.set({
            user:_this.state.user.email,
            qr_code:randomString.generate({ length: 10, charset: 'alphanumeric',capitalization:'uppercase'}),
            status:"1"
          })
        } else {
          console.log('QR created already');
        }
      })
      .then(function(docRef){
        _this.setState({
          isRegistered:true
        });
        // console.log("qr generated :"+docRef.id);
      })
      .catch(function(error){
        console.log("QRcode failed to create :"+error);
      })
      
    })
    .catch(function(error){
      console.log("create user :"+error);
    })
  
  }

  // old_createUser(fullName,dob,gender,tele,nationality,job){
  //   // console.log("MAIN LOGIN : createUser ")
  //   const _this = this;
  //   var usersRef = firebase.app.database().ref("users");
  //   var newUsersRef = usersRef.push();
    
  //   newUsersRef.set({
  //     email: this.state.user.email,
  //     fullName: fullName,
  //     userRole: "visitor",
  //     dateofbirth:dob,
  //     gender:gender,
  //     telephone:tele,
  //     nationality:nationality,
  //     job:job,
  //     iscomplete:0
  //   },function(error){
  //     if(error){
  //       console.log(error);
  //     }else{
  //       const refQR = firebase.app.firestore().collection("qrcode_collection");
  //       refQR.add({
  //         user:_this.state.user.email,
  //         qr_code:randomString.generate({ length: 10, charset: 'alphanumeric',capitalization:'uppercase'}),
  //         status:"1"
  //       })
  //       .then(function(docRef){
  //         _this.setState({
  //           isRegistered:true
  //         });
  //         // console.log("qr generated :"+docRef.id);
  //       })
  //       .catch(function(error){
  //         console.log("QRcode failed to create :"+error);
  //       })
        
  //     }
  //   })

  //   _this.setState({
  //     isRegistered:true
  //   });
  // }

    render(){
     
      if(this.state.isRegistered===true){
        return(
          <Redirect to="/ticket"/>
        )
      }
      
      if(this.props.isLoggedIn === true && this.props.isRegisteredUser){
        return(
          <Redirect to="/"/>

        )
      }
      
        return(
            <MainloginUI
            showGoogleLogin={this.showGoogleLogin}
            authenticate={this.authenticateLogin}
            createUser={this.createUser}
            user={this.state.user}
            error={this.state.error?this.state.error:""}
            isRegisteredUser={this.props.isLoggedIn ? this.props.isRegisteredUser : true}
            isRegister={!this.state.isLogin}
            changeIsLogin={this.changeIsLogin}
            sendPasswordResetLink={this.sendPasswordResetLink}
            />
        )
    }
}

export default Mainlogin;