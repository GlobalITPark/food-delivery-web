/*eslint no-useless-constructor: "off"*/
import React, {Component} from 'react';
import NavBar from './../ui/template/NavBar';
import CardUI from './../ui/template/Card';
import ReactTable from "react-table";
import firebase from '../config/database';
import SkyLight from 'react-skylight';
import Notification from '../components/Notification';
// import NavBarDefault from './../ui/template/NavBarDefault'

class App extends Component {
  constructor(props){
    super(props);

    this.state={
      userDetails:[],
      pageLength:null,
      userRow:[],
      isApproved:false,
    }

    this.getUserDataFromDatabase=this.getUserDataFromDatabase.bind(this);
    this.doApprove=this.doApprove.bind(this);
    this.doDelete=this.doDelete.bind(this);
    this.approveFieldAction=this.approveFieldAction.bind(this);
    this.infoFieldAction=this.infoFieldAction.bind(this);
    this.deleteFieldAction=this.deleteFieldAction.bind(this);
    this.cancelDelete=this.cancelDelete.bind(this);
    this.cancelApprove=this.cancelApprove.bind(this);
    this.cancelInfo=this.cancelInfo.bind(this);
    this.resetDataFunction=this.resetDataFunction.bind(this);
    this.refreshDataAndHideNotification=this.refreshDataAndHideNotification.bind(this);
    this.updateRestaturantActiveStatus=this.updateRestaturantActiveStatus.bind(this);

    
  }
  componentDidMount(){
    //Uncomment if you want to do a edirect
    //this.props.router.push('/fireadmin/clubs+skopje+items') //Path where you want user to be redirected initialy
    this.getUserDataFromDatabase();
  }

  getUserDataFromDatabase(){
    var _this =this;

    // const userRef = firebase.app.database().ref(`/users`);
    const userRef = firebase.app.firestore().collection("users");
    const allowedRef = firebase.app.database().ref(`/meta/config/allowedUsers`);

    var userDetails=[];

    userRef.where('userRole','==','vendor').where('iscomplete','==',0).get()
    .then(snapshot => {
      if(snapshot.empty){
        console.log('No matching documents.');
        return;
      }

      snapshot.forEach(doc => {
        var content = doc.data();
        userDetails.push({
          key:doc.id,
          content
        })
      });
      _this.setState({pageLength:userDetails.length,
        userDetails:userDetails,
        pageLength:userDetails.length
        
      })
    })
    .catch(error =>{
      console.log('Error getting documents', error);
    })

    
    
    // userRef.orderByKey().once("value")
    // .then(function(snapshot){
    //   snapshot.forEach(function(snap){
    //     var content = snap.val();
    //     var iscomplete = snap.val().iscomplete;
    //     var userRole = snap.val().userRole;
    //     if(userRole!=="visitor" && iscomplete===0){
    //       userDetails.push({
    //         key:snap.key,
    //         content
    //       })
    //     }
    //   })

    //   _this.setState({pageLength:userDetails.length,
    //     userDetails:userDetails,
    //     pageLength:userDetails.length
        
    //   })
    // })
  }

  approveFieldAction(row){
    this.refs.approveDialog.show();

    this.setState({
      userRow:row
    })
   
  }

  doApprove(){
    const _this = this;

    var key = this.state.userRow.original.key;
    var email = this.state.userRow.original.content.username;
    var userRole = this.state.userRow.original.content.userRole;

    const allowedUserRef = firebase.app.database().ref('/meta/config/allowedUsersWeb/'+key);

    // const newUserRef = allowedUserRef.push();

    allowedUserRef.set({
      email:email,
      type:userRole
    }, function(error) {
      if (error) {
        console.log("erroe",error);
      } else {
        const ref = firebase.app.firestore().collection("users").doc(key);
        ref.update({
          iscomplete:1
        })
        _this.updateRestaturantActiveStatus();
        _this.refs.approveDialog.hide();
        _this.refs.infoDialog.hide();
        _this.setState({notifications:[{type:"success",content:email+" approved successfully!"}]});
        _this.refreshDataAndHideNotification();
      }
    })
  }

  updateRestaturantActiveStatus(){
    const restId = this.state.restId;
    console.log("updateRestaturantActiveStatus",restId);
    if(restId){
      const ref = firebase.app.firestore().collection("restaurant_collection").doc(restId);
      ref.update({
        active_status:1
      })
    }
  }

  infoFieldAction(row){
    console.log("info field");
    this.setState({
      restId:"",
      title:"",
      owner:"",
      image:""
    })
    const _this=this;
    this.refs.infoDialog.show();
    var vendorEmail = row.original.content.username;
    const restInfo = [];
    firebase.app.firestore().collection("restaurant_collection").where('owner','==',vendorEmail).limit(1).get()
    .then(snapshot =>{
      if(snapshot.empty){
        return;
      }

      snapshot.forEach(doc => {
        _this.setState({
          restId:doc.id,
          title:doc.data().title,
          owner:doc.data().owner,
          image:doc.data().image
        })
      });

      
    console.log(this.state.restId);
    })

    this.setState({
      userRow:row
    })
  }

  deleteFieldAction(row){
    this.refs.deleteDialog.show();

    this.setState({
      userRow:row
    })
  }

  doDelete(){
    const _this = this;

    var key = this.state.userRow.original.key;
    var email = this.state.userRow.original.content.username;

    const ref = firebase.app.firestore().collection("users").doc(key);
    ref.update({
      userRole:"visitor"
    }).then(function(){
      _this.refs.deleteDialog.hide();
      _this.setState({notifications:[{type:"success",content:email+" removed successfully!"}]});
      _this.refreshDataAndHideNotification();
    }).catch(function(error){
      console.log(error.message);
    })

    // const ref = firebase.app.database().ref('users/'+key);

    // ref.remove(function(error) {
    //   if (error) {
    //     console.log("erroe",error);
    //   } else {
    //     _this.refs.deleteDialog.hide();
    //     _this.setState({notifications:[{type:"success",content:email+" removed successfully!"}]});
    //     _this.refreshDataAndHideNotification();
    //   }
    // })
  }

  cancelDelete(){
    this.refs.deleteDialog.hide()
  }

  cancelApprove(){
    this.refs.approveDialog.hide();
  }

  cancelInfo(){
    this.refs.infoDialog.hide()
  }

  generateNotifications(item){
    return (
        <div className="col-md-12">
            <Notification type={item.type} >{item.content}</Notification>
        </div>
    )
  }

  resetDataFunction(){
    this.getUserDataFromDatabase();
  }

  refreshDataAndHideNotification(refreshData=true,time=3000){
    //Refresh data,
    if(refreshData){
      this.resetDataFunction();
    }

    //Hide notifications
    setTimeout(function(){this.setState({notifications:[]})}.bind(this), time);
  }


  render() {
    const columns = [{
      Header: 'Full Name',
      accessor: 'content.fullName' // String-based value accessors!
    }, {
      Header: 'User Name',
      accessor: 'content.username',
    },{
      Header: 'User Role', // Custom header components!
      accessor: 'content.userRole'
    },
    // {
    //   Header: 'Date of birth', // Custom header components!
    //   accessor: 'content.dateofbirth'
    // },
    // {
    //   Header: 'gender', // Custom header components!
    //   accessor: 'content.gender'
    // },
    // {
    //   Header: 'job', // Custom header components!
    //   accessor: 'content.job'
    // },
    // {
    //   Header: 'nationality', // Custom header components!
    //   accessor: 'content.nationality'
    // }, 
    // {
    //   Header: 'telephone', // Custom header components!
    //   accessor: 'content.telephone'
    // },
    {
      Header: 'Action',
      filterable:false,
      Cell: row => 
        <span>
          {/* <button onClick={()=>this.approveFieldAction(row)} type="button" className="btn btn-success btn-sm">Approve</button> */}
          <button onClick={()=>this.deleteFieldAction(row)} type="button" className="btn btn-danger btn-sm">Delete</button>
          <button onClick={()=>this.infoFieldAction(row)} type="button" className="btn btn-success btn-sm">Approve</button>

        </span>
    }
  ]
    return (
      <div className="content">
        <NavBar/>

        {/* NOTIFICATIONS */}
        {this.state.notifications?this.state.notifications.map((notification)=>{
            return this.generateNotifications(notification)
        }):""}

        <CardUI title="Approve Users">
          <ReactTable
            key={this.state.pageLength}
            data={this.state.userDetails}
            filterable
            columns={columns}
            className="-striped -highlight"
            defaultPageSize={this.state.pageLength}
            showPagination={false}  
          />
        </CardUI>

        <SkyLight hideOnOverlayClicked ref="deleteDialog" title="">
          <span><h4 className="center-block">Delete user</h4></span>
          <div className="col-md-12">
              <Notification type="danger" >Are you sure you want to delete this user?</Notification>
          </div>

          <div className="col-sm-12" style={{marginTop:80}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelDelete} className="btn btn-info">Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.doDelete} className="btn btn-danger">Delete</a>
            </div>

          </div>

        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="approveDialog" title="">
          <span><h4 className="center-block">Approve user</h4></span>
          <div className="col-md-12">
              <Notification type="danger" >Are you sure you want to approve this user?</Notification>
          </div>

          <div className="col-sm-12" style={{marginTop:80}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelApprove} className="btn btn-info">Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.doApprove} className="btn btn-danger">Approve</a>
            </div>

          </div>

        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="infoDialog" title="">
          <span><h4 className="center-block">Approve user</h4></span>
          <div className="col-md-12">
              <Notification type="danger" >Are you sure you want to approve this user?</Notification>
          </div>
          {this.state.owner?
            <div className="col-md-12">
              <p>Restaurant Name:{this.state.title}</p>
              <p>Restaurant Owner:{this.state.owner}</p>
            </div>
            :
            <div className="col-md-12">
              <h5>User has no restaturant</h5>
            </div>
          }
          

          <div className="col-sm-12" style={{marginTop:40}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelInfo} className="btn btn-info">Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.doApprove} className="btn btn-danger">Approve</a>
            </div>

          </div>

        </SkyLight>

      </div>

      
    )
  }
}
export default App;
