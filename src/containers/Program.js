import React, {Component} from 'react';
import Youtubeplayer from './Youtubeplayer'
class Program extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDayOne:true
        };

        this.changeDay = this.changeDay.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    changeDay(){
        this.setState({
            isDayOne:!this.state.isDayOne
        })
    }
    render(){
        return(
            <div className="wrapper wrapper-full-page">
                <div className="full-page landing-page">
                    <div className="content">
                        <div style={{paddingBottom: '50px'}} className="section intro-section">
                            <div className="container-fluid program-banner"></div>
                            <div className="container w-container">
                                <div className="section-title-wrapper intro">
                                    <h2 className="section-title">プログラム</h2>
                                    <div className="section-divider"></div>
                                    <div className="section-title subtitle">
                                        スリランカスタイルを愛するすべての人に一番の興奮を！
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container w-container">
                            <div className="program-tabs w-tabs">
                                <div className="program-tabs-menu w-tab-menu">
                                    <a style={{backgroundColor:this.state.isDayOne?"#34c48b":""}} onClick={this.changeDay} className="program-tab-button w-inline-block w-tab-link w--current">
                                        <div className="tab-button-title"></div>
                                        <div className="tab-button-title subtitle">8/ 3 ( 土 )</div>
                                    </a>
                                    <a style={{backgroundColor:this.state.isDayOne?"":"#34c48b"}} onClick={this.changeDay} className="program-tab-button w-inline-block w-tab-link">
                                        <div className="tab-button-title"></div>
                                        <div className="tab-button-title subtitle">8/ 4 ( 日 )</div>
                                    </a>
                                </div>
                                <div className="program-tabs-content w-tab-content">
                                    <div className="program-tab-pane w-tab-pane w--tab-active">
                                        {this.state.isDayOne===true?
                                            <ul className="program-list w-list-unstyled">
                                                <li className="program-list-item">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">10:00~</div>
                                                    </div>
                                                    <a className="link program-link">オープニングセレモニー</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                                <li className="program-list-item">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">13:00~</div>
                                                    </div>
                                                    <a className="link program-link">カレーのデモストレーション</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                                <li className="program-list-item">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">14:00~</div>
                                                    </div>
                                                    <a className="link program-link">セイロンティーのデモストレーション </a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                                <li className="program-list-item last">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">15:00~</div>
                                                    </div>
                                                    <a className="link program-link">アーユルヴェーダのデモストレーション</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                            </ul>
                                            :
                                            <ul className="program-list w-list-unstyled">
                                                <li className="program-list-item">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">11:00~</div>
                                                    </div>
                                                    <a className="link program-link">アーユルヴェーダのデモストレーション</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                                <li className="program-list-item">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">12:00~</div>
                                                    </div>
                                                    <a className="link program-link">カレーのデモストレーション</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                                <li className="program-list-item">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">14:00~</div>
                                                    </div>
                                                    <a className="link program-link">セイロンティーのデモストレーション</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                                <li className="program-list-item last">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">15:00~</div>
                                                    </div>
                                                    <a className="link program-link">ウィッキーさんのトークショー</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                                <li className="program-list-item last">
                                                    <div className="program-time-block">
                                                        <div className="program-time-title">16:45~</div>
                                                    </div>
                                                    <a className="link program-link">大抽選会</a>
                                                    <div className="program-info-title">&nbsp;</div>
                                                </li>
                                            </ul>
                                            }
                                        
                                    </div>
                                </div>
                            </div>
                            <p className="link program-link">スケジュールは都合により変更する場合があります。</p>
                            <p className="link program-link">上記以外の時間はスリランカ民族舞踊の披露、及びスポンサーや出展各社の紹介を行います。</p>
                        </div>

                        <div style={{marginBottom:'20px'}} className="container w-container card-wrap">
                            <Youtubeplayer videoId='XAO-yK9qpxw'/>
                        </div>
                    
                    </div>
                
                </div>
            </div>
        )
    }
}

export default Program;