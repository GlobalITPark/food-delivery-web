import React,{Component}  from 'react';
import User from './containers/User';
import Ticket from './containers/Ticket';
import Landingpage from './containers/Landingpage';
import Program from './containers/Program';
import About from './containers/About';
import Centre from './containers/Centre';
import Products from './containers/Products';
import Dashboard from './containers/Dashboard';
import RaffleDraw from './containers/RaffleDraw';
import Mainlogin from './containers/Mainlogin';
import Mainregister from './containers/Mainregister';
import {BrowserRouter as Router,Route,hashHistory} from 'react-router-dom';
import HeaderUI from './containers/HeaderUI';
import {PrivateRoute,fakeAuth} from './Auth';
import Config from   './config/app';
import firebase from './config/database';
import { PulseLoader } from 'halogenium';
import ScrollToTop from './ScrollToTop';


class Main extends Component{
    constructor(props){
      console.log("MAIN : Constructor");
        super(props);

        this.state = {
            error:'',
            currentUser:null,
            isLoggedIn:false,
            isLoading:true,
            isRegisteredUser:false,
            user:{}

        };

        this.authLogin = this.authLogin.bind(this);
    }

    componentDidMount() {
      console.log("MAIN : ComponentDidMount");
      const _this=this;
      const setUser=(user,isLogin,isReg)=>{
        this.setState({
          currentUser:user,
          isLoggedIn:isLogin,
          isRegisteredUser:isReg
        })
      }

      const setLoading=(isLoading)=>{
        this.setState({
          isLoading:isLoading
        })
      }

      if(Config.firebaseConfig.apiKey){
        firebase.app.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            // if(user.emailVerified===false){
            //   alert("Verify your Email!");
            //   setTimeout(function(){
            //     firebase.app.auth().signOut();
            //   }.bind(this),5000);
              
            // }
            
              console.log("MAIN : User is signed in "+user.email);
              const userRef = firebase.app.firestore().collection("users");
              const allowedRef = firebase.app.database().ref(`/meta/config/allowedUsersWeb`);
  
              userRef.where('email','==',user.email).get()
              .then(snapshot => {
                if(snapshot.empty){
                  console.log("MAIN : User not found in user database");
                  setUser("visitor",true,false);
                  setLoading(false);
                  // <Redirect to='/login'/>
                  // alert("Complete your details");
                  return;
                }
  
                snapshot.forEach(doc => {
                  console.log(doc.id, '=>', doc.data());
  
                  var email = doc.data().email;
                  var userRole = doc.data().userRole;
                  if(email===user.email && userRole==="visitor"){
                    // console.log("INDEX userRole :"+currentuserRole)
                    // fakeAuth.authenticate();
                    setUser(userRole,true,true);
                    setLoading(false)
  
                   
  
                  }else if(email===user.email && userRole==="vendor"){
                    allowedRef.orderByChild("email").equalTo(user.email).once("value")
                    .then(snap => {
                      if(snap.val()){
                          // console.log("INDEX userRole :"+currentuserRole)
                          setUser(userRole,true,true);
                          setLoading(false)
                      
                          
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
                        // console.log("MAIN : userRole :"+userRole)
                        setUser(userRole,true,true);
                        setLoading(false)
                     
                      }else{
                          console.log("This user doens't have access to this admin panel!");
                          alert("This user doens't have access to this admin panel!");
                          firebase.app.auth().signOut();
                      }
                    })
                  }
                })
              })
              .catch(function (error) {
                var errorMessage = error.message;
                console.log(errorMessage);
             
              });
            
            
    
          } else {
            // No user is signed in.
            console.log("MAIN : No user is signed in ");
            setUser(null,false,false);
            setLoading(false)
          }
      })
      }else{
        // No user is signed in.
          console.log("MAIN : No user is signed in, step 1 ");
          setUser(null,false,false)
          setLoading(false)
      }

      // if(Config.firebaseConfig.apiKey){
      //   firebase.app.auth().onAuthStateChanged(function(user) {
      //     if (user) {
      //       // User is signed in.
      //       console.log("MAIN : User is signed in "+user.email);
      //       const userRef = firebase.app.database().ref(`/users`);
      //       const allowedRef = firebase.app.database().ref(`/meta/config/allowedUsers`);
    
      //       userRef.orderByChild("email").equalTo(user.email).once("value")
      //       .then(snapshot=>{
      //           if(snapshot.val()){
      //             // console.log("User found "+user.email);
      //               userRef.orderByKey().once("value")
      //               .then(function(snapshot){
      //                 snapshot.forEach(function(childSnapshot){
      //                   var email = childSnapshot.val().email;
      //                   var userRole = childSnapshot.val().userRole;
      //                   if(email===user.email && userRole==="visitor"){
      //                     // console.log("INDEX userRole :"+currentuserRole)
      //                     // fakeAuth.authenticate();
      //                     setUser(userRole,true,true);
      //                     setLoading(false)

                         
 
      //                   }else if(email===user.email && userRole==="vendor"){
      //                     allowedRef.orderByChild("email").equalTo(user.email).once("value")
      //                     .then(snap => {
      //                       if(snap.val()){
      //                           // console.log("INDEX userRole :"+currentuserRole)
      //                           setUser(userRole,true,true);
      //                           setLoading(false)
                            
                                
      //                       }else{
      //                           console.log("This user doens't have access to this vendor panel!");
      //                           alert("This user doens't have access to this vendor panel!");
      //                           firebase.app.auth().signOut();
                            
      //                       }
      //                     })
      //                   } else if(email===user.email && userRole==="admin"){
    
      //                     allowedRef.orderByChild("email").equalTo(user.email).once("value")
      //                     .then(snap => {
      //                       if(snap.val()){
      //                         // console.log("MAIN : userRole :"+userRole)
      //                         setUser(userRole,true,true);
      //                         setLoading(false)
                           
      //                       }else{
      //                           console.log("This user doens't have access to this admin panel!");
      //                           alert("This user doens't have access to this admin panel!");
      //                           firebase.app.auth().signOut();
      //                       }
      //                     })
      //                   }
                        
      //                 })
      //               }).catch(function (error) {
      //                 var errorMessage = error.message;
      //                 console.log(errorMessage);
                   
      //               });
      //             }else{
      //               console.log("MAIN : User not found in user database");
                   
      //               setUser("visitor",true,false);
      //               setLoading(false);
      //               <Redirect to='/login'/>
      //               alert("Complete your details");
                    
      //               // firebase.app.auth().signOut();
      //             }
      //       })
    
      //     } else {
      //       // No user is signed in.
      //       console.log("MAIN : No user is signed in ");
      //       setUser(null,false,false);
      //       setLoading(false)
      //     }
      // })
      // }else{
      //   // No user is signed in.
      //     console.log("MAIN : No user is signed in, step 1 ");
      //     setUser(null,false,false)
      //     setLoading(false)
      // }
    }

    authLogin(userRole){
      console.log("MAIN : Auth login ");
      const setUser=(user)=>{
        this.setState({
          currentUser:user,
          isLoggedIn:true
        })
      }
      console.log("auth login",userRole);
      setUser(userRole);
      // <Redirect to='/about'/>
      
    }

    authLogout(){
      fakeAuth.signout(()=>this.setState({isLoggedIn:false}));
      // <Redirect to='/' />
    }

    render(){

      if(this.state.isLoading===true){
        return(
          <div style={{marginLeft:'50%',marginTop:'20%'}}><PulseLoader color="#114fda" size="12px" margin="4px"/></div>
        )
      }else{
        console.log("MAIN : State current user - "+this.state.currentUser)
        console.log("MAIN : State isloggedin - "+this.state.isLoggedIn)
        console.log("MAIN : State isRegisteredUser - "+this.state.isRegisteredUser)

        return(
            <Router history={hashHistory}>
              <HeaderUI currentUser={this.state.currentUser} isLoggedIn={this.state.isLoggedIn} >
                <Route exact path={"/"} component={Landingpage}/>
                <Route path="/landing" component={Landingpage}/>
                <Route path="/about" component={About}/>
                <Route path="/centre" component={Centre}/>
                <Route path="/products/:id" component={Products}/>
                <Route path="/program" component={Program}/>
                <Route path="/login" component={(props)=>
                  <Mainlogin
                    isLoggedIn={this.state.isLoggedIn} 
                    isRegisteredUser={this.state.isRegisteredUser}
                    {...props}
                  />}
                />
                <Route path="/register" component={(props)=>
                  <Mainregister
                    isLoggedIn={this.state.isLoggedIn} 
                    isRegisteredUser={this.state.isRegisteredUser}
                    {...props}
                  />}
                />
                <PrivateRoute path="/dashboard" isLoggedIn={this.state.isLoggedIn} component={()=>
                  <Dashboard 
                    currentUser={this.state.currentUser}
                  />}
                />  
                <PrivateRoute path="/account" isLoggedIn={this.state.isLoggedIn} component={()=>
                  <User 
                    currentUser={this.state.currentUser}
                  />}/>
                <PrivateRoute path="/ticket" isLoggedIn={this.state.isLoggedIn} component={()=>
                  <Ticket 
                    currentUser={this.state.currentUser}
                  />}
                />
                <PrivateRoute path="/raffle" isLoggedIn={this.state.isLoggedIn} component={()=>
                  <RaffleDraw 
                    currentUser={this.state.currentUser}
                  />}
                />
              </HeaderUI>
            </Router>

        );
      }

     
      
    }
}
export default Main;
