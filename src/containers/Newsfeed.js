import React, { Component } from 'react'
import firebase from '../config/database'
// import * as firebaseCLASS from 'firebase';
require("firebase/firestore");


class Newsfeed extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            posts: []
          }
    }

    componentWillMount(){
        const _this=this;
        const posts = [];
        const ref = firebase.app.firestore().collection("news");
        ref.get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                // const {content} = doc.data();
                // console.log("doc data", doc.data());
                // posts.push({
                //     key:doc.id,
                //     content
                // });
                if(doc.data().isNews==="yes"){
                    posts.push(doc.data())
                }
                
            });

            _this.setState({
            posts:posts
            })
        })

    }

    render() {
       
        const posts = this.state.posts.map((post, index) =>
            <Post key={index} value={post} />
        );
        return (
            <div className="newsfeed row">
                {posts}
            
            </div>

        )
        }
}

// const responsive = {
//     desktop: {
//         breakpoint: { max: 3000, min: 1024 },
//         items: 3
//     },
//     tablet: {
//         breakpoint: { max: 1024, min: 464 },
//         items: 2
//     },
//     mobile: {
//         breakpoint: { max: 464, min: 0 },
//         items: 1
//     }
//     };


class Post extends Component {
    render() {
        return (
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div>
                <div className="feature-image">
                    <img className="image" alt={Image} src={this.props.value.image}></img>
                </div>

                <div>
                    <div className="title">
                        <a href="#">{this.props.value.title}</a>
                    </div>
                    {/* <div className="date">
                        {this.props.value.date}
                    </div> */}

                    <div className="description">
                        {this.props.value.description}
                    </div>
                </div>
            </div>
            

            
            

        </div>

       

        
        )
    }
}
  

export default Newsfeed;