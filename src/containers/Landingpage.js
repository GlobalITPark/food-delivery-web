import React, { Component } from "react";
import { Card } from "react-mdl";
import CountDown from "reactjs-countdown";
import { getLocale } from "../translations";
import Newsfeed from "./Newsfeed";
import Promo from "./Promo";

// Random component
const Completionist = () => <span>Festival started..!!</span>;

class Landingpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      chosenLocale: getLocale(),
    };
  }


  get getEnglishLandingPageContent(){
      return <div>
        <h5>Who We Are</h5>
        <p>
          Tabetai is a food delivery platform that is powered by Adam-I
          which connects the very best restaurants and stores to people.
          We are currently in Minamiuonuma city and its environs, where
          we allow merchants and people (customers) alike to experience
          a new world of possibilities from merchants reaching more
          groups of audience and understanding their customers better to
          people (users) having more options of unique cuisines being
          delivered to their doorstep while address the possible
          challenge of communication.
        </p>
        <p>
          Tabetai features carefully selected meals, drinks, cake and
          sweets which will arouse your appetite, fresh groceries and
          the very best cutting of meat to customer’s desire. The app
          offers free delivery service of above Y2,000 to your doorstep,
          booking option for dine-in and pick-up of order from
          restaurants and stores. What more? Locating our listed
          merchants with our inbuilt GPS location finder, tracking
          progress of order and payment which allows the option of cash
          on delivery or cash on pick up. In addition, users can rate
          services based on merchant performance and communicate with
          our bilingual customer care personal.
        </p>
        <h5>Try The App</h5>
        <p>If you are yet to download our app, click below</p>
        <div className="row">
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-12">
                <a
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.adami.tabetai"
                >
                  <img
                    alt="Tabetai"
                    src="/assets/img/playstore_link_qr_code.png"
                  ></img>
                </a>
              </div>
              <div className="col-md-12">
                {this.state.chosenLocale === "en" ? (
                  <a
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.adami.tabetai&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                  >
                    <img
                      style={{ width: "200px", height: "75px" }}
                      alt="Get it on Google Play"
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    />
                  </a>
                ) : (
                  <a
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.adami.tabetai&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                  >
                    <img
                      style={{ width: "200px", height: "75px" }}
                      alt="Get it on Google Play"
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/ja_badge_web_generic.png"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="row">
              <div className="col-md-12">
                <a
                  target="_blank"
                  href="https://apps.apple.com/in/app/tabetai/id1562102113"
                >
                  <img
                    alt="Tabetai"
                    src="/assets/img/appstore_link_qr_code.png"
                  ></img>
                </a>
              </div>
              <div className="col-md-12">
                {this.state.chosenLocale === "en" ? (
                  <a
                    target="_blank"
                    href="https://apps.apple.com/in/app/tabetai/id1562102113"
                  >
                    <img
                      style={{ width: "200px", height: "60px" }}
                      alt="Get it on App Store"
                      src="/assets/img/download_from_appstore_en.svg"
                    />
                  </a>
                ) : (
                  <a
                    target="_blank"
                    href="https://apps.apple.com/in/app/tabetai/id1562102113"
                  >
                    <img
                      style={{ width: "200px", height: "60px" }}
                      alt="Get it on App Store"
                      src="/assets/img/download_from_appstore_jp.svg"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <ul>
              <li>1)Select your preferred language</li>
              <li>
                2)Sign up using your Gmail account details or your
                Facebook detail. Or Register your username, email and
                password. Simple and fast!
              </li>
              <strong>For your delivery</strong>
              <li>
                1) Browse meals and products from listed categories of
                cuisine (i.e., Japanese, Chinese, Italian etc.). Also,
                sort based on rating, budget, opening hours, delivery
                time, delivery fee, minimum order amount, vouchers
                acceptance.
              </li>

              <li>
                2) Make your order based on selected restaurant/store
                from their menu to your basket and check out
              </li>

              <strong>- For Delivery</strong>
              <li>
                3) Enter your delivery address and payment will be cash
                on delivery.
              </li>
              <li>4) Track your order</li>
              <li>5) Rate and review the entire experience.</li>

              <p>
                No time to wait? Fast track your experience by cutting
                short your waiting time at your favorite restaurant or
                store. Booking for a pick-up option, you could also book
                your favorite seating spot and car pack space.
              </p>

              <li>
                - For Pick Up Order (fill in desired pick you time and
                date) cash on pick up.
              </li>
              <li>- For the Booking</li>
              <li>1)Selected your favorite restaurant, </li>
              <li>
                2)Fill in expected time and date of eat-in, number of
                guests and desired seating spot.
              </li>
              <li>3)Wait for confirmation and you are good to go</li>
            </ul>
            <h5>Current locations</h5>
            <p>
              Minamiuonuma city and environs which is located in Niigata
              prefecture; Japan. We will be in your city soon.
            </p>

            <h5>List of Merchants</h5>
            <p>
              Tabetai got you covered with its wide range of restaurants
              and stores near and around the city. More merchants are
              coming on board with in addition to the list below
            </p>
            <ul>
              <li>Hotel Okabe Urasa</li>
              <li>Meat Buffalo</li>
              <li>Family Dining Kodomaya</li>
              <li>Yamachiku Shop</li>
              <li>La Grassa Italian</li>
              <li>Kansendo Patisserie</li>
            </ul>

            <h5>Become a Merchant </h5>
            <p>
              Tabetai will revolutionize your business, it opens your
              restaurant and store to a new world of experience by
              taking your business directly to the palm of your
              customers and the entire city in a unique way. To be a
              merchant complete this{" "}
              <a href="/register-vendor">
                <strong>form</strong>
              </a>{" "}
              or contact us
            </p>
            <p>
              Tabatai has a strong Facebook community where you get to
              learn more on how to optimally utilize the app and also
              interact with other stakeholders. To join the Facebook
              community click{" "}
              <a
                target="_blank"
                href="https://www.facebook.com/tabetaiminamiuonuma"
              >
                <strong>here</strong>
              </a>
            </p>
          </div>
        </div>
      </div>
  }
  
  get getJapanLandingPageContent(){
      return <div>
        <h5>Who We Are 私たちについて</h5>
        <p>
        Tabetai is a food delivery platform that is powered by Adam-I which connects the 
        </p>
        <p>「食べたい」はアダムイノベーションが開発した食品デリバリーの為のアプリです。「食べたい」では南魚沼市及びその周辺のベストレストランと食品店をカバーしております。このアプリを使うことによって消費者と食品提供者の新しい連携の仕方をご提案できます。</p>
        <p>Very best restaurants and stores to people. We are currently in Minamiuonuma city and its environs, where we allow merchants and people (customers) alike to experience a new world of possibilities from merchants reaching more groups of audience and understanding their customers better to people (users) having more options of unique cuisines being delivered to their doorstep while address the possible challenge of communication.</p>
        <p>Tabetai features carefully selected meals, drinks, cake and sweets which will arouse </p>
        <p>「食べたい」は皆様のお好みにあった食事　飲み物　ケーキやスイーツ　フレッシュな食材、カットされた肉類などをご提供します。 </p>
        <p>your appetite, fresh groceries and the very best cutting of meat to customer’s desire. The app offers free delivery service of above Y2,000 to your doorstep, booking option for dine-in and pick-up of order from restaurants and stores. </p>
        <p>このアプリでは２０００円以上のご注文は無料配達いたします。</p>
        <p>What more? Locating our listed merchants with our inbuilt GPS location finder, tracking progress of order and payment which allows the option of cash on delivery or cash on pick up.</p>
        <p>GPS機能を使い注文品の追跡が可能です。支払いは配達時に現金支払いができす。</p>
        <p>In addition, users can rate services based on merchant performance and communicate with our bilingual customer care personal. To experience all this and many more why not try out Tabetai 
            app by clicking here <a href="https://play.google.com/store/apps/details?id=com.adami.tabetai">Android</a>  <a href="https://apps.apple.com/in/app/tabetai/id1562102113">IOS</a></p>
        <p>加えてユーザーはアプリの使い心地を評価することができます。ここ をクリックして下さい。</p>
                
        
        <h5>Try The App ぜひこのアプリをお試しください</h5>
        <p>If you are yet to download our app, click below</p>
        <p>まだダウンロードされていない方はぜひここからダウンロードしてください</p>
        <div className="row">
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-12">
                <a
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.adami.tabetai"
                >
                  <img
                    alt="Tabetai"
                    src="/assets/img/playstore_link_qr_code.png"
                  ></img>
                </a>
              </div>
              <div className="col-md-12">
                {this.state.chosenLocale === "en" ? (
                  <a
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.adami.tabetai&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                  >
                    <img
                      style={{ width: "200px", height: "75px" }}
                      alt="Get it on Google Play"
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    />
                  </a>
                ) : (
                  <a
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.adami.tabetai&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                  >
                    <img
                      style={{ width: "200px", height: "75px" }}
                      alt="Get it on Google Play"
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/ja_badge_web_generic.png"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="row">
              <div className="col-md-12">
                <a
                  target="_blank"
                  href="https://apps.apple.com/in/app/tabetai/id1562102113"
                >
                  <img
                    alt="Tabetai"
                    src="/assets/img/appstore_link_qr_code.png"
                  ></img>
                </a>
              </div>
              <div className="col-md-12">
                {this.state.chosenLocale === "en" ? (
                  <a
                    target="_blank"
                    href="https://apps.apple.com/in/app/tabetai/id1562102113"
                  >
                    <img
                      style={{ width: "200px", height: "60px" }}
                      alt="Get it on App Store"
                      src="/assets/img/download_from_appstore_en.svg"
                    />
                  </a>
                ) : (
                  <a
                    target="_blank"
                    href="https://apps.apple.com/in/app/tabetai/id1562102113"
                  >
                    <img
                      style={{ width: "200px", height: "60px" }}
                      alt="Get it on App Store"
                      src="/assets/img/download_from_appstore_jp.svg"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <ul>
              <li>1)Select your preferred language お好きな言語を選んでください。英語　もしくは日本語</li>
              <li>
                2)Sign up using your Gmail account details or your Facebook detail. Or Register your username, email and password. Simple and fast!
              </li>
              <strong>For your delivery</strong><p>初めての方はまずご自身のユーザー登録をお願いします。　ご自身のグーグルアカウント、フェースブックアカウント、もしくは他の　e-mail アカウントをご使用ください。初めにユーザー名を登録し、e-mail パスワードの順に入力します。</p>
              <li>
                1)Browse meals and products from listed categories of cuisine (i.e., Japanese, Chinese, Italian etc.). 
リストアップされたカテゴリーの中からお好きな料理や食品をお選びください。例）和食、中華、イタリアン　等など　Also, sort based on rating, budget, opening hours, delivery time, delivery fee, minimum order amount, vouchers acceptance. またそれぞれ予算別、営業時間、配達時間帯、配達料無料、最小注文量、クーポンの取り扱い有無　などに分けてソートすることが可能です。
</li>

              <li>
                2) Make your order based on selected restaurant/store from their menu to your basket and check out
選択された　レストランや食品店ごとに　オーダーをカゴに入れて下さい。</li>

              <strong>- For Delivery 配達について</strong>
              <li>
                3) Enter your delivery address and payment will be cash on delivery.
配達先の住所を入力してください。お支払いは配達時に現金でお願いします。
              </li>
              <li>4) Track your order 注文番号によって配達状況をチェックできます。</li>
              <li>5) Rate and review the entire experience. 
終わりましたらレビューや評価を入力お願いします。</li>
</ul>

              <p>No time to wait? さあやってみましょう</p>

              <p>Fast track your experience by cutting short your waiting time at your favorite restaurant or store. まずはぜひお試しください。</p>
              <p>Booking for a pick-up option, you could also book your favorite seating spot and car pack space.店頭受け取りも選択することができます。</p>
              <p>- For Pick Up Order (fill in desired pick you time and date) cash on pick up.
ご自分のお好きな受け取り時間を選択してください。</p>
              <ul>
              <li>- For the Booking レストランの座席予約。</li>
              <li>1)Selected your favorite restaurant, まずお好きなレストランをお選びください。</li>
              <li>2)Fill in the expected time and date of eat-in, number of guests and desired seating spot. 
ご来店されたい日にち、時間、人数、特にご指定の席があればお知らせください。</li>
              <li>3)Wait for confirmation and you are good to go
確認のメールをお待ちください。
折り返し確認メールが届けば予約完了です。</li>
            </ul>
            <h5>Current locations 現在サービス中の地域</h5>
            <p>Minamiuonuma city and environs which is located in Niigata prefecture; Japan. We will be in your city soon. 新潟県南魚沼市とその周辺地域　、私たちはもうすぐあなたの街にもエリアを拡大していきます。</p>

            <h5>List of Merchants 現在サービス中のレストラン　食品店</h5>
            <p>Tabetai got you covered with its wide range of restaurants and stores near and around the city. More merchants are coming on board with in addition to the list below 「食べたい」ではさらにもっと多くのレストラン　食品店などご提供する予定でおります。どうぞお楽しみに</p>
            <ul>
              <li>Hotel Okabe Urasa ホテル　オカベ浦佐</li>
              <li>Meat Buffalo 焼肉バッファロー</li>
              <li>Family Dining Kodomaya ファミリーダイニング　小玉屋</li>
              <li>Yamachiku Shop やまちく　ショップ</li>
              <li>La Grassa Italian ラ　グラーサ（イタリアン）</li>
              <li>Kansendo Patisserie 甘泉堂　パティスリー</li>
            </ul>

            <h5>Become a Merchant  加盟店登録するには</h5>
            <p>Tabetai will revolutionize your business, it opens your restaurant and store to a new world of experience by taking your business directly to the palm of your customers and the entire city in a unique way. 「食べたい」では現在加盟店を募集しております。きっと今までとは違うビジネス展開、ユニークな方法で直接お客様と触れ合える機会を増やしていただけることと思います。ぜひこの機会にご検討ください。
                 To be a
              merchant complete this{" "}
              <a href="/register-vendor">
                <strong>form</strong>
              </a>{" "}
              or contact us. 加盟店になるには以下のフォームにご記入ください。
            </p>
            <h5>Become a Delivery Agent</h5>
            <p>Complete this {" "}
              <a href="/register-vendor">
                <strong>form</strong>
              </a>{" "} or contact us.</p>
            <h5>Contact Us 連絡先メール</h5>
            <p>Email: <a href="mailto:info@adam-i.jp">info@adam-i.jp</a></p>
            <p>Tel: <a href="tel:025-788-0665">Tel: +081 (Bilingual)電話</a></p>
            <h5>Follow Us フェースブックでフォローお願いします</h5>
            <p>
            Tabatai has a strong Facebook community where you get to learn more on how to optimally utilize the app and also interact with other stakeholders. To join the Facebook community click{" "}
              <a
                target="_blank"
                href="https://www.facebook.com/tabetaiminamiuonuma"
              >
                <strong>here</strong>
              </a>
            </p>
            <p>「食べたい」はフェースブックコミュニティーの一員です。
フェースブックをご覧ください。</p>
          </div>
        </div>
      </div>
  }

  render() {
    return (
      <div className="wrapper wrapper-full-page">
        <div className="full-page landing-page">
          <div className="content">
            <div className="tempContent container w-container boxes">
              {(this.state.chosenLocale == 'en') ? 
              this.getEnglishLandingPageContent
              : this.getJapanLandingPageContent
              }
            </div>

            {/* old content may need to bring back later */}
            {/* <div style={{left:"-5px"}} id="myCarousel" className="carousel slide" data-interval="5000" data-ride="carousel">

                    
                        <div className="carousel-inner">
                            <div className="item active">
                            <img style={{width:'100%',height:'480px',objectFit:'cover',opacity:'0.6'}} src="/assets/img/sushi.jpg" alt="Los Angeles"></img>
                            </div>
                        </div>
                    </div> */}

            {/* <div className="container w-container boxes">
                        <Promo/>
                    </div> */}

            {/* <div className="container news-section">
                        <div className="section-title-wrapper">
                            <h2 className="section-title">ニュースフィード</h2>
                            <div className="section-divider"></div>
                            <h2 className="section-title subtitle">スリランカのスタイルを愛するすべての人にとって日本で一番の興奮</h2>
                        </div>
                        <Newsfeed/>
                    </div>   */}
          </div>
        </div>
      </div>
    );
  }
}

export default Landingpage;
