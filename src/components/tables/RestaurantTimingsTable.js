import React, { Component } from "react";
import firebase from "../../config/database";
import { translate } from "../../translations";
import SkyLight from "react-skylight";
import TimePicker from "react-gradient-timepicker";
import { Table } from "react-bootstrap";
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export default class RestaurantTimingsTable extends Component {
  // Lets initialize state
  constructor(props) {
    super(props);
    this.state = {
      restaurant: null,
      selectedTimingItemForDelete: null,
      isLoading: false,
      selectedDay: '',
      openingTime: {
        format12: "09:00 AM",
        format24: "09:00"
      },
      closingTime: {
        format12: "07:00 PM",
        format24: "19:00"
      }
    };
  }

  // Next we should load data from firebase
  componentDidMount = () => {
    // First thing first get already added timings
    this.getRestaurantDetails()
  };

  getRestaurantDetails = ()=> {
      var restId = this.props.restaurantId;
    if (restId) {
        const _this = this;
        var restRef = firebase.app.firestore().collection("restaurant_collection");
        restRef = restRef.doc(restId);
        restRef.get().then(function (doc) {
          if (doc.exists) {
            var temp = doc.data();
            temp.id = doc.id;
            _this.setState({
                restaurant: temp,
            });
          }
        });
      }
  }

  setOpeningTime =(val)=> {
      this.state.openingTime =  val
  }
    setClosingTime =(val)=> {
      this.state.closingTime = val
    }

    validateTiming = async ()=> {
      var timings = (this.state.restaurant && this.state.restaurant.timings) ? this.state.restaurant.timings : [];
      if (timings.length > 0) {
        var alreadyAdded = timings.filter((timing) => timing.day === this.state.selectedDay && timing.openingTime.format12 === this.state.openingTime.format12 && timing.closingTime.format12 === this.state.closingTime.format12)
        if (alreadyAdded.length > 0) {
          alert('timing already added')
          return false
        }
        var selectedOpeningTimeArr =  this.state.openingTime.format24.split(":");
        var selectedClosingTimeArr =  this.state.closingTime.format24.split(":");
        var selectedOpeningTimeInMillieSeconds = (+selectedOpeningTimeArr[0] * (60000 * 60)) + (+selectedOpeningTimeArr[1] * 60000);
        var selectedClosingTimeInMillieSeconds = (+selectedClosingTimeArr[0] * (60000 * 60)) + (+selectedClosingTimeArr[1] * 60000);
        if (selectedOpeningTimeInMillieSeconds > selectedClosingTimeInMillieSeconds) {
          alert('opening time cannot be greater than closing time')
          return false
        }
        var selectedOpeningTime = moment(this.state.openingTime.format12, "h:mm a");
        var selectedClosingTime = moment(this.state.closingTime.format12, "h:mm a");
        var isOverlapping = false
        timings.forEach(timing => {
          if (this.state.selectedDay === timing.day) {
            var addedOpeningTime = moment(timing.openingTime.format12, "h:mm a");
            var addedClosingTime = moment(timing.closingTime.format12, "h:mm a");
            const range1 = moment.range(selectedOpeningTime, selectedClosingTime);
            const range2 = moment.range(addedOpeningTime, addedClosingTime);
            isOverlapping = range1.overlaps(range2)
          }
        });
        if (isOverlapping) {
          alert('times are overlapping')
          return false;
        }
      }
      return true;
    }

    // Add each timings from user to restaurant
  addTimingToRestaurant = async () => {
      const _this =this;
    if (this.state.selectedDay && this.state.openingTime && this.state.closingTime && this.state.restaurant) {
      var isValid = await this.validateTiming()
      if (isValid) {
        this.setState({isLoading: true})
        var timings = (this.state.restaurant && this.state.restaurant.timings) ? this.state.restaurant.timings : [];
        var temp = {
            id: new Date().getTime(),
            day: this.state.selectedDay,
            openingTime : this.state.openingTime,
            closingTime: this.state.closingTime
        }
        timings.push(temp)
        _this.setState({isLoading: false})
        firebase.app
        .firestore()
        .collection("restaurant_collection")
        .doc(this.props.restaurantId)
        .update({
            timings: timings
        })
        .then(function () {
          _this.setState({isLoading: false})
            _this.refs.addTimingsPopup.hide()
            _this.getRestaurantDetails()
        })
      }
      
    }
  };

//Delete the currently available menItem
deleteTimingItem = (item)=> {
  this.setState({
    selectedTimingItemForDelete : item
  }, ()=>this.refs.confirmActionPopup.show())
} 

//On Delete confirm we delete  the currently available menItem
onConfirmDelete = async ()=> {
  var _this= this;
  if (this.state.selectedTimingItemForDelete) {
    this.setState({isLoading: true})
    var idToDelete = this.state.selectedTimingItemForDelete.id;
    var timings = this.state.restaurant.timings
    timings = timings.filter((item)=> item.id !== idToDelete)
    await firebase.app
    .firestore()
    .collection("restaurant_collection")
    .doc(this.props.restaurantId)
    .update({
        timings: timings
    })
    .then(function () {
        _this.getRestaurantDetails()
        _this.refs.confirmActionPopup.hide()
    })
    
    this.setState({isLoading: false, showSuccessMessage: true, successMessage: 'Order updated successfully'})
  }  
}


  // build order Items table rows
  getTimingsTr(timings) {
    var timingsTr = timings.map((time) => {
      if (time) {        
        return (
            <tr>
                <td>{time.day.toUpperCase()}</td>
                <td>{time.openingTime.format12}</td>
                <td>{time.closingTime.format12}</td>  
                <td>{<span onClick={()=>this.deleteTimingItem(time)} className="btn btn-simple btn-danger btn-icon delete"><i className="material-icons">delete</i></span>}
              </td>              
            </tr>
        );
      }
      return null
    });
    return timingsTr;
  }

  render = () => {
    return (
      <div className="row">          
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
        <div className="col-md-12 col-md-12">
          <div className="card">
            <div className="col-md-12">
              {/* Add new timing */}
              <div className="row">
                <div className="col-md-9">
                {(this.state.restaurant) ? <div style={{width: '41%', height: '68px'}} class="card-header card-header-text" data-background-color="rose"><h5 class="card-title">{this.state.restaurant.title}'s timings</h5></div>: null}
                </div>
                <div className="col-md-3">
                  <a
                    style={{ width: "50%" }}
                    className="btn btn-success"
                    onClick={() => this.refs.addTimingsPopup.show()}
                  >
                    {translate("addNewTiming")}
                  </a>
                </div>
              </div>
              {/* End add new timing */}
            </div>
            <div className="col-md-12">
            {(this.state.restaurant && this.state.restaurant.timings && this.state.restaurant.timings.length > 0) ? <Table striped style={{ border: 1 }}>
                  <thead>
                    <tr style={{backgroundColor: '#4545'}}>
                      <th>{translate("dayOfWeek")}</th>
                      <th>{translate("openTime")}</th>
                      <th>{translate("closeTime")}</th>
                      <th>{translate("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.getTimingsTr(this.state.restaurant.timings)}                    
                  </tbody>
                </Table>: <span>{translate('noDataFound')}</span>}
            </div>
          </div>
        </div>

        {/* Popups time */}
        {/* add timings Popup */}
        <SkyLight
          dialogStyles={{ height: "60%", width: "50%" }}
          ref="addTimingsPopup"
          title={translate("addNewTiming")}
          titleStyle={{ fontWeight: "bold", fontSize: "16px" }}
        >
          <div className="card-content">
            {/* week days */}
            <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("dayOfWeek")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
                <select
                  className="col-sm-8 form-control form-control-sm"
                  //value={''}
                  onChange={(e) => this.setState({selectedDay: e.target.value})}
                >
                  <option value="">{translate("select")}</option>
                  <option value="monday">{translate("monday")}</option>
                  <option value="tuesday">{translate("tuesday")}</option>
                  <option value="wednesday">{translate("wednesday")}</option>
                  <option value="thursday">{translate("thursday")}</option>
                  <option value="friday">{translate("friday")}</option>
                  <option value="saturday">{translate("saturday")}</option>
                  <option value="sunday">{translate("sunday")}</option>
                </select>
              </div>
            </div>
            {/* End weekly days */}

            {/* Open time */}
            <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("openTime")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
                <TimePicker
                  time="09:00"
                  theme="Bourbon"
                  className="timepicker"
                  placeholder="Start Time"
                  onSet={this.setOpeningTime}
                />
              </div>
            </div>
            {/* End open time */}

            {/* close time */}
            <div className="row">
              <div className="col-md-4">
                <h6 className="mb-3"> {translate("closeTime")} :</h6>
              </div>
              <div className="col-md-8" style={{ paddingTop: "26px" }}>
                <TimePicker
                  time="19:00"
                  theme="green"
                  className="timepicker"
                  placeholder="Close Time"
                  onSet={this.setClosingTime}
                />
              </div>
            </div>
            {/* End close time */}

            {/* Add button */}
            <div style={{ top: "100%" }} className="row">
              <div className="col-md-3"></div>
              <div className="col-md-9">
                {!this.state.isLoading ? (
                  <a
                    style={{ width: "50%" }}
                    className="btn btn-success"
                    onClick={() => this.addTimingToRestaurant()}
                  >
                    {translate("save")}
                  </a>
                ) : null}
              </div>
            </div>
            {/* End add button */}
          </div>
        </SkyLight>
        {/* End confirm Action Popup */}

        {/* add confirmActionPopup Popup */}
        <SkyLight     
        dialogStyles={{height: '20%', width: '25%'}}     
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

        {/* End Popups time */}
      </div>
    );
  };
}
