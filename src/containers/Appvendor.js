/*eslint no-useless-constructor: "off"*/
import React, { Component } from "react";
import { translate } from "../translations";
import NavBar from "./../ui/template/NavBar";
// import NavBarDefault from './../ui/template/NavBarDefault'
import firebase from "../config/database";
import { Table } from "react-bootstrap";

class Appvendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      restaurantIDs: [],
      pendingOrders: [],
      pendingDineIns: [],
    };
  }

  componentDidMount = () => {
    this.setupDashboardTables();
    //this.fetchPendingOrders()
    //this.fetchPendingDineIns()
  };

  setupDashboardTables = async () => {
    var restaurantIDs = await this.fetchRestaurantIDs();
    this.setState(
      {
        restaurantIDs: restaurantIDs,
      },
      this.fetchPendingOrders
    );
  };

  // fetch all the restaurant Ids the vendor currently have
  fetchRestaurantIDs = () => {
    //Get reference to fireStore
    var db = firebase.app.firestore();
    var vendorEmail = firebase.app.auth().currentUser.email;
    var restaurantIDs = [];
    return db
      .collection("restaurant_collection")
      .where("owner", "==", vendorEmail)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (vendorEmail === doc.data().owner) {
            restaurantIDs.push(doc.id);
          }
        });
        return restaurantIDs;
      });
  };

  // fetch all the pending orders for the vendor
  fetchPendingOrders = () => {
    if (this.state.restaurantIDs.length > 0) {
      this.state.restaurantIDs.forEach((restId) => {
        try { 
          this.getPendingOrderForRestaurant(restId);
          this.getPendingDineInForRestaurant(restId)

        } catch (e) {
          

        }
       
      });
      this.setState({
        isLoading: false,
      });
    }
  };

  getPendingOrderForRestaurant = (restId) => {
    //Get reference to fireStore
    var db = firebase.app.firestore();
    var _this = this;
    var ordersTemp = _this.state.pendingOrders;
    db.collection("orders")
      .where("restaurantID", "==", restId)
      .where("status", "in", ["confirmed", "ready_to_pick", "out_for_delivery"])
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var objectToAdd = doc.data();
          objectToAdd.id = doc.id;
          ordersTemp.push(objectToAdd);
        });
        _this.setState({
          pendingOrders: ordersTemp,
        });
      });
  };

  getPendingDineInForRestaurant = (restId) => {
    //Get reference to fireStore
    var db = firebase.app.firestore();
    var _this = this;
    var ordersTemp = _this.state.pendingDineIns;
    var startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    var endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    db.collection("dinein")
      .where("restaurantID", "==", restId)      
      .where("createdTime", ">=", startOfToday)
      .where("createdTime", "<=", endOfToday)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().status != 'canceled') {
            var objectToAdd = doc.data();
            objectToAdd.id = doc.id;
            ordersTemp.push(objectToAdd);
          }
          
        });
        _this.setState({
          pendingDineIns: ordersTemp,
        });
      });
  };

  // Build the pending orders table
  get getPendingOrdersTable() {
    var pendingOrdersTr = null;
    var isProcessing = (this.state.pendingOrders.length > 0 || this.state.isLoading);
    if (this.state.pendingOrders.length > 0) {
      pendingOrdersTr = this.state.pendingOrders.map((order, index) => {
        return (
          <tr key={Math.random()}>
            <td>
              <a href={`#/firestorevendor/orders+${order.id}`}>{order.id}</a>
            </td>
            <td>
              {order.orderDateTime ? order.orderDateTime : order.timeStamp}
            </td>
            <td>{order.delivery.name ? order.delivery.name : "NA"}</td>
            <td>{order.delivery.phone ? order.delivery.phone : "NA"}</td>
            <td>{order.deliveryAddress ? order.deliveryAddress : "NA"}</td>
            <td style={{ textTransform: "capitalize" }}>
              {order.status ? order.status : "NA"}
            </td>
          </tr>
        );
      });
    }
    return (
      <div>
        <h4>Pending orders</h4>
        {pendingOrdersTr ? (
          <Table striped style={{ border: 1 }}>
            <thead>
              <tr>
                <th>{translate("orderId")}</th>
                <th>{translate("orderDate")}</th>
                <th>{translate("delivery.name")}</th>
                <th>{translate("delivery.phone")}</th>
                <th>{translate("location")}</th>
                <th>{translate("status")}</th>
              </tr>
            </thead>
            <tbody>{pendingOrdersTr}</tbody>
          </Table>
        ) : (this.state.isLoading || isProcessing) ? (
          <span>{translate("loading")}</span>
        ) : (
          <span>{translate("notFound")}</span>
        )}
      </div>
    );
  } 
  
  // Build the pending DineIn table
  get getPendingDineInTable() {
    var pendingDineInsTr = null;
    var isProcessing = (this.state.pendingDineIns.length > 0 || this.state.isLoading) ;
    if (this.state.pendingDineIns.length > 0) {
      pendingDineInsTr = this.state.pendingDineIns.map((dine, index) => {
        return (
          <tr key={Math.random()}>
            <td>
              <a href={`#/firestorevendor/dinein+${dine.id}`}>{dine.id}</a>
            </td>
            <td>
              {dine.dineInDate ? dine.dineInDate + ' ' + dine.dineInTime : 'NA'}
            </td>
            <td>{dine.userName ? dine.userName : "NA"}</td>
            <td>{dine.phone ? dine.phone : "NA"}</td>
            <td>{dine.noOfSeats ? dine.noOfSeats : "NA"}</td>
            <td style={{ textTransform: "capitalize" }}>
              {dine.status ? dine.status : "NA"}
            </td>
          </tr>
        );
      });
      isProcessing= false;
    }
    return (
      <div>
        <h4>Pending dineIns</h4>
        {pendingDineInsTr ? (
          <Table striped style={{ border: 1 }}>
            <thead>
              <tr>
                <th>{translate("id")}</th>
                <th>{translate("reservationDate")}</th>
                <th>{translate("name")}</th>
                <th>{translate("phone")}</th>
                <th>{translate("noOfSeats")}</th>
                <th>{translate("status")}</th>
              </tr>
            </thead>
            <tbody>{pendingDineInsTr}</tbody>
          </Table>
        ) : (this.state.isLoading || isProcessing) ? (
          <span>{translate("loading")}</span>
        ) : (
          <span>{translate("notFound")}</span>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="content">
        <NavBar />

        <div>{translate("dashboard")}</div>
        {this.getPendingOrdersTable}
        {this.getPendingDineInTable}
      </div>
    );
  }
}

export default Appvendor;
