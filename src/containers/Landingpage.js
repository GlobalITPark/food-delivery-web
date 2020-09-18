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
                            <img style={{width:'100%',height:'480px',objectFit:'cover',opacity:'0.6'}} src="assets/img/slfest3.jpg" alt="Los Angeles"></img>
                                <div className="carousel-caption">
                                    <h3>スリランカデー2019</h3>
                                    <p>本格的なスリランカの飲食物を提供するフェスティバルのフードマートには35以上の屋台があります。</p>
                                </div>
                            </div>

                            <div className="item">
                                <img style={{width:'100%',height:'480px',objectFit:'cover'}} src="assets/img/slfest4.jpg" alt="Chicago"></img>
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
                    
                    <Card shadow={0} style={{width: '80%',minHeight:'45px',margin:'auto',marginTop:'-35px'}}>
                   
                    <div className="row">
                        <div className="col-xs-6 col-md-4 col-lg-4 col-sm-3">
                            <div className="intro-info-block">
                                <div className="intro-icon-wrapper">
                                <img  style={{width: '30px'}} src="https://uploads-ssl.webflow.com/5c64e08639e719533fb04a7f/5c64e08639e7192290b04a97_Icon-location.png"></img>
                                </div>
                                <div className="intro-info-title">
                                東京
                                </div>
                                <div className="intro-info-title subtitle">
                                渋谷
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-6 col-md-4 col-lg-4 col-sm-4">
                            <div className="intro-info-block">
                                <div className="intro-icon-wrapper">
                                <img  style={{width: '30px'}} src="https://uploads-ssl.webflow.com/5c64e08639e719533fb04a7f/5c64e08639e7194f7ab04a99_Icon-calendar.png"></img>
                                </div>
                                <div className="intro-info-title">
                                8月3日
                                </div>
                                <div className="intro-info-title subtitle">
                                &nbsp;
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-4 col-lg-4 col-sm-5 countdown">
                            <div style={{color:'#fff'}} className="small timer"> 
                            {/* <CountDown deadline='03 August 2019 10:00:00'/> */}
                            <h5>Sri Lankan Festival Started..!!</h5>
                            </div>
                        </div>
                        
                    </div>
                    </Card>
                    


                    {/* <div className="home-intro-section">
                        <div className="container home-intro-container w-container">
                                <div className="home-intro-block w-clearfix">
                                    <div className="intro-row w-row">
                                        <div className="intro-column w-col w-col-6">
                                            <div className="intro-info-block">
                                                <div className="intro-icon-wrapper">
                                                <img src="https://uploads-ssl.webflow.com/5c64e08639e719533fb04a7f/5c64e08639e7192290b04a97_Icon-location.png"></img>
                                                </div>
                                                <div className="intro-info-title">
                                                Tokyo
                                                </div>
                                                <div className="intro-info-title subtitle">
                                                Shibuya
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div> */}
                    <div className="container w-container boxes">
                        {/* <div className="section-title-wrapper">
                            <h2 className="section-title">promo</h2>
                            <div className="section-divider"></div>
                            <h2 className="section-title subtitle">The best excitement of the year in Japan for all who love Sri Lankan style</h2>
                        </div> */}

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

                    

                    {/* <div className="section download-section">
                        <div className="div-block">
                            <h2 className="section-title small" style={{paddingTop:'10px'}}>downloads</h2>
                            <div className="section-divider"></div>
                            <p className="paragraph-2">Various form and documents can that are useful for exhibitors and other interested parties can be downloaded here.</p>
                            <a className="button w-button">Download Now</a>
                        </div>
                    </div> */}

                    <div className="section">
                        <div className="map-container">
                            <div className="section-title-wrapper centered">
                                <h2 className="section-title">フェスティバル地図</h2>
                                <div className="section-divider">
                                </div>
                                <div className="map-section">                                
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.3988647430415!2d139.69449231525846!3d35.667179580197654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188cb2be5a0789%3A0x3a59d87360bedcdd!2sYoyogi+Park+outdoor+stage!5e0!3m2!1sen!2slk!4v1564084406475!5m2!1sen!2slk" 
                                    width="100%" height="450" frameBorder="1" ></iframe>
                                </div>

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