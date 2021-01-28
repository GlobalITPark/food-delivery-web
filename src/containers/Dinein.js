import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from '../config/database';
import { browserHistory } from 'react-router';
import SkyLight from 'react-skylight';
import {Redirect} from 'react-router-dom';
import Notification from '../components/Notification';




class Dinein extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            centreId:'',
            centreName:null,
            user_name: '',
            phone: '',
            no_of_seats: '',
            date:'',
            time: '',
            instruction: '',
            dineInOrders:[],
        };
        
        this.getDineinDetailsFromFirestore = this.getDineinDetailsFromFirestore.bind(this);
        this.viewReserveDinein = this.viewReserveDinein.bind(this);
        this.requestDinein = this.requestDinein.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePhone = this.handleChangePhone.bind(this);
        this.handleChangeSeats = this.handleChangeSeats.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleChangeInstruction = this.handleChangeInstruction.bind(this);


    }

    componentDidMount(){
        this.authListener();
    }

    authListener(){
        const _this=this;
        const setUser=(user)=>{
        this.setState({user:user})
        }

        //Now do the listner
        firebase.app.auth().onAuthStateChanged(function(user) {
            if (user) {
            setUser(user);
            // User is signed in.
            console.log("User has Logged  in Master");
            console.log(user);
            
            } else {
            // No user is signed in.
            console.log("User has logged out Master");
            }
        });   
    }

    handleChangeName(event){
        this.setState({ user_name: event.target.value }); 
    }

    handleChangePhone(event){
        this.setState({ phone: event.target.value }); 
    }

    handleChangeSeats(event){
        this.setState({ no_of_seats: event.target.value }); 
    }

    handleChangeDate(event){
        this.setState({ date: event.target.value }); 
    }

    handleChangeTime(event){
        this.setState({ time: event.target.value }); 
    }

    handleChangeInstruction(event){
        this.setState({ instruction: event.target.value }); 
    }

    componentWillMount() {
        const { match: { params } } = this.props;
        console.log( "dine in",this.props);

        const _this=this;
        const collectionRef = firebase.app.firestore().collection("restaurant_collection");
        const collection = collectionRef.doc(params.id);

        collection.get().then(function(doc){
            _this.setState({
                centreId:doc.id,
                centreName:doc.data().title,
                centreDesc:doc.data().description,
                centreImage:doc.data().image
            })
        })

        this.getDineinDetailsFromFirestore();


    }

    getDineinDetailsFromFirestore(){
        console.log("getDineinDetailsFromFirestore");
        const _this=this;
        const dinein = [];
        const ref = firebase.app.firestore().collection("dinein");
        ref.get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                if(doc.data().userEmail===_this.state.user.email){
                    dinein.push(doc.data())
                }
            });
    
            _this.setState({
              dineInOrders:dinein
            })
        })
      }

      viewReserveDinein(){
        this.refs.reserveDinein.show();
      }

    requestDinein(event){
        const { match: { params } } = this.props;
        console.log( "requestDinein params",params);

        const getTimestamp = () => {
            const firebase = require('firebase'); // eslint-disable-line global-require
            require('firebase/firestore'); // eslint-disable-line global-require
            return firebase.firestore.FieldValue.serverTimestamp();
        }

        if(this.state.user_name&&this.state.phone&&this.state.no_of_seats&&this.state.date&&this.state.time&&this.state.user_name.length>0&&this.state.phone.length>0){
            var dineinOrder={
            userEmail:this.state.user.email,
            userID:this.state.user.uid,
            userName:this.state.user_name,
            phone:this.state.phone,
            noOfSeats:this.state.no_of_seats,
            dineInDate:this.state.date,
            dineInTime:this.state.time,
            instruction:this.state.instruction?this.state.instruction:"",
            createdTime:getTimestamp(),
            status:"Pending",
            restaurantID:params.id,
            restaurantName:this.state.centreName,
            restaurantImage:this.state.centreImage,
            }
            console.log( "requestDinein");

            var newID=new Date().getTime()+"";
            const dineinRef = firebase.app.firestore().collection("dinein").doc(newID);
            dineinRef.set(
                dineinOrder
            ).then(function(){
                console.log( "requestDinein success");
            }).catch(function(error){
                console.log(error.message);
                event.preventDefault();
            });
            
        }
        // event.preventDefault();
        this.refs.reserveDinein.hide();
        this.setState({notifications:[{type:"success",content:"Reserved successfully!"}]});
        this.refreshDataAndHideNotification();

    }

    generateNotifications(item){
        return (
            <div className="col-md-12">
                <Notification type={item.type} >{item.content}</Notification>
            </div>
        )
    }

    resetDataFunction(){
        this.getDineinDetailsFromFirestore();
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
        // const { cartItems } = this.props;
        if(this.props.currentUser !== 'visitor'){
            return(
                <Redirect to="/"/>
            )
        }

        const dineInDetails = this.state.dineInOrders.map((dinein, index) =>
            <Dineinview key={index} value={dinein} />
        );

        return (
        <div className="row wrap-cart">
            <div className="col-md-12">
            <h2 className="section-title-dinein">Restaurant Reservation - {this.state.centreName}</h2>
            <div className="card">
                <div style={{margin:"20px"}} className="card-body">
                    <div className="card-title">
                        <h4 style={{marginBottom:"0px"}}>
                            <button onClick={()=>this.viewReserveDinein()} style={{float:"right"}} type="button" className="btn btn-primary">Reserve</button>
                            DineIn
                        </h4>
                        Your Dine in Details

                        {/* NOTIFICATIONS */}
                        {this.state.notifications?this.state.notifications.map((notification)=>{
                            return this.generateNotifications(notification)
                        }):""}
                    </div> 
                    <hr/>
                    {dineInDetails?dineInDetails:"No DineIn details"}
                    
                    
                </div>
            </div>
            </div>

            <SkyLight dialogStyles={{height:'100%'}} ref="reserveDinein" title="">
                {/* <span><h4>Reserve at {this.state.centreName}</h4></span> */}
                <span><h2 className="section-title-dinein">Reserve at {this.state.centreName}</h2></span>
                <form className="needs-validation order" onSubmit={this.requestDinein}>
                    <div className="row"  style={{marginBottom: '20px'}}>
                        <div className="col-md-6">
                            <label>Name</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter your name" onChange={this.handleChangeName} value={this.state.user_name} required/>
                        </div>
                        <div className="col-md-6">
                            <label>Phone Number</label>
                            <input type="text" className="form-control" id="phoneNo" placeholder="Phone number" onChange={this.handleChangePhone} value={this.state.phone} required/>
                        </div>
                    </div>

                    <div style={{marginBottom: '20px'}}>
                        <label>No of Seats</label>
                        <input type="text" className="form-control" id="seats" placeholder="No of Seats" onChange={this.handleChangeSeats} value={this.state.no_of_seats} required/>
                    </div>

                    <div className="row"  style={{marginBottom: '20px'}}>
                        <div className="col-md-6">
                            <label>Date</label>
                            <input type="date" className="form-control" id="date" onChange={this.handleChangeDate} value={this.state.date} required/>
                        </div>
                        <div className="col-md-6">
                            <label>Time</label>
                            <input type="time" className="form-control" id="time" onChange={this.handleChangeTime} value={this.state.time} required/>
                        </div>
                    </div>
                    <div style={{marginBottom: '20px'}}>
                        <label>Special Instruction</label>
                        <input type="text" className="form-control" id="instruction" placeholder="Special Instruction" onChange={this.handleChangeInstruction} value={this.state.instruction} required/>
                    </div>
                    <button className="btn btn-block continue" type="submit">Request Dinein</button>
                </form>
            </SkyLight>
        </div>
        );
    } 
}

class Dineinview extends Component {
    render() {
        return (
          <div className="row">
            <div className="col-lg-4 col-md-4 col-xs-4">
              <p>{this.props.value.restaurantName}</p>
            </div>
            <div className="col-lg-4 col-md-4 col-xs-4">
                <p>{this.props.value.dineInDate} at {this.props.value.dineInTime}</p>
            </div>
            <div className="col-lg-2 col-md-2 col-xs-2">
                <div className="badge badge-primary">{this.props.value.noOfSeats} people</div>
            </div>
            <div className="col-lg-2 col-md-2 col-xs-2">
                <div className="badge badge-primary">{this.props.value.status}</div>
            </div>
          </div>
        )
    }
  }

// export default connect(
//     (state) => ({
//     //   cartItems: state.cart.cartItems,
//     }),
//     {}
// )(Dinein);

export default Dinein;