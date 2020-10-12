import React, {Component} from 'react'
import firebase from '../config/database'
import Item from './Item'
import {Grid} from 'react-mdl';

import { PulseLoader } from 'halogenium';

class Products extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            items: [],
            centreName:null,
            centreDesc:null,
            isLoading:true
     //       cartItems: []
          }
    }

    componentWillMount(){
        const { match: { params } } = this.props;


        const _this=this;
        const items = [];
        const collectionRef = firebase.app.firestore().collection("restaurant_collection");
        const collection = collectionRef.doc(params.id);

        collection.get().then(function(doc){
            _this.setState({
                centreName:doc.data().title,
                centreDesc:doc.data().description
            })
        })
        

        const itemRef = firebase.app.firestore().collection("restaurant");
        itemRef.where('collection','==',collection).get().then(function(snap){
            snap.forEach(function(doc){
                
                const content = doc.data();
                items.push({
                    key:doc.id,
                    content
                });
            })

            _this.setState({
                isLoading:false,
                items:items
            })
            
        })

    }

    render(){
        const items = this.state.items.map((item, index) =>
        <Item key={index} value={item}/>
        );
        return(
            <div className="wrapper wrapper-full-page">
                <div className="full-page landing-page">
                    <div className="content">
                        <div style={{paddingBottom: '50px'}} className="section intro-section">
                            <div className="container w-container">
                                <div className="section-title-wrapper intro">
                                    <h2 className="section-title">{this.state.centreName}</h2>
                                    {/* <div className="section-divider"></div> */}
                                    <div className="section-title subtitle">
                                    {this.state.centreDesc}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container w-container">
                            <div className="row">
                                <div className="col-lg-8">
                                    {this.state.isLoading?<PulseLoader color="#8637AD" size="12px" margin="4px"/>:""}
                                    <Grid className="demo-grid-1">
                                        {items}
                                    </Grid>
                                </div>
                            </div>
                        
                        </div>

                    </div>
                
                </div>
            </div>
           
        )
    }
}

export default Products;