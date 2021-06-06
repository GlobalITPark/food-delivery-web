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

    getOrderDetails = (orderId)=> {
        const _this=this;
        var orderRef = firebase.app.firestore().collection("orders");
        var orderId = atob(orderId);
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
                    <div className="col-md-4">
                        <h6 className="mb-3"> {translate('orderNo')} :</h6>
                    </div>
                    <div className="col-md-8" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.id}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <h6 className="mb-3"> {translate('Delivery/ Pickup Time')} :</h6>
                    </div>
                    <div className="col-md-8" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.orderDateTime}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <h6 className="mb-3"> {translate('Name of the customer')} :</h6>
                    </div>
                    <div className="col-md-8" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.delivery.name}</strong>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-4">
                        <h6 className="mb-3"> {translate('Phone Number')} :</h6>
                    </div>
                    <div className="col-md-8" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.delivery.phone}</strong>
                    </div>
                </div>           
                
        </div>
        <div className ="col-md-6">
        
                <div className="row">
                    <div className="col-md-4">
                        <h6 className="mb-3"> {translate('Order type')} :</h6>
                    </div>
                    <div className="col-md-8" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.deliveryType}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <h6 className="mb-3"> {translate('Delivery Instructions')} :</h6>
                    </div>
                    <div className="col-md-8" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.deliveryInstructions}</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <h6 className="mb-3"> {translate('Address')} :</h6>
                    </div>
                    <div className="col-md-8" style={{paddingTop: '26px'}}>
                        <strong>{this.state.order.deliveryAddress}</strong>
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
                <div className="col-md-6">
                <a style={{float:"right"}} className="btn btn-success"  onClick={()=>console.log('dd')}>{translate('deliveredSuccessfully')}</a>
                </div>
            </div>
        </div>
        </div> : <div>{translate('loading')}</div> }
        </div>
        );
    }
}

export default OrderDetailsForEmailLink;
