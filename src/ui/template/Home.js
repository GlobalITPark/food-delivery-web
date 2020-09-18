/*eslint no-unused-vars: "off"*/
/*eslint no-script-url: "off"*/
/*eslint no-unused-expressions: "off"*/
/*eslint array-callback-return: "off"*/
import React, { Component } from 'react'
import Config from   './../../config/app';
var pjson = require('../../../package.json');
import NavItem from '../../components/NavItem'
import { Link } from 'react-router'
import firebase from '../../config/database'
import {Layout, Header, Navigation, Content} from 'react-mdl';

export default class HomeUI extends Component {

    constructor(props) {

        super(props);
        this.state = {};

       
    }

    render() {
        return (
           

            // <div style={{height: '300px', position: 'relative'}}>
            //     <Layout fixedHeader>
            //         <Header title={<span><span style={{ color: '#ddd' }}></span><strong>Sri Lankan day Festival</strong></span>}>
            //             <Navigation>
            //                 <Link to="/">Home</Link>
            //                 <Link to="/about">about</Link>
            //                 <Link to="/centre">Centres</Link>
            //                 <Link to="/contact">Contact</Link>
            //             </Navigation>
            //             <a><i className="material-icons">fingerprint</i>Login</a>
                    
            //         </Header>
                
            //         <Content>
            //             {this.props.children}
            //         </Content>
            //     </Layout>
            // </div>
            
            <div>
                <nav className="navbar navbar-primary navbar-absolute">{/*navbar-tranparent*/}
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">
                                {/* {Config.adminConfig.appName} */}
                                Sri Lankan Festival
                            </a>
                        </div>
                        <div className="collapse navbar-collapse">
                            
                                
                                {!this.props.isLoggedIn ?
                                    <ul className="nav navbar-nav navbar-right">
                                        <li>
                                            <Link to="/">Home</Link> 
                                        </li>
                                        <li>
                                            <Link to="/about">About</Link> 
                                        </li>
                                        <li>
                                            <Link to="/centre">Centres</Link> 
                                        </li>
                                        <li>
                                            <Link to="/contact">Contact</Link> 
                                        </li>
                                        <li className={this.props.isRegister ? "active" : ""}>
                                            <Link to="/login">
                                                <a className="nav-link" role="button" onClick={()=> {this.props.changeIsLogin(true)} }>
                                                    <i className="material-icons">fingerprint</i>Login
                                                </a>
                                            </Link>
                                            
                                        </li>
                                        <li className={this.props.isRegister ? "active" : ""} >
                                            <Link to="/register">
                                                <a className="nav-link" role="button" onClick={()=> {this.props.changeIsLogin(false)} }>
                                                    <i className="material-icons">how_to_reg</i>Register
                                                </a>
                                            </Link>
                                            
                                        </li>
                                    </ul>
                                     : 
                                    <ul className="nav navbar-nav navbar-right">
                                        <li>
                                            <Link to="/">Home</Link> 
                                        </li>
                                        <li>
                                            <Link to="/about">About</Link> 
                                        </li>
                                        <li>
                                            <Link to="/centre">Centres</Link> 
                                        </li>
                                        <li>
                                            <Link to="/contact">Contact</Link> 
                                        </li>
                                        <li>
                                            <Link to="/dashboard">Dashboard</Link> 
                                        </li>
                                       
                                    </ul>
                                     
                                }
                                
                                {/* {
                                   Config.adminConfig.allowRegistration ?
                                   (<li className={this.props.isRegister ? "active" : ""} >
                                   <a className="nav-link" role="button" onClick={()=> {this.props.changeIsLogin(false)} }>
                                       <i className="material-icons">how_to_reg</i>Register
                                   </a>
                                   </li>) : ""
                                } */}
                            
                        </div>
                    </div>
                </nav>
                
                <div className="wrapper wrapper-full-page">
                    <div className="full-page login-page" data-image="assets/img/lock.jpeg">
                        <div className="content">
                            <div className="container">
                                <div className="row">
                                {this.props.children}
                                </div>
                            </div>
                        </div>
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
               
                
            </div>
        )
    }
}
