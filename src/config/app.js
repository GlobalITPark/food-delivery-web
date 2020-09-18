//FireBase
exports.firebaseConfig = {
  // apiKey: "AIzaSyD1gtlnQjr6hWADJff4GNrXkcLkgy_qZyM",
  // authDomain: "slfa-a3e75.firebaseapp.com",
  // databaseURL: "https://slfa-a3e75.firebaseio.com",
  // projectId: "slfa-a3e75",
  // storageBucket: "slfa-a3e75.appspot.com",
  // messagingSenderId: "227958172265"

  apiKey: "AIzaSyDJgz_KuGwUZcpUuqtQXYAd93FVgJPG5ZE",
  authDomain: "test01-27e99.firebaseapp.com",
  databaseURL: "https://test01-27e99.firebaseio.com",
  projectId: "test01-27e99",
  storageBucket: "test01-27e99.appspot.com",
  messagingSenderId: "282070567796"


};



//App setup
exports.adminConfig={
"appName": "Conference Admin",
"slogan":"made with love for a better firebase.",

"design":{
  "sidebarBg":"sidebar-1.jpg", //sidebar-1, sidebar-2, sidebar-3
  "dataActiveColor":"rose", //"purple | blue | green | orange | red | rose"
  "dataBackgroundColor":"black", // "white | black"
},

"showItemIDs":false,
"showSearchInTables":true,
"allowedUsers":["2011chava@gmail.com","angathan@aziot.jp","kobi@k1.com","vendor@aziot.jp","admin@aziot.jp"], //If null, allow all users, else it should be array of allowd users
"allowRegistration":["2011chava@gmail.com","angathan@aziot.jp","kobi@k1.com","admin@aziot.jp"],
"allowGoogleAuth":true,
"fieldBoxName": "Fields",
"maxNumberOfTableHeaders":5,
"prefixForJoin":['-L0'],
"methodOfInsertingNewObjects":"push", //timestamp (key+time) | push - use firebase keys
"urlSeparator":"+",
"urlSeparatorFirestoreSubArray":"~",
"googleMapsAPIKey":"AIzaSyDc5wWlcOHydNkbCG1lWTExxliRPhNWR48",
// "previewOnlyKeys":["owner"],

"fieldsTypes":{
  "photo":["photo","image","category_image"],
  "dateTime":["datetime","start","eventDateStart","eventDateEnd","date"],
  "date":["datefield","created"],
  "time":["time"],
  "map":["map","latlng","location","eventLocation"],
  "textarea":["description"],
  "html":["content"],
  "radio":["radio","radiotf","featured","isShopping","showPhotos","layout","coloring","outbound","rounded","sectionType","showNavButton"],
  "checkbox":["checkbox"],
  "dropdowns":["type","status","dropdowns","navButtonAction"],
  "file":["videoField"],
  "rgbaColor":['rgba'],
  "hexColor":['*Color',"buttonText"],
  "relation":['creator','collection','collection_recipe','eventsnc_collection'],
  "iconmd":['icon',"*Icon"],
  "iconfa":['iconfa'],
  "iconti":['iconti'],
  
},
"optionsForSelect":[
    {"key":"dropdowns","options":["new","processing","rejected","completed"]},
    {"key":"checkbox","options":["Skopje","Belgrade","New York"]},
    {"key":"type","options":["Bug fix","Feature","Improuvment","deleted","added","updated"]},
    {"key":"status","options":["order_received","order_confirmed","ready_to_pick","picked_up","order_canceled"]},
    {"key":"radio","options":["no","maybe","yes"]},
    {"key":"radiotf","options":["true","false"]},
    {"key":"featured","options":["true","false"]},
    {"key":"isShopping","options":["true","false"]},
    {"key":"rounded","options":["true","false"]},
    {"key":"outbound","options":["true","false"]},
    {"key":"layout","options":["side","tabs"]},
    {"key":"coloring","options":["simple","advanced"]},
    {"key":"showPhotos","options":["true","false"]},
    {"key":"showNavButton","options":["true","false"]},
    {"key":"navButtonAction","options":["add-to-favorites"]},
    {"key":"sectionType","options":["master-detail","cart","orders","wish-list"]},
],
"optionsForRelation":[
  {
    //Firestore - Native
    "display": "name",
    "isValuePath": true,
    "key": "creator",
    "path": "/users",
    "produceRelationKey": false,
    "relationJoiner": "-",
    "relationKey": "type_eventid",
    "value": "name"
  },
  {
    //Firestore - Native
    "display": "title",
    "isValuePath": true,
    "key": "collection",
    "path": "/restaurant_collection",
    "produceRelationKey": false,
    "relationJoiner": "-",
    "relationKey": "type_eventid",
    "value": "name"
  },
    {
      //Firestore - Native
      "display": "title",
      "isValuePath": true,
      "key": "collection_restaurant",
      "path": "/restaurant_collection",
      "produceRelationKey": true,
      "relationJoiner": "-",
      "relationKey": "restaurant_collection",
      "value": "name"
    },
    {
      //Firestore - Native
      "display": "title",
      "isValuePath": true,
      "key": "collection_news",
      "path": "/news_collection",
      "produceRelationKey": false,
      "relationJoiner": "-",
      "relationKey": "news_collection",
      "value": "name"
    }
],
"paging":{
  "pageSize": 20,
  "finite": true,
  "retainLastPage": false
}
}

//Navigation
exports.navigation=[
  {
    "link": "/",
    "name": "Dashboard",
    "schema":null,
    "icon":"home",
    "path": "",
     isIndex:true,
  },
  {
    "link": "firestoreadmin",
    "path": "users",
    "name": "Manage users",
    "icon": "perm_identity",
    "tableFields":["username","email","userRole"],
  },
  {
    "link": "firestoreadmin",
    "path": "qrcode_collection",
    "name": "Manage QR Code",
    "icon": "perm_identity",
    "tableFields":["qr_code","user","status"],
  },
  // {
  //   "link": "raffle",
  //   "path": "",
  //   "name": "Raffle",
  //   "icon":"loyalty",
  //   "tableFields":[],
  // },
  {
    "link": "firestoreadmin",
    "path": "conference_venue",
    "name": "Map",
    "icon":"location_city",
    "tableFields":["title","locationName"],
  },
  //Kobi
  // {
  //   "link": "firestoreadmin",
  //   "path": "eventsnc",
  //   "name": "Events",
  //   "icon":"list",
  //   "tableFields":["title","image","price"],
  // },
  // {
  //   "link": "firestoreadmin",
  //   "path": "eventsnc_collection",
  //   "name": "Categories",
  //   "icon":"layers",
  //   "tableFields":[],
  // },
  {
    "link": "firestoreadmin",
    "path": "news",
    "name": "News",
    "icon":"list",
    "tableFields":["title","image",],
  },
  
  //kobi
  // {
  //   "link": "firestoreadmin",
  //   "path": "news_collection",
  //   "name": "Categories",
  //   "icon":"layers",
  //   "tableFields":[],
  // },
  
  //kobi
  // {
  //   "link": "firestoreadmin",
  //   "path": "events",
  //   "name": "Events",
  //   "icon":"shopping_cart",
  //   "tableFields":["status","total"],
  //   "subMenus":[
  //     {
  //       "link": "fireadmin",
  //       "path": "events/sofia/items",
  //       "name": "Sofia",
  //       "icon":"brush",
  //       "tableFields":["name","description"]
  //     },{
  //       "link": "fireadmin",
  //       "path": "events/skopje/items",
  //       "name": "Skopje",
  //       "icon":"menu",
  //       "tableFields":["name","description"],
  //     },
  //     {
  //       "link": "fireadmin",
  //       "path": "events/belgrade/items",
  //       "name": "Belgrade",
  //       "icon":"menu",
  //       "tableFields":["name","description"],
  //     }
  //   ]
  // },
  {
    "link": "firestoreadmin",
    "path": "ticket_collection",
    "name": "Tickets",
    "icon":"list",
    "tableFields":["tickNo","user"],
  },
  {
    "link": "firestoreadmin",
    "path": "orders",
    "name": "Orders",
    "icon":"shopping_cart",
    "tableFields":["status","total"],
  },

  
  {
    "link": "firestoreadmin",
    "path": "restaurant",
    "name": "Menu items",
    "icon":"local_dining",
    "tableFields":["title","price"],
  },
  {
    "link": "firestoreadmin",
    "path": "restaurant_collection",
    "name": "Restaurants",
    "icon":"layers",
    "tableFields":["title","owner","count"],
  },
  {
    "link": "firestoreadmin",
    "path": "eventsconference",
    "name": "Ceylon one Events",
    "icon":"list",
    "tableFields":["title","image","price"],
  },
  {
    "link": "firestoreadmin",
    "path": "eventsconference_collection",
    "name": "ev-days",
    "icon":"layers",
    "tableFields":[],
  },
  // {
  //   "link": "fireadmin",
  //   "path": "static/cities",
  //   "name": "Venue",
  //   "icon":"location_city",
  //   "tableFields":[],
  // },
  {
    "link": "fireadmin",
    "path": "conference",
    "name": "App setup",
    "icon":"settings_applications",
    "tableFields":["name","description"],
    "subMenus":[
      {
        "link": "fireadmin",
        "path": "meta/config",
        "name": "Design",
        "icon":"brush",
        "tableFields":["name","description"]
      },
      {
        "link": "fireadmin",
        "path": "meta/design",
        "name": "Design",
        "icon":"brush",
        "tableFields":["name","description"]
      },{
        "link": "fireadmin",
        "path": "meta/navigation",
        "name": "Navigation",
        "icon":"menu",
        "tableFields":["name","description"],
      }
    ]
  },{
    "link": "push",
    "path": "",
    "name": "Push notification",
    "icon":"speaker_notes",
    "tableFields":[],
  }
];

//Navigation
exports.vendorNavigation=[
  {
    "link": "/",
    "name": "Dashboard",
    "schema":null,
    "icon":"home",
    "path": "",
     isIndex:true,
  },
  // {
  //   "link": "firestoreadmin",
  //   "path": "conference_venue",
  //   "name": "Venue",
  //   "icon":"location_city",
  //   "tableFields":[],
  // },
  // {
  //   "link": "firestoreadmin",
  //   "path": "eventsnc",
  //   "name": "Events",
  //   "icon":"list",
  //   "tableFields":["title","image","price"],
  // },
  // {
  //   "link": "firestoreadmin",
  //   "path": "eventsnc_collection",
  //   "name": "Categories",
  //   "icon":"layers",
  //   "tableFields":[],
  // },
  // {
  //   "link": "firestoreadmin",
  //   "path": "news",
  //   "name": "News",
  //   "icon":"list",
  //   "tableFields":["title","image",],
  // },
  // {
  //   "link": "firestoreadmin",
  //   "path": "news_collection",
  //   "name": "Categories",
  //   "icon":"layers",
  //   "tableFields":[],
  // },
  // {
  //   "link": "fireadmin",
  //   "path": "userdata/{useruuid}",
  //   "name": "My Profile",
  //   "icon": "perm_identity",
  //   "tableFields":[],
  // },
  // {
  //   "link": "firestoreadmin",
  //   "path": "events",
  //   "name": "Events",
  //   "icon":"shopping_cart",
  //   "tableFields":["status","total"],
  //   "subMenus":[
  //     {
  //       "link": "fireadmin",
  //       "path": "events/sofia/items",
  //       "name": "Sofia",
  //       "icon":"brush",
  //       "tableFields":["name","description"]
  //     },{
  //       "link": "fireadmin",
  //       "path": "events/skopje/items",
  //       "name": "Skopje",
  //       "icon":"menu",
  //       "tableFields":["name","description"],
  //     },
  //     {
  //       "link": "fireadmin",
  //       "path": "events/belgrade/items",
  //       "name": "Belgrade",
  //       "icon":"menu",
  //       "tableFields":["name","description"],
  //     }
  //   ]
  // },
  // {
  //   "link": "firestorevendor",
  //   "path": "clubs",
  //   "name": "Tickets",
  //   "icon":"list",
  //   "tableFields":["title","image","price"],
  // },
  // {
  //   "link": "fireadmin",
  //   "path": "bookings",
  //   "name": "Booking",
  //   "icon":"list",
  //   "tableFields":["title","image","price"],
  // },

  {
    "link": "firestorevendor",
    "path": "restaurant_collection",
    "name": "My Restaurant",
    "icon":"layers",
    "tableFields":["title","owner","count"],
  },
  {
    "link": "firestorevendor",
    "path": "restaurant",
    "name": "Menu items",
    "icon":"local_dining",
    "tableFields":["title","image","price"],
  }, 
  {
    "link": "firestorevendor",
    "path": "orders",
    "name": "Orders",
    "icon":"shopping_cart",
    "tableFields":["orderID","userID","status","total"],
  },
  // {
  //   "link": "firestoreadmin",
  //   "path": "eventsconference",
  //   "name": "Speakers",
  //   "icon":"list",
  //   "tableFields":["title","image","price"],
  // },
  // {
  //   "link": "firestoreadmin",
  //   "path": "eventsconference_collection",
  //   "name": "ev-Conference days",
  //   "icon":"layers",
  //   "tableFields":[],
  // },
  // {
  //   "link": "fireadmin",
  //   "path": "static/cities",
  //   "name": "Venue",
  //   "icon":"location_city",
  //   "tableFields":[],
  // },
  // {
  //   "link": "fireadmin",
  //   "path": "conference",
  //   "name": "App setup",
  //   "icon":"settings_applications",
  //   "tableFields":["name","description"],
  //   "subMenus":[
  //     {
  //       "link": "fireadmin",
  //       "path": "ticketScenner/config",
  //       "name": "Design",
  //       "icon":"brush",
  //       "tableFields":["name","description"]
  //     },
  //     {
  //       "link": "fireadmin",
  //       "path": "ticketScenner/design",
  //       "name": "Design",
  //       "icon":"brush",
  //       "tableFields":["name","description"]
  //     },{
  //       "link": "fireadmin",
  //       "path": "users/navigation",
  //       "name": "Navigation",
  //       "icon":"menu",
  //       "tableFields":["name","description"],
  //     }
  //   ]
  // },
  {
    "link": "gift",
    "path": "",
    "name": "Gifts",
    "icon":"card_giftcard",
    "tableFields":[],
  },
  {
    "link": "push",
    "path": "",
    "name": "Push notification",
    "icon":"speaker_notes",
    "tableFields":[],
  }
];

exports.pushSettings={
"pushType":"expo", //firebase -  onesignal - expo
"Firebase_AuthorizationPushKey":"AIzaSyCFUf7fspu61J9YsWE-2A-vI9of1ihtSiE", //Firebase push authorization ket
"pushTopic":"news", //Only for firebase push
"oneSignal_REST_API_KEY":"",
"oneSignal_APP_KEY":"",
"included_segments":"Active Users", //Only for onesignal push
"firebasePathToTokens":"/expoPushTokens", //we save expo push tokens in firebase db
"saveNotificationInFireStore":true, //Should we store the notification in firestore
}

exports.userDetails={

}
