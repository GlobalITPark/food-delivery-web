import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
// import {Redirect} from 'react-router'
import Admin from '../Admin'
import Vendor from '../Vendor'

class Dashboard extends Component {
    state = {
        // redirectToReferrer:false
    }

    // login =()=>{
    //     fakeAuth.authenticate(()=>{
    //         this.setState(()=>{
    //             redirectToReferrer:true
    //         })
    //     })
    // }
    render(){
        console.log("current user"+this.props.currentUser)
        // return(
        
        // const { redirectToReferrer } = this.state

        // if(redirectToReferrer===true){
        //     return <Redirect to='/login'/>
        // }
        if(this.props.currentUser==="admin"){
            return(
                <Admin/>
            )
        }else if(this.props.currentUser==="vendor"){
            return(
                <Vendor/>
            )
        }else if(this.props.currentUser==="visitor"){
            return(
                <Redirect to='/'/>
            )
        }
        // return(
            
        //     <Admin/>
        //     <div className="content">
        //     <Admin/>
                
        //         {/* Dashboard only
        //         <br />
        //         Add your own content here, instructions etc...
        //         Dashboard
        //         Dashboard
        //         <br />
        //         Dashboard
        //         <br />
        //         Dashboard
        //         <br /> */}
                
        //     </div>
        // )
    }
}

export default Dashboard;