import React, {Component} from 'react'
import firebase from '../config/database'
import {Link} from 'react-router-dom'
import {Grid,Cell,Card,CardTitle,CardText,CardActions,Button} from 'react-mdl';
import { PulseLoader } from 'halogenium';


class Centre extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            centres: [],
            isLoading:true
          }
    }

    componentWillMount(){
        const _this=this;
        const centres = [];
        const ref = firebase.app.firestore().collection("restaurant_collection");
        ref.orderBy('count','asc').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                const content = doc.data();
                
                centres.push({
                    key:doc.id,
                    content
                });
                // centres.push(doc.data())
                // console.log("doc data", centres);
                
            });

            _this.setState({
                isLoading:false,
                centres:centres
            })
        })

    }


    render(){
        const centres = this.state.centres.map((centre, index) =>
        <Restaurant key={index} value={centre} />
        );
        return(
            <div className="wrapper wrapper-full-page">
                <div className="full-page landing-page">
                    <div className="content">
                        <div style={{paddingBottom: '50px'}} className="section intro-section">
                            <div className="container-fluid centre-banner"></div>
                            <div className="container w-container">
                                <div className="section-title-wrapper intro">
                                    <h2 className="section-title">レストラン</h2>
                                    <div className="section-divider"></div>
                                    <div className="section-title subtitle">
                                        本格的なスリランカの飲食物を提供するフェスティバルのフードマートには35以上の屋台があります。                                    
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container w-container card-wrap">
                            {this.state.isLoading?<PulseLoader color="#8637AD" size="12px" margin="4px"/>:""}
                            <Grid className="demo-grid-1">
                                {centres}
                            </Grid>
                        </div>
                    
                    </div>
                
                </div>
            </div>

            
        )
        
        
    }
}

class Restaurant extends Component {
    render() {
        return (
            <Cell col={3}>
                <Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
                    <CardTitle style={{height:'180px',color: '#fff', background: 'url('+this.props.value.content.image+')bottom right 15% no-repeat #46B6AC',backgroundSize:'cover'}}></CardTitle>
                    <CardText style={{width:'100%'}}>
                        {this.props.value.content.description}
                    </CardText>
                    <CardActions border>
                        <Link to={"products/"+this.props.value.key}><Button colored>{this.props.value.content.title}</Button></Link>
                    </CardActions>
                </Card>
            </Cell>
            
        )
    }
}

export default Centre;