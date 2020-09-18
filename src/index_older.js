/*eslint no-unused-vars: "off"*/
import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './Admin';
import Login from './Login';
import Main from './Main';
import Splash from './Splash';
import Config from   './config/app';
import design from   './ui/template/Config';
import {Redirect} from 'react-router-dom'
import * as FirebaseSDK from 'firebase';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
require("firebase/firestore");

//console.log = function() {}
import firebase from './config/database'
import { fakeAuth } from './Auth';

//Remove data fethced
var configReceived=!Config.remoteSetup;

if(Config.remoteSetup){
  //Do a remote setuo of the admin
  var connectionPath=Config.remotePath;
  if(Config.allowSubDomainControl){
    //Control by subdomain
    connectionPath=Config.subDomainControlHolder+window.THE_DOMAIN;
  }
  var fetcherFirebaseApp = FirebaseSDK.initializeApp(Config.firebaseConfig,"fetcher");
  fetcherFirebaseApp.database().ref(connectionPath).once('value').then(function(snapshot) {
    console.log("hi",snapshot.val())
    Config.firebaseConfig=snapshot.val().firebaseConfig;
    Config.adminConfig=snapshot.val().adminConfig;
    Config.navigation=snapshot.val().navigation;
    Config.pushSettings=snapshot.val().pushSettings;
    firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
    configReceived=true;
    console.log("cekck 1");
    checkLoginStatus();
    // displayApp();
  });
}else{
  // Legacy, local setup
  firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
  // console.log("cekck 2");
  checkLoginStatus();
//   displayApp();
}




//AUTHENTICATION
var loggedIn=false;
var currentuserRole=null;

function checkLoginStatus(){
  
  if(Config.firebaseConfig.apiKey){
    firebase.app.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("INDEX : User is signed in "+user.email);
        const userRef = firebase.app.database().ref(`/users`);
        const allowedRef = firebase.app.database().ref(`/meta/config/allowedUsers`);

        userRef.orderByChild("email").equalTo(user.email).once("value")
        .then(snapshot=>{
            if(snapshot.val()){
              // console.log("User found "+user.email);
                userRef.orderByKey().once("value")
                .then(function(snapshot){
                  snapshot.forEach(function(childSnapshot){
                    var email = childSnapshot.val().email;
                    var userRole = childSnapshot.val().userRole;
                    if(email===user.email && userRole==="visitor"){
                      // console.log("INDEX userRole :"+currentuserRole)
                      fakeAuth.authenticate();
                      loggedIn=true;
                      currentuserRole=userRole;
                      displayApp();
                      
                      
                    }else if(email===user.email && userRole==="vendor"){
                      allowedRef.orderByChild("email").equalTo(user.email).once("value")
                      .then(snap => {
                        if(snap.val()){
                            // console.log("INDEX userRole :"+currentuserRole)
                            fakeAuth.authenticate();
                            loggedIn=true;
                            currentuserRole=userRole;
                            displayApp();
                            
                        }else{
                            console.log("This user doens't have access to this vendor panel!");
                            alert("This user doens't have access to this vendor panel!");
                            firebase.app.auth().signOut();
                        
                        }
                      })
                    } else if(email===user.email && userRole==="admin"){

                      allowedRef.orderByChild("email").equalTo(user.email).once("value")
                      .then(snap => {
                        if(snap.val()){
                            loggedIn=true;
                            currentuserRole=userRole;
                            fakeAuth.authenticate();
                            // console.log("INDEX userRole :"+currentuserRole)
                            displayApp();
                            
                        }else{
                            console.log("This user doens't have access to this admin panel!");
                            alert("This user doens't have access to this admin panel!");
                            firebase.app.auth().signOut();
                        }
                      })
                    }
                    
                  })
                })
              }else{
                console.log("INDEX : User not found in user database")
              }
        })
        

        // if(Config.adminConfig.allowedUsers!=null&&Config.adminConfig.allowedUsers.indexOf(user.email)===-1){
        //   //Error, this user is not allowed anyway
        //   alert("The user "+user.email+" doens't have access to this admin panel!");
        //   firebase.app.auth().signOut();
        // }else{
        //   loggedIn=true;

        //   //Update Paths
        //  for (let index = 0; index < Config.navigation.length; index++) {
        //   Config.navigation[index].path=Config.navigation[index].path.replace("{useruuid}",user.uid); 
        //   if( Config.navigation[index].subMenus){
        //     for (let subIndex = 0; subIndex < Config.navigation[index].subMenus.length; subIndex++) {
        //       Config.navigation[index].subMenus[subIndex].path=Config.navigation[index].subMenus[subIndex].path.replace("{useruuid}",user.uid); 
        //     }
        //   }
        //  }
          

        //  //Do we have our pushSettings remoutly configurable
        //  if(Config.pushSettings.remoteSetup){
        //   var fetcherPushConfigFirebaseApp = FirebaseSDK.initializeApp(Config.firebaseConfig,"pushFetcher");
        //   fetcherPushConfigFirebaseApp.database().ref(Config.pushSettings.remotePath).once('value').then(function(snapshot) {
        //     //alert("FETCH PUSH CONFIG")
        //     //alert(snapshot.val())
        //     Config.pushSettings=snapshot.val();
        //     displayApp();
        //   });
        //  }else{
        //   displayApp();
        //  }
          
        // }



      } else {
        // No user is signed in.
        console.log("INDEX : No user is signed in ");
        fakeAuth.signout();
        loggedIn=false;
        currentuserRole=null;
        displayApp();
        // if(window.display){
        //     window.display();
        // }

      }
  })
  }else{
    // No user is signed in.
      console.log("INDEX : No user is signed in, step 1 ");
      loggedIn=false;
      currentuserRole=null;
      displayApp();
    //   if(window.display){
    //       window.display();
    //   }
  }
}



function displayApp(){
  // if(!configReceived){
  //    ReactDOM.render(
  //       <Splash />,
  //       document.getElementById('root')
  //     );
  // }else{
  //   // Show splash window
  //   if(loggedIn){
  //     ReactDOM.render(
  //       <Main 
  //         isLoggedin ={loggedIn}
  //       />,
  //       document.getElementById('root')
  //     );
  //   }else{
  //     ReactDOM.render(
  //       <Main 
  //       isLoggedin ={loggedIn}
  //     />,
  //       document.getElementById('root')
  //     );
  //   }

    
  // }
  console.log("INDEX : ",{loggedIn}," ",{currentuserRole});
  ReactDOM.render(
      
      <Main
        Loggedin ={loggedIn}
        userRole={currentuserRole}
       />,
      document.getElementById('root')
    );
  }

  
  

  //  ReactDOM.render(
  //       <Main />,
  //       document.getElementById('root')
  //     );
    

// displayApp();



