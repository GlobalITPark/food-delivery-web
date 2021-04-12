const availableLangs = {
  'en' : {
    dashboard : "Dashboard",
    myRestaurant:"My Restaurant",
    menuItems :"Menu Items",
    orders:"Orders",
    reservations:"Reservations",
    account:"Account",
    logout:"Logout",
    restaurantCollection:"Restaurants",
    "restaurant":"Restaurants",
    addNewRestaurant:"Add New Restaurant",
    approve:"Approve",
    actions:"Actions",
    title:"Title",
    owner:"Owner",
    count:"Count",
    image:"Image",
    price:"Price",
    addNewMenuItem:"Add new menu item",
    orderID:"OrderID",
    "timeStamp":"Time",
    "delivery.name":"Customer Name",
    "delivery.phone":"Phone Number",
    reject:"Reject",
    selectImage:"Select image",
    userName:"User Name",
    restaurantName:"Restaurant Name",
    phone:"Phone",
    noOfSeats:"No Of Seats",
    dineInDate:"Dine In Date",
    dineInTime:"Dine In Time",
    changeOrderStatusNotifyUser:"Change Order Status & Notify User",
    completeOrder:"Complete Order",
},
  'jp' : {
    dashboard:"レストランのトップページ",
    myRestaurant:"マイレストラン",
    menuItems:"メニュー",
    orders:"注文",
    reservations:"予約",
    account:"ユーザー名",
    logout:"ログアウト",
    restaurantCollection:"レストラン詳細",
    "Restaurant collection":"レストラン詳細",
    "restaurant":"レストラン詳細",
    addNewRestaurant:"新しいレストランの追加",
    approve:"承認",
    actions:"アクション",
    title:"レストラン名",
    owner:"オーナー",
    count:"総数",
    image:"イメージ",
    price:"価格",
    addNewMenuItem:"メニューの追加",
    orderID:"オーダー番号",
    "timeStamp":"注文日時詳細",
    "delivery.name":"注文者名",
    "delivery.phone":"注文者　電話番号",
    reject:"リジェクト",
    selectImage:"画像を選択",
    userName:"ユーザー名",
    restaurantName:"レストラン名",
    phone:"電話",
    noOfSeats:"座席数",
    dineInDate:"デートで食事",
    dineInTime:"時間内に食事",
    changeOrderStatusNotifyUser:"注文ステータスの変更とユーザーへの通知",
    completeOrder:"完全な注文",
    
}
};

   //Sets the currently chosen locale 
   export const setDefaultLocale = ()=> {
    var selectedLocale = localStorage.getItem('selectedLocale');
    localStorage.setItem('selectedLocale', selectedLocale);

   }
   
   //Sets the currently chosen locale 
   export const setChosenLocale = (languageCode)=> {
    localStorage.setItem('selectedLocale', languageCode);

   }


   //gets the currently chosen locale 
   export const getLocale = ()=> {
    var selectedLocale = localStorage.getItem('selectedLocale');
    return selectedLocale ? selectedLocale : 'en';
   }
   
   //translate the given word
   export const translate = (word)=> {
     var currentLocale = getLocale()
     var translatedWord = word;
     if (currentLocale == 'en' && availableLangs.en[word] != undefined) {
       translatedWord = availableLangs.en[word]
     } else if (currentLocale == 'jp' && availableLangs.jp[word] != undefined) {
      translatedWord = availableLangs.jp[word]
    }
    return translatedWord;
   }
   