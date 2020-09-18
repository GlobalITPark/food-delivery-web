/*eslint no-unused-vars: "off"*/
import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './Admin';
import Login from './Login';
import Main from './Main';
import Splash from './Splash';
import Config from   './config/app';
import design from   './ui/template/Config';
import * as FirebaseSDK from 'firebase';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
require("firebase/firestore");

//console.log = function() {}
import firebase from './config/database'
import { fakeAuth } from './Auth';

//Remove data fethced
var configReceived=!Config.remoteSetup;

// if(Config.remoteSetup){
//   //Do a remote setuo of the admin
//   var connectionPath=Config.remotePath;
//   if(Config.allowSubDomainControl){
//     //Control by subdomain
//     connectionPath=Config.subDomainControlHolder+window.THE_DOMAIN;
//   }
//   var fetcherFirebaseApp = FirebaseSDK.initializeApp(Config.firebaseConfig,"fetcher");
//   fetcherFirebaseApp.database().ref(connectionPath).once('value').then(function(snapshot) {
//     console.log("hi",snapshot.val())
//     Config.firebaseConfig=snapshot.val().firebaseConfig;
//     Config.adminConfig=snapshot.val().adminConfig;
//     Config.navigation=snapshot.val().navigation;
//     Config.pushSettings=snapshot.val().pushSettings;
//     firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
//     configReceived=true;
//     checkLoginStatus();
//     displayApp();
//   });
// }else{
//   // Legacy, local setup
//   firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
//   checkLoginStatus();
//   displayApp();
// }
firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");

ReactDOM.render(<Main />,document.getElementById('root'));
    




