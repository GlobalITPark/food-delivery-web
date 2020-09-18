import React, {Component} from 'react';
import NavBar from './../ui/template/NavBar';
import firebase from '../config/database';
import CardUI from './../ui/template/Card';
import fire from 'firebase';
import ReactTable from "react-table";
import {ClipLoader,FadeLoader,ScaleLoader} from 'halogenium';
import {Redirect} from 'react-router-dom';



class RaffleDraw extends Component {
    constructor(props) {
      super(props);
      this.state = {
        min: 1,
        max: 1000,
        number: null,
        isRaffleStarted:false,
        isRaffleEnded:false,
        selected_winners:null,
        winners:[],
        isLoading:false
        // isRaffleDone:"0",
      }

      this.startRaffle = this.startRaffle.bind(this);
      this.getWinnersDataFromFirestore = this.getWinnersDataFromFirestore.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.addNextWinner = this.addNextWinner.bind(this);
      this.resetDataFunction = this.resetDataFunction.bind(this);
      this.selectRaffleNumber = this.selectRaffleNumber.bind(this);
      
    }
  
    componentDidMount() {
     this.setState({ number: this.generateNumber(this.state.min, this.state.max)});
    this.setState({number:"Raffle",isRaffleStarted:false,isRaffleEnded:false});
      const _this=this;
      const db = firebase.app.firestore();
      const ticketStatsRef = db.collection('raffle_results').doc('--raffle_stats--');
      ticketStatsRef.get()
      .then(doc => {
        if(!doc.exists){
          console.log("No such document!");
        } else{
          console.log('Document data:', doc.data());
          _this.setState({
            isRaffleDone:doc.data().isRaffleDone,
            raffleStatus:doc.data().status,
            // selected_winner:doc.data().selected_winner
          });
        }
      })
      this.getWinnersDataFromFirestore();
    }

    getWinnersDataFromFirestore(){
      const _this=this;
      const winners = [];
      const ref = firebase.app.firestore().collection("raffle_results");
      ref.get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
              const content = doc.data();
              // console.log("doc data", doc.data());
              
              if(doc.id==="--raffle_stats--"){
                _this.setState({
                  // isRaffleDone:doc.data().isRaffleDone,
                  // raffleStatus:doc.data().status,
                  selected_winners:doc.data().selected_winners
                });
              }else{
                winners.push({
                  place:doc.id,
                  content
              });
              }
              
          });
  
          _this.setState({
            winners:winners
          })
      })
    }
    
    minChange = (event) => {
      this.setState({ min: event.target.value})
    }
    
    maxChange = (event) => {
      this.setState({ max: event.target.value})
    }
    
    generateNumber = (min, max) => {
      return Math.floor(Math.random()*(max-min+1)+min)
    }

    startRaffle(){
      const _this =this;
      setTimeout(function(){
        _this.setState({
          isRaffleDone:"1",
          raffleStatus:"1",
            isRaffleStarted:true,
            
        })
      }.bind(this),2000);

     
    }
    
    getInputs = () => {
      if(this.state.min > this.state.max ){
        const minTemp = this.state.min
        const maxTemp = this.state.max
        this.setState(
        { 
          min: maxTemp,
          max: minTemp
        }, () =>
          this.setState({
            number: this.generateNumber(this.state.min, this.state.max)  
          })
        );
      } else {
        this.setState({
          number: this.generateNumber(this.state.min, this.state.max)  
        })
      }
    }

    selectRaffleNumber(row){
      const _this=this;
      console.log("raffle place :"+JSON.stringify(row.original.place));
      var luckyNo;
      _this.setState({
        isLoading: true 
      })
      if(this.state.min > this.state.max ){
        const minTemp = this.state.min
        const maxTemp = this.state.max
        this.setState(
        { 
          min: maxTemp,
          max: minTemp
        }, () =>
          luckyNo = this.generateNumber(this.state.min, this.state.max)
        );
      } else {
        luckyNo = this.generateNumber(this.state.min, this.state.max)
      }

      setTimeout(function(){
        _this.setState({
          number: luckyNo,
          isLoading:false,
            isRaffleEnded:true
        })

        const db = firebase.app.firestore();
        const raffleResultRef = db.collection('raffle_results').doc(row.original.place);
        raffleResultRef.update({ticket_no:luckyNo});
        _this.resetDataFunction();
      }.bind(this),3000);
      
    }

    addNextWinner(){
      const _this=this;
      const db = firebase.app.firestore();
      const increment = fire.firestore.FieldValue.increment(1);
   
      const raffleStatsRef = db.collection('raffle_results').doc('--raffle_stats--');
      const raffleResultRef = db.collection('raffle_results').doc((this.state.selected_winners+1).toString());
 
      const batch = db.batch();
      batch.set(raffleResultRef,{ticket_no:""});
      batch.set(raffleStatsRef,{selected_winners:increment},{merge:true});
      batch.commit();

      setTimeout(function(){
        _this.setState({
          raffleStatus:0,
            isRaffleStarted:false
        })
        _this.resetDataFunction();
      }.bind(this),2000);
    }

    resetDataFunction(){
      this.getWinnersDataFromFirestore();
    }
    
    render() {
      if(this.props.currentUser !== 'admin'){
        return(
          <Redirect to="/"/>
    
        )
      }
      const columns = [{
        Header: '#',
        accessor: 'place' // String-based value accessors!
      }, {
        Header: 'Ticket No',
        accessor: 'content.ticket_no',
      },
      // {
      //   Header: 'Name', // Custom header components!
      //   accessor: 'name'
      // }, 
      {
        Header: 'Action',
        filterable:false,
        Cell: row => 
          <span>
            {row.original.content.ticket_no==="" ?
            <button onClick={()=>this.selectRaffleNumber(row)} type="button" className="btn btn-danger btn-sm">Raffle</button>
            :
            <button disabled type="button" className="btn btn-success btn-sm">Finished</button>
            }
            
          </span>
      }]
      return (

        <div className="wrapper wrapper-full-page">
        <div className="full-page landing-page">
            <div className="content">
                <div className="section intro-section">
                    <div className="container w-container">
                        <div className="content">
			<NavBar />
            <div className="row">
                <CardUI class="col-md-12 winning"  name='' title={"Raffle Draw"}  showAction={false}>
                    <div style={this.state.raffleStatus==="1" ? {} : {pointerEvents:'none',opacity:'0.4'}} id="raffle-draw">
                    
                    <div id="winning-num">
                        {this.state.isRaffleStarted===false?
                        "Start"
                        :""}
                        {this.state.isLoading===true?
                            <img src="assets/img/loader.gif"></img>
                        :
                        ""
                        }
          
                        {(this.state.isRaffleEnded===false && this.state.isRaffleStarted===true&&this.state.isLoading===false)?
                            "Raffle"
                        :""}
                       
                        {this.state.isRaffleEnded===true?
                            <div className="winning-number">{this.state.number}</div>
                        :
                        ""
                        }
                        
                    </div>
                    
                    </div>
                </CardUI>

                <CardUI class="col-md-12 results"  name={"results"} title={"Results"}  showAction={false}>
                    {/* <br /><br /> */}
                    {this.state.raffleStatus==="1" ?
                    <div>
                        <ReactTable
                          key={this.state.pageLength}
                          data={this.state.winners}
                          filterable
                          columns={columns}
                          className="-striped -highlight"
                          defaultPageSize={this.state.winners.length}
                          showPagination={false}  
                        />
                        <a style={{float:"right"}} className="btn btn-sm" onClick={this.addNextWinner}>Add</a>
                    </div>

                        
                      :
                      <div style={{textAlign:"center"}}>
                          <a className="btn btn-success raffle" onClick={this.startRaffle}>Raffle</a>
                      </div>
                     
                    }
                    
                    
                    
                </CardUI>
            </div>
		</div>
                    </div>
                </div>

               
            
            </div>
        
        </div>

    </div>
        
  
      );
    }
  }

  export default RaffleDraw;


