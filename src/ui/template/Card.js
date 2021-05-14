import React, { Component } from 'react'
import { translate } from '../../translations'

/**
 * Creates a card
 * 
 * Available props
 * 
 * name
 * title
 * children
 * action
 * showAction
 * class ex. "col-md-12"
 * 
 */
export default class CardUI extends Component {
    actionView(){
            if(this.props.showAction && this.props.title !='Fields'&& this.props.title !='Restaurant'){
                return (
                <a  onClick={()=>{this.props.action()}}><div id="addDiv" className="card-header card-header-icon" data-background-color="purple" style={{float:"right"}}>
                    <i className="material-icons">add</i>
                </div></a>)
            }else{
                return (<div></div>)
            }
    }

    render() {
        return (
            <div className={this.props.class?this.props.class:"col-md-12"} key={this.props.name}>
                <div className="card">
                  {this.actionView()}
                  <form className="form-horizontal">
                    <div className="card-header card-header-text" data-background-color="rose">
                      <h5 className="card-title">{(this.props.title == 'Restaurant') ? translate('menuItem') : translate(this.props.title) }</h5>
                    </div>
                    <br />
                    <div className="col-md-12">
                        {this.props.children}
                    </div>
                    
                  </form>
                </div>
                {this.props.lastSub==="orders+"+this.props.currentCollectionName?
                (
                  <div>
                <a style={{float:"right"}} className="btn btn-success"  onClick={()=>{this.props.confirmOrderAction()}}>{translate('changeOrderStatusNotifyUser')}</a>
                <a style={{float:"right"}} className="btn btn-info"  onClick={()=>{this.props.completeOrder()}}>{translate('completeOrder')}</a>
                <div><a style={{float:"right"}} className="btn btn-danger"  onClick={()=>{this.props.rejectOrderAction()}}>{translate('reject')}</a></div>
                </div>
                )
                :this.props.lastSub==="dinein+"+this.props.currentCollectionName? (
                  <div>
                <a style={{float:"right"}} className="btn btn-success"  onClick={()=>{this.props.changeDineInStatus()}}>{translate('changeDineInStatusNotifyUser')}</a>
                </div>
                ) : ""}
              </div> 
        )
    }
}
