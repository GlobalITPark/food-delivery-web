import React, { Component } from 'react'
import Config from '../../config/app'
import {BrowserRouter as Router, Link,NavLink } from 'react-router-dom';
import { translate } from '../../translations';

// const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class MainregisterVendorUI extends Component {

    constructor(props) {

        super(props);
        this.state = {
            displayName: '',
            username: '',
            password: '',
            passwordConfirm:'',
            userRole:'Vendor',
            isResetPassword: false,
            checked: false,
            title: '',
            description: ''
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangePasswordConfirm = this.handleChangePasswordConfirm.bind(this);
        this.handleChangeDisplayName = this.handleChangeDisplayName.bind(this);
        this.handleChangeUserRole = this.handleChangeUserRole.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
    }

    handleChangeDisplayName(event){
        this.setState({ displayName: event.target.value }); 
    }   

    handleChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    handleChangePasswordConfirm(event) {
        this.setState({ passwordConfirm: event.target.value });
    }

    handleChangeUserRole(event){
        this.setState({userRole: event.target.value})
    }

    handleChangeTitle(event) {
        this.setState({ title: event.target.value });
    }

    handleChangeDescription(event) {
        this.setState({ description: event.target.value });
    }

    handleSubmit(event) {
        if(!this.state.isResetPassword){
            //when login
            if(!this.state.passwordConfirm){
                alert("Enter confirm password!");
            }else if(this.state.password!==this.state.passwordConfirm){
                alert("Passwords doesn`t match!");
            }else{
                this.props.authenticate(
                    this.state.username, 
                    this.state.password, 
                    this.state.displayName,
                    this.state.userRole,
                    this.state.title,
                    this.state.description
                );
            }
            
        }else{
            this.props.sendPasswordResetLink(this.state.username);
            this.setState({isResetPassword:false})
        }
        event.preventDefault();
    }

    render() {
        const {
            username,
            password,
            passwordConfirm,
          } = this.state;

        const isInvalid =
            password !== passwordConfirm ||
            password === '' ||
            username === '';
        return (
            <div className="wrapper wrapper-full-page">
                    <div className="full-page login-page" data-image="/assets/img/lock.jpeg">
                        <div className="content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="card card-login">
                                            <div style={{background:'#d81b60'}} className="card-header text-center" data-background-color="#d81b60">
                                                <h4 style={{marginTop:'0px',marginBottom:'0px'}} className="card-title">{translate('register')}</h4>
                                            </div>
                                            <div className="card-content">
                                                <h4>{this.props.error}</h4>
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">how_to_reg</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">{translate('restaurantName')}</label>
                                                        <input type="text" value={this.state.title} onChange={this.handleChangeTitle} className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">work</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">{translate('description')}</label>
                                                        <input type="text" value={this.state.description} onChange={this.handleChangeDescription} className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">email</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">{translate('email')}</label>
                                                        <input type="email" value={this.state.username} onChange={this.handleChangeUsername} className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">lock_outline</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">{translate('password')}</label>
                                                        <input type="password" value={this.state.password} onChange={this.handleChangePassword} className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">lock_outline</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">{translate('confirmPassword')}</label>
                                                        <input type="password" value={this.state.passwordConfirm} onChange={this.handleChangePasswordConfirm} className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="footer text-center">
                                                <input type="submit" className="btn btn-danger" />{translate('submit')}
                                            </div>
                                            {/* <div style={{"text-align": "center"}}>
                                                <Link to="/register">
                                                    Register as a user?
                                                </Link>     
                                            </div> */}
                                        </div>
                                    </form> 
                                    </div>
                                </div>
                            </div>
                        </div>
                      
                    </div>
                </div>
            
        )
    }
}
