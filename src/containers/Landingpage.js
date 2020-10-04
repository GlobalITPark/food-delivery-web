import React, {Component} from 'react';
import {Card} from 'react-mdl';
import CountDown from 'reactjs-countdown';
import Newsfeed from './Newsfeed';
import Promo from './Promo';

// Random component
const Completionist = () => <span>Festival started..!!</span>;


class Landingpage extends Component {

    constructor(props){
        super(props);
      }

    render(){

        return(
            <div className="wrapper wrapper-full-page">
            <div className="full-page landing-page">
                <div className="content">
                    <div style={{left:"-5px"}} id="myCarousel" className="carousel slide" data-interval="5000" data-ride="carousel">

                    
                        <div className="carousel-inner">
                            <div className="item active">
                            <img style={{width:'100%',height:'480px',objectFit:'cover',opacity:'0.6'}} src="assets/img/sushi.jpg" alt="Los Angeles"></img>
                            </div>
                        </div>
                    </div>
                    
                    <div className="container w-container boxes">
                        <Promo/>
                    </div>

                    <div className="container news-section">
                        <div className="section-title-wrapper">
                            <h2 className="section-title">ニュースフィード</h2>
                            <div className="section-divider"></div>
                            <h2 className="section-title subtitle">スリランカのスタイルを愛するすべての人にとって日本で一番の興奮</h2>
                        </div>
                        <Newsfeed/>
                    </div>  
                </div>
            </div>
        </div>
        )
    }
}

export default Landingpage;