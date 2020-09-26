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
                        <ol className="carousel-indicators">
                            <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                            <li data-target="#myCarousel" data-slide-to="1"></li>
                            <li data-target="#myCarousel" data-slide-to="2"></li>
                        </ol>

                    
                        <div className="carousel-inner">
                            <div className="item active">
                            <img style={{width:'100%',height:'480px',objectFit:'cover',opacity:'0.6'}} src="assets/img/sushi.jpg" alt="Los Angeles"></img>
                                <div className="carousel-caption">
                                    <h3>スリランカデー2019</h3>
                                    <p>本格的なスリランカの飲食物を提供するフェスティバルのフードマートには35以上の屋台があります。</p>
                                </div>
                            </div>

                            <div className="item">
                                <img style={{width:'100%',height:'480px',objectFit:'cover'}} src="assets/img/srilankan.jpg" alt="Chicago"></img>
                                    <div className="carousel-caption">
                                        <h3>第15回スリランカ・フェスティバル in JAPAN 2019</h3>
                                        <p>&nbsp;</p>
                                    </div>
                            </div>

                            <div className="item">
                                <img style={{width:'100%',height:'480px',objectFit:'cover'}} src="assets/img/slfest9.jpg" alt="New York"></img>
                                    <div className="carousel-caption">
                                        <h3>東京で感じるスリランカ</h3>
                                        <p>&nbsp;</p>
                                    </div>  
                            </div>
                        </div>

                        <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="right carousel-control" href="#myCarousel" data-slide="next">
                            <span className="glyphicon glyphicon-chevron-right"></span>
                            <span className="sr-only">Next</span>
                        </a>
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
            
                        <div className="intro-section-column w-col w-col-12 w-col-small-12 w-col-tiny-12">
                            <p className="join-text">イベントについてもっと知りたいですか？</p>
                            <a className="button w-button" href="#">もっと読む</a>
                        </div>
                    </div>

                    <div className="container w-container tokyo-text">
                        <div className="section-title-wrapper centered">
                            <h2 className="section-title">東京でスリランカを感じよう！</h2>
                            <div className="section-divider"></div>
                            <h2 className="section-title subtitle">スリランカスタイルを愛するすべての人に一番の興奮を</h2>
                        </div>

                        <div className="intro-section-row w-row">
                            <div className="intro-section-column w-col w-col-4 w-col-small-4 w-col-tiny-12">
                                <div className="icon-block">
                                    <img src="assets/img/food.png"></img>
                                </div>
                                <div className="intro-column-title">フード</div>
                                <p>フェスティバルには35軒以上の食の屋台があります</p>
                            </div>

                            <div className="intro-section-column w-col w-col-4 w-col-small-4 w-col-tiny-12">
                                <div className="icon-block">
                                    <img src="assets/img/music.png"></img>
                                </div>
                                <div className="intro-column-title">音楽とダンス</div>
                                <p>スリランカの音楽とダンスで祝う</p>
                            </div>

                            <div className="intro-section-column w-col w-col-4 w-col-small-4 w-col-tiny-12">
                                <div className="icon-block">
                                    <img src="assets/img/ayurveda.png"></img>
                                </div>
                                <div className="intro-column-title">アーユルヴェーダとヨガ</div>
                                <p>スリランカスタイルのアーユルヴェーダとヨガを試しませんか？</p>
                            </div>

                            <div className="intro-section-column w-col w-col-12 w-col-small-12 w-col-tiny-12">
                                <p className="join-text">エンターテイメントに満ちた素晴らしいお祭りを私たちと体験しましょう！</p>
                                <a className="button w-button" href="/register">今日ここで登録</a>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
        )
    }
}

export default Landingpage;