import React, {Component,PropTypes} from 'react'
import firebase from '../../config/database'
import Config from   '../../config/app';

class MultiSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value:(props.value) ? props.value : [],
      options:[]
    };
    this.handleChange=this.handleChange.bind(this);
    this.createOption=this.createOption.bind(this);
    this.findFirebaseRelatedData=this.findFirebaseRelatedData.bind(this);
  }

  /**
   * Step 0a
   * Start getting data
   */
  componentDidMount(){
    console.log('this.propsssssssssss', this.state)
    if(this.props.isFirestore){
      
      this.findFirestoreRelatedData();
    }else{
      console.log('this.hereeeeeeeeeeee', this.props)
      this.findFirebaseRelatedData();
    }
  }

  findFirestoreRelatedData(){
    //alert(JSON.stringify(this.props.options));
    var db = firebase.app.firestore();
    //COLLECTIONS - GET DOCUMENTS 
    var optionsFromFirebse=[];
    var _this=this;
        db.collection(this.props.options.path).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var currentDocument=doc.data();
              currentDocument.uidOfFirebase=doc.id;
              console.log(doc.id, " => ", currentDocument);
              

              var newOption={
                value:_this.props.options.isValuePath?_this.props.options.path+"/"+doc.id:currentDocument[_this.props.options.value],
                name:currentDocument[_this.props.options.display],
              }
              //console.log(newOption);
              optionsFromFirebse.push(newOption);

          });
          _this.setState({options:optionsFromFirebse})
      });

  }

  findFirebaseRelatedData(){
    //console.log("findFirebaseRelatedData");
    //console.log(this.props.options);
    var _this=this;
    var ref=firebase.app.database().ref(this.props.options.path);
    ref.once('value').then(function(snapshot) {
      var data=snapshot.val();
      //console.log(data);
      var optionsFromFirebse=[];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var currentItem=data[key];

          var newOption={
            value:_this.props.options.isValuePath?_this.props.options.path+"/"+key:currentItem[_this.props.options.value],
            name:currentItem[_this.props.options.display],
          }
          //console.log(newOption);
          optionsFromFirebse.push(newOption);
        }
      }//End loop

      _this.setState({options:optionsFromFirebse})


    });
  }


  capitalizeFirstLetter(string) {
    string+="";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Change events on all inputs
  handleChange(value) {
    console.log(value.value)
    //Find if we have this elemet already selected
    var selectedItems=this.state.value;
    var indexOfItem=selectedItems.indexOf(value.value);
    if(indexOfItem===-1){
      //It doesn't exist, add it
      selectedItems.push(value.value);
    }else{
      //Remove it, make it unselected
       selectedItems.splice(indexOfItem, 1);
    }
    this.setState({value: selectedItems});
    this.props.updateAction(this.props.theKey,selectedItems,false,"reference");
  }

  createOption(value){
    return (<option key={Math.random().toString()} value={value.value}>{this.capitalizeFirstLetter(value.name)}</option>)
    
  }

  renderARadio(value){
    return (
      <div className="checkbox" key={Math.random()}>
        <label>
          <input type="checkbox" name={this.props.theKey} value={value.value} checked={this.state.value.indexOf(value.value)>-1}  onChange={(_)=>this.handleChange(value)} />
          <span className="checkbox-material"><span className="check"></span></span> {this.capitalizeFirstLetter(value.name)}
        </label>
      </div>
    )
  }

  render() {
    return (
      <div className={Config.designSettings.editElementDivClass}>
          <label className="control-label"></label>
          {this.state.options.map((val)=>{
              return this.renderARadio(val);
            })}
      </div>
    )
    
  }
}
export default MultiSelect;

MultiSelect.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    //value: PropTypes.string.isRequired,
    //parentKey: PropTypes.any.isRequired,
    class: PropTypes.string
};
