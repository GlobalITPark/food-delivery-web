/*eslint eqeqeq: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint no-use-before-define: "off"*/
/*eslint radix: "off"*/
/*eslint no-redeclare: "off"*/
import React, { Component } from "react";
import { Link, Redirect } from "react-router";
import firebase from "../config/database";
import Fields from "../components/fields/Fields.js";
import Input from "../components/fields/Input.js";
import Table from "../components/tables/RTable.js";
import Config from "../config/app";
import Common from "../common.js";
import Notification from "../components/Notification";
import SkyLight from "react-skylight";
import NavBar from "./../ui/template/NavBar";
import moment from "moment";
import CardUI from "./../ui/template/Card";
import INSERT_STRUCTURE from "../config/firestoreschema.js";
import * as firebaseREF from "firebase";
var request = require("superagent");
require("firebase/firestore");
import Moment from 'moment';

const ROUTER_PATH = "/firestorevendor/";
import { PulseLoader } from "halogenium";
import { translate } from "../translations";

class Firestorevendor extends Component {
  constructor(props) {
    super(props);

    //Create initial step
    this.state = {
      documents: [],
      collections: [],
      restaurants: [],
      restaurantIDs: [],
      selectedRest: "",
      currentCollectionName: "",
      isCollection: false,
      isDocument: false,
      keyToDelete: null,
      pathToDelete: null,
      theSubLink: null,
      fieldsOfOnsert: null,
      isLoading: true,
      showAddCollection: "",
      user: {},
      restaurantDetails: {},
      userCollectionId: null,
      restaurantID: "",
      displayNewOrder: false,
      restaurantTitle: "",
      restaurantTitleJa: "",
      restaurantDescription: "",
      restaurantDescriptionJa: "",
      menuTitle: "",
      menuTitleJa: "",
      menuDescription: "",
      menuDescriptionJa: "",
      expected_time_of_delivery: "",
      message_optional: "",
      deliveryCharge: 0,
      orderStatus: "",
      orderedRestaurant: "",
      orderDetails: null,
      orderOwner: null,
      menuCalories: 0,
      redeemedPoints: 0,
      menuPrice: null,
      taxPercentage: 8,
      addMenuItemFormError: false,
      filteredRestaurantId: '',
      reservationStatus: '',
      messageFromRestaurant: '',
    };

    //Bind function to this
    this.getCollecitonDataFromFireStore = this.getCollecitonDataFromFireStore.bind(
      this
    );
    this.resetDataFunction = this.resetDataFunction.bind(this);
    this.processRecords = this.processRecords.bind(this);
    this.updateAction = this.updateAction.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.cancelAddFirstItem = this.cancelAddFirstItem.bind(this);
    this.doDelete = this.doDelete.bind(this);
    this.deleteFieldAction = this.deleteFieldAction.bind(this);
    this.refreshDataAndHideNotification = this.refreshDataAndHideNotification.bind(
      this
    );
    this.addKey = this.addKey.bind(this);
    this.confirmOrderAndSendNotification = this.confirmOrderAndSendNotification.bind(
      this
    );
    this.completeOrderAndSendNotification = this.completeOrderAndSendNotification.bind(
      this
    );
    this.showSubItems = this.showSubItems.bind(this);
    this.updatePartOfObject = this.updatePartOfObject.bind(this);
    this.addDocumentToCollection = this.addDocumentToCollection.bind(this);
    this.addItemToArray = this.addItemToArray.bind(this);
    this.newOrderAlert = this.newOrderAlert.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
    this.viewCreateRestaurantDialog = this.viewCreateRestaurantDialog.bind(
      this
    );
    this.cancelCreateRestaurantDialog = this.cancelCreateRestaurantDialog.bind(
      this
    );
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);
    this.handleChangeMenuTitle = this.handleChangeMenuTitle.bind(this);
    this.handleChangeMenuDescription = this.handleChangeMenuDescription.bind(
      this
    );
    this.handleChangeMenuCalories = this.handleChangeMenuCalories.bind(this);
    this.handleChangeMenuPrice = this.handleChangeMenuPrice.bind(this);
    this.handleChangeTaxPercentage = this.handleChangeTaxPercentage.bind(this);
    this.createMenuItem = this.createMenuItem.bind(this);
    this.viewCreateMenuDialog = this.viewCreateMenuDialog.bind(this);
    this.cancelCreateMenuDialog = this.cancelCreateMenuDialog.bind(this);
    this.rejectThisOrder = this.rejectThisOrder.bind(this);
    this.getRestaurants = this.getRestaurants.bind(this);
  }

  /**
   * Step 0a
   * Start getting data
   */
  componentDidMount() {
    this.getRestaurants();
    window.getDemo().reinitializeSideClose();
    this.findFirestorePath();

    const _this = this;

    const setUser = (user) => {
      this.setState({
        user: user,
      });
    };

    firebase.app.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
      } else {
        // No user is signed in.
        console.log("User has logged out Master");
      }
    });

    // firebase.app.firestore().collection('restaurant_collection').where('owner', '==', user.email).get()
    // .then(snapshot => {
    //   if (snapshot.empty) {
    //     console.log('No matching documents.');
    //     return;
    //   }
    //   snapshot.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data());
    //     _this.setState({
    //       user:user,
    //       restaurantID:doc.id
    //     })

    //   });
    // })
    // .catch(err => {
    //   console.log('Error getting restaurant id documents', err);
    // });

    console.log("Restaurant Id", _this.state.restaurantID);
  }

  componentWillMount() {}

 

  /**
   * Convert field starting with REFERENCE: to native reference
   * ex. 
   * "fields":{
			"group":"REFERENCE:/groups/YOURDEFAULTGROUP",
    },
   * @param {Object} fields 
   */
  convertSchemaReferencesToNativeReferences(fields) {
    Object.keys(fields).forEach((key) => {
      if (fields.hasOwnProperty(key)) {
        if ((fields[key] + "").indexOf("REFERENCE:") == 0) {
          var refrencePath = (fields[key] + "").replace("REFERENCE:", "");
          console.log("refrencePath -->" + refrencePath);
          fields[key] = firebase.app.firestore().doc(refrencePath);
        }
      }
    });

    console.log(fields);

    return fields;
  }

  /**
   * Step 0b
   * Resets data function
   */
  resetDataFunction() {
    var newState = {};
    newState.documents = [];
    newState.collections = [];
    newState.currentCollectionName = "";
    newState.fieldsAsArray = [];
    newState.arrayNames = [];
    newState.fields = [];
    newState.arrays = [];
    newState.elements = [];
    newState.elementsInArray = [];
    newState.theSubLink = null;

    this.setState(newState);
    this.findFirestorePath();
  }

  newOrderAlert() {
    const _this = this;
    firebase.app
      .firestore()
      .collection("orders")
      .where("restaurantID", "==", "nqM8wudP47GJVzRXjuD6")
      .where("status", "==", "Just created")
      .onSnapshot(
        (querySnapshot) => {
          console.log(`Received doc snapshot: ${querySnapshot}`);
          // querySnapshot.docChanges().forEach(change =>{
          //   // console.log(`Received query snapshot of size ${JSON.stringify(doc.data())}`);
          //   if (change.type === 'added') {
          //     console.log('New city: ', change.doc.data());

          //   }
          //   if (change.type === 'modified') {
          //     console.log('Modified city: ', change.doc.data());
          //   }
          //   if (change.type === 'removed') {
          //     console.log('Removed city: ', change.doc.data());
          //   }
          // })
          // _this.setState({notifications:[{type:"success",content:"New Orders"}]});
          this.refs.newOrderAlert.show();
          // alert("new order");
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  /**
   * Step 0c
   * componentWillReceiveProps event of React, fires when component is mounted and ready to display
   * Start connection to firebase
   */
  componentWillReceiveProps(nextProps, nextState) {
    console.log("Next SUB: " + nextProps.params.sub);
    console.log("Prev SUB : " + this.props.params.sub);
    if (nextProps.params.sub == this.props.params.sub) {
      console.log("update now");
      this.setState({ isLoading: true });
      this.resetDataFunction();
    }
  }

  getAppBuilderAppName() {
    if (Config.appEditPath != undefined) {
      var items = Config.appEditPath.split("/");
      var lastPathItem = items[items.length - 1];
      return lastPathItem + "_";
    } else {
      return "";
    }
  }

  /**
   * Step 0d
   * getMeTheFirestorePath created firestore path based on the router parh
   */
  getMeTheFirestorePath() {
    var thePath =
      /*this.getAppBuilderAppName()+*/ this.props.route.path
        .replace(ROUTER_PATH, "")
        .replace(":sub", "") +
      (this.props.params && this.props.params.sub
        ? this.props.params.sub
        : ""
      ).replace(/\+/g, "/");
    return thePath;
  }

  /**
   * Step 1
   * Finds out the Firestore path
   * Also creates the path that will be used to access the insert
   */
  findFirestorePath() {
    var pathData = {};
    if (this.props.params && this.props.params.sub) {
      pathData.lastSub = this.props.params.sub;
    }

    //Find the firestore path
    var firebasePath = this.getMeTheFirestorePath();
    pathData.firebasePath = firebasePath;

    //Find last path - the last item
    var subPath =
      this.props.params && this.props.params.sub ? this.props.params.sub : "";
    var items = subPath.split(Config.adminConfig.urlSeparator);
    pathData.lastPathItem = Common.capitalizeFirstLetter(
      items[items.length - 1]
    );
    pathData.completePath = subPath;

    //Save this in state
    this.setState(pathData);

    //Go to next step of finding the collection data
    this.getCollecitonDataFromFireStore(firebasePath);
  }

  /**
   * Step 2
   * Connect to firestore to get the current item we need
   * @param {String} collection - this infact can be collection or document
   */
  getCollecitonDataFromFireStore(collection) {
    //Create the segmments based on the path / collection we have
    var segments = collection.split("/");
    var lastSegment = segments[segments.length - 1];

    //Is this a call to a collections data
    var isCollection = segments.length % 2;

    //Reference to this
    var _this = this;

    //Save know info for now
    this.setState({
      currentCollectionName: segments[segments.length - 1],
      isCollection: isCollection,
      isDocument: !isCollection,
    });

    //Get reference to firestore
    var db = firebase.app.firestore();

    //Here, we will save the documents from collection
    var documents = [];

    if (isCollection) {
      if (collection === "restaurant") {
        var ref = db.collection("restaurant_collection");
        if (this.state.user.email) {
          ref.where('owner', '==', this.state.user.email)
        }
          ref.get()
          .then(function (querySnapshot) {
            var datacCount = 0;
            querySnapshot.forEach(function (doc) {
              datacCount++;
              if (_this.state.user.email === doc.data().owner) {
                //Increment counter
                _this.setState({
                  userCollectionId: doc.id,
                  restaurantDetails: doc.data(),
                });
                // userCollectionId=doc.id;
              }
            });
          });
      } else if (collection === "orders") {
        // this.newOrderAlert()
        db.collection("restaurant_collection")
          .get()
          .then(function (querySnapshot) {
            var datacCount = 0;
            querySnapshot.forEach(function (doc) {
              datacCount++;
              if (_this.state.user.email === doc.data().owner) {
                //Increment counter
                _this.setState({
                  userCollectionId: doc.id,
                  displayNewOrder: true,
                  restaurantDetails: doc.data(),
                });
                // userCollectionId=doc.id;
              }
            });
          });
      }

      //COLLECTIONS - GET DOCUMENTS

      var colRef = db.collection(collection)
        colRef.get()
        .then(function (querySnapshot) {
          var datacCount = 0;
          querySnapshot.forEach(function (doc) {
            //Increment counter
            datacCount++;

            //Get the object
            var currentDocument = doc.data();

            //Sace uidOfFirebase inside him
            currentDocument.uidOfFirebase = doc.id;

            // console.log(doc.id, " => ", currentDocument);
            // console.log("user ", _this.state.user.email);

            if (
              collection === "restaurant_collection" &&
              currentDocument.owner === _this.state.user.email
            ) {
              //Save in the list of documents
              documents.push(currentDocument);
            } else if (
              collection === "restaurant" &&
              currentDocument.owner === _this.state.user.email
            ) {
              documents.push(currentDocument);
            } else if (
              collection === "orders" &&
              _this.state.restaurantIDs.includes(currentDocument.restaurantID)
            ) {
              currentDocument.orderID = doc.id;
              documents.push(currentDocument);
            } else if (
              collection === "dinein" &&
              _this.state.restaurantIDs.includes(currentDocument.restaurantID)
            ) {
              documents.push(currentDocument);
            } else if (_this.state.currentCollectionName === "variants") {
              documents.push(currentDocument);
            }
          });
          console.log("DOCS----");
          console.log(documents);

          // SORTING THE DOCS
          if (collection === 'orders') {
            documents.sort(function(x, y){
              var date1 = Moment(x.timeStamp);
              var date2 = Moment(y.timeStamp);
              return Moment(date2).diff(date1);
            })
          }
          if (collection === 'dinein') {
            documents.sort(function(x, y){
              var date1 = Moment(x.createdTime);
              var date2 = Moment(y.createdTime);
              return Moment(date2).diff(date1);
            })
          }
          if (collection === "restaurant") {
            documents = [];            
            _this.getRealMenuItemsForThisUser(_this.state.user.email)
          }

          //Save the douments in the sate
          _this.setState({
            isLoading: false,
            documents: documents,
            showAddCollection: datacCount == 0 ? collection : "",
          });
          if (datacCount == 0) {
            _this.refs.addCollectionDialog.show();
          }
          console.log(_this.state.documents);
        });
    } else {
      //DOCUMENT - GET FIELDS && COLLECTIONS
      var referenceToCollection = collection.replace("/" + lastSegment, "");

      //Create reference to the document itseld
      var docRef = db.collection(referenceToCollection).doc(lastSegment);

      //Get the starting collectoin
      var parrentCollection = segments;
      parrentCollection.splice(-1, 1);

      //Find the collections of this document
      this.findDocumentCollections(parrentCollection);

     
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log("Document data:", _this.state.restaurantDetails);
            if (doc.data().order && doc.data().order.length > 0) {
              // This is an order detail so lets update order related details
              firebase.app
                .firestore()
                .collection("restaurant_collection")
                .doc(doc.data().restaurantID)
                .get()
                .then((rest) => {
                  var userId = "";
                  if (rest.exists) {
                    userId = doc.data().userID;
                    _this.setState(
                      {
                        expected_time_of_delivery: doc.data()
                          .expected_time_of_delivery
                          ? doc.data().expected_time_of_delivery
                          : "",
                        message_optional: doc.data().message_optional
                          ? doc.data().message_optional
                          : "",
                        orderStatus: doc.data().status ? doc.data().status : "",
                        orderDetails: doc.data(),
                        deliveryCharge: doc.data().deliveryCharge,
                        orderedRestaurant: rest.data(),
                      },
                      () => {
                        if (userId) {
                          firebase.app
                            .firestore()
                            .collection("users")
                            .doc(userId)
                            .get()
                            .then((doc) => {
                              if (doc.exists) {
                                _this.setState({
                                  orderOwner: doc.data(),
                                });
                              }
                            });
                        }
                      }
                    );
                  }
                });
            }

            //Directly process the data
            _this.processRecords(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("2nd Error getting document:", error);
        });
    }
  }

  getRealMenuItemsForThisUser = (email) => {
    var _this = this;
    var menuItems = [];
    if (email) {
      _this.setState({isLoading: true,})
      var resRef = firebase.app
      .firestore()
      .collection("restaurant_collection")
      .where('owner', '==', email);
      resRef.get()
        .then(function (querySnapshot) {
          querySnapshot.docs.forEach(function (rest) {
            _this.setState({isLoading: true,})
            firebase.app
            .firestore()
            .collection("restaurant").where(
              "collection",
              "==",
              firebase.app.firestore().doc("restaurant_collection/" + rest.id)).get().then((snapShot) => {
                if (snapShot) {                  
                  snapShot.docs.forEach((doc) => {
                    var objToAdd = doc.data();
                    objToAdd.uidOfFirebase = doc.id;
                    menuItems.push(objToAdd);
                  });                                  
                }
                _this.setState({documents: []}, _this.forceUpdate)
                _this.setState({documents:menuItems}, _this.forceUpdate)                
              });
          });
          _this.setState({isLoading: false,})
        });
        _this.forceUpdate()

    }
  }

  /**
   * Step 3
   * findDocumentCollections - what collections should we display / currently there is no way to get collection form docuemnt
   * @param {Array} chunks - the collection / documents
   */
  findDocumentCollections(chunks) {
    console.log("Search for the schema now of " + chunks);

    //In firestore, use the last chunk only
    chunks = [chunks[chunks.length - 1]];
    console.log("Modified chunk " + chunks);

    //At start is the complete schema
    var theInsertSchemaObject = INSERT_STRUCTURE;
    var cuurrentFields = null;
    console.log("CHUNKS");
    console.log(chunks);

    //Foreach chunks, find the collections / fields
    chunks.map((item, index) => {
      console.log("current chunk:" + item);

      //Also make the last object any
      //In the process, check if we have each element in our schema
      if (
        theInsertSchemaObject != null &&
        theInsertSchemaObject &&
        theInsertSchemaObject[item] &&
        theInsertSchemaObject[item]["collections"]
      ) {
        var isLastObject = index == chunks.length - 1;

        if (
          isLastObject &&
          theInsertSchemaObject != null &&
          theInsertSchemaObject[item] &&
          theInsertSchemaObject[item]["fields"]
        ) {
          cuurrentFields = theInsertSchemaObject[item]["fields"];
        }

        if (isLastObject && theInsertSchemaObject != null) {
          //It is last
          theInsertSchemaObject = theInsertSchemaObject[item]["collections"];
        } else {
          theInsertSchemaObject = theInsertSchemaObject[item]["collections"];
        }
      } else {
        theInsertSchemaObject = [];
      }
      console.log("Current schema");
      console.log(theInsertSchemaObject);
    });

    //Save the collection to be shown as button and fieldsOfOnsert that will be used on inserting object
    this.setState({
      collections: theInsertSchemaObject,
      fieldsOfOnsert: cuurrentFields,
    });
  }

  /**
   * Step 4
   * Processes received records from firebase
   * @param {Object} records
   */
  processRecords(records) {
    console.log(records);

    var fields = {};
    var arrays = {};
    var elements = [];
    var elementsInArray = [];
    var newState = {};
    var directValue = "";
    newState.fieldsAsArray = fieldsAsArray;
    newState.arrayNames = arrayNames;
    newState.fields = fields;
    newState.arrays = arrays;
    newState.elements = elements;
    newState.directValue = directValue;
    newState.elementsInArray = elementsInArray;
    newState.records = null;

    this.setState(newState);

    //Each display is consisted of
    //Fields   - This are string, numbers, photos, dates etc...
    //Arrays   - Arrays of data, ex items:[0:{},1:{},2:{}...]
    //         - Or object with prefixes that match in array
    //Elements - Object that don't match in any prefix for Join - They are represented as buttons.

    //In FireStore
    //GeoPoint
    //DocumentReference

    //If record is of type array , then there is no need for parsing, just directly add the record in the arrays list
    if (Common.getClass(records) == "Array") {
      //Get the last name
      console.log("This is array");
      var subPath =
        this.props.params && this.props.params.sub ? this.props.params.sub : "";
      var allPathItems = subPath.split("+");
      console.log(allPathItems);
      if (allPathItems.length > 0) {
        var lastItem = allPathItems[allPathItems.length - 1];
        console.log(lastItem);
        arrays[lastItem] = records;
      }
      //this.setState({"arrays":this.state.arrays.push(records)})
    } else if (Common.getClass(records) == "Object") {
      //Parse the Object record
      for (var key in records) {
        if (records.hasOwnProperty(key)) {
          var currentElementClasss = Common.getClass(records[key]);
          console.log(key + "'s class is: " + currentElementClasss);

          //Add the items by their type
          if (currentElementClasss == "Array") {
            //Add it in the arrays  list
            arrays[key] = records[key];
            fields[key] = records[key];
          } else if (currentElementClasss == "Object") {
            //Add it in the elements list
            var isElementMentForTheArray = false; //Do we have to put this object in the array
            for (var i = 0; i < Config.adminConfig.prefixForJoin.length; i++) {
              if (key.indexOf(Config.adminConfig.prefixForJoin[i]) > -1) {
                isElementMentForTheArray = true;
                break;
              }
            }

            var objToInsert = records[key];
            objToInsert.uidOfFirebase = key;

            if (isElementMentForTheArray) {
              //Add this to the merged elements
              elementsInArray.push(objToInsert);
            } else {
              //Add just to elements
              elements.push(objToInsert);
            }
          } else if (
            currentElementClasss != "undefined" &&
            currentElementClasss != "null"
          ) {
            //This is string, number, or Boolean
            //Add it to the fields list
            fields[key] = records[key];
          } else if (currentElementClasss == "GeoPoint") {
            //This is GeoPOint
            //Add it to the fields list
            fields[key] = records[key];
          } else if (currentElementClasss == "DocumentReference") {
            //This is DocumentReference
            //Add it to the fields list
            fields[key] = records[key];
          }
        }
      }
    }
    if (Common.getClass(records) == "String") {
      console.log("We have direct value of string");
      directValue = records;
    }

    //Convert fields from object to array
    var fieldsAsArray = [];
    console.log("Add the items now inside fieldsAsArray");
    console.log("Current schema");
    console.log(this.state.currentInsertStructure);
    //currentInsertStructure
    var keysFromFirebase = Object.keys(fields);
    console.log("keysFromFirebase");
    console.log(keysFromFirebase);
    var keysFromSchema = Object.keys(this.state.currentInsertStructure || {});
    console.log("keysFromSchema");
    console.log(keysFromSchema);

    keysFromSchema.forEach((key) => {
      if (fields.hasOwnProperty(key)) {
        fieldsAsArray.push({ theKey: key, value: fields[key] });
        var indexOfElementInFirebaseObject = keysFromFirebase.indexOf(key);
        if (indexOfElementInFirebaseObject > -1) {
          keysFromFirebase.splice(indexOfElementInFirebaseObject, 1);
        }
      }
    });

    console.log("keysFromFirebase");
    console.log(keysFromFirebase);

    keysFromFirebase.forEach((key) => {
      if (fields.hasOwnProperty(key)) {
        fieldsAsArray.push({ theKey: key, value: fields[key] });
      }
    });

    //Get all array names
    var arrayNames = [];
    Object.keys(arrays).forEach((key) => {
      arrayNames.push(key);
    });

    /// Sorting keys descending
    fieldsAsArray.sort(function (a, b) {
      var objA = a.theKey.toUpperCase();
      var objB = b.theKey.toUpperCase();
      return objA > objB ? -1 : objA < objB ? 1 : 0;
    });

    var newState = {};
    newState.fieldsAsArray = fieldsAsArray;
    newState.arrayNames = arrayNames;
    newState.fields = fields;
    newState.arrays = arrays;
    newState.isJustArray = Common.getClass(records) == "Array";
    newState.elements = elements;
    newState.elementsInArray = elementsInArray;
    newState.directValue = directValue;
    newState.records = records;
    newState.isLoading = false;

    console.log("THE elements");
    console.log(elements);

    //Set the new state
    this.setState(newState);

    //Additional init, set the DataTime, check format if something goes wrong
    window.additionalInit();
  }

  /**
   *
   * Create R Update D
   *
   */

  /**
   * processValueToSave  - helper for saving in Firestore , converts value to correct format
   * @param {value} value
   * @param {type} type of field
   */
  processValueToSave(value, type) {
    //To handle number values
    if (value && !isNaN(value)) {
      value = Number(value);
    }

    //To handle boolean values
    value = value === "true" ? true : value === "false" ? false : value;
    if (type == "date") {
      //To handle date values
      if (moment(value).isValid()) {
        value = moment(value).toDate();
        //futureStartAtDate = new Date(moment().locale("en").add(1, 'd').format("MMM DD, YYYY HH:MM"))
      }
    }
    return value;
  }

  /**
   * updatePartOfObject  - updates sub data from document in firestore, this also does Delete
   * @param {String} key to be updated
   * @param {String} value
   * @param {Boolean} refresh after action
   * @param {String} type of file
   * @param {String} firebasePath current firestore path
   * @param {String} byGivvenSubLink force link to field
   * @param {Function} callback function after action
   */
  updatePartOfObject(
    key,
    value,
    dorefresh = false,
    type = null,
    firebasePath,
    byGivvenSubLink = null,
    callback = null
  ) {
    var subLink = this.state.theSubLink;
    if (byGivvenSubLink != null) {
      subLink = byGivvenSubLink;
    }
    console.log(
      "Sub save " +
        key +
        " to " +
        value +
        " and the path is " +
        firebasePath +
        " and theSubLink is " +
        subLink
    );
    var chunks = subLink.split(
      Config.adminConfig.urlSeparatorFirestoreSubArray
    );
    console.log(chunks);
    var _this = this;
    //First get the document
    //DOCUMENT - GET FIELDS && COLLECTIONS
    var docRef = firebase.app.firestore().doc(firebasePath);
    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var numChunks = chunks.length - 1;
          var doc = doc.data();
          console.log(doc);
          if (value == "DELETE_VALUE") {
            if (numChunks == 2) {
              doc[chunks[1]].splice(chunks[2], 1);
            }
            if (numChunks == 1) {
              doc[chunks[1]] = null;
            }
          } else {
            //Normal update, or insert
            if (key == "DIRECT_VALUE_OF_CURRENT_PATH") {
              if (numChunks == 3) {
                doc[chunks[1]][chunks[2]][chunks[3]] = value;
              }
              if (numChunks == 2) {
                doc[chunks[1]][chunks[2]] = value;
              }
              if (numChunks == 1) {
                doc[chunks[1]] = value;
              }
            } else {
              if (numChunks == 3) {
                doc[chunks[1]][chunks[2]][chunks[3]][key] = value;
              }
              if (numChunks == 2) {
                doc[chunks[1]][chunks[2]][key] = value;
              }
              if (numChunks == 1) {
                doc[chunks[1]][key] = value;
              }
            }
          }

          if (key == "NAME_OF_THE_NEW_KEY" || key == "VALUE_OF_THE_NEW_KEY") {
            var ob = {};
            ob[key] = value;
            _this.setState(ob);
          } else {
            console.log("Document data:", doc);
            _this.updateAction(
              chunks[1],
              doc[chunks[1]],
              dorefresh,
              null,
              true
            );
            if (callback) {
              callback();
            }
          }

          //alert(chunks.length-1);
          //_this.processRecords(doc.data())
          //console.log(doc);
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  /**
   * Firebase update based on key / value,
   * This function also sets derect name and value
   * @param {String} key
   * @param {String} value
   */

  /**
   * updateAction  - updates sub data from document in firestore, this also does Delete
   * @param {String} key to be updated
   * @param {String} value
   * @param {Boolean} refresh after action
   * @param {String} type of file
   * @param {Boolean} forceObjectSave force saving sub object
   */
  updateAction(
    key,
    value,
    dorefresh = false,
    type = null,
    forceObjectSave = false
  ) {
    value = this.processValueToSave(value, type);
    var firebasePath =
      this.props.route.path
        .replace("/firestorevendor/", "")
        .replace(":sub", "") +
      (this.props.params && this.props.params.sub
        ? this.props.params.sub
        : ""
      ).replace(/\+/g, "/");
    if (this.state.theSubLink != null && !forceObjectSave) {
      // alert(key+"<-mk->"+value+"<-->"+dorefresh+"<-->"+type+"<-->"+firebasePath)
      this.updatePartOfObject(key, value, dorefresh, type, firebasePath);
    } else {
      //value=firebase.firestore().doc("/users/A2sWwzDop0EAMdfxfJ56");
      //key="creator";

      console.log("firebasePath from update:" + firebasePath);
      console.log("Update " + key + " into " + value);

      if (key == "NAME_OF_THE_NEW_KEY" || key == "VALUE_OF_THE_NEW_KEY") {
        console.log("THE_NEW_KEY");
        var updateObj = {};
        updateObj[key] = value;
        this.setState(updateObj);
        console.log("-- OBJ update --");
        console.log(updateObj);
      } else {
        var db = firebase.app.firestore();

        var databaseRef = db.doc(firebasePath);
        var updateObj = {};
        updateObj[key] = value;
        databaseRef.set(updateObj, { merge: true });
      }
    }
  }

  viewCreateRestaurantDialog() {
    console.log("display modal");
    this.refs.viewCreateRestaurantRequest.show();
  }

  cancelCreateRestaurantDialog() {
    this.refs.viewCreateRestaurantRequest.hide();
    this.refs.viewCreateMenuRequest.hide();
  }

  handleChangeTitle(event) {
    this.setState({ restaurantTitle: event.target.value });
  }
  
  handleChangeTitleJa(event) {
    this.setState({ restaurantTitleJa: event.target.value });
  }

  handleChangeDescription(event) {
    this.setState({ restaurantDescription: event.target.value });
  }
  
  handleChangeDescriptionJa(event) {
    this.setState({ restaurantDescriptionJa: event.target.value });
  }

  createRestaurant(event) {
    console.log("create resturant");
    var _this = this;

    const restaurantRef = firebase.app
      .firestore()
      .collection("restaurant_collection")
      .doc();
    restaurantRef
      .set({
        title: this.state.restaurantTitle,
        title_ja: this.state.restaurantTitleJa,
        categories: [],
        description: this.state.restaurantDescription,
        description_ja: this.state.restaurantDescriptionJa,
        restaurant_location: {
          Latitude: 0,
          Longitude: 0,
        },
        owner: this.state.user.email,
        image: "https://i.imgur.com/80vu1wL.jpg",
        active_status: 0,
        isDineInAvailable: false,
        website: '',
        delivery_charge: 0,
        count: 1,
      })
      .then(function () {
        _this.cancelCreateRestaurantDialog();
        _this.resetDataFunction();
        _this.setState({
          restaurantTitle: "",
          restaurantDescription: "",
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });

    event.preventDefault();
  }

  viewCreateMenuDialog() {
    console.log("display menu modal");
    // this.getRestaurants()

    this.refs.viewCreateMenuRequest.show();
  }

  getRestaurants = () => {
    //if (this.state.currentCollectionName === 'restaurant') {
    var restaurantRef = firebase.app
      .firestore()
      .collection("restaurant_collection");
    var restaurants = [];
    var restaurantIDs = [];
    restaurantRef = restaurantRef
      .where("owner", "==", firebase.app.auth().currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          snapshot.forEach((doc) => {
            var rest = doc.data();
            rest.id = doc.id;
            //rest.val = 'restaurant_collection/'+doc.id;
            rest.val = doc.id;
            restaurants.push(rest);
            restaurantIDs.push(doc.id);
          });
        }
        return;
      });
    this.setState(
      { restaurants: restaurants, restaurantIDs: restaurantIDs },
      () => this.forceUpdate()
    );

    //}
    this.forceUpdate();
  };

  handleRestChange = (event) => {
    this.setState({ selectedRest: event.target.value });
  };

  cancelCreateMenuDialog() {
    this.refs.viewCreateMenuRequest.hide();
  }

  handleChangeMenuTitle(event) {
    this.setState({ menuTitle: event.target.value });
  }
  handleChangeMenuTitleJa = (event)=> {
    this.setState({ menuTitleJa: event.target.value });
  }

  handleChangeMenuDescription(event) {
    this.setState({ menuDescription: event.target.value });
  }
  handleChangeMenuDescriptionJa = (event)=> {
    this.setState({ menuDescriptionJa: event.target.value });
  }

  handleChangeMenuCalories(event) {
    this.setState({ menuCalories: event.target.value });
  }

  handleChangeMenuPrice(event) {
    this.setState({ menuPrice: event.target.value });
  }
  handleChangeTaxPercentage(event) {
    this.setState({ taxPercentage: event.target.value });
  }

  //Function called when create menu Item form submit
  createMenuItem(event) {
    if (this.state.menuTitle && this.state.menuPrice && this.state.selectedRest) {

    
    console.log("create Menu item");
    var _this = this;
    const collectionRef = firebase.app
      .firestore()
      .collection("restaurant_collection");
    var collection = collectionRef.doc(this.state.userCollectionId);
    if (this.state.selectedRest) {
      collection = collectionRef.doc(this.state.selectedRest);
    }

    const restaurantRef = firebase.app
      .firestore()
      .collection("restaurant")
      .doc();
    restaurantRef
      .set({
        title: this.state.menuTitle,
        title_ja: this.state.menuTitleJa,
        description: this.state.menuDescription,
        description_ja: this.state.menuDescriptionJa,
        food_categories: [],
        owner: this.state.user.email,
        image: "https://i.imgur.com/dwsrHbH.jpeg",
        //status: false,
        isActive: true,
        //calories: this.state.menuCalories,
        collection: collection,
        price: this.state.menuPrice,
        taxPercentage: this.state.taxPercentage,
        options: "",
        shortDescription: "",
        shortDescription_ja: "",
      })
      .then(function (aa) {        
        
        restaurantRef
        .collection("variants")
        .doc()
        .set({
          title: _this.state.menuTitle,
          title_ja: _this.state.menuTitleJa,
          price: _this.state.menuPrice,
          isActive: true
        })
        .then(function () {
            console.log('Document Added ');
            //just to redirect to edit page
            window.location.href = '/dashboard#/firestorevendor/restaurant+'+restaurantRef.id;
           window.location.reload()
           
        })
        .catch(function (error) {
            console.error('Error adding document: ', error);
        });
        _this.cancelCreateMenuDialog();
        _this.resetDataFunction();
        _this.setState({
          menuTitle: "",
          menuTitleJa: "",
          menuDescription: "",
          menuDescriptionJa: "",
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });
    } else {
      this.setState({
        addMenuItemFormError: true
      })
    }
    event.preventDefault();
  }

  /**
   * addDocumentToCollection  - used recursivly to add collection's document's collections
   * @param {String} name name of the collection
   * @param {FirestoreReference} reference
   */
  addDocumentToCollection(name, reference = null) {
    var pathChunks = this.state.firebasePath.split("/");
    pathChunks.pop();
    var withoutLast = pathChunks.join("/");
    console.log(name + " vs " + withoutLast);
    //Find the fields to be inserted
    console.log("INSERT_STRUCTURE");
    var theInsertSchemaObject =
      INSERT_STRUCTURE[name.replace(this.getAppBuilderAppName(), "")].fields;

    //New in version 9.1.0
    theInsertSchemaObject = this.convertSchemaReferencesToNativeReferences(
      theInsertSchemaObject
    );

    //DON'T PRINT THE FIELD SINCE THE ARE CIRCULAR STRUCTURES NOW
    //console.log(JSON.stringify(theInsertSchemaObject));

    //Find the collections to be inserted
    var theInsertSchemaCollections =
      INSERT_STRUCTURE[name.replace(this.getAppBuilderAppName(), "")]
        .collections;
    console.log(JSON.stringify(theInsertSchemaCollections));

    //Reference to root firestore or existing document reference
    var db =
      reference == null
        ? pathChunks.length > 1
          ? firebase.app.firestore().doc(withoutLast)
          : firebase.app.firestore()
        : reference;

    //Check type of insert
    var isTimestamp =
      Config.adminConfig.methodOfInsertingNewObjects == "timestamp";

    //Create new element
    var newElementRef = isTimestamp
      ? db.collection(name).doc(Date.now())
      : db.collection(name).doc();

    if (name === "restaurant") {
      const collectionRef = firebase.app
        .firestore()
        .collection("restaurant_collection");
      const collection = collectionRef.doc(this.state.userCollectionId);
      theInsertSchemaObject["collection"] = collection;
    }
    //Add data to the new element
    newElementRef.set(theInsertSchemaObject);

    //Go over sub collection and insert them
    for (var i = 0; i < theInsertSchemaCollections.length; i++) {
      this.addDocumentToCollection(
        theInsertSchemaCollections[i],
        newElementRef
      );
    }

    //Show the notification on root element
    if (reference == null) {
      this.cancelAddFirstItem();
      var message = "Element added. You can find it in the table bellow.";
      if (Config.adminConfig.goDirectlyInTheInsertedNode) {
        this.props.router.push(
          this.props.route.path.replace(":sub", "") +
            (this.props.params && this.props.params.sub
              ? this.props.params.sub
              : "") +
            Config.adminConfig.urlSeparator +
            newElementRef.id
        );
        message = "Element added. You can now edit it";
      }
      this.setState({ notifications: [{ type: "success", content: message }] });
      this.refreshDataAndHideNotification();

      if (Config.adminConfig.goDirectlyInTheInsertedNode) {
        this.props.router.push(
          this.props.route.path.replace(":sub", "") +
            (this.props.params && this.props.params.sub
              ? this.props.params.sub
              : "") +
            Config.adminConfig.urlSeparator +
            newElementRef.id
        );
      }
    }
  }

  /**
   * addKey
   * Adds key in our list of fields in firestore
   */
  addKey() {
    if (
      this.state.NAME_OF_THE_NEW_KEY &&
      this.state.NAME_OF_THE_NEW_KEY.length > 0
    ) {
      if (
        this.state.VALUE_OF_THE_NEW_KEY &&
        this.state.VALUE_OF_THE_NEW_KEY.length > 0
      ) {
        this.setState({
          notifications: [{ type: "success", content: "New key added." }],
        });
        this.updateAction(
          this.state.NAME_OF_THE_NEW_KEY,
          this.state.VALUE_OF_THE_NEW_KEY
        );
        this.refs.simpleDialog.hide();
        this.refreshDataAndHideNotification();
      }
    }
  }

  reloadPage() {
    // window.location.reload();
    this.refs.newOrderAlert.hide();
  }

  confirmOrderAndSendNotification() {
    console.log("confirmOrderAndSendNotification clicked");

    var _this = this;
    var notifications = [];
    var pathToTokens = "/expoPushTokens";
    var document = this.state.fieldsAsArray;
    var collection = this.state.currentCollectionName;
    var userId;
    var restId = this.state.fieldsAsArray[0].value;
    var restName;
    var expoToken;
    var currentToken;
    Object.keys(document).forEach(function (key) {
      if (document[key].theKey === "userID") {
        userId = document[key].value;
      }
    });

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
          console.log("restaurant title data:", doc.data().title);
        }
      })
      .catch((err) => {
        console.log("Error getting restaurant name", err);
      });

    console.log("document", userId);
    console.log("collection", collection);

    firebase.app
      .firestore()
      .collection("orders")
      .doc(collection)
      .update({
        status: _this.state.orderStatus ? _this.state.orderStatus : "confirmed",
        expected_time_of_delivery: _this.state.expected_time_of_delivery,
        message_optional: _this.state.message_optional,
        deliveryCharge: _this.state.deliveryCharge,
      })
      .then(function () {
        // Send Notification
        firebase.app
          .firestore()
          .collection("users")
          .doc(userId)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("No such user!");
            } else {
              var status = _this.state.orderStatus;
              status = status.replaceAll("_", " ");
              expoToken = doc.data().expoToken;
              if (doc.data().referredBy) {
                _this.rewardTheReferrer(doc);
              }
              notifications.push({
                to: expoToken,
                body:
                  doc.data().fullName != undefined
                    ? `Hi ${doc.data().fullName} Your order is ${status}.`
                    : `Your order is ${status}.`,
                title: _this.state.orderedRestaurant.title
                  ? _this.state.orderedRestaurant.title
                  : restName,
              });
              if (expoToken) {
                var restNameEn = _this.state.orderedRestaurant.title ? _this.state.orderedRestaurant.title : restName;
                var restNameJa = _this.state.orderedRestaurant.title_ja ? _this.state.orderedRestaurant.title_ja : restName;
                var bodyEn =  doc.data().fullName != undefined ? `Hi ${doc.data().fullName} Your order is ${status}.` : `Your order is ${status}.`;
                var bodyJa =  '注文の更新';
                var userCurrentLanguage =  (doc.data().currentLocale) ? doc.data().currentLocale : 'en';
                let data = {
                  "to": expoToken,
                  "title":  (userCurrentLanguage == 'en') ? restNameEn : restNameJa,
                  "body":  (userCurrentLanguage == 'en') ? bodyEn : bodyJa,
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
                        referenceId: collection,
                        isRead: false,
                        type: "order_update",
                        data: {
                          title : restNameEn,
                          titleJa : restNameJa, 
                          createdBy : doc.data().fullName,
                          content : `Your order is ${status}`,
                          optionalMessage: _this.state.message_optional,
                          status : status,
                        },
                        title: _this.state.orderedRestaurant.title
                          ? _this.state.orderedRestaurant.title
                          : restName,  
                        message:
                          doc.data().fullName != undefined
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
            }
          })
          .catch((err) => {
            console.log("Error getting user", err);
          });

        // firebase.app.database().ref(pathToTokens).once('value').then(function(snapshot){
        //   var tokens=snapshot.val();
        //   console.log(tokens);

        //   if (tokens) {
        //      Object.keys(tokens).forEach(function(key) {
        //     console.log("tokens",tokens);

        //     console.log("token key",tokens[key]);

        //     if(tokens[key].orderUserId && tokens[key].orderUserId===userId){
        //       console.log("token key orderUserId",tokens[key].orderUserId);

        //       currentToken=tokens[key].token;
        //       console.log("currentToken",currentToken);

        //     }

        //   });
        //   }

        //   console.log("current documents",document);
        //   console.log("to:currentToken",expoToken);

        // })
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });

    this.refs.confirmPickup.hide();
    this.refs.changeDineInStatusModal.hide();
    this.refs.completeOrder.hide();
    this.refs.rejectOderPickup.hide();
    this.refreshDataAndHideNotification();
  }
  
  confirmReservationAndSendNotification = ()=> {
    console.log("confirmReservationAndSendNotification clicked");

    var _this = this;
    var document = _this.state.fieldsAsArray;
    var collection = _this.state.currentCollectionName;
    var userId;
    var expoToken;
    Object.keys(document).forEach(function (key) {
      if (document[key].theKey === "userID") {
        userId = document[key].value;
      }
    });


    firebase.app
      .firestore()
      .collection("dinein")
      .doc(collection)
      .update({
        messageFromRestaurant: _this.state.messageFromRestaurant,
        reservationStatus: _this.state.reservationStatus,
      })
      .then(function () {
        // Send Notification
        firebase.app.firestore().collection('dinein').doc(collection).get().then(reservation => {
          if (reservation.exists) {
            firebase.app
          .firestore()
          .collection("users")
          .doc(userId)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("No such user!");
            } else {
              var status = _this.state.reservationStatus;
              status = status.replaceAll("_", " ");
              expoToken = doc.data().expoToken;
              
              if (expoToken) {
                var restNameEn = reservation.data().restaurantName;
                var restNameJa = (reservation.data().restaurantNameJa) ? reservation.data().restaurantNameJa : reservation.data().restaurantName;
                var bodyEn =  doc.data().fullName != undefined ? `Hi ${doc.data().fullName} Your reservation is ${status}.` : `Your reservation is ${status}.`;
                var bodyJa =  '予約の更新';
                var userCurrentLanguage =  (doc.data().currentLocale) ? doc.data().currentLocale : 'en';
                let data = {
                  "to": expoToken,
                  "title":  (userCurrentLanguage == 'en') ? restNameEn : restNameJa,
                  "body":  (userCurrentLanguage == 'en') ? bodyEn : bodyJa,
                  "sound": "default",
                  "priority": 'high',
                  "data": {
                    'type': 'dinein-notification',
                    'dineInDate': reservation.data().dineInDate,
                    'dineInTime': reservation.data().dineInTime,
                    'noOfSeats': reservation.data().noOfSeats,
                    'reservationStatus': _this.state.reservationStatus,
                  }
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
                        referenceId: collection,
                        isRead: false,
                        type: "dinein_update",
                        title: reservation.data().restaurantName,
                        data: {
                          title : reservation.data().restaurantName,
                          titleJa : reservation.data().restaurantNameJa, 
                          createdBy : doc.data().fullName,
                          content : `Your reservation is ${status}`,
                          optionalMessage : _this.state.messageFromRestaurant,
                          status : status,
                        },
                        message:
                          doc.data().fullName != undefined
                            ? `Hi ${
                                doc.data().fullName
                              } Your reservation is ${status}.`
                            : `Your reservation is ${status}.`,
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
                console.log("There are no subscribed tokens");
                //alert("There are no subscribed tokens");
              }
            }
          })
          .catch((err) => {
            console.log("Error getting user", err);
          });
          }
        })

      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });

    _this.refs.confirmPickup.hide();
    _this.refs.changeDineInStatusModal.hide();
    _this.refs.completeOrder.hide();
    _this.refs.rejectOderPickup.hide();
    _this.refs.changeDineInStatusModal.hide();
    _this.refreshDataAndHideNotification();
  }

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
  
  completeOrderAndSendNotification() {
    var _this = this;
    var notifications = [];
    var document = this.state.fieldsAsArray;
    var collection = this.state.currentCollectionName;
    var userId;
    var restId = this.state.fieldsAsArray[0].value;
    var restName;
    var expoToken;
    Object.keys(document).forEach(function (key) {
      if (document[key].theKey === "userID") {
        userId = document[key].value;
      }
    });

    var amountPayable =  _this.state.orderDetails.total >= 2000
      ? _this.state.orderDetails.total -
      _this.state.redeemedPoints
      : _this.state.orderDetails.total +
      _this.state.orderDetails.deliveryCharge -
      _this.state.redeemedPoints

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
          console.log("restaurant title data:", doc.data().title);
        }
      })
      .catch((err) => {
        console.log("Error getting restaurant name", err);
      });

    firebase.app
      .firestore()
      .collection("orders")
      .doc(collection)
      .update({
        status: "picked_up",
        amountPayable: amountPayable,
        pointsRedeemed: _this.state.redeemedPoints,
      })
      .then(function () {
        // Send Notification  
        firebase.app
          .firestore()
          .collection("users")
          .doc(userId)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("No such user!");
            } else {
              firebase.app
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        points: doc.data().points - _this.state.redeemedPoints,
      })
              
              expoToken = doc.data().expoToken;              
              if (expoToken) {
                var restNameEn =  _this.state.orderedRestaurant.title ? _this.state.orderedRestaurant.title : restName;
                var restNameJa = _this.state.orderedRestaurant.title_ja ? _this.state.orderedRestaurant.title_ja : restName;
                var bodyEn =  doc.data().fullName != undefined  ? `Hi ${doc.data().fullName} Your order is picked up.`  : `Your order is picked up.`;
                var bodyJa =  'ご注文を承ります。';
                var userCurrentLanguage =  (doc.data().currentLocale) ? doc.data().currentLocale : 'en';               
                var dataToSend = {
                  to: expoToken,
                  body:(userCurrentLanguage == 'en') ? bodyEn : bodyJa,
                  title:(userCurrentLanguage == 'en') ? restNameEn : restNameJa,
                  "data": {'type': 'order_update'}
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
                        userId: userId,
                        referenceId: collection,
                        isRead: false,
                        type: "order_update",
                        data: {
                          title : restNameEn,
                          titleJa : restNameJa, 
                          createdBy : doc.data().fullName,
                          content : 'Your order is picked up',
                          optionalMessage : '',
                          status : 'picked_up',
                        },
                        title: _this.state.orderedRestaurant.title
                          ? _this.state.orderedRestaurant.title
                          : restName,
                        message:
                          doc.data().fullName != undefined
                            ? `Hi ${
                                doc.data().fullName
                              } Your order is picked up.`
                            : `Your order is picked up.`,
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
                        location.reload()
                      });
                  });
              } else {
                location.reload()
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

    //this.refs.confirmPickup.hide();
    //this.refs.completeOrder.hide();
    //this.refs.rejectOderPickup.hide();
    //this.refreshDataAndHideNotification();
  }

  rejectThisOrderBAK = () => {
    console.log("confirmOrderAndSendNotification clicked");

    var _this = this;
    var restId = this.state.fieldsAsArray[0].value;
    var collection = this.state.currentCollectionName;
    firebase.app
      .firestore()
      .collection("restaurant_collection")
      .doc(restId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No such restaurant!");
        } else {
          console.log("restaurant title data:", doc.data().title);
        }
      })
      .catch((err) => {
        console.log("Error getting restaurant name", err);
      });

    firebase.app
      .firestore()
      .collection("orders")
      .doc(collection)
      .update({
        status: "rejected",
        message_optional: this.state.message_optional,
      })
      .then(function () {})
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });

    this.refs.rejectOderPickup.hide();
  };

  rejectThisOrder = () => {
    console.log("confirmOrderAndSendNotification clicked");

    var _this = this;
    _this.setState(
      {
        message_optional: _this.state.message_optional,
        orderStatus: "rejected",
      },
      _this.confirmOrderAndSendNotification
    );

    this.refs.rejectOderPickup.hide();
  };

  /**
   * addItemToArray  - add item to array
   * @param {String} name name of the array
   * @param {Number} howLongItIs count of items, to know the next index
   */
  addItemToArray(name, howLongItIs) {
    console.log("Add item to array " + name);
    console.log("Is just array " + this.state.isJustArray);

    console.log("Data ");
    console.log(this.state.fieldsOfOnsert);

    var dataToInsert = null;
    var correctPathToInsertIn = "";
    if (this.state.fieldsOfOnsert) {
      if (this.state.isJustArray) {
        console.log("THIS IS Array");
        dataToInsert = this.state.fieldsOfOnsert[0];
        correctPathToInsertIn =
          this.state.firebasePath +
          Config.adminConfig.urlSeparatorFirestoreSubArray +
          parseInt(howLongItIs);
      } else {
        dataToInsert = this.state.fieldsOfOnsert[name];
        dataToInsert = dataToInsert ? dataToInsert[0] : null;
        correctPathToInsertIn =
          this.state.firebasePath +
          Config.adminConfig.urlSeparatorFirestoreSubArray +
          name +
          Config.adminConfig.urlSeparatorFirestoreSubArray +
          parseInt(howLongItIs);
      }
    }

    console.log("Data to insert");
    console.log(dataToInsert);
    console.log("Path to insert");
    console.log(correctPathToInsertIn);

    var _this = this;
    this.updatePartOfObject(
      "DIRECT_VALUE_OF_CURRENT_PATH",
      dataToInsert,
      true,
      null,
      this.state.firebasePath,
      correctPathToInsertIn,
      function (e) {
        _this.setState({
          notifications: [{ type: "success", content: "New element added." }],
        });
        _this.refreshDataAndHideNotification();
      }
    );
  }

  /**
   *
   * C Read U D
   *
   */

  /**
   * showSubItems - displays sub object, mimics opening of new page
   * @param {String} theSubLink , direct link to the sub object
   */
  showSubItems(theSubLink) {
    var chunks = theSubLink.split(
      Config.adminConfig.urlSeparatorFirestoreSubArray
    );
    this.setState({
      itemOfInterest: chunks[1],
      theSubLink: theSubLink,
    });
    var items = this.state.records;
    console.log(items);
    for (var i = 1; i < chunks.length; i++) {
      console.log(chunks[i]);
      items = items[chunks[i]];
    }
    console.log("--- NEW ITEMS ");
    console.log(items);
    this.processRecords(items);
  }

  /**
   *
   * C R U Delete
   *
   */

  /**
   * deleteFieldAction - displays sub object, mimics opening of new page
   * @param {String} key to be updated
   * @param {Boolean} isItArrayItem
   * @param {String} theLink
   */
  deleteFieldAction(key, isItArrayItem = false, theLink = null) {
    console.log("Delete " + key);
    console.log(theLink);
    if (theLink != null) {
      theLink = theLink.replace("/firestorevendor", "");
    }
    if (isNaN(key)) {
      isItArrayItem = false;
    }
    console.log("Is it array: " + isItArrayItem);
    var firebasePathToDelete =
      this.props.route.path.replace(ROUTER_PATH, "").replace(":sub", "") +
      (this.props.params && this.props.params.sub
        ? this.props.params.sub
        : ""
      ).replace(/\+/g, "/");
    if (key != null) {
      //firebasePathToDelete+=("/"+key)
    }

    console.log("firebasePath for delete:" + firebasePathToDelete);
    this.setState({
      pathToDelete: theLink ? theLink : firebasePathToDelete,
      isItArrayItemToDelete: isItArrayItem,
      keyToDelete: theLink ? "" : key,
    });
    window.scrollTo(0, 0);
    this.refs.deleteDialog.show();
  }

  /**
   * doDelete - do the actual deleting based on the data in the state
   */
  doDelete() {
    var _this = this;
    console.log("Do delete ");
    console.log("Is it array " + this.state.isItArrayItemToDelete);
    console.log("Path to delete: " + this.state.pathToDelete);
    var completeDeletePath =
      this.state.pathToDelete + "/" + this.state.keyToDelete;
    console.log("completeDeletePath to delete: " + completeDeletePath);
    if (
      this.state.pathToDelete.indexOf(
        Config.adminConfig.urlSeparatorFirestoreSubArray
      ) > -1
    ) {
      //Sub data
      _this.refs.deleteDialog.hide();
      this.updatePartOfObject(
        "DIRECT_VALUE_OF_CURRENT_PATH",
        "DELETE_VALUE",
        true,
        null,
        this.state.firebasePath,
        this.state.pathToDelete,
        function (e) {
          _this.setState({
            notifications: [{ type: "success", content: "Element deleted." }],
          });
          _this.refreshDataAndHideNotification();
        }
      );
    } else {
      //Normal data

      var chunks = completeDeletePath.split("/");

      var db = firebase.app.firestore();

      if (chunks.length % 2) {
        //odd
        //Delete fields from docuemnt
        var refToDoc = db.doc(this.state.pathToDelete);

        // Remove the 'capital' field from the document
        var deleteAction = {};
        deleteAction[
          this.state.keyToDelete
        ] = firebaseREF.firestore.FieldValue.delete();
        refToDoc
          .update(deleteAction)
          .then(function () {
            console.log("Document successfully deleted!");
            _this.refs.deleteDialog.hide();
            _this.setState({
              keyToDelete: null,
              pathToDelete: null,
              notifications: [
                { type: "success", content: "Field is deleted." },
              ],
            });
            _this.refreshDataAndHideNotification();
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      } else {
        //even
        //delete document from collection
        //alert("Delete document "+completeDeletePath);
        db.collection(this.state.pathToDelete)
          .doc(this.state.keyToDelete)
          .delete()
          .then(function () {
            console.log("Document successfully deleted!");
            _this.refs.deleteDialog.hide();
            _this.setState({
              pathToDelete: null,
              notifications: [
                { type: "success", content: "Field is deleted." },
              ],
            });
            _this.refreshDataAndHideNotification();
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      }
    }

    /*firebase.database().ref(this.state.pathToDelete).set(null).then((e)=>{
      console.log("Delete res: "+e)
      this.refs.deleteDialog.hide();
      this.setState({keyToDelete:null,pathToDelete:null,notifications:[{type:"success",content:"Field is deleted."}]});
      this.refreshDataAndHideNotification();

    })*/
  }

  /**
   * cancelDelete - user click on cancel
   */
  cancelDelete() {
    console.log("Cancel Delete");
    this.refs.deleteDialog.hide();
  }

  cancelAddFirstItem() {
    console.log("Cancel Add");
    this.refs.addCollectionDialog.hide();
  }

  /**
   *
   * UI GENERATORS
   *
   */

  /**
   * This function finds the headers for the current menu
   * @param firebasePath - we will use current firebasePath to find the current menu
   */
  findHeadersBasedOnPath(firebasePath) {
    var headers = null;

    var itemFound = false;
    var navigation = Config.vendorNavigation;
    for (var i = 0; i < navigation.length && !itemFound; i++) {
      if (
        navigation[i].path == firebasePath &&
        navigation[i].tableFields &&
        navigation[i].link == "firestorevendor"
      ) {
        headers = navigation[i].tableFields;
        itemFound = true;
      }

      //Look into the sub menus
      if (navigation[i].subMenus) {
        for (var j = 0; j < navigation[i].subMenus.length; j++) {
          if (
            navigation[i].subMenus[j].path == firebasePath &&
            navigation[i].subMenus[j].tableFields &&
            navigation[i].subMenus[j].link == "firestorevendor"
          ) {
            headers = navigation[i].subMenus[j].tableFields;
            itemFound = true;
          }
        }
      }
    }
    return headers;
  }

  /**
   * makeCollectionTable
   * Creates single collection documents
   */
  makeCollectionTable() {
    var name = this.state.currentCollectionName;
    if (name === "restaurant") {
      return (
        <CardUI
          name={name}
          showAction={true}
          action={() => {
            this.addDocumentToCollection(name);
          }}
          title={Common.capitalizeFirstLetter(name)}
        >
          <Table
            caller={"firestore"}
            headers={this.findHeadersBasedOnPath(this.state.firebasePath)}
            deleteFieldAction={this.deleteFieldAction}
            fromObjectInArray={true}
            name={name}
            routerPath={this.props.route.path}
            isJustArray={false}
            sub={
              this.props.params && this.props.params.sub
                ? this.props.params.sub
                : ""
            }
            data={this.state.documents}
          />
        </CardUI>
      );
    } else {
      return (
        <CardUI
          name={name} 
          showAction={(name === 'variants')}
          action={(name === 'variants') ?() => {
            this.addDocumentToCollection(name);
          } : ''}          
          title={Common.capitalizeFirstLetter(name)}
        >
          <Table
            caller={"firestore"}
            headers={this.findHeadersBasedOnPath(this.state.firebasePath)}
            deleteFieldAction={this.deleteFieldAction}
            fromObjectInArray={true}
            name={name}
            routerPath={this.props.route.path}
            isJustArray={false}
            sub={
              this.props.params && this.props.params.sub
                ? this.props.params.sub
                : ""
            }
            data={this.state.documents}
          />
        </CardUI>
      );
    }
  }

  /**
   * Creates single array section
   * @param {String} name, used as key also
   */
  makeArrayCard(name) {
    return (
      <CardUI
        name={name}
        showAction={true}
        action={() => {
          this.addItemToArray(name, this.state.arrays[name].length);
        }}
        title={Common.capitalizeFirstLetter(name)}
      >
        <Table
          caller={"firestore"}
          isFirestoreSubArray={true}
          showSubItems={this.showSubItems}
          headers={this.findHeadersBasedOnPath(this.state.firebasePath)}
          deleteFieldAction={this.deleteFieldAction}
          fromObjectInArray={false}
          name={name}
          routerPath={this.props.route.path}
          isJustArray={this.state.isJustArray}
          sub={
            this.props.params && this.props.params.sub
              ? this.props.params.sub
              : ""
          }
          data={this.state.arrays[name]}
        />
      </CardUI>
    );
  }

  /**
   * Creates  table section for the elements object
   * @param {String} name, used as key also
   */
  makeTableCardForElementsInArray() {
    var name = this.state.lastPathItem;
    return (
      <CardUI
        name={name}
        showAction={false}
        title={Common.capitalizeFirstLetter(name)}
      >
        <Table
          caller={"firestore"}
          isFirestoreSubArray={true}
          showSubItems={this.showSubItems}
          headers={this.findHeadersBasedOnPath(this.state.firebasePath)}
          deleteFieldAction={this.deleteFieldAction}
          fromObjectInArray={true}
          name={name}
          routerPath={this.props.route.path}
          isJustArray={this.state.isJustArray}
          sub={
            this.props.params && this.props.params.sub
              ? this.props.params.sub
              : ""
          }
          data={this.state.elementsInArray}
        ></Table>
      </CardUI>
    );
  }

  /**
   * Creates direct value section
   * @param {String} value, valu of the current path
   */
  makeValueCard(value) {
    var name = this.state.currentCollectionName;
    return (
      <CardUI name={name} showAction={false} title={"Value"}>
        <Input
          updateAction={this.updateAction}
          class=""
          theKey="DIRECT_VALUE_OF_CURRENT_PATH"
          value={value}
        />
      </CardUI>
    );
  }

  /**
   * generateNavBar
   */
  generateNavBar() {
    var subPath =
      this.props.params && this.props.params.sub ? this.props.params.sub : "";
    var items = subPath.split(Config.adminConfig.urlSeparator);
    var name = this.state.currentCollectionName;
    console.log("colect name " + name);
    var path = "/firestorevendor/";
    return (
      <div>
        <NavBar
          items={items}
          path={path}
          title={
            items.length > 0
              ? Common.capitalizeFirstLetter(items[items.length - 1])
              : ""
          }
        />
        <div
          style={{
            float: "right",
            "margin-top": "-40px",
            "margin-right": "28px",
            "padding-top": "8px",
          }}
        >
          {name === "restaurant_collection" ? (
            <a
              className="btn btn-primary"
              onClick={() => this.viewCreateRestaurantDialog()}
            >
              {translate("addNewRestaurant")}
            </a>
          ) : (
            ""
          )}
          {name === "restaurant" ? (
            <a
              className="btn btn-primary"
              onClick={() => this.viewCreateMenuDialog()}
            >
              {translate("addNewMenuItem")}
            </a>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }

  // Filter the menu items based on currently selected Restaurant
  filterMenuItems = ()=> {
    if (this.state.filteredRestaurantId) {
      var _this= this;
    var foodItems= [];
    var db = firebase.app.firestore();
    const restaurantCollectionRef = db
    .collection("restaurant_collection")
   .doc(this.state.filteredRestaurantId);
   const food =  db.collection("restaurant")
  .where('collection', '==', restaurantCollectionRef);

  
  food.get().then(snapshot=> {
    snapshot.docs.forEach((doc) => {
      //Get the object
      var currentDocument = doc.data();

      //Sace uidOfFirebase inside him
      currentDocument.uidOfFirebase = doc.id;
      foodItems.push(currentDocument);
    })
    _this.setState({documents: []}, _this.forceUpdate)
    _this.setState({documents:foodItems}, _this.forceUpdate)
  })

  this.forceUpdate()

    }
    
     
  }
  
  /**
   * generateRestaurantFilter
   */
   generateRestaurantFilter() {
    var name = this.state.currentCollectionName;
    return (name === "restaurant" ? (
      <div>
              <row>
                <div className='col-md-6'>
                <label className="col-sm-3">{translate('filterByRestaurant')}</label>
                {this.state.restaurants ? (
                    <div className="form-group">
                      <select
                        className="form-control"
                        value={this.state.filteredRestaurantId}
                        onChange={(e) =>
                          this.setState({ filteredRestaurantId: e.target.value })
                        }
                      >
                        <option value="">select</option>
                        {this.state.restaurants.map((rest, index) => {
                          return <option value={rest.val}>{rest.title}</option>;
                        })}
                      </select>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <a
              className="btn btn-primary"
              onClick={() => this.filterMenuItems()}
            >
              {translate("filter")}
            </a>
            {this.state.filteredRestaurantId ? <a
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              {translate("clear")}
            </a> : ''}
              </row>
            </div>
    ) : (
      ""
    ));
  }

  /**
   * generateNotifications
   * @param {Object} item - notification to be created
   */
  generateNotifications(item) {
    return (
      <div className="col-md-12">
        <Notification type={item.type}>{item.content}</Notification>
      </div>
    );
  }

  /**
   * refreshDataAndHideNotification
   * @param {Boolean} refreshData
   * @param {Number} time
   */
  refreshDataAndHideNotification(refreshData = true, time = 3000) {
    //Refresh data,
    if (refreshData) {
      this.resetDataFunction();
    }

    //Hide notifications
    setTimeout(
      function () {
        this.setState({ notifications: [] });
      }.bind(this),
      time
    );
  }

  //MAIN RENDER FUNCTION
  render() {
    return (
      <div className="content">
        {this.generateNavBar()}
        {this.generateRestaurantFilter()}

        <div className="content" sub={this.state.lastSub}>
          <div className="container-fluid">
            <div style={{ textAlign: "center" }}>
              {/* LOADER */}
              {this.state.isLoading ? (
                <PulseLoader color="#8637AD" size="12px" margin="4px" />
              ) : (
                ""
              )}
            </div>

            {/* NOTIFICATIONS */}
            {this.state.notifications
              ? this.state.notifications.map((notification) => {
                  return this.generateNotifications(notification);
                })
              : ""}

            {/* Documents in collection */}
            {this.state.isCollection && this.state.documents.length > 0
              ? this.makeCollectionTable()
              : this.state.isCollection ? translate('notFound') : ''}

            {/* DIRECT VALUE */}
            {this.state.directValue && this.state.directValue.length > 0
              ? this.makeValueCard(this.state.directValue)
              : ""}

            {/* FIELDS */}
            {this.state.fieldsAsArray && this.state.fieldsAsArray.length > 0 ? (
              <CardUI
                name={"fields"}
                currentCollectionName={this.state.currentCollectionName}
                lastSub={this.state.lastSub}
                showAction={true}
                action={() => this.refs.simpleDialog.show()}
                confirmOrderAction={
                  this.state.lastSub ===
                  "orders+" + this.state.currentCollectionName
                    ? () => this.refs.confirmPickup.show()
                    : ""
                }
                changeDineInStatus={
                  this.state.lastSub ===
                  "dinein+" + this.state.currentCollectionName
                    ? () => this.refs.changeDineInStatusModal.show()
                    : ""
                }
                completeOrder={
                  this.state.lastSub ===
                  "orders+" + this.state.currentCollectionName
                    ? () => this.refs.completeOrder.show()
                    : ""
                }
                rejectOrderAction={
                  this.state.lastSub ===
                  "orders+" + this.state.currentCollectionName
                    ? () => this.refs.rejectOderPickup.show()
                    : ""
                }
                title={Common.capitalizeFirstLetter(
                  Config.adminConfig.fieldBoxName
                )}
              >
                {this.state.fieldsAsArray
                  ? this.state.fieldsAsArray.map((item) => {
                      return (
                        <Fields
                          isFirestore={true}
                          parentKey={null}
                          key={item.theKey + this.state.lastSub}
                          deleteFieldAction={this.deleteFieldAction}
                          updateAction={this.updateAction}
                          theKey={item.theKey}
                          //isDisabled={true}
                          value={item.value}
                        />
                      );
                    })
                  : ""}
              </CardUI>
            ) : (
              ""
            )}

            {/* COLLECTIONS */}
            {this.state.theSubLink == null &&
            this.state.isDocument &&
            this.state.collections &&
            this.state.collections.length > 0 ? (
              <CardUI
                name={"collections"}
                showAction={false}
                title={"Collections"}
              >
                {this.state.theSubLink == null && this.state.collections
                  ? this.state.collections.map((item) => {
                      var theLink =
                        "/firestorevendor/" +
                        this.state.completePath +
                        Config.adminConfig.urlSeparator +
                        item;
                      return (
                        <Link to={theLink}>
                          <a className="btn">
                            {item}
                            <div className="ripple-container"></div>
                          </a>
                        </Link>
                      );
                    })
                  : ""}
              </CardUI>
            ) : (
              ""
            )}

            {/* ARRAYS */}
            {/* Just Hide these for time being */}
            {(this.state.lastSub ===
                  "orders+" + this.state.currentCollectionName
                     && this.state.arrayNames)
              ? this.state.arrayNames.map((key) => {
                  return this.makeArrayCard(key);
                })
              : ""}

            {/* ELEMENTS MERGED IN ARRAY */}
            {this.state.elementsInArray && this.state.elementsInArray.length > 0
              ? this.makeTableCardForElementsInArray()
              : ""}

            {/* ELEMENTS */}
            {this.state.elements && this.state.elements.length > 0 ? (
              <CardUI
                name={"elements"}
                showAction={false}
                title={this.state.lastPathItem + "' elements"}
              >
                {this.state.elements
                  ? this.state.elements.map((item) => {
                      var theLink =
                        "/firevendor/" +
                        this.state.completePath +
                        Config.adminConfig.urlSeparatorFirestoreSubArray +
                        item.uidOfFirebase;
                      if (this.state.theSubLink != null) {
                        theLink =
                          this.state.theSubLink +
                          Config.adminConfig.urlSeparatorFirestoreSubArray +
                          item.uidOfFirebase;
                      }

                      //alert(theLink);
                      return (
                        <Link
                          onClick={() => {
                            this.showSubItems(theLink);
                          }}
                        >
                          <a className="btn">
                            {item.uidOfFirebase}
                            <div className="ripple-container"></div>
                          </a>
                        </Link>
                      );
                    })
                  : ""}
              </CardUI>
            ) : (
              ""
            )}
          </div>
        </div>
        <SkyLight hideOnOverlayClicked ref="deleteDialog" title="">
          <span>
            <h3 className="center-block">Delete data</h3>
          </span>
          <div className="col-md-12">
            <Notification type="danger">
              All data at this location, but not nested collections, will be
              deleted! To delete any collection's data go in each collection and
              detele the documents
            </Notification>
          </div>
          <div className="col-md-12">Data Location</div>
          <div className="col-md-12">
            <b>{this.state.pathToDelete + "/" + this.state.keyToDelete}</b>
          </div>

          <div className="col-sm-12" style={{ marginTop: 80 }}>
            <div className="col-sm-6"></div>
            <div className="col-sm-3 center-block">
              <a
                onClick={this.cancelDelete}
                className="btn btn-info center-block"
              >
                Cancel
              </a>
            </div>
            <div className="col-sm-3 center-block">
              <a
                onClick={this.doDelete}
                className="btn btn-danger center-block"
              >
                Delete
              </a>
            </div>
          </div>
        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="addCollectionDialog" title="">
          <span>
            <h3 className="center-block">Add first document in collection</h3>
          </span>
          <div className="col-md-12">
            <Notification type="success">
              Looks like there are no documents in this collection. Add your
              first document in this collection
            </Notification>
          </div>

          <div className="col-md-12">Data Location</div>
          <div className="col-md-12">
            <b>{this.state.showAddCollection}</b>
          </div>

          <div className="col-sm-12" style={{ marginTop: 80 }}>
            <div className="col-sm-6"></div>
            <div className="col-sm-3 center-block">
              <a
                onClick={this.cancelAddFirstItem}
                className={
                  Config.designSettings.buttonInfoClass + " center-block"
                }
              >
                Cancel
              </a>
            </div>
            <div className="col-sm-3 center-block">
              <a
                onClick={() => {
                  this.addDocumentToCollection(
                    this.state.currentCollectionName
                  );
                }}
                className={
                  Config.designSettings.buttonSuccessClass + " center-block"
                }
              >
                ADD
              </a>
            </div>
          </div>
        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="simpleDialog" title="">
          <span>
            <h3 className="center-block">Add new key</h3>
          </span>
          <br />
          <div className="card-content">
            <div className="row">
              <label className="col-sm-3 label-on-left">Name of they key</label>
              <div className="col-sm-12">
                <Input
                  updateAction={this.updateAction}
                  class=""
                  theKey="NAME_OF_THE_NEW_KEY"
                  value={"name"}
                />
              </div>
              <div className="col-sm-1"></div>
            </div>
          </div>
          <br />
          <br />
          <div className="card-content">
            <div className="row">
              <label className="col-sm-3 label-on-left">Value</label>
              <div className="col-sm-12">
                <Input
                  updateAction={this.updateAction}
                  class=""
                  theKey="VALUE_OF_THE_NEW_KEY"
                  value={"value"}
                />
              </div>
              <div className="col-sm-1"></div>
            </div>
          </div>
          <div className="col-sm-12 ">
            <div className="col-sm-3 "></div>
            <div className="col-sm-6 center-block">
              <a
                onClick={this.addKey}
                className="btn btn-rose btn-round center-block"
              >
                <i className="fa fa-save"></i> Add key
              </a>
            </div>
            <div className="col-sm-3 "></div>
          </div>
        </SkyLight>

        <SkyLight dialogStyles={{ height: "60%" }} hideOnOverlayClicked ref="confirmPickup" title="">
          <span>
            <h3 className="center-block">Change Order status</h3>
          </span>
          <div className="card-content">
            <div className="row">
              {/* <h5>Change the order status</h5> */}
              <h5>Order ID : {this.state.currentCollectionName}</h5>
            </div>
            <div>
              <row>
                <label className="col-sm-3 label-on-left">Order Status</label>
                <select
                  className="col-sm-9 form-control form-control-sm"
                  value={this.state.orderStatus}
                  onChange={(e) =>
                    this.setState({ orderStatus: e.target.value })
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
                </select>
              </row>
            </div>
            <br />
            <div>
              <label className="col-sm-3 label-on-left">Expected Time</label>
              <br />
              <input
                type="text"
                onChange={(event) =>
                  this.setState({
                    expected_time_of_delivery: event.target.value,
                  })
                }
                value={this.state.expected_time_of_delivery}
                className="col-sm-6 form-control"
                name="expected_time_of_delivery"
              />
              <br />
              
              <label className="col-sm-3 label-on-left">{translate('deliveryCharge')}</label>
              <br />
              <input
                type="text"
                onChange={(event) =>
                  this.setState({
                    deliveryCharge: event.target.value,
                  })
                }
                value={this.state.deliveryCharge}
                className="col-sm-6 form-control"
                name="deliveryCharge"
              />
              <br />
              <label className="col-sm-3 label-on-left">
                Message (Optional)
              </label>
              <textarea
                onChange={(event) =>
                  this.setState({ message_optional: event.target.value })
                }
                value={this.state.message_optional}
                className="form-control"
                cols={3}
                name="message_optional"
              ></textarea>
            </div>
          </div>

          <div className="col-sm-12 ">
            <div className="col-sm-3 "></div>
            <div className="col-sm-6 center-block">
              <a
                onClick={this.confirmOrderAndSendNotification}
                className="btn btn-rose btn-round center-block"
              >
                <i className="fa fa-save"></i>Change status
              </a>
            </div>
            <div className="col-sm-3 "></div>
          </div>
        </SkyLight>
        
        <SkyLight hideOnOverlayClicked ref="changeDineInStatusModal" title="">
          <span>
            <h3 className="center-block">Change Reservation status</h3>
          </span>
          <div className="card-content">
            <div className="row">
              {/* <h5>Change the order status</h5> */}
              <h5>Reservation ID : {this.state.currentCollectionName}</h5>
            </div>
            <div>
              <row>
                <label className="col-sm-3 label-on-left">Reservation Status</label>
                <select
                  className="col-sm-9 form-control form-control-sm"
                  value={this.state.reservationStatus}
                  onChange={(e) =>
                    this.setState({ reservationStatus: e.target.value })
                  }
                >
                  <option value="">select</option>
                  <option value="confirmed">Confirm</option>
                  <option value="rejected">Reject</option>
                </select>
              </row>
            </div>
            <br />
            <div>              
              <label className="col-sm-3 label-on-left">
                Message (Optional)
              </label>
              <textarea
                onChange={(event) =>
                  this.setState({ messageFromRestaurant: event.target.value })
                }
                value={this.state.messageFromRestaurant}
                className="form-control"
                cols={3}
                name="messageFromRestaurant"
              ></textarea>
            </div>
          </div>

          <div className="col-sm-12 ">
            <div className="col-sm-3 "></div>
            <div className="col-sm-6 center-block">
              <a
                onClick={this.confirmReservationAndSendNotification}
                className="btn btn-rose btn-round center-block"
              >
                <i className="fa fa-save"></i>Change status
              </a>
            </div>
            <div className="col-sm-3 "></div>
          </div>
        </SkyLight>
        
        

        <SkyLight
          dialogStyles={{ height: "600px" }}
          hideOnOverlayClicked
          ref="completeOrder"
          title={translate("completeOrder")}
        >
          <div className="card-content">
            {this.state.orderDetails && this.state.orderOwner ? (
              <div>
                {/* Order Id   */}
                <div className="row">
                  <div className="col-md-3">
                    <h5>{translate("orderID")} : </h5>
                  </div>
                  <div className="col-md-9">
                    <h5>{this.state.currentCollectionName} </h5>
                  </div>
                </div>
                {/* End Order Id   */}

                {/* Order Total   */}
                <div className="row">
                  <div className="col-md-3">
                    <h5>{translate("orderValue")} : </h5>
                  </div>
                  <div className="col-md-9">
                    <h5>{this.state.orderDetails.total} </h5>
                  </div>
                </div>
                {/* End Order Total   */}

                {/* Delivery Charges   */}
                <div className="row">
                  <div className="col-md-3">
                    <h5>{translate("deliveryCharges")} : </h5>
                  </div>
                  <div className="col-md-9">
                    <h5>
                      {this.state.orderDetails.total > 2000
                        ? 0
                        : this.state.orderDetails.deliveryCharge}{" "}
                    </h5>
                  </div>
                </div>
                {/* End Delivery Charges   */}

                {/* Total value   */}
                <div className="row">
                  <div className="col-md-3">
                    <h5>{translate("total")} : </h5>
                  </div>
                  <div className="col-md-9">
                    <h5>
                      {this.state.orderDetails.total > 2000
                        ? this.state.orderDetails.total
                        : this.state.orderDetails.total +
                          this.state.orderDetails.deliveryCharge}{" "}
                    </h5>
                  </div>
                </div>
                {/* End Total value   */}

                {/* points available   */}
                <div className="row">
                  <div className="col-md-3">
                    <h5>{translate("pointsAvailable")} : </h5>
                  </div>
                  <div className="col-md-9">
                    <h5>{this.state.orderOwner.points} </h5>
                  </div>
                </div>
                {/* End points available   */}

                {/* points redeem   */}
                <div className="row">
                  <div className="col-md-3">
                    <h5>{translate("pointsRedeem")} : </h5>
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          style={{ paddingTop: "35px" }}
                          type="text"
                          value={this.state.redeemedPoints}
                          onChange={(e) => {
                            if (e.target.value <= 100 && e.target.value <= this.state.orderOwner.points ) {
                              this.setState({ redeemedPoints: e.target.value });
                            } else {
                              alert("please check the input");
                            }
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-8">
                        <h5>Max 100</h5>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End points redeem   */}

                {/* Amount Payable   */}
                <div className="row">
                  <div className="col-md-3">
                    <h5>{translate("amountPayable")} : </h5>
                  </div>
                  <div className="col-md-9">
                    <h5>
                      {this.state.orderDetails.total > 2000
                        ? this.state.orderDetails.total -
                          this.state.redeemedPoints
                        : this.state.orderDetails.total +
                          this.state.orderDetails.deliveryCharge -
                          this.state.redeemedPoints}
                    </h5>
                  </div>
                </div>
                {/* End Amount Payable   */}

                <div className="col-sm-12 ">
                  <div className="col-sm-3 "></div>
                  <div className="col-sm-6 center-block">
                    <a
                      onClick={this.completeOrderAndSendNotification}
                      className="btn btn-rose btn-round center-block"
                    >
                      <i className="fa fa-save"></i>{" "}
                      {translate("completeOrder")}
                    </a>
                  </div>
                  <div className="col-sm-3 "></div>
                </div>
              </div>
            ) : (
              <p>Nothing found</p>
            )}
          </div>
        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="rejectOderPickup" title="">
          <span>
            <h3 className="center-block">Reject Order</h3>
          </span>
          <div className="card-content">
            <div className="row">
              <h5>Are you sure you want to reject the order?</h5>
              <h5>Order ID : {this.state.currentCollectionName}</h5>
            </div>
            <div>
              <label className="col-sm-3 label-on-left">
                Reason for reject
              </label>
              <textarea
                onChange={(event) =>
                  this.setState({ message_optional: event.target.value })
                }
                value={this.state.message_optional}
                className="form-control"
                cols={3}
                name="message_optional"
              ></textarea>
            </div>
          </div>

          <div className="col-sm-12 ">
            <div className="col-sm-3 "></div>
            <div className="col-sm-6 center-block">
              <a
                onClick={this.rejectThisOrder}
                className="btn btn-rose btn-round center-block"
              >
                <i className="fa fa-save"></i>Reject
              </a>
            </div>
            <div className="col-sm-3 "></div>
          </div>
        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="newOrderAlert" title="">
          <span>
            <h3 className="center-block">New Order Received</h3>
          </span>
          <br />
          <div className="card-content">
            <div className="row">
              <h5>You got a new order</h5>
            </div>
            <br />
            <br />

            <div className="col-sm-12 ">
              <div className="col-sm-3 "></div>
              <div className="col-sm-6 center-block">
                <a
                  onClick={this.reloadPage}
                  className="btn btn-rose btn-round center-block"
                >
                  <i className="fa fa-save"></i>Check it
                </a>
              </div>
              <div className="col-sm-3 "></div>
            </div>
          </div>
        </SkyLight>
        <SkyLight
          dialogStyles={{ height: "60%" }}
          hideOnOverlayClicked
          ref="viewCreateRestaurantRequest"
          title=""
        >
          <div className="col-md-12">
            <form onSubmit={this.createRestaurant}>
              <div className="card card-login">
                <div
                  style={{ background: "#211c54" }}
                  className="card-header text-center"
                  data-background-color="#0B3C5D"
                >
                  <h4
                    style={{ marginTop: "0px", marginBottom: "0px" }}
                    className="card-title"
                  >
                    {translate('Add Restaurant')}
                  </h4>
                </div>
                <div className="card-content">
                  <h4>{this.props.error}</h4>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">how_to_reg</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('title')}</label>
                      <input
                        type="text"
                        value={this.state.restaurantTitle}
                        onChange={this.handleChangeTitle}
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">how_to_reg</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('titleJa')}</label>
                      <input
                        type="text"
                        value={this.state.restaurantTitleJa}
                        onChange={this.handleChangeTitleJa}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">work</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('description')}</label>
                      <input
                        type="text"
                        value={this.state.restaurantDescription}
                        onChange={this.handleChangeDescription}
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">work</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('descriptionJa')}</label>
                      <input
                        type="text"
                        value={this.state.restaurantDescriptionJa}
                        onChange={this.handleChangeDescriptionJa}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="footer text-center">
                  <a
                    onClick={this.cancelCreateRestaurantDialog}
                    className="btn btn-info"
                  >
                    {translate('cancel')}
                  </a>
                  <input  type="submit" className="btn btn-danger" />
                </div>
              </div>
            </form>
          </div>
        </SkyLight>
        <SkyLight
          dialogStyles={{ height: "85%" }}
          hideOnOverlayClicked
          ref="viewCreateMenuRequest"
          title=""
        >
          <div className="col-md-12">
            <form onSubmit={this.createMenuItem}>
              <div className="card card-login">
                <div
                  style={{ background: "#211c54" }}
                  className="card-header text-center"
                  data-background-color="#0B3C5D"
                >
                  <h4
                    style={{ marginTop: "0px", marginBottom: "0px" }}
                    className="card-title"
                  >
                    {translate('Add Menu Item')}
                  </h4>
                </div>
                <div className="card-content">
                  <h4>{this.props.error}</h4>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">title</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('title')}</label>
                      <input
                        type="text"
                        value={this.state.menuTitle}
                        onChange={this.handleChangeMenuTitle}
                        className="form-control"
                      />
                    </div>
                    {(this.state.addMenuItemFormError && !this.state.menuTitle) ? <span style={{color: 'red', fontSize: '12px'}} >{translate('thisFieldIsRequired')}</span> : null}
                  </div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">title</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('titleJa')}</label>
                      <input
                        type="text"
                        value={this.state.menuTitleJa}
                        onChange={this.handleChangeMenuTitleJa}
                        className="form-control"
                      />
                    </div>
                  </div>
                  {this.state.restaurants ? (
                    <div className="input-group">
                       <span className="input-group-addon">
                      <i className="material-icons">restaurant</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('restaurant')}</label>
                      <select
                        className="form-control"
                        value={this.state.selectedRest}
                        onChange={this.handleRestChange}
                      >
                        <option value="">select</option>
                        {this.state.restaurants.map((rest, index) => {
                          return <option value={rest.val}>{rest.title}</option>;
                        })}
                      </select>
                      {(this.state.addMenuItemFormError && !this.state.selectedRest) ? <span style={{color: 'red', fontSize: '12px'}} >{translate('thisFieldIsRequired')}</span> : null}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">description</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('description')}</label>
                      <textarea
                      className="form-control"
                      style={{minHeight: 75}}
                       onChange={this.handleChangeMenuDescription} >
                        {this.state.menuDescription}
                      </textarea>
                      
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">description</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('description_ja')}</label>
                      <textarea
                      className="form-control"
                      style={{minHeight: 75}}
                       onChange={this.handleChangeMenuDescriptionJa} >
                        {this.state.menuDescriptionJa}
                      </textarea>
                      
                    </div>
                  </div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">money</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('price')}</label>
                      <input
                        type='number'
                        value={this.state.menuPrice}
                        onChange={this.handleChangeMenuPrice}
                        className="form-control"
                      />
                    </div>
                    {(this.state.addMenuItemFormError && !this.state.menuPrice) ? <span style={{color: 'red', fontSize: '12px'}} >{translate('thisFieldIsRequired')}</span> : null}
                  </div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">money</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">{translate('tax_in_percentage')}</label>
                      <input
                        type='number'
                        value={this.state.taxPercentage}
                        onChange={this.handleChangeTaxPercentage}
                        className="form-control"
                      />
                    </div>
                    {(this.state.addMenuItemFormError && !this.state.taxPercentage) ? <span style={{color: 'red', fontSize: '12px'}} >{translate('thisFieldIsRequired')}</span> : null}
                  </div>
                  {/* <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">emoji_food_beverage</i>
                    </span>
                    <div className="form-group">
                      <label className="control-label">Calories</label>
                      <input
                        type="text"
                        value={this.state.menuCalories}
                        onChange={this.handleChangeMenuCalories}
                        className="form-control"
                      />
                    </div>
                  </div> */}
                </div>
                <div className="footer text-center">
                  <a
                    onClick={this.cancelCreateRestaurantDialog}
                    className="btn btn-info"
                  >
                    {translate('cancel')}
                  </a>
                  <input type="submit" className="btn btn-danger" />
                </div>
              </div>
            </form>
          </div>
        </SkyLight>
      </div>
    );
  }
}
export default Firestorevendor;
