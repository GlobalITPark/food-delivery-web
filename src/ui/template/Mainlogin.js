import React, { Component } from 'react'
import Config from '../../config/app';
import Notification from '../../components/Notification';

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class MainloginUI extends Component {

    constructor(props) {

        super(props);
        this.state = {
            fullName: '',
            username: '',
            password:'',
            dateOfBirth: '',
            gender:'',
            telephone:'',
            nationality:'',
            job:'',
            isResetPassword: false,
            notificationEnabled:false
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeFullName = this.handleChangeFullName.bind(this);
        this.handleChangeDateOfBirth = this.handleChangeDateOfBirth.bind(this);
        this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleChangeTelephone = this.handleChangeTelephone.bind(this);
        this.handleChangeNationality = this.handleChangeNationality.bind(this);
        this.handleChangeJob = this.handleChangeJob.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    handleChangeFullName(event){
        this.setState({ fullName: event.target.value }); 
    }   

    handleChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    handleChangeDateOfBirth(event) {
        this.setState({ dateOfBirth: event.target.value });
    }

    handleChangeGender(event) {
        this.setState({ gender: event.target.value });
    }

    handleChangeTelephone(event) {
        this.setState({ telephone: event.target.value });
    }
    handleChangeNationality(event) {
        this.setState({ nationality: event.target.value });
    }
    handleChangeJob(event) {
        this.setState({ job: event.target.value });
    }

    handleSubmit(event) {
        
        //alert('Username: ' + this.state.username+ " Password: "+this.state.password);
        if(!this.state.isResetPassword){
            //when login
            this.props.authenticate(this.state.username, this.state.password, this.state.fullName);
        }else{
            this.props.sendPasswordResetLink(this.state.username);
            this.setState({isResetPassword:false})
        }
        event.preventDefault();
        
        setTimeout(function(){
            this.setState({notificationEnabled:true});
        }.bind(this),1000);
        setTimeout(function(){
            this.setState({ username: '',password: '',notificationEnabled:false});
        }.bind(this),4000);
        
    }

    createUser(event){
        this.props.createUser(this.state.fullName,this.state.dateOfBirth,this.state.gender,this.state.telephone,this.state.nationality,this.state.job);
        event.preventDefault();
    }

    generateNotifications(error){
        return (
            <div className="col-md-12">
                <Notification type="danger">{error}</Notification>
            </div>
        )

      }

    render() {
        const {
            username,
            password,
          } = this.state;
        const isInvalid =
        password === '' ||
        username === '';
        return (
            <div className="wrapper wrapper-full-page">
                    <div className="full-page login-page">
                        <div className="content">
                            <div className="container">
                                <div className="row">
                                {this.props.isRegisteredUser ?
                                    <div className="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="card card-login">
                                                <div className="card-header text-center" data-background-color="rose">
                                                    <h4 style={{marginTop:'0px',marginBottom:'0px'}} className="card-title">{
                                                        this.state.isResetPassword?"Reset Password":"Login"
                                                    }</h4>
                                                </div>
                                                <div className="card-content">
                                                {!this.state.isResetPassword?
                                                    this.props.showGoogleLogin()
                                                    :
                                                    ""}

                                                    {/* NOTIFICATIONS */}
                                                    {(this.state.notificationEnabled && this.props.error)?this.generateNotifications(this.props.error):""}

                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="material-icons">email</i>
                                                        </span>
                                                        <div className="form-group label-floating">
                                                            <label className="control-label">Email address</label>
                                                            <input type="email" value={this.state.username} onChange={this.handleChangeUsername} className="form-control" />
                                                        </div>
                                                    </div>
                                                    <ConditionalDisplay condition={!this.state.isResetPassword}>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="material-icons">lock_outline</i>
                                                        </span>
                                                        
                                                        <div className="form-group label-floating">
                                                            <label className="control-label">Password</label>
                                                            <input type="password" value={this.state.password} onChange={this.handleChangePassword} className="form-control" />
                                                        </div>
                                                        
                                                    </div>
                                                    </ConditionalDisplay>
                                                </div>
                                                <div className="footer text-center">
                                                    <input disabled={isInvalid} type="submit" className="btn btn-danger" />
                                                </div>
                                                <div style={{"textAlign": "center"}}>
                                                    <a onClick={()=>{ this.setState({isResetPassword: !this.state.isResetPassword} )}} role="button">{
                                                        !this.state.isResetPassword?"Forgot your password?":"Back to Login"
                                                    }</a>
                                                </div>
                                            </div>
                                        </form>            
                                                
                                            
                                    </div>
                                    
                                :
                                
                                <form style={{margin:'0px 10%'}} onSubmit={this.createUser}>
                                    <div className="card card-login">
                                        <div style={{background:'#211c54'}} className="card-header text-center" data-background-color="#0B3C5D">
                                            <h4 style={{marginTop:'0px',marginBottom:'0px'}} className="card-title">Submit you details</h4>
                                        </div>
                                        <div className="card-content">
                                            <h4>{this.props.error}</h4>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="material-icons">how_to_reg</i>
                                                </span>
                                                <div className="form-group">
                                                    <label className="control-label">Full Name</label>
                                                    <input type="text" value={this.state.fullName} onChange={this.handleChangeFullName} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="material-icons">calendar_today</i>
                                                </span>
                                                <div className="form-group">
                                                    <label className="control-label">Date of Birth</label>
                                                    <input type="date" value={this.state.username} onChange={this.handleChangeDateOfBirth} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="material-icons">wc</i>
                                                </span>
                                                <div className="form-group">
                                                    <label className="control-label">Gender</label>
                                                    <div>
                                                        <label>
                                                            <input type="radio" name="gender" value="male" onChange={this.handleChangeGender}/>
                                                            Male
                                                        </label>
                                                        <label>
                                                            <input type="radio" name="gender" value="female" onChange={this.handleChangeGender}  />
                                                            Female
                                                        </label>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="material-icons">local_phone</i>
                                                </span>
                                                <div className="form-group">
                                                    <label className="control-label">Telephone</label>
                                                    <input type="text" value={this.state.displayName} onChange={this.handleChangeTelephone} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="material-icons">public</i>
                                                </span>
                                                <div className="form-group">
                                                    <label className="control-label">Nationality</label>
                                                    <div>
                                                        <label>
                                                            <input type="radio" name="nationality" value="srilankan" onChange={this.handleChangeNationality}/>
                                                            Sri Lankan
                                                        </label>
                                                        <label>
                                                            <input type="radio" name="nationality" value="japanese" onChange={this.handleChangeNationality}  />
                                                            Japanese
                                                        </label>
                                                        <label>
                                                            <input type="radio" name="nationality" value="chinese" onChange={this.handleChangeNationality}  />
                                                            Chinese
                                                        </label>
                                                        <label>
                                                            <input type="radio" name="nationality" value="other" onChange={this.handleChangeNationality}  />
                                                            Other
                                                        </label>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="material-icons">work</i>
                                                </span>
                                                <div className="form-group">
                                                    <label className="control-label">Job</label>
                                                    <input type="text" value={this.state.displayName} onChange={this.handleChangeJob} className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="footer text-center">
                                            <input type="submit" className="btn btn-danger" />
                                        </div>
                                    </div>
                                </form> 
                                }   
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}
