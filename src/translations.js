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
    login:"Login",
    home:"Home",
    resetPassword:"Reset password",
    'forgotPassword?':"Forgot password?",
    'backToLogin':"Back to login",
    pendingOrders:"Pending orders",
    pendingDineIns:"Pending Dine-Ins",
    location:"Location",
    status:"Status",
    reservationDate:"Reservation date",
    confirmed:"Confirmed",
    just_created:"Just created",
    ready_to_pick:"Ready to pickup",
    picked_up:"Picked up",
    out_for_delivery:"Out for delivery",
    delivered:"delivered",
    cannot_deliver:"cannot_deliver",
},
  'jp' : {
    cannot_deliver:"届けることができません",
    delivered:"配信",
    out_for_delivery:"配達のために",
    picked_up:"拾った",
    ready_to_pick:"ピックアップする準備ができました",
    just_created:"作成したばかり",
    confirmed:"確認済み",
    reservationDate:"予約日",
    status:"状態",
    location:"ロケーション",
    pendingDineIns:"保留中の食事",
    pendingOrders:"保留中の注文",
    'backToLogin':"ログインに戻る",
    resetPassword:"パスワードを再設定する",
    'forgotPassword?':"パスワードをお忘れですか？",
    home:"ホーム",
    register:"登録",
    login:"ログイン",
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
    orderValue:"オーダー値",
    deliveryCharges:"配送料",
    descriptionJa:"説明",
    total:"合計",
    pointsAvailable:"利用可能なポイント",
    pointsRedeem:"交換ポイント",
    amountPayable:"支払い可能な金額",
    menuItem:"メニュー項目",
    slNo:"シリアルナンバー",
    orderDate:"注文日",
    description_ja:"日本語での説明",
    tax_in_percentage:"パーセンテージでの税金",
    name:"名前",
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
   