import React, { Component } from "react";
import firebase from "../config/database";
import { getLocale, setChosenLocale, translate } from "../translations";
import { Table } from "react-bootstrap";
import SkyLight from "react-skylight";

class OrderDetailsForEmailLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      userAvailablePoints: 0,
      orderStatus: '',
      expectedDeliveryTime: '',
      optionalMessage: ''
    };
  }

  componentDidMount = () => {
    const {
      match: { params },
    } = this.props;
    console.log(this.props.location.search);
    console.log(params);
    this.getOrderDetails(params.id);
    if (this.props.location.search === "?_l=en") {
      setChosenLocale("en");
      this.setState({}, this.forceUpdate);
    } else {
      setChosenLocale("jp");
      this.setState({}, this.forceUpdate);
    }
  };

  //Get the order details
  getOrderDetails = (orderId) => {
    const _this = this;
    var orderRef = firebase.app.firestore().collection("orders");
    orderId = atob(orderId);
    orderRef = orderRef.doc(orderId);
    orderRef.get().then(function (doc) {
      if (doc.exists) {
        var temp = doc.data();
        temp.id = doc.id;
        _this.getUserAvailablePoints(temp.userID);
        _this.setState({
          order: temp,
          orderStatus: temp.status,
          expectedDeliveryTime: temp.expected_time_of_delivery,
          optionalMessage: temp.message_optional,
        });
      }
    });
  };

  //Get the user's available points
  getUserAvailablePoints = (userId) => {
    const _this = this;
    var orderRef = firebase.app.firestore().collection("users");
    orderRef = orderRef.doc(userId);
    orderRef.get().then(function (doc) {
      if (doc.exists) {
        _this.setState({
          userAvailablePoints: doc.data().points,
        });
      }
    });
  };

  changeOrderStatus() {
    if (this.state.order) {
      var order = this.state.order;
      var _this = this;
      var restId = order.restaurantID;
      var userId = order.userID;
      var orderId = order.id;
      var restNameEn;
      var restNameJa;

      firebase.app
        .firestore()
        .collection("restaurant_collection")
        .doc(restId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            restNameEn = doc.data().title;
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
          status: this.state.orderStatus,
          expected_time_of_delivery: this.state.expectedDeliveryTime,
          message_optional: this.state.optionalMessage,
        })
        .then(function () {
          // Send Notification
          firebase.app
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((doc) => {
              if (doc.exists) {
                var status = _this.state.orderStatus;
              status = status.replaceAll("_", " ");
              var expoToken = doc.data().expoToken;
              if (doc.data().referredBy) {
                _this.rewardTheReferrer(doc);
              }
              if (expoToken) {
                var bodyEn =  doc.data().fullName !== undefined ? `Hi ${doc.data().fullName} Your order is ${status}.` : `Your order is ${status}.`;
                bodyEn = bodyEn+'\n'+ _this.state.expectedDeliveryTime + '\n' + _this.state.optionalMessage 
                var bodyJa =  '注文の更新';
                bodyJa = bodyJa+'\n '+ _this.state.expectedDeliveryTime + '\n' + _this.state.optionalMessage
                var userCurrentLanguage =  (doc.data().currentLocale) ? doc.data().currentLocale : 'en';
                let data = {
                  "to": expoToken,
                  "title":  (userCurrentLanguage === 'en') ? restNameEn : restNameJa,
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
                        userId: userId,
                        referenceId: 'orders',
                        isRead: false,
                        type: "order_update",
                        data: {
                          title : restNameEn,
                          titleJa : restNameJa, 
                          createdBy : doc.data().fullName,
                          content : `Your order is ${status}`,
                          optionalMessage: _this.state.optionalMessage,
                          status : status,
                        },
                        title: restNameEn,  
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
                  });
              } else {
                //alert("There are no subscribed tokens");
                console.log("There are no subscribed tokens");
              }
            
            }})
            .catch((err) => {
              console.log("Error getting user", err);
            });
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
    this.refs.orderStatusChangePopup.hide()
  }

  // Reward the referrer when completing an order
  rewardTheReferrer = (user) => {
    var referredByUserId = user.data().referredBy.userId;
    firebase.app.firestore().collection("users").doc(user.id).update({
      referredByCompleted: user.data().referredBy,
      referredBy: "",
    });
    var referredByRef = firebase.app
      .firestore()
      .collection("users")
      .doc(referredByUserId);
    referredByRef.get().then((doc) => {
      if (doc.exists) {
        var totalPoints = doc.data().points + 50;
        referredByRef
          .update({
            points: totalPoints,
          })
          .then(function () {
            var expoToken = doc.data().expoToken;
            console.log("YESSSSSSSSSSSS REACHED HEREEE");
            if (expoToken) {
              var titleEn = "Points credited";
              var titleJa = "付与されたポイント";
              var bodyEn =
                "You have earned 50 points by referring " +
                doc.data().fullName +
                ". Total points earned are " +
                totalPoints;
              var bodyJa = `あなたは ${
                doc.data().fullName
              } を紹介し、50ポイントを獲得し、合計ポイントを獲得しました ${totalPoints}`;
              var dataToSend = {
                to: expoToken,
                body: doc.data().currentLocale === "en" ? bodyEn : bodyJa,
                title: doc.data().currentLocale === "en" ? titleEn : titleJa,
                data: { type: "points-credited" },
              };
              fetch("https://exp.host/--/api/v2/push/send", {
                mode: "no-cors",
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
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
                    title: "Points Credited",
                    titleJa: titleJa,
                    data: {
                      title: "Points Credited",
                      titleJa: titleJa,
                      createdBy: doc.data().fullName,
                      content:
                        "You have earned 50 points by referring " +
                        doc.data().fullName +
                        " Total points earned are " +
                        totalPoints,
                      contentJa: bodyJa,
                      optionalMessage: "",
                      status: "points credited",
                    },
                    message:
                      "You have earned 50 points by referring " +
                      doc.data().fullName +
                      ". Total points earned are " +
                      totalPoints,
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
                  })
                  .then(() => {
                    console.log("sucesssssssssssssssss");
                  });
              });
            }
          });
      }
    });

    console.log(user.data().referredBy);
  };

  // build order Items table rows
  getOrderItemsTr(orderItems) {
    var orderItemsTr = orderItems.map((item) => {
      if (item) {
        return (
          <tr key={Math.random()}>
            <td>{getLocale() === "en" ? item.name : item.name_ja}</td>
            <td>{item.quantity}</td>
            {/* <td>{item.variant}</td> */}
            <td>{item.price}</td>
            <td>{item.quantity * item.price}</td>
          </tr>
        );
      }
    });
    return orderItemsTr;
  }
  render() {
    return (
      <div className="wrap-cart">
        {this.state.order ? (
          <div className="row ">
            <h4 className="mb-3">{translate("orderDetails")}</h4>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3"> {translate("orderNo")} :</h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.id}</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3">
                    {" "}
                    {translate("Delivery/ Pickup Time")} :
                  </h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.orderDateTime}</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3">
                    {" "}
                    {translate("Name of the customer")} :
                  </h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.delivery.name}</strong>
                </div>
              </div>

              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3"> {translate("Phone Number")} :</h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.delivery.phone}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3"> {translate("Order type")} :</h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.deliveryType}</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3">
                    {" "}
                    {translate("Delivery Instructions")} :
                  </h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.deliveryInstructions}</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3">
                    {" "}
                    {translate("specialInstructions")} :
                  </h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.specialInstructions}</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3"> {translate("Address")} :</h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong>{this.state.order.deliveryAddress}</strong>
                </div>
              </div>
              {this.state.order.deliveryLocation &&
              this.state.order.deliveryLocation.latitude ? (
                <div className="row">
                  <div className="col-md-5">
                    <h6 className="mb-3"> {translate("deliveryLocation")} :</h6>
                  </div>
                  <div className="col-md-7" style={{ paddingTop: "26px" }}>
                    <a
                      target="_blank"
                      href={`https://www.google.com/maps?q=${
                        this.state.order.deliveryLocation
                          ? this.state.order.deliveryLocation.latitude
                          : ""
                      },${
                        this.state.order.deliveryLocation
                          ? this.state.order.deliveryLocation.longitude
                          : ""
                      }`}
                    >
                      <strong>{translate("viewOnMap")}</strong>
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="row">
                <div className="col-md-5">
                  <h6 className="mb-3"> {translate("currentStatus")} :</h6>
                </div>
                <div className="col-md-7" style={{ paddingTop: "26px" }}>
                  <strong
                    style={{
                      padding: "8px",
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "100px",
                    }}
                  >
                    {translate(this.state.order.status)}
                  </strong>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div>
                <h4>{translate("orderItems")}</h4>
                <Table striped style={{ border: 1 }}>
                  <thead>
                    <tr>
                      <th>{translate("foodName")}</th>
                      <th>{translate("qty")}</th>
                      {/* <th>{translate("variant")}</th> */}
                      <th>{translate("price") + "(¥)"}</th>
                      <th>{translate("total") + "(¥)"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.getOrderItemsTr(this.state.order.order)}
                    <tr>
                      <td>{translate("deliveryCharge")}</td>
                      <td></td>
                      <td></td>
                      <td>{this.state.order.deliveryCharge}</td>
                    </tr>
                    <tr>
                      <td>{translate("total")}</td>
                      <td></td>
                      <td></td>
                      <td>{`${
                        parseFloat(this.state.order.total) +
                        parseFloat(this.state.order.pointsRedeemed)
                      }`}</td>
                    </tr>
                    <tr>
                      <td>{translate("pointsAvailable")}</td>
                      <td></td>
                      <td></td>
                      <td>{this.state.userAvailablePoints}</td>
                    </tr>
                    <tr>
                      <td>{translate("pointsRedeemed")}</td>
                      <td></td>
                      <td></td>
                      <td>
                        {this.state.order.pointsRedeemed
                          ? this.state.order.pointsRedeemed
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>{translate("amountPayable")}</td>
                      <td></td>
                      <td></td>
                      <td>{this.state.order.total}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-9">
                  {this.state.order.status !== "delivered" ? (
                    <a
                      style={{ width: "50%" }}
                      className="btn btn-success"
                      onClick={() => this.refs.orderStatusChangePopup.show()}
                    >
                      {translate("changeOrderStatus")}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>{translate("loading")}</div>
        )}

        {/* Popups here */}

        <SkyLight
          hideOnOverlayClicked
          ref="orderStatusChangePopup"
          title={translate("changeOrderStatus")}
        >
          <div className="card-content">
            {this.state.order ? (<div className="row">
              <div className="col-md-12">
              {/* orderStatus */}
              <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("currentStatus")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <select
                  className="col-sm-8 form-control form-control-sm"
                  value={this.state.orderStatus}
                  onChange={(e) => {
                    if (e.target.value === 'rejected') {
                      this.setState({expectedDeliveryTime: ''})
                    }
                    this.setState({ orderStatus: e.target.value })
                  }
                  }
                >
                  <option value="">select</option>                  
                  <option value="confirmed">Order Confirmed</option>
                  <option value="ready_to_pick">Ready To Pick</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="canceled">Order Canceled</option>
                  <option value="out_for_delivery">Out For Delivery</option>
                  <option value="delivered">Order Delivered</option>
                  <option value="cannot_deliver">Cannot Deliver</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            {/* End orderStatus */}

            {/* Expected delivery time */}
            {(this.state.orderStatus !== 'rejected') ?<div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("expectedDeliveryTime")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <input
                type="text"
                onChange={(event) =>
                  this.setState({
                    expectedDeliveryTime: event.target.value,
                  })
                }
                value={this.state.expectedDeliveryTime}
                className="col-sm-6 form-control"
                name="expectedDeliveryTime"
              />
              </div>
            </div> : null }
            {/* End Expected delivery time */}

            {/* Optional Message */}
            <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {(this.state.orderStatus !== 'rejected') ? translate("optionalMessage") : translate('reasonForReject')} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <textarea
                onChange={(event) =>
                  this.setState({ optionalMessage: event.target.value })
                }
                value={this.state.optionalMessage}
                className="form-control"
                cols={4}
                name="optionalMessage"
              ></textarea>
              </div>
            </div>
            {/* End Optional Message */}
            
            {/* Change Status button */}
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-9">
              <a
                      style={{ width: "50%" }}
                      className="btn btn-success"
                      onClick={() => this.changeOrderStatus()}
                    >
                      {translate("changeOrderStatus")}
                    </a>
              </div>              
            </div>
            {/* End Change Status button */}


            </div>

            
            </div> ) : <p>{translate('loading')}</p> }
          </div>
        </SkyLight>

        {/* End popups */}
      </div>
    );
  }
}

export default OrderDetailsForEmailLink;
