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
      orderItems: [],
      menuItems: [],
      userAvailablePoints: 0,
      deliveryCharge: 0,
      orderStatus: '',
      expectedDeliveryTime: '',
      optionalMessage: '',
      selectedMenuItem: null,
      quantity: 1,
      foodVariants: [],
      selectedFoodVariant: null,
      isLoading: false,
      successMessage: '',
      showSuccessMessage: false,
      selectedMenuItemForDelete: null,
      
    };
  }

  componentDidMount = () => {     
    this.getOrderDetails();
    if (this.props.location.search === "?_l=en") {
      setChosenLocale("en");
      this.setState({}, this.forceUpdate);
    } else {
      setChosenLocale("jp");
      this.setState({}, this.forceUpdate);
    }
  };

  //Get the order details
  getOrderDetails = () => {
    const {
      match: { params },
    } = this.props;
    var orderId = params.id;
    if (orderId) {
      const _this = this;
      var orderRef = firebase.app.firestore().collection("orders");
      orderId = atob(orderId);
      orderRef = orderRef.doc(orderId);
      orderRef.get().then(function (doc) {
        if (doc.exists) {
          var temp = doc.data();
          temp.id = doc.id;
          _this.getUserAvailablePoints(temp.userID);
          _this.restaurantMenuItems(temp.restaurantID);
          _this.getRestaurantDetails(temp.restaurantID);
          _this.setState({
            order: temp,
            orderItems: temp.order,
            orderStatus: temp.status,
            expectedDeliveryTime: temp.expected_time_of_delivery,
            optionalMessage: temp.message_optional,
          });
        }
      });
    }
    
  };

  //Get the restaurants available menu items
  restaurantMenuItems = (restId) => {
    const _this = this;
    var menuItemRef = firebase.app.firestore().collection("restaurant");
    menuItemRef = menuItemRef.where(
      "collection",
      "==",
      firebase.app.firestore().doc("restaurant_collection/" + restId)
    );
    menuItemRef.where('isActive', '==', true)
    menuItemRef.get().then((snapshot) => {
      if (snapshot !== null) {
        var data = [];
        snapshot.docs.forEach((doc) => {
          var objToAdd = doc.data();
          objToAdd.id = doc.id;
          data.push(objToAdd)
        })
        _this.setState({
          menuItems: data
        })
      }
    })
  };

  getFoodVariants = (foodId)=> {
    var _this = this;
    firebase.app.firestore().collection(`restaurant/${foodId}/variants`).where('isActive', '==', true).get().then(function (querySnapshot) {
        var tempArr = [];
        if (querySnapshot != null) {          
         querySnapshot.forEach(function (doc) {
            if (doc.data().price) {
              //var objToAdd=JSON.parse(doc._document.data.toString());
              var objToAdd = doc.data();
              //Add the id, on each object, easier for referencing
              objToAdd.id = doc.id;
              tempArr.push(objToAdd);
            }
          });        
        }
        var selectedFoodVariant = (tempArr.length > 0) ? tempArr[0] : null
          if (selectedFoodVariant) {
            selectedFoodVariant.title_en = selectedFoodVariant.title;
            selectedFoodVariant.title_ja = selectedFoodVariant.title_ja;
          }      
        tempArr = tempArr.map((item) => {
          var t = item
          t.title_en = item.title
          return t
        })             
        tempArr = tempArr.sort((a, b) => a.title.localeCompare(b.title))    
          _this.setState({
            foodVariants: tempArr,
            selectedFoodVariant: selectedFoodVariant
         });
      });
    
  }
  
  //Get the restaurant details
  getRestaurantDetails = (restId) => {
    const _this = this;
    var restRef = firebase.app.firestore().collection("restaurant_collection");
    restRef = restRef.doc(restId);
    restRef.get().then(function (doc) {
      if (doc.exists) {
        _this.setState({
          deliveryCharge: doc.data().delivery_charge,
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


  //Add a new Menu item from popup to current order
  addMenuItemToOrder = async ()=> {
    if (this.state.selectedMenuItem !== null) {
      this.setState({isLoading: true})      
      var currentOrderItems = []
      currentOrderItems = this.state.orderItems
      var newItem = {
        id : this.state.selectedMenuItem.id,
        image: this.state.selectedMenuItem.image,
        name: this.state.selectedFoodVariant?`${this.state.selectedMenuItem.title} (${this.state.selectedFoodVariant.title_en})`  :this.state.selectedMenuItem.title,
        name_ja: this.state.selectedFoodVariant?`${this.state.selectedMenuItem.title_ja} (${this.state.selectedFoodVariant.title_ja})`  :this.state.selectedMenuItem.title_ja,
        price: this.state.selectedFoodVariant?this.state.selectedFoodVariant.price : Math.floor(this.state.selectedMenuItem.price),
        quantity: Math.floor(this.state.quantity),
        variant: this.state.selectedFoodVariant?`${this.state.selectedMenuItem.title_ja} (${this.state.selectedFoodVariant.title_ja})`  :this.state.selectedMenuItem.title_ja,
      }
      currentOrderItems.push(newItem)
      await this.updateOrderWithItems(currentOrderItems)
      this.refs.addNewMenuItemPopup.hide()
      this.setState({isLoading: false, showSuccessMessage: true, successMessage: 'Order updated successfully'})
    }
  }

  updateOrderWithItems = async (currentOrderItems) => {
    var _this =this;
    var currentDeliveryCharge = Math.floor(this.state.deliveryCharge)
    var pointsRedeemed = Math.floor(this.state.order.pointsRedeemed)
    var updateObj = {}
      updateObj.order = currentOrderItems
      var newTotalPrice = 0
      currentOrderItems.forEach((item)=> {
        var itemPrice = Math.floor(item.price) * Math.floor(item.quantity)
        newTotalPrice += itemPrice
      })
      if (newTotalPrice >= 2000) {
        updateObj.deliveryCharge = 0          
      } else {
        newTotalPrice += currentDeliveryCharge
        updateObj.deliveryCharge = currentDeliveryCharge
      }
      newTotalPrice -= pointsRedeemed;
      updateObj.total = newTotalPrice
      await firebase.app
        .firestore()
        .collection("orders")
        .doc(this.state.order.id)
        .update(updateObj)
        .then(function () {
          _this.getOrderDetails() 
        })
  }

  //Edit the currently available menItem
  editOrderItem = (item)=> {
    var menuItem = this.state.menuItems.find((oi)=>oi.id === item.id)
    this.getFoodVariants(item.id)
    this.setState({
      selectedMenuItem : menuItem,
      quantity : item.quantity,
    }, ()=>this.refs.editMenuItemPopup.show())
  }
  
  //On Edit confirm we delete  the currently available menItem
  onEditConfirm = async ()=> {
    if (this.state.selectedMenuItem) {
      this.setState({isLoading: true})
      var newItem = {
        id : this.state.selectedMenuItem.id,
        image: this.state.selectedMenuItem.image,
        name: this.state.selectedFoodVariant?`${this.state.selectedMenuItem.title} (${this.state.selectedFoodVariant.title_en})`  :this.state.selectedMenuItem.title,
        name_ja: this.state.selectedFoodVariant?`${this.state.selectedMenuItem.title_ja} (${this.state.selectedFoodVariant.title_ja})`  :this.state.selectedMenuItem.title_ja,
        price: this.state.selectedFoodVariant?this.state.selectedFoodVariant.price : Math.floor(this.state.selectedMenuItem.price),
        quantity: Math.floor(this.state.quantity),
        variant: this.state.selectedFoodVariant?`${this.state.selectedMenuItem.title_ja} (${this.state.selectedFoodVariant.title_ja})`  :this.state.selectedMenuItem.title_ja,
      }
      var orderItems = this.state.orderItems
      orderItems = orderItems.filter((item)=> item.id !== this.state.selectedMenuItem.id)
      orderItems.push(newItem)
      await this.updateOrderWithItems(orderItems)
      this.refs.editMenuItemPopup.hide()
      this.setState({isLoading: false, showSuccessMessage: true, successMessage: 'Order updated successfully'})

    }
    
  }
    
  //Delete the currently available menItem
  deleteOrderItem = (item)=> {
    this.setState({
      selectedMenuItemForDelete : item
    }, ()=>this.refs.confirmActionPopup.show())
  } 

  //On Delete confirm we delete  the currently available menItem
  onConfirmDelete = async ()=> {
    if (this.state.selectedMenuItemForDelete) {
      this.setState({isLoading: true})
      var idToDelete = this.state.selectedMenuItemForDelete.id;
      var orderItems = this.state.orderItems
      orderItems = orderItems.filter((item)=> item.id !== idToDelete)
      await this.updateOrderWithItems(orderItems)
      this.refs.confirmActionPopup.hide()
      this.setState({isLoading: false, showSuccessMessage: true, successMessage: 'Order updated successfully'})

    }
    
  }

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
            <td>{<span>
              <span onClick={()=>this.editOrderItem(item)} className="btn btn-simple btn-warning btn-icon edit"><i className="material-icons">edit</i></span>
              {(orderItems.length > 1) ?<span onClick={()=>this.deleteOrderItem(item)} className="btn btn-simple btn-danger btn-icon delete"><i className="material-icons">delete</i></span> : null}
              </span>}</td>
          </tr>
        );
      }
      return null
    });
    return orderItemsTr;
  }
  render() {
    return (
      <div style={{padding: 0}} className="wrap-cart">
        {(this.state.isLoading) ? <div style={{
          alignItems: 'center',
          background: '#000000',
          display: 'flex',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 9999,
          opacity: 0.5
        }} id="loader"><img style={{width:'100px',height: '100px', marginRight: '5px'}} alt="" src="/assets/img/loading-buffering.gif"></img>
        </div> : null}
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
                <div className="row">
                  <div className="col-md-12"><h4>{translate("orderItems")}</h4></div>
                  
                  </div>
                
                <Table striped style={{ border: 1 }}>
                  <thead>
                    <tr style={{backgroundColor: '#4545'}}>
                      <th>{translate("foodName")}</th>
                      <th>{translate("qty")}</th>
                      {/* <th>{translate("variant")}</th> */}
                      <th>{translate("price") + "(¥)"}</th>
                      <th>{translate("total") + "(¥)"}</th>
                      <th>{translate("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.getOrderItemsTr(this.state.order.order)}
                    <tr>
                      <td>{translate("deliveryCharge")}</td>
                      <td></td>
                      <td></td>
                      <td><strong>{this.state.order.deliveryCharge}</strong></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{translate("total")}</td>
                      <td></td>
                      <td></td>
                      <td><strong>{`${
                        parseFloat(this.state.order.total) +
                        parseFloat(this.state.order.pointsRedeemed)
                      }`}</strong></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{translate("pointsAvailable")}</td>
                      <td></td>
                      <td></td>
                      <td><strong>{this.state.userAvailablePoints}</strong></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{translate("pointsRedeemed")}</td>
                      <td></td>
                      <td></td>
                      <td>
                      <strong>{this.state.order.pointsRedeemed
                          ? this.state.order.pointsRedeemed
                          : 0}</strong>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{translate("amountPayable")}</td>
                      <td></td>
                      <td></td>
                      <td><strong>{this.state.order.total}</strong></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row">
              <div className="col-md-3"><a
                      
                      className="btn btn-info"
                      onClick={() => this.refs.addNewMenuItemPopup.show()}
                    >
                      {translate("addNewMenuItem")}
                    </a></div>
                <div className="col-md-9">        
                    <a
                      style={{ width: "50%" }}
                      className="btn btn-success"
                      onClick={() => this.refs.orderStatusChangePopup.show()}
                    >
                      {translate("changeOrderStatus")}
                    </a>
                  
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>{translate("loading")}</div>
        )}

        {/* Popups here */}

        {/* change Order status Popup */}
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
        {/* End Order change status popup */}
        
        {/* add New Menu Item Popup */}
        <SkyLight
          hideOnOverlayClicked
          ref="addNewMenuItemPopup"
          title={translate("addNewMenuItem")}
        >
          <div className="card-content">
            {this.state.menuItems ? (<div className="row">
              <div className="col-md-12">

              {/* Menu Item */}
              <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("MenuItems")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <select
                  className="col-sm-8 form-control form-control-sm"
                  //value={this.state.selectedMenuItem?this.state.selectedMenuItem.title : ''}
                  onChange={(e) => {  
                    var menuItem = this.state.menuItems[e.target.value];
                    this.getFoodVariants(menuItem.id)
                    this.setState({ selectedMenuItem:  menuItem})
                  }
                  }
                >
                  <option value="">select</option>
                        {this.state.menuItems.map((item, key) => {
                          return <option value={key}>{(getLocale() === 'en')? item.title : item.title_ja}</option>;
                        })}
                </select>
              </div>
            </div>
            {/* End Select menu Item */}
            
            {/* foodVariants */}
              {(this.state.foodVariants.length > 0) ?<div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("variant")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <select
                  className="col-sm-8 form-control form-control-sm"
                  //value={this.state.selectedMenuItem?this.state.selectedMenuItem.title : ''}
                  onChange={(e) => {  
                    this.setState({ selectedFoodVariant: this.state.foodVariants[e.target.value] })
                  }
                  }
                >
                  <option value="">select</option>
                        {this.state.foodVariants.map((item, key) => {
                          return <option value={key}>{(getLocale() === 'en')? item.title : item.title_ja}</option>;
                        })}
                </select>
              </div>
            </div> : null }
            {/* End foodVariants */}

            {/* Required Quantity */}
            <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("quantity")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <input
                type="number"
                onChange={(event) => {
                  if (event.target.value > 0) {
                    this.setState({
                      quantity: event.target.value,
                    })
                  } 
                }
                }
                value={this.state.quantity}
                className="col-sm-6 form-control"
                name="quantity"
              />
              </div>
            </div>
            {/* End Quantity */}
            <div className="row">
              <div className="col-md-12"></div>
              </div>
            
            
            {/* Add button */}
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-9">
              {(!this.state.isLoading) ? <a
                      style={{ width: "50%" }}
                      className="btn btn-success"
                      onClick={() => this.addMenuItemToOrder()}
                    >
                      {translate("addToOrder")}
                    </a> : null}
              </div>              
            </div>
            {/* End add button */}
            </div>            
            </div> ) : <p>{translate('loading')}</p> }
          </div>
        </SkyLight>
        {/* End add new menu item popup */}
        
        
        {/* add confirmActionPopup Popup */}
        <SkyLight     
        dialogStyles={{height: '35%', width: '50%'}}     
          ref="confirmActionPopup"
          title={translate("areYouSureYouWantToDeleteThisItem")}
          titleStyle={{fontWeight: 'bold', fontSize: '16px'}}
        >
          <div className="card-content">       
            {/* Add button */}
            <div style={{top:'100%'}} className="row">
              <div className="col-md-3"></div>
              <div className="col-md-9">
              {(!this.state.isLoading) ? <a
                      style={{ width: "50%" }}
                      className="btn btn-success"
                      onClick={() => this.onConfirmDelete()}
                    >
                      {translate("delete")}
                    </a> : null}
              </div>              
            </div>
            {/* End add button */}
            </div>
        </SkyLight>
        {/* End confirm Action Popup */}
        
        {/* add editMenuItemPopup Popup */}
        <SkyLight     
        dialogStyles={{height: '45%', width: '50%'}}     
          ref="editMenuItemPopup"
          title={translate("editItem")}
        >
          <div className="card-content">     
          {/* foodVariants */}
          {(this.state.foodVariants.length > 0) ?<div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("variant")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <select
                  className="col-sm-8 form-control form-control-sm"
                  //value={''}
                  onChange={(e) => {  
                    this.setState({ selectedFoodVariant: this.state.foodVariants[e.target.value] })
                  }
                  }
                >
                  <option value="">select</option>
                        {this.state.foodVariants.map((item, key) => {
                          return <option  value={key}>{(getLocale() === 'en')? item.title : item.title_ja}</option>;
                        })}
                </select>
              </div>
            </div> : null }
            {/* End foodVariants */}

            {/* Required Quantity */}
            <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("quantity")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
              <input
                type="number"
                onChange={(event) => {
                  if (event.target.value > 0) {
                    this.setState({
                      quantity: event.target.value,
                    })
                  } 
                }
                }
                value={this.state.quantity}
                className="col-sm-6 form-control"
                name="quantity"
              />
              </div>
            </div>
            {/* End Quantity */}
            

            {/* Add button */}
            <div style={{top:'100%'}} className="row">
              <div className="col-md-3"></div>
              <div className="col-md-9">
              {(!this.state.isLoading) ? <a
                      style={{ width: "50%" }}
                      className="btn btn-success"
                      onClick={() => this.onEditConfirm()}
                    >
                      {translate("update")}
                    </a> : null}
              </div>              
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-9"></div>
              </div>
            {/* End add button */}
            </div>
        </SkyLight>
        {/* End edit Menu Item  Popup */}

        {/* End popups */}
      </div>
    );
  }
}

export default OrderDetailsForEmailLink;
