/*eslint eqeqeq: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint no-use-before-define: "off"*/
/*eslint radix: "off"*/
/*eslint no-redeclare: "off"*/
import React, {Component} from 'react'
import {Link} from 'react-router'
import firebase from '../config/database'
import Fields from '../components/fields/Fields.js'
import Input from '../components/fields/Input.js';
import Table from  '../components/tables/RTable.js'
import Config from   '../config/app';
import Common from '../common.js';
import Notification from '../components/Notification';
import SkyLight from 'react-skylight';
import NavBar from './../ui/template/NavBar'
import moment from 'moment';
import CardUI from './../ui/template/Card'
import INSERT_STRUCTURE from "../config/firestoreschema.js"
import * as firebaseREF from 'firebase';
var request = require('superagent');
require("firebase/firestore");



const ROUTER_PATH="/firestorevendor/";
import { PulseLoader } from 'halogenium';

class Firestorevendor extends Component {
  
  constructor(props){
    super(props);
    
    //Create initial step
    this.state={
      documents:[],
      collections:[],
      currentCollectionName:"",
      isCollection:false,
      isDocument:false,
      keyToDelete:null,
      pathToDelete:null,
      theSubLink:null,
      fieldsOfOnsert:null,
      isLoading:true,
      showAddCollection:"",
      user:{},
      userCollectionId:null,
      restaurantID:"" ,
      displayNewOrder:false
    };

    //Bind function to this
    this.getCollecitonDataFromFireStore=this.getCollecitonDataFromFireStore.bind(this);
    this.resetDataFunction=this.resetDataFunction.bind(this);
    this.processRecords=this.processRecords.bind(this);
    this.updateAction=this.updateAction.bind(this);
    this.cancelDelete=this.cancelDelete.bind(this);
    this.cancelAddFirstItem=this.cancelAddFirstItem.bind(this);
    this.doDelete=this.doDelete.bind(this);
    this.deleteFieldAction=this.deleteFieldAction.bind(this);
    this.refreshDataAndHideNotification=this.refreshDataAndHideNotification.bind(this);
    this.addKey=this.addKey.bind(this);
    this.confirmOrderAndSendNotification=this.confirmOrderAndSendNotification.bind(this);
    this.showSubItems=this.showSubItems.bind(this);
    this.updatePartOfObject=this.updatePartOfObject.bind(this);
    this.addDocumentToCollection=this.addDocumentToCollection.bind(this);
    this.addItemToArray=this.addItemToArray.bind(this);
    this.newOrderAlert=this.newOrderAlert.bind(this);
    this.reloadPage=this.reloadPage.bind(this);



  }

  /**
   * Step 0a
   * Start getting data
   */
  componentDidMount(){
      window.getDemo().reinitializeSideClose();
      this.findFirestorePath();

      const _this = this;

      const setUser=(user)=>{
        

        this.setState({
          user:user,
        })

      }
    
        firebase.app.auth().onAuthStateChanged(function(user) {
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
        
        console.log("Restaurant Id",_this.state.restaurantID)
        
       
  }

  componentWillMount(){
    
    
  }

  /**
   * Convert field starting with REFERENCE: to native reference
   * ex. 
   * "fields":{
			"group":"REFERENCE:/groups/YOURDEFAULTGROUP",
    },
   * @param {Object} fields 
   */
  convertSchemaReferencesToNativeReferences(fields){

    Object.keys(fields).forEach((key)=>{
        if (fields.hasOwnProperty(key)) {
          if((fields[key]+"").indexOf("REFERENCE:")==0){
            var refrencePath=(fields[key]+"").replace("REFERENCE:","");
            console.log("refrencePath -->"+refrencePath)
            fields[key]=firebase.app.firestore().doc(refrencePath);
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
  resetDataFunction(){
    var newState={};
        newState.documents=[];
        newState.collections=[];
        newState.currentCollectionName="";
        newState.fieldsAsArray=[];
        newState.arrayNames=[];
        newState.fields=[];
        newState.arrays=[];
        newState.elements=[];
        newState.elementsInArray=[];
        newState.theSubLink=null;

    this.setState(newState);
    this.findFirestorePath();
  }

  newOrderAlert(){
    const _this=this;
    firebase.app.firestore().collection('orders').where('restaurantID', '==', 'nqM8wudP47GJVzRXjuD6').where('status', '==', 'Just created').onSnapshot(querySnapshot => {
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
      this.refs.newOrderAlert.show()
      // alert("new order");
    },err =>{
      console.log(`Encountered error: ${err}`);
    })
  }

  /**
   * Step 0c
   * componentWillReceiveProps event of React, fires when component is mounted and ready to display
   * Start connection to firebase
   */
  componentWillReceiveProps(nextProps, nextState) {
      console.log("Next SUB: "+nextProps.params.sub);
      console.log("Prev SUB : "+this.props.params.sub);
      if(nextProps.params.sub==this.props.params.sub){
          console.log("update now");
          this.setState({isLoading:true})
          this.resetDataFunction();
      }
  }

  getAppBuilderAppName(){
    if(Config.appEditPath!= undefined){
      var items=Config.appEditPath.split("/");
      var lastPathItem=items[items.length-1];
      return lastPathItem+"_";
    }else{
      return "";
    }
  }

  /**
   * Step 0d
   * getMeTheFirestorePath created firestore path based on the router parh
   */
  getMeTheFirestorePath(){
    var thePath=/*this.getAppBuilderAppName()+*/(this.props.route.path.replace(ROUTER_PATH,"").replace(":sub",""))+(this.props.params&&this.props.params.sub?this.props.params.sub:"").replace(/\+/g,"/");;
    return thePath;
  }

  /**
   * Step 1
   * Finds out the Firestore path
   * Also creates the path that will be used to access the insert
   */
  findFirestorePath(){
      var pathData={}
      if(this.props.params&&this.props.params.sub){
          pathData.lastSub=this.props.params.sub;
      }

      //Find the firestore path
      var firebasePath=this.getMeTheFirestorePath();
      pathData.firebasePath=firebasePath;

      

      //Find last path - the last item
      var subPath=this.props.params&&this.props.params.sub?this.props.params.sub:""
      var items=subPath.split(Config.adminConfig.urlSeparator);
      pathData.lastPathItem=Common.capitalizeFirstLetter(items[items.length-1]);
      pathData.completePath=subPath;

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
  getCollecitonDataFromFireStore(collection){
    
    //Create the segmments based on the path / collection we have
    var segments = collection.split("/");
    var lastSegment=segments[segments.length-1];

    //Is this a call to a collections data
    var isCollection=segments.length%2;

    //Reference to this
    var _this=this;

    //Save know info for now
    this.setState({
      currentCollectionName:segments[segments.length-1],
      isCollection:isCollection,
      isDocument:!isCollection,
    })

    //Get reference to firestore
    var db = firebase.app.firestore();

    //Here, we will save the documents from collection
    var documents=[];

    if(isCollection){
      

      if(collection==="restaurant"){
        db.collection("restaurant_collection").get().then(function(querySnapshot) {
          var datacCount=0;
          querySnapshot.forEach(function(doc) {
            datacCount++;
            if(_this.state.user.email===doc.data().owner){
              //Increment counter
              _this.setState({
                userCollectionId:doc.id
              })
              // userCollectionId=doc.id;

            }
          })
        })
      }else if(collection==="orders"){
        // this.newOrderAlert()
        db.collection("restaurant_collection").get().then(function(querySnapshot) {
          var datacCount=0;
          querySnapshot.forEach(function(doc) {
            datacCount++;
            if(_this.state.user.email===doc.data().owner){
              //Increment counter
              _this.setState({
                userCollectionId:doc.id,
                displayNewOrder:true
              })
              // userCollectionId=doc.id;

            }
          })
        })
      }

        //COLLECTIONS - GET DOCUMENTS 
       
        db.collection(collection).get().then(function(querySnapshot) {
          var datacCount=0;
          querySnapshot.forEach(function(doc) {

            //Increment counter
            datacCount++;

            //Get the object
            var currentDocument=doc.data();

            //Sace uidOfFirebase inside him
            currentDocument.uidOfFirebase=doc.id;

            // console.log(doc.id, " => ", currentDocument);
            // console.log("user ", _this.state.user.email);
            

            if(collection==="restaurant_collection" && currentDocument.owner===_this.state.user.email){
              //Save in the list of documents
              documents.push(currentDocument)
            }else if(collection==="restaurant" && currentDocument.collection.id===_this.state.userCollectionId){
              documents.push(currentDocument)
            }else if(collection==="orders" && currentDocument.restaurantID===_this.state.userCollectionId){
              
              currentDocument.orderID=doc.id;
              documents.push(currentDocument)
            }

            
          });
          console.log("DOCS----");
          console.log(documents);

          //Save the douments in the sate
          _this.setState({
            isLoading:false,
            documents:documents,
            showAddCollection:datacCount==0?collection:""
          })
          if(datacCount==0){
            _this.refs.addCollectionDialog.show();
          }
          console.log(_this.state.documents);
      });
      }else{
        //DOCUMENT - GET FIELDS && COLLECTIONS
        var referenceToCollection=collection.replace("/"+lastSegment,"");

        //Create reference to the document itseld
        var docRef = db.collection(referenceToCollection).doc(lastSegment);

        //Get the starting collectoin
        var parrentCollection=segments;
        parrentCollection.splice(-1,1);

        //Find the collections of this document
        this.findDocumentCollections(parrentCollection);
        
        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());

                //Directly process the data
                _this.processRecords(doc.data())  
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("2nd Error getting document:", error);
        }); 
      }
   }

  /**
   * Step 3
   * findDocumentCollections - what collections should we display / currently there is no way to get collection form docuemnt
   * @param {Array} chunks - the collection / documents
   */
  findDocumentCollections(chunks){
      console.log("Search for the schema now of "+chunks);

      //In firestore, use the last chunk only
      chunks=[chunks[chunks.length-1]];
      console.log("Modified chunk "+chunks);
      

      //At start is the complete schema
      var theInsertSchemaObject=INSERT_STRUCTURE;
      var cuurrentFields=null;
      console.log("CHUNKS");
      console.log(chunks);
      
      //Foreach chunks, find the collections / fields
      chunks.map((item,index)=>{
          console.log("current chunk:"+item);

          //Also make the last object any
          //In the process, check if we have each element in our schema
          if(theInsertSchemaObject!=null&&theInsertSchemaObject&&theInsertSchemaObject[item]&&theInsertSchemaObject[item]['collections']){
              var isLastObject=(index==(chunks.length-1));
              
              if(isLastObject&&theInsertSchemaObject!=null&&theInsertSchemaObject[item]&&theInsertSchemaObject[item]['fields']){
                cuurrentFields=theInsertSchemaObject[item]['fields'];  
              }

              if(isLastObject&&theInsertSchemaObject!=null){
                //It is last
                theInsertSchemaObject=theInsertSchemaObject[item]['collections'];
              }else{
                theInsertSchemaObject=theInsertSchemaObject[item]['collections'];
              }
          }else{
            theInsertSchemaObject=[];
          }
          console.log("Current schema");
          console.log(theInsertSchemaObject);


      })
      
      //Save the collection to be shown as button and fieldsOfOnsert that will be used on inserting object
      this.setState({collections:theInsertSchemaObject,fieldsOfOnsert:cuurrentFields})
  }

  /**
   * Step 4
   * Processes received records from firebase
   * @param {Object} records
   */
  processRecords(records){
      console.log(records);

      var fields={};
      var arrays={};
      var elements=[];
      var elementsInArray=[];
      var newState={};
      var directValue="";
      newState.fieldsAsArray=fieldsAsArray;
      newState.arrayNames=arrayNames;
      newState.fields=fields;
      newState.arrays=arrays;
      newState.elements=elements;
      newState.directValue=directValue;
      newState.elementsInArray=elementsInArray;
      newState.records=null;

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
      if(Common.getClass(records)=="Array"){
          //Get the last name
          console.log("This is array");
          var subPath=this.props.params&&this.props.params.sub?this.props.params.sub:""
          var allPathItems=subPath.split("+");
          console.log(allPathItems)
          if(allPathItems.length>0){
              var lastItem=allPathItems[allPathItems.length-1];
              console.log(lastItem);
              arrays[lastItem]=records;

          }
          //this.setState({"arrays":this.state.arrays.push(records)})
      }else if(Common.getClass(records)=="Object"){
          //Parse the Object record
          for (var key in records){
              if (records.hasOwnProperty(key)) {
                  var currentElementClasss=Common.getClass(records[key]);
                  console.log(key + "'s class is: " + currentElementClasss);

                  //Add the items by their type
                  if(currentElementClasss=="Array"){
                      //Add it in the arrays  list
                      arrays[key]=records[key];
                  }else if(currentElementClasss=="Object"){
                      //Add it in the elements list
                      var isElementMentForTheArray=false; //Do we have to put this object in the array
                      for (var i=0;i<Config.adminConfig.prefixForJoin.length;i++){
                          if(key.indexOf(Config.adminConfig.prefixForJoin[i])>-1){
                              isElementMentForTheArray=true;
                              break;
                          }
                      }

                      var objToInsert=records[key];
                      objToInsert.uidOfFirebase=key;

                      if(isElementMentForTheArray){
                          //Add this to the merged elements
                          elementsInArray.push(objToInsert);
                      }else{
                          //Add just to elements
                          elements.push(objToInsert);
                      }

                  }else if(currentElementClasss!="undefined"&&currentElementClasss!="null"){
                      //This is string, number, or Boolean
                      //Add it to the fields list
                      fields[key]=records[key];
                  }else if(currentElementClasss=="GeoPoint"){
                      //This is GeoPOint
                      //Add it to the fields list
                      fields[key]=records[key];
                  }else if(currentElementClasss=="DocumentReference"){
                      //This is DocumentReference
                      //Add it to the fields list
                      fields[key]=records[key];
                  }
                  
              }
          }
      }if(Common.getClass(records)=="String"){
        console.log("We have direct value of string");
        directValue=records;
      }

      //Convert fields from object to array
      var fieldsAsArray=[];
      console.log("Add the items now inside fieldsAsArray");
      console.log("Current schema");
      console.log(this.state.currentInsertStructure)
      //currentInsertStructure
      var keysFromFirebase=Object.keys(fields);
      console.log("keysFromFirebase")
      console.log(keysFromFirebase)
      var keysFromSchema=Object.keys(this.state.currentInsertStructure||{});
      console.log("keysFromSchema")
      console.log(keysFromSchema)

      keysFromSchema.forEach((key)=>{
        if (fields.hasOwnProperty(key)) {
          fieldsAsArray.push({"theKey":key,"value":fields[key]})
          var indexOfElementInFirebaseObject = keysFromFirebase.indexOf(key);
          if (indexOfElementInFirebaseObject > -1) {
              keysFromFirebase.splice(indexOfElementInFirebaseObject, 1);
          }
        }
      });

      console.log("keysFromFirebase")
      console.log(keysFromFirebase)

      keysFromFirebase.forEach((key)=>{
        if (fields.hasOwnProperty(key)) {
          fieldsAsArray.push({"theKey":key,"value":fields[key]})
        }
      });



      //Get all array names
      var arrayNames=[];
      Object.keys(arrays).forEach((key)=>{
          arrayNames.push(key)
      });

      var newState={};
      newState.fieldsAsArray=fieldsAsArray;
      newState.arrayNames=arrayNames;
      newState.fields=fields;
      newState.arrays=arrays;
      newState.isJustArray=Common.getClass(records)=="Array";
      newState.elements=elements;
      newState.elementsInArray=elementsInArray;
      newState.directValue=directValue;
      newState.records=records;
      newState.isLoading=false;

      console.log("THE elements")
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
  processValueToSave(value,type){
      //To handle number values
      if(!isNaN(value)){
        value=Number(value);
      }

      //To handle boolean values
      value=value==="true"?true:(value==="false"?false:value);

    
      if(type=="date"){
        //To handle date values
        if(moment(value).isValid()){
          value=moment(value).toDate();
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
  updatePartOfObject(key,value,dorefresh=false,type=null,firebasePath,byGivvenSubLink=null,callback=null){
    var subLink=this.state.theSubLink;
    if(byGivvenSubLink!=null){
      subLink=byGivvenSubLink;
    }
    console.log("Sub save "+key+" to "+value+" and the path is "+firebasePath+" and theSubLink is "+subLink);
    var chunks=subLink.split(Config.adminConfig.urlSeparatorFirestoreSubArray);
    console.log(chunks);
    var _this=this;
    //First get the document
    //DOCUMENT - GET FIELDS && COLLECTIONS
        var docRef = firebase.app.firestore().doc(firebasePath);
        docRef.get().then(function(doc) {
            if (doc.exists) {
              var numChunks=chunks.length-1;
              var doc=doc.data();
              console.log(doc);
              if(value=="DELETE_VALUE"){
                if(numChunks==2){
                   doc[chunks[1]].splice(chunks[2], 1);
                }
                if(numChunks==1){
                   doc[chunks[1]]=null;
                }
              }else{
                //Normal update, or insert
                if(key=="DIRECT_VALUE_OF_CURRENT_PATH"){
                  if(numChunks==3){
                    doc[chunks[1]][chunks[2]][chunks[3]]=value
                  }
                  if(numChunks==2){
                    doc[chunks[1]][chunks[2]]=value
                  }
                  if(numChunks==1){
                    doc[chunks[1]]=value
                  }
                }else{
                  if(numChunks==3){
                    doc[chunks[1]][chunks[2]][chunks[3]][key]=value
                  }
                  if(numChunks==2){
                    doc[chunks[1]][chunks[2]][key]=value
                  }
                  if(numChunks==1){
                    doc[chunks[1]][key]=value
                  }
                }
               
              }

              if(key=="NAME_OF_THE_NEW_KEY"||key=="VALUE_OF_THE_NEW_KEY"){
                var ob={};
                ob[key]=value;
                _this.setState(ob);
              }else{
                console.log("Document data:", doc);
                _this.updateAction(chunks[1],doc[chunks[1]],dorefresh,null,true)
                if(callback){
                  callback();
                }
              }
              
                

                //alert(chunks.length-1);
                //_this.processRecords(doc.data())
                //console.log(doc);
                
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
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
  updateAction(key,value,dorefresh=false,type=null,forceObjectSave=false){
    value=this.processValueToSave(value,type);
    var firebasePath=(this.props.route.path.replace("/firestorevendor/","").replace(":sub",""))+(this.props.params&&this.props.params.sub?this.props.params.sub:"").replace(/\+/g,"/");
    if(this.state.theSubLink!=null&&!forceObjectSave){
     // alert(key+"<-mk->"+value+"<-->"+dorefresh+"<-->"+type+"<-->"+firebasePath)
      this.updatePartOfObject(key,value,dorefresh,type,firebasePath)
    }else{
    
      //value=firebase.firestore().doc("/users/A2sWwzDop0EAMdfxfJ56");
      //key="creator";
      
       console.log("firebasePath from update:"+firebasePath)
      console.log('Update '+key+" into "+value);

      if(key=="NAME_OF_THE_NEW_KEY"||key=="VALUE_OF_THE_NEW_KEY"){
        console.log("THE_NEW_KEY")
        var updateObj={};
        updateObj[key]=value;
        this.setState(updateObj);
        console.log("-- OBJ update --")
        console.log(updateObj);
      }else{
        var db = firebase.app.firestore();

        var databaseRef = db.doc(firebasePath);
        var updateObj={};
        updateObj[key]=value;
        databaseRef.set(updateObj, { merge: true });
      }

      }
  }

  /**
  * addDocumentToCollection  - used recursivly to add collection's document's collections
  * @param {String} name name of the collection
  * @param {FirestoreReference} reference
  */
  addDocumentToCollection(name,reference=null){
    
    var pathChunks=this.state.firebasePath.split("/");
    pathChunks.pop();
    var withoutLast = pathChunks.join("/");
    console.log(name+" vs "+withoutLast);
    //Find the fields to be inserted
    console.log("INSERT_STRUCTURE");
    var theInsertSchemaObject=INSERT_STRUCTURE[name.replace(this.getAppBuilderAppName(),"")].fields;

    //New in version 9.1.0
    theInsertSchemaObject=this.convertSchemaReferencesToNativeReferences(theInsertSchemaObject);

    //DON'T PRINT THE FIELD SINCE THE ARE CIRCULAR STRUCTURES NOW
    //console.log(JSON.stringify(theInsertSchemaObject));

    //Find the collections to be inserted
    var theInsertSchemaCollections=INSERT_STRUCTURE[name.replace(this.getAppBuilderAppName(),"")].collections;
    console.log(JSON.stringify(theInsertSchemaCollections));

    //Reference to root firestore or existing document reference
    var db = reference==null?(pathChunks.length>1?firebase.app.firestore().doc(withoutLast):firebase.app.firestore()):reference;
    
    //Check type of insert
    var isTimestamp=Config.adminConfig.methodOfInsertingNewObjects=="timestamp"

    //Create new element
    var newElementRef=isTimestamp?db.collection(name).doc(Date.now()):db.collection(name).doc()

    if(name==="restaurant"){
      const collectionRef = firebase.app.firestore().collection("restaurant_collection");
      const collection = collectionRef.doc(this.state.userCollectionId);
      theInsertSchemaObject["collection"]=collection;
    }
    //Add data to the new element
    newElementRef.set(theInsertSchemaObject)

    //Go over sub collection and insert them
    for (var i = 0; i < theInsertSchemaCollections.length; i++) {
      this.addDocumentToCollection(theInsertSchemaCollections[i],newElementRef)
    }


    //Show the notification on root element
    if(reference==null){
      this.cancelAddFirstItem();
      var message="Element added. You can find it in the table bellow.";
      if(Config.adminConfig.goDirectlyInTheInsertedNode){
        this.props.router.push(this.props.route.path.replace(":sub","")+(this.props.params&&this.props.params.sub?this.props.params.sub:"")+Config.adminConfig.urlSeparator+newElementRef.id);
        message="Element added. You can now edit it";
       }
      this.setState({notifications:[{type:"success",content:message}]});
      this.refreshDataAndHideNotification();

      if(Config.adminConfig.goDirectlyInTheInsertedNode){
        this.props.router.push(this.props.route.path.replace(":sub","")+(this.props.params&&this.props.params.sub?this.props.params.sub:"")+Config.adminConfig.urlSeparator+newElementRef.id);
       }

    }   
   }

  /**
  * addKey
  * Adds key in our list of fields in firestore
  */
  addKey(){
    if(this.state.NAME_OF_THE_NEW_KEY&&this.state.NAME_OF_THE_NEW_KEY.length>0){
     
      if(this.state.VALUE_OF_THE_NEW_KEY&&this.state.VALUE_OF_THE_NEW_KEY.length>0){
        
        this.setState({notifications:[{type:"success",content:"New key added."}]});
        this.updateAction(this.state.NAME_OF_THE_NEW_KEY,this.state.VALUE_OF_THE_NEW_KEY);
        this.refs.simpleDialog.hide()
        this.refreshDataAndHideNotification();
      }
    }
  }

  reloadPage(){
    // window.location.reload();
    this.refs.newOrderAlert.hide()

    
  }

  confirmOrderAndSendNotification(){
    console.log('confirmOrderAndSendNotification clicked');

    var _this=this;
    var notifications=[];
    var pathToTokens = "/expoPushTokens";
    var document=this.state.fieldsAsArray;
    var collection=this.state.currentCollectionName;
    var userId;
    var restId=this.state.fieldsAsArray[0].value;
    var restName;
    var currentToken;
    Object.keys(document).forEach(function(key) {
      
      if(document[key].theKey==="userID"){
        userId = document[key].value;
      }
    });

    firebase.app.firestore().collection("restaurant_collection").doc(restId).get()
    .then(doc =>{
      if (!doc.exists) {
        console.log('No such restaurant!');
      } else {
        restName=doc.data().title;
        console.log('restaurant title data:', doc.data().title);
      }
    })
    .catch(err => {
      console.log('Error getting restaurant name', err);
    });

    console.log("document",userId);
    console.log("collection",collection);

    firebase.app.firestore().collection("orders").doc(collection).update({
      status:"ready_to_pick"
    })
    .then(function() {
      // Send Notification
      firebase.app.database().ref(pathToTokens).once('value').then(function(snapshot){
        var tokens=snapshot.val();
  
        Object.keys(tokens).forEach(function(key) {
          console.log("tokens",tokens);

          console.log("token key",tokens[key]);

          if(tokens[key].orderUserId && tokens[key].orderUserId===userId){
            console.log("token key orderUserId",tokens[key].orderUserId);

            currentToken=tokens[key].token;
            console.log("currentToken",currentToken);

          }
          
        });
        console.log("current documents",document);
        notifications.push({
          to:currentToken,
          body: "Your order is ready to pick up.",
          title: restName,
          
        })
        if(notifications.length>0){
            var url='https://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send';
            var json = JSON.stringify(notifications);
            request.post(url)
                //.set('Accept-Encoding', 'gzip, deflate')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                //.set('User-Agent', 'expo-server-sdk-node/2.3.3')
                .send(json)
                .end(_this.sendCallback)
        }else{
            alert("There are no subscribed tokens");
        }
      })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    

    this.refs.confirmPickup.hide()
    this.refreshDataAndHideNotification();

  }

  /**
  * addItemToArray  - add item to array
  * @param {String} name name of the array
  * @param {Number} howLongItIs count of items, to know the next index
  */
  addItemToArray(name,howLongItIs){
    console.log("Add item to array "+name);
    console.log("Is just array "+this.state.isJustArray);

    console.log("Data ");
    console.log(this.state.fieldsOfOnsert);

    var dataToInsert=null;
    var correctPathToInsertIn="";
    if(this.state.fieldsOfOnsert){
        if(this.state.isJustArray){
          console.log("THIS IS Array")
            dataToInsert=this.state.fieldsOfOnsert[0];
            correctPathToInsertIn=this.state.firebasePath+Config.adminConfig.urlSeparatorFirestoreSubArray+(parseInt(howLongItIs));
        }else{
            dataToInsert=this.state.fieldsOfOnsert[name];
            dataToInsert=dataToInsert?dataToInsert[0]:null;
            correctPathToInsertIn=this.state.firebasePath+Config.adminConfig.urlSeparatorFirestoreSubArray+name+Config.adminConfig.urlSeparatorFirestoreSubArray+(parseInt(howLongItIs));
        }
    }

    console.log("Data to insert");
    console.log(dataToInsert);
    console.log("Path to insert");
    console.log(correctPathToInsertIn);
   
    var _this=this;
    this.updatePartOfObject("DIRECT_VALUE_OF_CURRENT_PATH",dataToInsert,true,null ,this.state.firebasePath,correctPathToInsertIn,function(e){
       _this.setState({notifications:[{type:"success",content:"New element added."}]});
      _this.refreshDataAndHideNotification();
    })
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
  showSubItems(theSubLink){
    var chunks = theSubLink.split(Config.adminConfig.urlSeparatorFirestoreSubArray);
    this.setState({
      itemOfInterest:chunks[1],
      theSubLink:theSubLink,
    })
    var items=this.state.records;
    console.log(items);
    for (var i = 1; i < chunks.length; i++) {
      console.log(chunks[i]);
      items=items[chunks[i]];
    }
    console.log("--- NEW ITEMS ");
    console.log(items)
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
  deleteFieldAction(key,isItArrayItem=false,theLink=null){
    console.log("Delete "+key);
    console.log(theLink);
    if(theLink!=null){
      theLink=theLink.replace("/firestorevendor","");
    }
    if(isNaN(key)){
      isItArrayItem=false;
    }
    console.log("Is it array: "+isItArrayItem);
    var firebasePathToDelete=(this.props.route.path.replace(ROUTER_PATH,"").replace(":sub",""))+(this.props.params&&this.props.params.sub?this.props.params.sub:"").replace(/\+/g,"/");
    if(key!=null){
      //firebasePathToDelete+=("/"+key)
    }

    console.log("firebasePath for delete:"+firebasePathToDelete);
    this.setState({pathToDelete:theLink?theLink:firebasePathToDelete,isItArrayItemToDelete:isItArrayItem,keyToDelete:theLink?"":key});
    window.scrollTo(0, 0);
    this.refs.deleteDialog.show();

  }

  /**
  * doDelete - do the actual deleting based on the data in the state
  */
  doDelete(){
    var _this=this;
    console.log("Do delete ");
    console.log("Is it array "+this.state.isItArrayItemToDelete);
    console.log("Path to delete: "+this.state.pathToDelete)
    var completeDeletePath=this.state.pathToDelete+"/"+this.state.keyToDelete;
    console.log("completeDeletePath to delete: "+completeDeletePath)
    if(this.state.pathToDelete.indexOf(Config.adminConfig.urlSeparatorFirestoreSubArray)>-1){
      //Sub data
      _this.refs.deleteDialog.hide();
       this.updatePartOfObject("DIRECT_VALUE_OF_CURRENT_PATH","DELETE_VALUE",true,null ,this.state.firebasePath,this.state.pathToDelete,function(e){
         _this.setState({notifications:[{type:"success",content:"Element deleted."}]});
        _this.refreshDataAndHideNotification();
      })
    }else{
      //Normal data

      var chunks=completeDeletePath.split("/");

      var db = firebase.app.firestore();
     

      if(chunks.length%2){
        //odd
        //Delete fields from docuemnt
        var refToDoc = db.doc(this.state.pathToDelete);

        // Remove the 'capital' field from the document
        var deleteAction={};
        deleteAction[this.state.keyToDelete]=firebaseREF.firestore.FieldValue.delete();
        refToDoc.update(deleteAction).then(function() {
            console.log("Document successfully deleted!");
            _this.refs.deleteDialog.hide();
            _this.setState({keyToDelete:null,pathToDelete:null,notifications:[{type:"success",content:"Field is deleted."}]});
            _this.refreshDataAndHideNotification();
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
      }else{
        //even
        //delete document from collection
        //alert("Delete document "+completeDeletePath);
        db.collection(this.state.pathToDelete).doc(this.state.keyToDelete).delete().then(function() {
            console.log("Document successfully deleted!");
            _this.refs.deleteDialog.hide();
            _this.setState({pathToDelete:null,notifications:[{type:"success",content:"Field is deleted."}]});
            _this.refreshDataAndHideNotification();
        }).catch(function(error) {
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
  cancelDelete(){
    console.log("Cancel Delete");
    this.refs.deleteDialog.hide()
  }

  cancelAddFirstItem(){
    console.log("Cancel Add");
    this.refs.addCollectionDialog.hide()
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
  findHeadersBasedOnPath(firebasePath){
     var headers=null;

     var itemFound=false;
     var navigation=Config.vendorNavigation;
     for(var i=0;i<navigation.length&&!itemFound;i++){
       if(navigation[i].path==firebasePath&&navigation[i].tableFields&&navigation[i].link=="firestorevendor"){
         headers=navigation[i].tableFields;
         itemFound=true;
       }

       //Look into the sub menus
       if(navigation[i].subMenus){
         for(var j=0;j<navigation[i].subMenus.length;j++){
           if(navigation[i].subMenus[j].path==firebasePath&&navigation[i].subMenus[j].tableFields&&navigation[i].subMenus[j].link=="firestorevendor"){
             headers=navigation[i].subMenus[j].tableFields;
             itemFound=true;
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
  makeCollectionTable(){
      var name=this.state.currentCollectionName;
      if(name==="restaurant"){
        return (
          <CardUI name={name} showAction={true} action={()=>{this.addDocumentToCollection(name)}} title={Common.capitalizeFirstLetter(name)}>
            <Table
                caller={"firestore"}
                headers={this.findHeadersBasedOnPath(this.state.firebasePath)} 
                deleteFieldAction={this.deleteFieldAction} 
                fromObjectInArray={true} 
                name={name} 
                routerPath={this.props.route.path} 
                isJustArray={false} 
                sub={this.props.params&&this.props.params.sub?this.props.params.sub:""} 
                data={this.state.documents}
                />
          </CardUI>
        )
      }else{
        return (
          <CardUI name={name} showAction={false} title={Common.capitalizeFirstLetter(name)}>
            <Table
                caller={"firestore"}
                headers={this.findHeadersBasedOnPath(this.state.firebasePath)} 
                deleteFieldAction={this.deleteFieldAction} 
                fromObjectInArray={true} 
                name={name} 
                routerPath={this.props.route.path} 
                isJustArray={false} 
                sub={this.props.params&&this.props.params.sub?this.props.params.sub:""} 
                data={this.state.documents}
                />
          </CardUI>
        )
      }
      
  }

  /**
   * Creates single array section
   * @param {String} name, used as key also
   */
  makeArrayCard(name){
      return (
        <CardUI name={name} showAction={true} action={()=>{this.addItemToArray(name,this.state.arrays[name].length)}} title={Common.capitalizeFirstLetter(name)}>
          <Table 
              caller={"firestore"}
              isFirestoreSubArray={true}
              showSubItems={this.showSubItems}
              headers={this.findHeadersBasedOnPath(this.state.firebasePath)} 
              deleteFieldAction={this.deleteFieldAction} 
              fromObjectInArray={false} name={name}
              routerPath={this.props.route.path} 
              isJustArray={this.state.isJustArray} 
              sub={this.props.params&&this.props.params.sub?this.props.params.sub:""} 
              data={this.state.arrays[name]}/>
        </CardUI>
      )
  }

  /**
   * Creates  table section for the elements object
   * @param {String} name, used as key also
   */
  makeTableCardForElementsInArray(){
      var name=this.state.lastPathItem;
      return (
        <CardUI name={name} showAction={false}  title={Common.capitalizeFirstLetter(name)}>
          <Table 
              caller={"firestore"}
              isFirestoreSubArray={true}
              showSubItems={this.showSubItems}
              headers={this.findHeadersBasedOnPath(this.state.firebasePath)} deleteFieldAction={this.deleteFieldAction} fromObjectInArray={true} name={name} routerPath={this.props.route.path} isJustArray={this.state.isJustArray} sub={this.props.params&&this.props.params.sub?this.props.params.sub:""} data={this.state.elementsInArray}>
          </Table>
        </CardUI>
      )
  }

  /**
    * Creates direct value section
    * @param {String} value, valu of the current path
    */
   makeValueCard(value){
     var name=this.state.currentCollectionName;
     return (
      <CardUI name={name} showAction={false}  title={"Value"}>
        <Input updateAction={this.updateAction} class="" theKey="DIRECT_VALUE_OF_CURRENT_PATH" value={value} />
      </CardUI>
     )
   }


  /**
   * generateNavBar
   */
  generateNavBar(){
      var subPath=this.props.params&&this.props.params.sub?this.props.params.sub:""
      var items=subPath.split(Config.adminConfig.urlSeparator);
      var path="/firestorevendor/"
      return (<NavBar 
        items={items} 
        path={path} 
        title={items.length>0?Common.capitalizeFirstLetter(items[items.length-1]):""} />
        ) 
  }

  /**
   * generateNotifications
   * @param {Object} item - notification to be created
   */
  generateNotifications(item){
      return (
          <div className="col-md-12">
              <Notification type={item.type} >{item.content}</Notification>
          </div>
      )
  }

  /**
  * refreshDataAndHideNotification
  * @param {Boolean} refreshData 
  * @param {Number} time 
  */
  refreshDataAndHideNotification(refreshData=true,time=3000){
    //Refresh data,
    if(refreshData){
      this.resetDataFunction();
    }

    //Hide notifications
    setTimeout(function(){this.setState({notifications:[]})}.bind(this), time);
  }

  //MAIN RENDER FUNCTION 
  render() {
    return (
      <div className="content">
        {this.generateNavBar()}

        <div className="content" sub={this.state.lastSub}>

          <div className="container-fluid">

          <div style={{textAlign: 'center'}}>
            {/* LOADER */}
            {this.state.isLoading?<PulseLoader color="#8637AD" size="12px" margin="4px"/>:""}
          </div>

           {/* NOTIFICATIONS */}
              {this.state.notifications?this.state.notifications.map((notification)=>{
                  return this.generateNotifications(notification)
              }):""}

            {/* Documents in collection */}
            {this.state.isCollection&&this.state.documents.length>0?this.makeCollectionTable():""}

            {/* DIRECT VALUE */}
              {this.state.directValue&&this.state.directValue.length>0?this.makeValueCard(this.state.directValue):""}


            {/* FIELDS */}
              {this.state.fieldsAsArray&&this.state.fieldsAsArray.length>0?(
              <CardUI 
              name={"fields"} 
              currentCollectionName={this.state.currentCollectionName} 
              lastSub={this.state.lastSub} showAction={true} 
              action={()=>this.refs.simpleDialog.show()} 
              confirmOrderAction={this.state.lastSub==="orders+"+this.state.currentCollectionName?()=>this.refs.confirmPickup.show():""} 
              title={Common.capitalizeFirstLetter(Config.adminConfig.fieldBoxName)}
              >
                     {this.state.fieldsAsArray?this.state.fieldsAsArray.map((item)=>{
                      
                      return (
                      <Fields 
                        isFirestore={true}
                        parentKey={null}
                        key={item.theKey+this.state.lastSub} 
                        deleteFieldAction={this.deleteFieldAction} 
                        updateAction={this.updateAction}  
                        theKey={item.theKey} 
                        isDisabled={true}
                        value={item.value} />)
                    

                  }):"" }
                  
                </CardUI>
                ):""}


            {/* COLLECTIONS */}
            {this.state.theSubLink==null&&this.state.isDocument&&this.state.collections&&this.state.collections.length>0?(
                <CardUI name={"collections"} showAction={false} title={"Collections"}>
                    {this.state.theSubLink==null&&this.state.collections?this.state.collections.map((item)=>{
                              var theLink="/firestorevendor/"+this.state.completePath+Config.adminConfig.urlSeparator+item;
                              return ( <Link to={theLink}><a className="btn">{item}<div className="ripple-container"></div></a></Link>)
                          }):"" }
                </CardUI>):""}

            {/* ARRAYS */}
                {this.state.arrayNames?this.state.arrayNames.map((key)=>{
                  return this.makeArrayCard(key)
                }):""}

                {/* ELEMENTS MERGED IN ARRAY */}
                {this.state.elementsInArray&&this.state.elementsInArray.length>0?( this.makeTableCardForElementsInArray()):""}

                {/* ELEMENTS */}
                {this.state.elements&&this.state.elements.length>0?(
                  <CardUI name={"elements"} showAction={false} title={this.state.lastPathItem+"' elements"}>
                    {this.state.elements?this.state.elements.map((item)=>{
                                    var theLink="/firevendor/"+this.state.completePath+Config.adminConfig.urlSeparatorFirestoreSubArray+item.uidOfFirebase;
                                    if(this.state.theSubLink!=null){
                                      theLink=this.state.theSubLink+Config.adminConfig.urlSeparatorFirestoreSubArray+item.uidOfFirebase;
                                    }
                                      
                                    //alert(theLink);
                                    return ( <Link onClick={()=>{this.showSubItems(theLink)}}><a className="btn">{item.uidOfFirebase}<div className="ripple-container"></div></a></Link>)
                                }):"" }
                  </CardUI>):""}




          </div>
        </div>
        <SkyLight hideOnOverlayClicked ref="deleteDialog" title="">
          <span><h3  className="center-block">Delete data</h3></span>
          <div className="col-md-12">
              <Notification type="danger" >All data at this location, but not nested collections, will be deleted! To delete any collection's data go in each collection and detele the documents</Notification>
          </div>
          <div className="col-md-12">
              Data Location
          </div>
          <div className="col-md-12">
              <b>{this.state.pathToDelete+"/"+this.state.keyToDelete}</b>
          </div>

          <div className="col-sm-12" style={{marginTop:80}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelDelete} className="btn btn-info center-block">Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.doDelete} className="btn btn-danger center-block">Delete</a>
            </div>

          </div>

        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="addCollectionDialog" title="">
          <span><h3  className="center-block">Add first document in collection</h3></span>
          <div className="col-md-12">
              <Notification type="success" >Looks like there are no documents in this collection. Add your first document in this collection</Notification>
          </div>

          <div className="col-md-12">
              Data Location
          </div>
          <div className="col-md-12">
              <b>{this.state.showAddCollection}</b>
          </div>
          

          <div className="col-sm-12" style={{marginTop:80}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelAddFirstItem} className={Config.designSettings.buttonInfoClass+" center-block"}>Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={()=>{this.addDocumentToCollection(this.state.currentCollectionName)}} className={Config.designSettings.buttonSuccessClass+" center-block"}>ADD</a>
            </div>

          </div>

        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="simpleDialog" title="">
          <span><h3  className="center-block">Add new key</h3></span>
          <br />
          <div  className="card-content">
            <div className="row">
              <label className="col-sm-3 label-on-left">Name of they key</label>
              <div className="col-sm-12">
                <Input updateAction={this.updateAction} class="" theKey="NAME_OF_THE_NEW_KEY" value={"name"} />
              </div>
              <div className="col-sm-1">
              </div>
            </div>
          </div><br /><br />
          <div  className="card-content">
            <div className="row">
              <label className="col-sm-3 label-on-left">Value</label>
              <div className="col-sm-12">
                <Input updateAction={this.updateAction} class="" theKey="VALUE_OF_THE_NEW_KEY" value={"value"} />
              </div>
              <div className="col-sm-1">
              </div>
            </div>
          </div>
          <div className="col-sm-12 ">
            <div className="col-sm-3 ">
            </div>
            <div className="col-sm-6 center-block">
              <a onClick={this.addKey} className="btn btn-rose btn-round center-block"><i className="fa fa-save"></i>   Add key</a>
            </div>
            <div className="col-sm-3 ">
            </div>
          </div>
        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="confirmPickup" title="">
          <span><h3  className="center-block">Confirm Pick up</h3></span>
          <br />
          <div  className="card-content">
            <div className="row">
             <h5>Are you sure the order is ready?</h5>
             <h5>Order ID : {this.state.currentCollectionName}</h5>
            </div>
          </div><br /><br />
        
          <div className="col-sm-12 ">
            <div className="col-sm-3 ">
            </div>
            <div className="col-sm-6 center-block">
              <a onClick={this.confirmOrderAndSendNotification} className="btn btn-rose btn-round center-block"><i className="fa fa-save"></i>Order Ready</a>
            </div>
            <div className="col-sm-3 ">
            </div>
          </div>
        </SkyLight>

        <SkyLight hideOnOverlayClicked ref="newOrderAlert" title="">
          <span><h3  className="center-block">New Order Received</h3></span>
          <br />
          <div  className="card-content">
            <div className="row">
             <h5>You got a new order</h5>
          </div><br /><br />
        
          <div className="col-sm-12 ">
            <div className="col-sm-3 ">
            </div>
            <div className="col-sm-6 center-block">
              <a onClick={this.reloadPage} className="btn btn-rose btn-round center-block"><i className="fa fa-save"></i>Check it</a>
            </div>
            <div className="col-sm-3 ">
            </div>
          </div>
          </div>
        </SkyLight>
      </div>
    )
  }
}
export default Firestorevendor;
