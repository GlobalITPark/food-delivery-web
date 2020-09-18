/*eslint no-unused-vars: "off"*/
/*eslint no-script-url: "off"*/
/*eslint no-unused-expressions: "off"*/
/*eslint array-callback-return: "off"*/
import React, { Component } from 'react'
import {BrowserRouter as Router, Link,NavLink } from 'react-router-dom'
// import { Link } from 'react-router'
import firebase from '../config/database'
var md5 = require('md5');

export default class HeaderUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
          }

          this.createUserView = this.createUserView.bind(this);
          this.handleLogout = this.handleLogout.bind(this);
   
    }

    componentDidMount(){
        this.authListener();
    }
      
    authListener(){
    console.log("HEADER : componentDidMount");
    const setUser=(user)=>{
    this.setState({user:user})
    }

    //Now do the listner
    firebase.app.auth().onAuthStateChanged(function(user) {
    if (user) {
        setUser(user);
       
        
    } else {
        // No user is signed in.
        console.log("HEADER : No user is signed in.");
    }
    });
    }
      
      /**
   * Logout function
   * @param {Event} e 
   */
  handleLogout(e) {
    e.preventDefault();

    console.log('HEADER : The Logout link is clicked');
    firebase.app.auth().signOut();
  }
    
    //Create user dropdown menu in navigation
    createUserView(){
    var userPhoto=this.state.user.photoURL?this.state.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.state.user.email+"")+"?s=512";
    return (
        <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><img alt="" className="img-circle img-responsive fireadmin-user_image" src={userPhoto} /></a>
            
            <ul className="dropdown-menu userDropdownMenu" role="menu">
            <li><a>{this.state.user.email}</a></li>
            <li><Link to="/account">Account</Link></li>
            {(this.props.isLoggedIn && (this.props.currentUser!=="visitor")) ?                            
            <li>
                <Link to="/dashboard">Dashboard</Link> 
            </li>
            :""
            }
            {(this.props.isLoggedIn && (this.props.currentUser==="visitor")) ?                            
            <li>
                <Link to="/ticket">Ticket</Link> 
            </li>
            :""
            }{(this.props.isLoggedIn && (this.props.currentUser==="admin")) ?                            
            <li>
                <Link to="/raffle">Raffle</Link> 
            </li>
            :""
            }
            <li className="divider" />
            <li role="button"><a onClick={this.handleLogout}>Logout</a></li>
            </ul>
        </li>
    );
    }

    render() {

       console.log("HEADER : isLoggedin - "+this.props.isLoggedIn)
       console.log("HEADER : Props Current user - "+this.props.currentUser)
       
        return (

        <div>
                <nav style={{padding:"0"}} className="navbar navbar-primary navbar-fixed-top">{/*navbar-tranparent*/}
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a style={{width:'80%'}} className="navbar-brand" href="#">
                                {/* {Config.adminConfig.appName} */}
                                {/* Ceylon One */}
                                <img style={{marginTop:'-12px'}} alt="" src="assets/img/Ceylon one Wide.png"></img>
                            </a>
                        </div>
                        <div className="collapse navbar-collapse">
                        
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <NavLink exact activeStyle={{backgroundColor:'#0000003a'}} to="/">ホーム</NavLink> 
                            </li>
                            {/* <li>
                                <NavLink exact activeStyle={{backgroundColor:'#0000003a'}} to="/about">About</NavLink> 
                            </li> */}
                            <li>
                                <NavLink exact activeStyle={{backgroundColor:'#0000003a'}} to="/centre">レストラン</NavLink> 
                            </li>
                            <li>
                                <NavLink exact activeStyle={{backgroundColor:'#0000003a'}} to="/program">プログラム</NavLink> 
                            </li>
                            
                            {!this.props.isLoggedIn ?
                            <li className={this.props.isRegister ? "active" : ""}>
                                <NavLink exact activeStyle={{backgroundColor:'#fffcff1a'}} to="/login">
                                    <a style={{color:'#ff4307'}} className="nav-link" role="button" >
                                        <i className="material-icons">fingerprint</i>ログイン
                                    </a>
                                </NavLink>
                                
                            </li>
                            :
                            // <li>
                            //     <Link to="/login"><a onClick={this.logout}>Logout</a></Link> 
                            // </li>
                            // <AuthButton/>
                            ""
                            }

                            {!this.props.isLoggedIn ?
                            <li className={this.props.isRegister ? "active" : ""} >
                                <NavLink exact activeStyle={{backgroundColor:'#fffcff1a'}} to="/register">
                                    <a style={{color:'#ff4307'}} className="nav-link" role="button" >
                                        <i className="material-icons">how_to_reg</i>登録
                                    </a>
                                </NavLink>
                                
                            </li>
                            :
                            this.createUserView()
                            }

                            {(this.props.isLoggedIn && (this.props.currentUser==="visitor")) ?
                            <li>
                                <NavLink exact activeStyle={{backgroundColor:'#fffcff1a'}} to="/cart"><i className="material-icons">shopping_cart</i></NavLink> 
                            </li>
                            :""
                            }
                            
                            
                        </ul>
                                    
                        </div>
                    </div>
                </nav>
                    
                {this.props.children}

                <footer className="footer" style={{backgroundColor:'#353535'}}>
                    <div className="container w-container">
                        <div className="footer-row w-row">
                            <div className="footer-column first w-col w-col-10">
                                <div className="footer-title">フェスティバルについて</div>
                                <div className="section-divider"></div>
                                <p style={{color:'#b8b8b8'}}>
                                スリランカビジネス協議会が主催するスリランカフェスティバルは、100を超えるブースや売店、主にスリランカで行われた製品のマーケティングや企画で構成されています。本格的なスリランカの飲食物を提供するフェスティバルのフードマートには35軒以上の屋台があります。その他衣料品、宝石＆ジュエリー、手工芸品、装飾品、金融、銀行サービスから占星術やアーユルヴェーダのサービスまで、数多くのスリランカの製品やサービスがブースや屋台で販売されています。                                </p>
                                <p style={{color:'#b8b8b8'}}>
                                            <em>主催者</em>
                                            <br></br>
                                            <strong>スリランカビジネス協議会</strong>
                                            <br></br>
                                            C / Oスリランカ大使館、2丁目-1-54東京都港区高輪1-55
                                            <br></br>
                                        </p>
                            </div>

                            <div className="footer-column w-col w-col-2">
                                <div className="footer-title">お問い合わせ</div>
                                <div className="section-divider"></div>
                                <ul className="footer-list w-list-unstyled">
                                    <li className="footer-list-item">
                                        
                                    </li>
                                    <li className="footer-list-item">
                                        <a style={{color:'#b8b8b8'}} className="link footer-link" href="tel:03-6868-8666"><strong>電話</strong>: 03-6868-8666</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a style={{color:'#b8b8b8'}} className="link footer-link email-link" href="mailto:info@srilankafestival.jp"><strong>メール</strong>: info@srilankafestival.jp</a>
                                    </li>
                                </ul>
                            </div>

                            
                        </div>
                    </div>
                </footer>
                {/* <div className="wrapper wrapper-full-page">
                    <div className="full-page login-page">
                        {this.props.children}
                        <footer className="footer">
                            <div className="container">
                                <nav className="pull-left">
                                    <ul>

                                    </ul>
                                </nav>
                                <p className="copyright pull-right">

                                    &copy;
                                <script>
                                        document.write(new Date().getFullYear())
                                </script>
                                    {Config.adminConfig.appName}


                                </p>
                            </div>
                        </footer>
                    </div>
                </div>
                */}
                
            </div>
       
             
            
        )
    }
}
