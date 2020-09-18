import React, {Component} from 'react'
import firebase from '../config/database'
import {Grid,Cell,Card,CardTitle,CardText,CardActions,Button} from 'react-mdl';

import { PulseLoader } from 'halogenium';

class Products extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            items: [],
            centreName:null,
            centreDesc:null,
            isLoading:true
          }
    }

    componentWillMount(){
        const { match: { params } } = this.props;


        const _this=this;
        const items = [];
        const collectionRef = firebase.app.firestore().collection("restaurant_collection");
        const collection = collectionRef.doc(params.id);

        collection.get().then(function(doc){
            // console.log("collection"+doc.data().title)
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
        <Item key={index} value={item} />
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
                                {/* <div className="col-lg-4">
                                    <div className="card">
                                        <div style={{margin:"20px"}} className="card-body">
                                        <button type="button" className="btn btn-success btn-block">Checkout</button>
                                        <hr/>
                                        <div className="col-lg-2 col-md-2 col-xs-2">
                                            <p>2</p>
                                        </div>
                                        <div className="col-lg-7 col-md-7 col-xs-7">
                                            <p>Pork curry set</p>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-xs-3">
                                            <p>480.00</p>
                                        </div>
                                        <hr/>
                                            
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        
                        </div>

                    </div>
                
                </div>
            </div>
           
        )
    }
}

class Item extends Component {
    render() {
        return (
            <Cell col={4}>
                <Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
                    <CardTitle style={{height:'180px',color: '#fff', background: 'url('+this.props.value.content.image+')bottom right 15% no-repeat #46B6AC',backgroundSize:'cover'}}></CardTitle>
                    <CardText style={{width:'100%',textAlign:'center'}}>
                        {this.props.value.content.description}
                    </CardText>
                    <CardActions border>
                        <Button colored>{this.props.value.content.title}</Button>
                    </CardActions>
                </Card>
            </Cell>
            
        )
    }
}

export default Products;