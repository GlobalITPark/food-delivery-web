/*eslint no-unused-vars: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint no-redeclare: "off"*/

import React, { Component,PropTypes } from 'react'
import Config from   '../../config/app'
import Common from '../../common.js'
import moment from 'moment'
import { Link } from 'react-router'
import ReactTable from "react-table"
import "react-table/react-table.css"
import matchSorter from 'match-sorter'
import { getLocale, translate } from '../../translations'
export default class RTable extends Component {

    constructor(props){
        super(props);

        this.state = {
            headers: this.props.headers,
            data: this.props.data,
            columns: [],
            pageSize: this.props.data.length
        }

        console.log("================= RECEVIED DATA ==================");
        console.log(this.props.headers);
        console.log("================= END RECEVIED DATA ==================");

        this.setupColumns = this.setupColumns.bind(this);
        this.returnLink = this.returnLink.bind(this);
        this.rowCreator = this.rowCreator.bind(this);
    }

    /**
  * componentDidMount event of React, fires when component is mounted and ready to display
  * Start connection to firebase
  */
  componentDidMount() {

    console.log(this.props);

    if(this.props.headers&&this.props.headers.length>0){
      //We already know who are our headers,preset
      this.setupColumns();
    }else{
        //Loop throught all items ( in data ) to find our headers
        var headers=[]
        var headersCounter={};
        for (var i = 0; i < this.props.data.length; i++) {

            //The type of our array items
            var parrentType=Common.getClass(this.props.data);
            var type=Common.getClass(this.props.data[i]);
            console.log("parrentType type is "+parrentType);
            console.log("Inside type is "+type);

            //OBJECTS INSIDE
            if(type==="Object"){

                //In CASE we have OBJECT as array items
                for (var key in this.props.data[i]) {
                    // skip loop if the property is from prototype
                    if (!this.props.data[i].hasOwnProperty(key)) continue;

                    var obj = this.props.data[i][key];
                    var objType = Common.getClass(obj);

                    //Consider onyl String, Bool, Number
                    if((objType==="String"||objType==="Boolean"||objType==="Number")&&key!=="uidOfFirebase"){
                        if(headersCounter[key]){
                        headersCounter[key]++
                        }else{
                        headersCounter[key]=1;
                        }
                    }
                }
            }

            //STRING INSIDE
            else if(type==="String"){
                headers=["Value"];
                headersCounter["Value"]=1;
                break;
            }
        }

        console.log("headersCounter")
        console.log(headersCounter)
        //END looking for headers

        var numHeadersCounter=0;
        for (var key in headersCounter) {
            numHeadersCounter++;
        }

        console.log("numHeadersCounter "+numHeadersCounter);

        //ARRAYS INSIDE
        if(numHeadersCounter===0){
            console.log("Make it ArtificialArray");
            headers=["Items"];
            headersCounter["Items"]=1;
            type="ArtificialArray"; //Artificial
        }

        //Now we have the headers, with their number of occurences
        //Convert object to array
        var headersCounterAsArray=[];
        for (var key in headersCounter) {
            headersCounterAsArray.push({key:key,counter:headersCounter[key]})
        }


        headersCounterAsArray.sort(function(b, a) {
            return parseFloat(a.counter) - parseFloat(b.counter);
        });

        console.log("headersCounterAsArray length "+headersCounterAsArray.length)
        console.log(headersCounterAsArray)


        //Pick headers based on their number of appereances 2
        headers=[];
        for (var k = 0; k < headersCounterAsArray.length && k<Config.adminConfig.maxNumberOfTableHeaders; k++) {
            console.log("Is it ok "+(k < headersCounterAsArray.length && k<Config.adminConfig.maxNumberOfTableHeaders))
            headers.push(headersCounterAsArray[k].key)
        }

        //Update the state
        console.log(headers);
        this.setState({headers:headers,type:type})
        setTimeout(this.setupColumns,100)
        }
    }
    
    //Create column for every header
    setupColumns(){
        var columns = [];
        var orderColumns = ['name', 'variant', 'quantity', 'price', 'image'];
        var headers = (this.props.name === 'order') ? orderColumns : this.state.headers;
        headers.map((header, colIndex)=>{
            columns.push({  
                Header: Common.capitalizeFirstLetter(translate(header)),
                accessor: header,
                //not filterable for photo and object
                filterable: Config.adminConfig.fieldsTypes.photo.indexOf(header)>-1?false:(header.indexOf(".")>0?false:true),
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [header] }),
                  filterAll: true,
                Cell: row => (this.rowCreator(row, colIndex, row.index))
            })
        })

        if(this.props.name === 'restaurant_collection'){
            columns.push({
                Header: translate('approve'),
                filterable: false,
                Cell: row => (
                   <div className="disabled-sorting text-center">
                       {this.createApproveButton(row)}
                   </div> 
                )
            });
        } 
        if(this.props.name === 'orders'){
            columns.push({
                Header: translate('viewOrder'),
                filterable: false,
                Cell: row => (
                    <a target={'_blank'} href={`/order-details/${btoa(row.original.uidOfFirebase)}?_l=${getLocale()}`}>{translate('viewOrder')}</a>
                )
            });
        }

        columns.push({
            Header: translate('actions'),
            filterable: false,
            Cell: row => (
               <div className="disabled-sorting text-center">
                   {this.createEditButton(this.returnLink(row, row.index))}
                   {this.props.name !== 'users' ? <a onClick={
                        ()=>{ 
                            this.deleteAction(this.props.fromObjectInArray?row.original.uidOfFirebase:row.index,this.returnLink(row, row.index))
                        }
                        }>
                        <span className="btn btn-simple btn-danger btn-icon delete"><i className="material-icons">delete</i></span>
                    </a> : <p></p>}
                    
               </div> 
            )
        });
       

        this.setState({
            columns: columns
        })
    }    

    //Create Edit button
    createEditButton(link){
        if(this.props.isFirestoreSubArray){
          return (<a onClick={()=>{ this.props.showSubItems(link)}}><span className="btn btn-simple btn-danger btn-icon edit"><i className="material-icons">edit</i></span></a>);
        }else{
          return (<Link to={link}>
            <span className="btn btn-simple btn-warning btn-icon edit"><i className="material-icons">edit</i></span>
          </Link>)
      }
    }

    createApproveButton(row){
        if(!row.original.active_status) {
            if(this.props.isAdmin) {
                return (
                    <button onClick={()=>this.props.approveAction(row)} type="button" className="btn btn-success btn-sm">
                        Approve
                    </button>
                    );
            }else {
                return(<span>Approval_pending</span>);
            }
        }else {
            return(<span>Already_approved</span>);
        }
    }

    //Create Delete button
    deleteAction(rowIndex,link){
        if(this.props.isFirestoreSubArray){
          this.props.deleteFieldAction(rowIndex,true,link);
        }else{
           this.props.deleteFieldAction(rowIndex,true);
        }
    }

    //Return specific link 
    returnLink(row, index){
        var theLink=this.props.routerPath.replace(":sub","")+this.props.sub;
        if(this.props.isFirestoreSubArray){
            if(this.props.fromObjectInArray){
                theLink+=Config.adminConfig.urlSeparatorFirestoreSubArray+row.original.uidOfFirebase;
            }else{
                if(this.props.isJustArray){
                    theLink+=Config.adminConfig.urlSeparatorFirestoreSubArray+index;
                }else{
                    theLink+=Config.adminConfig.urlSeparatorFirestoreSubArray+this.props.name+Config.adminConfig.urlSeparatorFirestoreSubArray+index;
                }
            }
        }else{
            if(this.props.fromObjectInArray){
                theLink+=Config.adminConfig.urlSeparator+row.original.uidOfFirebase;
            }else{
                if(this.props.isJustArray){
                    theLink+=Config.adminConfig.urlSeparator+index;
                }else{
                    theLink+=Config.adminConfig.urlSeparator+this.props.name+Config.adminConfig.urlSeparator+index;
                }   
            }
        }
        return theLink;
    }

    //Create row depending of type 
    rowCreator(row, colIndex, rowIndex){
        var key=row.column.id;
        if(Config.adminConfig.fieldsTypes.photo.indexOf(key)>-1){
            //This is photo 
            return (<div className="tableImageDiv"><Link to={this.returnLink(row, rowIndex)}><img alt={row.original.name} className="tableImage" src={row.value}  width={"200px"} /></Link></div>)
        }if(Config.adminConfig.fieldsTypes.dateTime.indexOf(key)>-1){
            //This is date time
            return (<div className="text-center"><p>{(row.value && row.value.seconds) ? moment(new Date(row.value.seconds*1000)).format('D-MMM-YYYY H:mm') : '--'}</p></div>)
        }if(typeof(row.value) === "boolean"){
            //This is boolean
            return (<div className="text-center">{row.value?"True":"False"}</div>)
        }if(typeof(row.value) === "object"){
            //This is object - this can happen if element with same name is of other kind ex string or number
            return (<div></div>)
        }else{
            if(this.state.type === "String"){
                console.log("--HERE--String")
                //Normal value
                //But can be string
                return (<div className="text-center">{row.original}</div>)
            }if(this.state.type==="ArtificialArray"){
                console.log("--HERE--ArtificialArray")
                if(Config.adminConfig.showItemIDs){
                  return colIndex===0?(<div className="text-center"><Link to={this.returnLink(row, rowIndex)}>{this.props.data[colIndex].uidOfFirebase}</Link></div>):(<div className="text-center">{this.props.data[colIndex].uidOfFirebase}</div>)
                }else{
                  return colIndex===0?(<div className="text-center"><Link to={this.returnLink(row, rowIndex)}>{"Item "+(rowIndex+1)}</Link></div>):(<div className="text-center">{"Item "+(rowIndex+1)}</div>)
                }
               
            }else{
                
              return colIndex===0?(<div className="text-center"><Link to={this.returnLink(row, rowIndex)}>{row.value}</Link></div>):(<div className="text-center">{row.value}</div>)
          }
        }
    }  

    render() {
        return (
        <div>
            <ReactTable
                data={this.state.data}
                filterable
                defaultFilterMethod={(filter, row) =>
                    String(row[filter.id]) === filter.value
                }
                columns={this.state.columns}
                className="-striped -highlight"  
                defaultPageSize={this.state.pageSize}
                showPagination={false}
            />  
        </div>
        )
    }
}

RTable.propTypes = {
    data:PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    routerPath: PropTypes.string.isRequired,
    isJustArray: PropTypes.bool.isRequired,
    sub:PropTypes.string,
    fromObjectInArray:PropTypes.bool.isRequired,
    deleteFieldAction:PropTypes.func.isRequired,
    approveAction:PropTypes.func,
    isAdmin:PropTypes.bool
};