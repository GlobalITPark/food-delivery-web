/*eslint array-callback-return: "off"*/
import React, { Component } from 'react'
import firebase from '../config/database'
import Config from   './../config/app'
import Card from './../ui/template/Card'
import SkyLight from 'react-skylight';
import QRCode from 'qrcode.react';
import fire from 'firebase';
import Notification from '../components/Notification';
import ReactTable from "react-table";
import {Redirect} from 'react-router-dom';



var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class Ticket extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      user: {},
      tickets:[],
      qr_code:"",
      qr_status:"",
      newTicketNo:"",
    }

    
    this.authListener = this.authListener.bind(this);
    this.getTicketDataFromFirestore = this.getTicketDataFromFirestore.bind(this);
    this.viewPurchase = this.viewPurchase.bind(this);
    this.purchaseTicket = this.purchaseTicket.bind(this);
    this.cancelPurchase = this.cancelPurchase.bind(this);
    this.viewQRdialog = this.viewQRdialog.bind(this);
    this.cancelviewQRCode = this.cancelviewQRCode.bind(this);

  }

  componentDidMount(){
    this.authListener();
  }

  componentWillMount(){
    this.getTicketDataFromFirestore();
  }
  
  authListener(){
    const _this=this;
    const ref = firebase.app.firestore().collection("qrcode_collection");

    const setUser=(user)=>{
    this.setState({user:user})
    }

    //Now do the listner
    firebase.app.auth().onAuthStateChanged(function(user) {
    if (user) {
        setUser(user);
        // User is signed in.
        console.log("User has Logged  in Master");
        console.log(user.email);
        ref.get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
              // const {content} = doc.data();
              // console.log("doc data", doc.data());
              // posts.push({
              //     key:doc.id,
              //     content
              // });
              if(doc.data().user===_this.state.user.email){
                _this.setState({
                  qr_code:doc.data().qr_code,
                  qr_status:doc.data().status
                })
                
              }
          });

      })
        
    } else {
        // No user is signed in.
        console.log("User has logged out Master");
    }
    });

    }

    getTicketDataFromFirestore(){
      const _this=this;
      const tickets = [];
      const ref = firebase.app.firestore().collection("ticket_collection");
      ref.get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
              // const {content} = doc.data();
              // console.log("doc data", doc.data());
              // posts.push({
              //     key:doc.id,
              //     content
              // });
              if(doc.data().user===_this.state.user.email){
                tickets.push(doc.data())
              }
          });
  
          _this.setState({
            tickets:tickets
          })
      })
    }

    viewPurchase(){
      const _this=this;
      this.refs.puchaseTicket.show();
      const db = firebase.app.firestore();
      const ticketStatsRef = db.collection('ticket_collection').doc('--ticket_stats--');
      ticketStatsRef.get()
      .then(doc => {
        if(!doc.exists){
          console.log("No such document!");
        } else{
          console.log('Document data:', doc.data());
          _this.setState({
            newTicketNo:doc.data().ticket_count+1
          });
        }
      })
    }

    purchaseTicket(){
      const _this=this;
      const db = firebase.app.firestore();
      const increment = fire.firestore.FieldValue.increment(1);
   
      const ticketStatsRef = db.collection('ticket_collection').doc('--ticket_stats--');
      const ticketRef = db.collection('ticket_collection').doc();
 
      const batch = db.batch();
      batch.set(ticketRef,{tickNo:this.state.newTicketNo,user:this.state.user.email});
      batch.set(ticketStatsRef,{ticket_count:increment},{merge:true});
      batch.commit();
      this.refs.puchaseTicket.hide();
      _this.setState({notifications:[{type:"success",content:"Purchased Ticket successfully!"}]});
      _this.refreshDataAndHideNotification();
    }

    viewQRdialog(){
        this.refs.viewQRCode.show();
    }

    cancelPurchase(){
        this.refs.puchaseTicket.hide();
    }

    cancelviewQRCode(){
        this.refs.viewQRCode.hide();
    }

    generateNotifications(item){
      return (
          <div className="col-md-12">
              <Notification type={item.type} >{item.content}</Notification>
          </div>
      )
    }

    resetDataFunction(){
      this.getTicketDataFromFirestore();
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
  if(this.props.currentUser !== 'visitor'){
    return(
      <Redirect to="/"/>

    )
  }

    const ticket = this.state.tickets.map((ticket, index) =>
      <Ticketview key={index} value={ticket} />
    );
    return (
        <div className="wrapper wrapper-full-page">
        <div className="full-page landing-page">
            <div className="content">
                <div className="section intro-section">
                    <div className="container w-container">
                        <div className="section-title-wrapper intro">
                            <h2 className="section-title">Gifts & Tickets</h2>
                            <div className="section-divider"></div>
                            <div className="section-title subtitle">
                            </div>
                        </div>

                        <div className="card">
                            <div style={{margin:"20px"}} className="card-body">
                            <div className="card-title"><h4 style={{marginBottom:"0px"}}>Gifts</h4> Claim your gift for your successful registration</div>
                            <hr/>
                            <div className="col-lg-5 col-md-5 col-xs-5">
                                <p>Successful Registration gift</p>
                            </div>
                            <div className="col-lg-5 col-md-5 col-xs-5">
                                <p>{this.state.qr_code}{this.state.qr_code==="" ? "-" :<a onClick={()=>this.viewQRdialog()} className="btn btn-sm btn-default">QRCODE</a>}</p>
                            </div>
                            <div className="col-lg-2 col-md-2 col-xs-2">
                              {this.state.qr_code==="" ? "-" :<div className="badge badge-primary">{this.state.qr_status==="1" ? "Available" : "Redeemed"}</div>}
                            </div>
                            <hr/>
                            </div>
                        </div>

                        <div className="card">
                            <div style={{margin:"20px"}} className="card-body">
                                <div className="card-title">
                                    <h4 style={{marginBottom:"0px"}}>
                                        <button onClick={()=>this.viewPurchase()} style={{float:"right"}} type="button" className="btn btn-primary">Purchase Ticket</button>
                                        Ticket Purchase
                                    </h4>
                                    Your gifts vouchers to claim

                                    {/* NOTIFICATIONS */}
                                    {this.state.notifications?this.state.notifications.map((notification)=>{
                                        return this.generateNotifications(notification)
                                    }):""}
                                </div> 
                                <hr/>
                                {ticket}
                               
                            </div>
                        </div>

                        <div className="card">
                            <div style={{margin:"20px"}} className="card-body">
                                <div className="card-title">
                                    <h4 style={{marginBottom:"0px"}}>
                                        Raffle Results
                                    </h4>
                                    Find your ticket numbers!!

                                </div> 
                                <hr/>
                                <Raffleresults/>
                               
                            </div>
                        </div>
                    </div>
                </div>

               
            
            </div>
        
        </div>

        <SkyLight hideOnOverlayClicked ref="puchaseTicket" title="">
          <span><h3>Purchase Ticket</h3></span>
          <div className="col-md-12">
              <h5>Your Ticket No : {this.state.newTicketNo}</h5>
          </div>
          <div className="col-sm-12" style={{marginTop:80}}>
            <p>Are you sure you want to purchase the ticket?</p>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelPurchase} className="btn btn-info center-block">Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.purchaseTicket} className="btn btn-danger center-block">Purchase</a>
            </div>

          </div>
        </SkyLight>

        <SkyLight dialogStyles={{height:'50%'}} hideOnOverlayClicked ref="viewQRCode" title="">
          <h4>Your QRCode</h4>
          <div style={{textAlign:'center'}} className="col-md-12">
            <QRCode value={this.state.qr_code}></QRCode>
          </div>
          <div className="col-sm-12" style={{}}>
            <div style={{float:"right"}} className="col-sm-3 center-block">
              <a onClick={this.cancelviewQRCode} className="btn btn-info center-block">Cancel</a>
            </div>
          </div>

        </SkyLight>
    </div>
    )
  }
}

class Ticketview extends Component {
  render() {
      return (
        <div className="row">
          <div className="col-lg-5 col-md-5 col-xs-5">
            <p>Raffel ticket</p>
          </div>
          <div className="col-lg-5 col-md-5 col-xs-5">
              <p>{this.props.value.tickNo}</p>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-2">
              <div className="badge badge-primary">Raffle</div>
          </div>
        </div>
      )
  }
}

class Raffleresults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winners:[],
    }

    this.getWinnersDataFromFirestore = this.getWinnersDataFromFirestore.bind(this);
  }

  componentDidMount(){
    this.getWinnersDataFromFirestore();
  }

  getWinnersDataFromFirestore(){
    const _this=this;
    const winners = [];
    const ref = firebase.app.firestore().collection("raffle_results");
    ref.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc) {
            const content = doc.data();
            // console.log("doc data", doc.data());
            
            if(doc.id==="--raffle_stats--"){
              _this.setState({
                isRaffleDone:doc.data().isRaffleDone,
                raffleStatus:doc.data().status,
                selected_winners:doc.data().selected_winners
              });
            }else{
              winners.push({
                place:doc.id,
                content
            });
            }
            
        });

        _this.setState({
          winners:winners
        })
    })
  }

  render() {
    const columns = [{
      Header: '#',
      accessor: 'place' // String-based value accessors!
    }, {
      Header: 'Ticket No',
      accessor: 'content.ticket_no',
    }]
      return (
        <ReactTable
          key={this.state.pageLength}
          data={this.state.winners}
          columns={columns}
          className="-striped -highlight"
          pageSize={this.state.winners.length}
          showPagination={false}  
        />
      )
  }
}
