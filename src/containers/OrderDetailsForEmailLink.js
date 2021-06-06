import React, { Component } from "react";
import firebase from '../config/database'
import { translate } from "../translations";
import { Table } from "react-bootstrap";

class OrderDetailsForEmailLink extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            order: null
          }
    }

    componentDidMount = ()=> {
        const { match: { params } } = this.props;
        this.getOrderDetails(params.id);   
    }

    //Get the order details
    getOrderDetails = (orderId)=> {
        const _this=this;
        var orderRef = firebase.app.firestore().collection("orders");
        orderId = atob(orderId);
        orderRef = orderRef.doc(orderId);
        orderRef.get().then(function(doc){
            if (doc.exists) {
                var temp = doc.data();
            temp.id= doc.id;
            _this.setState({
                order:temp,
            })
            }
            
        })
    }

    markAsOrderDelivered() {  
        if (this.state.order) {
            var order = this.state.order;
        var _this = this;
        var restId = order.restaurantID;    
        var userID = order.userID;    
        var orderId = order.id;
        var restName;    
        var restNameJa;    
    
        
        firebase.app
          .firestore()
          .collection("restaurant_collection")
          .doc(restId)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("No such restaurant!");
            } else {
              restName = doc.data().title;
              restNameJa = doc.data().title_ja;
              console.log("restaurant title data:", doc.data().title);
            }
          })
          .catch((err) => {
            console.log("Error getting restaurant name", err);
          });
    
        firebase.app
          .firestore()
          .collection("orders")
          .doc(orderId)
          .update({
            status: 'delivered',
          })
          .then(function () {
            // Send Notification
            firebase.app
              .firestore().collection("users").doc(userID).get()
              .then((doc) => {
                if (!doc.exists) {
                  console.log("No such user!");
                } else {
                  var status = 'delivered';
                  var expoToken = doc.data().expoToken;
                  if (doc.data().referredBy) {
                    _this.rewardTheReferrer(doc);
                  }                 
                  if (expoToken) {
                    var bodyEn =  doc.data().fullName !== undefined ? `Hi ${doc.data().fullName} Your order is ${status}.` : `Your order is ${status}.`;
                    var bodyJa =  '注文の更新';
                    var userCurrentLanguage =  (doc.data().currentLocale) ? doc.data().currentLocale : 'en';
                    let data = {
                      "to": expoToken,
                      "title":  (userCurrentLanguage === 'en') ? restName : restNameJa,
                      "body":  (userCurrentLanguage === 'en') ? bodyEn : bodyJa,
                      "sound": "default",
                      "priority": 'high',
                      "data": {'type': 'order_update'}
                  }                
                      fetch("https://exp.host/--/api/v2/push/send", {
                        'mode': 'no-cors',
                        'method': 'POST',
                        'headers': {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    }).catch(err => console.log(err))
                    .finally(() => {
                        var d = new Date();
                        var months = [
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ];
                        var db = firebase.app.firestore();
                        db.collection("notifications")
                          .add({
                            createdAt: new Date(),
                            userId: userID,
                            referenceId: orderId,
                            isRead: false,
                            type: "order_update",
                            data: {
                              title : restName,
                              titleJa : restNameJa, 
                              createdBy : doc.data().fullName,
                              content : `Your order is ${status}`,
                              optionalMessage: '',
                              status : status,
                            },
                            title: restName,  
                            message:
                              doc.data().fullName !== undefined
                                ? `Hi ${
                                    doc.data().fullName
                                  } Your order is ${status}.`
                                : `Your order is ${status}.`,
                            longMessage:
                              d.getDate() +
                              "-" +
                              months[d.getMonth()] +
                              "-" +
                              d.getFullYear() +
                              " " +
                              d.getHours() +
                              ":" +
                              d.getMinutes(),
                          });
                          alert(translate('success'))
                      });
                  } else {
                    //alert("There are no subscribed tokens");
                    console.log("There are no subscribed tokens");
                  }
                }
              })
              .catch((err) => {
                console.log("Error getting user", err);
              });
    
           
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });

        } 
        
      }

      // Reward the referrer when completing an order
      rewardTheReferrer = (user)=> {
        var referredByUserId = user.data().referredBy.userId;
        firebase.app.firestore().collection("users").doc(user.id).update({
          referredByCompleted : user.data().referredBy,
          referredBy: ""
        });
        var referredByRef = firebase.app.firestore().collection("users").doc(referredByUserId);
        referredByRef.get().then(doc => {
          if (doc.exists) {
            var totalPoints = doc.data().points + 50;
            referredByRef.update({
              points: totalPoints,
            }).then(function(){
              var expoToken = doc.data().expoToken;
              console.log('YESSSSSSSSSSSS REACHED HEREEE')
                  if (expoToken) {
                    var titleEn = 'Points credited';
                    var titleJa = '付与されたポイント';
                    var bodyEn = "You have earned 50 points by referring " + doc.data().fullName + '. Total points earned are ' + totalPoints;
                    var bodyJa = `あなたは ${doc.data().fullName} を紹介し、50ポイントを獲得し、合計ポイントを獲得しました ${totalPoints}`;
                    var dataToSend = {
                      to: expoToken,
                      body: (doc.data().currentLocale === 'en') ? bodyEn : bodyJa,
                      title: (doc.data().currentLocale === 'en') ? titleEn : titleJa,
                      "data": {'type': 'points-credited'}
                    }
                    fetch("https://exp.host/--/api/v2/push/send", {
                      'mode': 'no-cors',
                      'method': 'POST',
                      'headers': {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend)
                  }).finally(() => {
                        var d = new Date();
                        var months = [
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ];
                        var db = firebase.app.firestore();
                        db.collection("notifications")
                          .add({
                            createdAt: new Date(),
                            userId: doc.id,
                            referenceId: user.id,
                            type: "points_credited",
                            title: 'Points Credited',
                            titleJa: titleJa,
                            data: {
                              title : 'Points Credited',
                              titleJa : titleJa, 
                              createdBy : doc.data().fullName,
                              content : "You have earned 50 points by referring " + doc.data().fullName + ' Total points earned are ' + totalPoints,
                              contentJa : bodyJa,
                              optionalMessage : '',
                              status : 'points credited',
                            },
                            message: "You have earned 50 points by referring " + doc.data().fullName + '. Total points earned are ' + totalPoints,
                            longMessage:
                              d.getDate() +
                              "-" +
                              months[d.getMonth()] +
                              "-" +
                              d.getFullYear() +
                              " " +
                              d.getHours() +
                              ":" +
                              d.getMinutes(),
                          }).then(()=> {
                            console.log('sucesssssssssssssssss')
                          });
                      });
                    }
                
            })
          }
        })
        
        console.log(user.data().referredBy)
    
      }
      

    // build order Items table rows
    getOrderItemsTr(orderItems) {
        var orderItemsTr = orderItems.map((item) => {
            return (
                <tr key={Math.random()}><td>{item.name}</td><td>{item.quantity}</td><td>{
                    item.variant
                  }</td><td>{item.price}</td><td>{
                    item.quantity * item.price
                  }</td></tr>
            );
          });
          return orderItemsTr;

    }
    render() {
        console.log(this.state.order);
        return (<div className="wrap-cart">
            {(this.state.order) ? 
            
        <div className="row ">
            <h4 className="mb-3">{translate('orderDetails')}</h4>
            <div className="col-md-6">
                
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('orderNo')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.id}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('Delivery/ Pickup Time')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.orderDateTime}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('Name of the customer')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.delivery.name}</strong>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('Phone Number')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.delivery.phone}</strong>
                    </div>
                </div>           
                
        </div>
        <div className="col-md-6">
        
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('Order type')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.deliveryType}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('Delivery Instructions')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.deliveryInstructions}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('Address')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.deliveryAddress}</strong>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-5">
                        <h6 className="mb-3"> {translate('currentStatus')} :</h6>
                    </div>
                    <div className="col-md-7" style={{paddingTop: '26px'}}>
                        <strong style={{padding: '8px',backgroundColor: 'green', color: 'white', borderRadius: '100px'}}>{this.state.order.status.replaceAll('_', ' ')}</strong>
                    </div>
                </div>
        </div>
        <div className="col-md-12">
        <div>
        <h4>{translate('orderItems')}</h4>        
          <Table striped style={{ border: 1 }}>
            <thead>
              <tr>
                <th>{translate("foodName")}</th>
                <th>{translate("qty")}</th>
                <th>{translate("variant")}</th>
                <th>{translate("price") + '(¥)'}</th>
                <th>{translate("total") + '(¥)'}</th>
              </tr>
            </thead>
            <tbody>{this.getOrderItemsTr(this.state.order.order)}
            <tr><td>{translate('deliveryCharge')}</td><td></td><td></td><td></td><td>{this.state.order.deliveryCharge}</td></tr><tr><td>{translate('total')}</td><td></td><td></td><td></td><td>{this.state.order.total}</td></tr>
            </tbody>
          </Table>        
      </div>
        </div>
        <div className="col-md-12">
            <div className="row">
            <div className="col-md-3"></div>
                <div className="col-md-9">
                {(this.state.order.status !== 'delivered') ? <a style={{width: '50%'}} className="btn btn-success"  onClick={()=>this.markAsOrderDelivered()}>{translate('deliveredSuccessfully')}</a> : 
                null} 
                </div>
            </div>
        </div>
        </div> : <div>{translate('loading')}</div> }
        </div>
        );
    }
}

export default OrderDetailsForEmailLink;
