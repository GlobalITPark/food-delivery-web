import React, { Component } from 'react'
import Config from '../../config/app';

// const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class MainregisterUI extends Component {

    constructor(props) {

        super(props);
        this.state = {
            displayName: '',
            username: '',
            password: '',
            passwordConfirm:'',
            userRole:'',
            isResetPassword: false
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangePasswordConfirm = this.handleChangePasswordConfirm.bind(this);
        this.handleChangeDisplayName = this.handleChangeDisplayName.bind(this);
        this.handleChangeUserRole = this.handleChangeUserRole.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(event) {
        // alert('Username: ' + this.state.username+ " Password: "+this.state.password);
        if(!this.state.isResetPassword){
            //when login
            if(!this.state.passwordConfirm){
                alert("Enter confirm password!");
            }else if(this.state.password!==this.state.passwordConfirm){
                alert("Passwords doesn`t match!");
            }else{
                this.props.authenticate(this.state.username, this.state.password, this.state.displayName,this.state.userRole);
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
                    <div className="full-page login-page" data-image="assets/img/lock.jpeg">
                        <div className="content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="card card-login">
                                            <div style={{background:'#d81b60'}} className="card-header text-center" data-background-color="#d81b60">
                                                <h4 style={{marginTop:'0px',marginBottom:'0px'}} className="card-title">Register</h4>
                                            </div>
                                            <div className="card-content">
                                                {/* {this.props.showGoogleLogin()} */}
                                                <h4>{this.props.error}</h4>
                                                {/* <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">how_to_reg</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">Register As</label>
                                                        <input type="radio" name="userRole" value="visitor" onChange={this.handleChangeUserRole}/>Visitor
                                                        <input type="radio" name="userRole" value="vendor" onChange={this.handleChangeUserRole}/>Vendor
                                                    </div>
                                                </div> */}
                                                {/* <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">how_to_reg</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">Full Name</label>
                                                        <input type="text" value={this.state.displayName} onChange={this.handleChangeDisplayName} className="form-control" />
                                                    </div>
                                                </div> */}
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">email</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">Email address</label>
                                                        <input type="email" value={this.state.username} onChange={this.handleChangeUsername} className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">lock_outline</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">Password</label>
                                                        <input type="password" value={this.state.password} onChange={this.handleChangePassword} className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="material-icons">lock_outline</i>
                                                    </span>
                                                    <div className="form-group">
                                                        <label className="control-label">Confirm Password</label>
                                                        <input type="password" value={this.state.passwordConfirm} onChange={this.handleChangePasswordConfirm} className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="footer text-center">
                                                <input type="submit" className="btn btn-danger" />
                                            </div>
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
