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
    "restaurant":"Restaurant",
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
    orderValue:"Order Value",
    "timeStamp":"Time",
    "delivery.name":"Customer Name",
    "delivery.phone":"Phone Number",
    reject:"Reject",
    selectImage:"Select image",
    userName:"User Name",
    restaurantName:"Restaurant Name",
    Restaurant:"Restaurant",
    "Add Menu Item":"Add Menu Item",
    phone:"Phone",
    noOfSeats:"No Of Seats",
    dineInDate:"Dine In Date",
    dineInTime:"Dine In Time",
    changeOrderStatusNotifyUser:"Change Order Status & Notify User",
    changeDineInStatusNotifyUser:"Change DineIn Status & Notify User",
    completeOrder:"Complete Order",
    deliveryCharges:"Delivery Charges",
    total:"Total",
    pointsAvailable:"Points Available",
    pointsRedeem:"Points Redeem",
    amountPayable:"Amount Payable",
    "Add Restaurant":"Add Restaurant",
    description:"Description",
    descriptionJa:"Description in japanese",
    cancel:"Cancel",
    titleJa:"Title Japanese",
    description_ja:"Description Japanese",
    thisFieldIsRequired:"This field is required",
    menuItem:"Menu items",
    slNo:"SL No",
    orderDate:"Order date",
    name:"Name",
    loading:"Loading please wait...",
    notFound:"No items found",
    filterByRestaurant:"Filter by restaurant",
    tax_in_percentage:"Tax in %",
    confirmPassword:"Confirm password",
    email:"Email",
    password:"Password",
    submit:"Submit",
    register:"Register",
},
  'jp' : {
    register:"登録",
    submit:"参加する",
    email:"Eメール",
    password:"パスワード",
    confirmPassword:"パスワードを認証する",
    filterByRestaurant:"レストランでフィルタリング",
    dashboard:"レストランのトップページ",
    myRestaurant:"マイレストラン",
    menuItems:"メニュー",
    orders:"注文",
    reservations:"予約",
    account:"ユーザー名",
    logout:"ログアウト",
    restaurantCollection:"レストラン詳細",
    "Restaurant collection":"レストラン詳細",
    "Restaurant":"レストラン詳細",
    "restaurant":"レストラン詳細",
    "Add Menu Item":"メニュー項目の追加",
    addNewRestaurant:"新しいレストランの追加",
    "Add Restaurant":"新しいレストランの追加",
    approve:"承認",
    actions:"アクション",
    title:"レストラン名",
    titleJa:"タイトル日本語",
    "description":"説明",
    "cancel":"キャンセル",
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
    thisFieldIsRequired:"この項目は必須です",
    dineInDate:"デートで食事",
    dineInTime:"時間内に食事",
    changeOrderStatusNotifyUser:"注文ステータスの変更とユーザーへの通知",
    changeDineInStatusNotifyUser:"食事のステータスを変更し、ユーザーに通知します",
    completeOrder:"完全な注文",
    orderValue:"Order Value_ja",
    deliveryCharges:"Delivery Charges_ja",
    descriptionJa:"description_Ja",
    total:"Total_ja",
    pointsAvailable:"Points Available_ja",
    pointsRedeem:"Points Redeem_ja",
    amountPayable:"Amount Payable_ja",
    menuItem:"Menu items_ja",
    slNo:"slNo_ja",
    orderDate:"orderDate_ja",
    description_ja:"Description Japanese_ja",
    tax_in_percentage:"パーセンテージでの税金",
    name:"name_ja",
    loading:"読み込み中。。。待って下さい",
    notFound:"項目は見つかりませんでした",
    
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
   