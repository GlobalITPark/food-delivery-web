import React, { Component } from 'react'
import firebase from '../config/database'
// import * as firebaseCLASS from 'firebase';
require("firebase/firestore");
import {Grid,Cell,Card,CardTitle,CardText,CardActions,Button} from 'react-mdl';


class Promo extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            promo: []
          }
    }

    componentWillMount(){
        const _this=this;
        const promo = [];
        const ref = firebase.app.firestore().collection("news");
        ref.get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                // const {content} = doc.data();
                // console.log("doc data", doc.data().isNews);
                // posts.push({
                //     key:doc.id,
                //     content
                // });
                if(doc.data().isNews==="no"){
                    promo.push(doc.data())
                }
                
            });

            _this.setState({
            promo:promo
            })
        })

    }


    render() {
        const promo = this.state.promo.map((promo, index) =>
        <Promocard key={index} value={promo} />
        );
        return (
            <Grid className="demo-grid-1">
                {promo}
            </Grid>
        )
        }
}

class Promocard extends Component {
    render() {
        return (
            <Cell col={3}>
                <Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
                    <CardTitle expand style={{color: '#fff', background: 'url('+this.props.value.image+')bottom right 15% no-repeat #46B6AC',backgroundSize:'cover'}}></CardTitle>
                    <CardText>
                        {this.props.value.description}
                    </CardText>
                    <CardActions border>
                        <Button colored>{this.props.value.title}</Button>
                    </CardActions>
                </Card>
            </Cell>
            
        )
    }
}

export default Promo;