import * as firebase from 'firebase';
require("firebase/firestore");

var collectionMeta={
	"eventsconference":{
		"fields":{
			"item_special":"no",
			"collection_eventsconference":"",
			"description":"The speaker session long text",
			"image":"https://i.stack.imgur.com/l60Hf.png",
			"title":"Session title",
			"eventDateStartEndTime":"09:00 AM until 11:30 AM",
		},
		"collections":[],
	},
	"conferencetickets":{
		"fields":{
			"collection_eventsconference":"",
			"description":"Ticket information",
			"image":"https://cdn4.iconfinder.com/data/icons/computer-and-web-2/500/Calendar-512.png",
			"price":10,
			"title":"Your ticket name",
			"options":{
				"option1":{
					"name":"Workshop",
					"values":["Yes","No"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants"],
	},
	"eventsconference_collection":{
		"fields":{
			"title":"Day 1",
			"description":"Conference day 1",
			"image":"https://i.imgur.com/tcglVPv.jpg",
		},
		"collections":[],
	},
	"conference_venue":{
		"fields":{
			"locationName":"Location name",
			"collection_venue":"",
			"description":"Your venue description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"title":"Your venue title",
			"location":new firebase.firestore.GeoPoint(41.22, 22.34),
		},
		"collections":["photos"],
	},
	"variants":{
		"fields":{
			"option1":"Yes",
			"option2":"",
			"option3":"",
			"price":10,
			"title":"VIP"
		},
		"collections":[],
    },
	"TEMPLATE":{
		"fields":{},
		"collections":[],
	},
	"restaurant":{
		"fields":{
			"calories":100,
			"collection":"",
			"description":"Your product description",
			"image":"https://i.imgur.com/80vu1wL.jpg",
			"price":10,
			"title":"Your product title",
			"options":"",
			"shortDescription":"",
			"status":false,
		},
		"collections":["variants"],
	},
	"restaurant_collection":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/80vu1wL.jpg",
			"owner":"",
			"count":1,
			"active_status":0
		},
		"collections":[],
	},
	"variants":{
		"fields":{
			"option1":"Big",
			"option2":"",
			"option3":"",
			"price":10,
			"title":"Big portion"
		},
		"collections":[],
	},
	"TEMPLATE":{
		"fields":{},
		"collections":[],
	},
	"news":{
		"fields":{
			"collection_news":"",
			"description":"Your event description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"title":"Your event title",
			"date":"2018-01-01 18:00",
			"isNews":"no"
		},
		"collections":["photos"],
	},
	"news_collection":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/tcglVPv.jpg",
		},
		"collections":[],
	},
	"photos":{
		"fields":{
			"name":"Name of the photo",
			"photo":"https://i.imgur.com/svaHD6d.jpg"
		},
		"collections":[],
	},
	"variants":{
		"fields":{
			"option1":"Yes",
			"option2":"",
			"option3":"",
			"price":10,
			"title":"VIP"
		},
		"collections":[],
    },
	"TEMPLATE":{
		"fields":{},
		"collections":[],
	},	"eventsnc":{
		"fields":{
			"locationName":"Location name",
			"eventsnc_collection":"",
			"description":"Your event description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"price":10,
			"title":"Your event title",
			"eventDateStart":"2018-01-01 18:00",
			"eventDateEnd":"2018-01-01 22:00",
			"options":{
				"option1":{
					"name":"VIP",
					"values":["Yes","No"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants","photos"],
	},
	"eventsnc_collection":{
		"fields":{
			"title":"Your category title"
		},
		"collections":[],
	},
	"venue":{
		"fields":{
			"locationName":"Location name",
			"collection_venue":"",
			"description":"Your venue description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"title":"Your venue title",
			"location":new firebase.firestore.GeoPoint(41.22, 22.34),
		},
		"collections":["photos"],
	},
	"albums":{
		"fields":{
			"date":"2018-01-01 18:00",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"description":"",
			"title":""
		},
		"collections":["photos"],
	},
	"photos":{
		"fields":{
			"name":"Name of the photo",
			"photo":"https://i.imgur.com/svaHD6d.jpg"
		},
		"collections":[],
	},
	"variants":{
		"fields":{
			"option1":"Yes",
			"option2":"",
			"option3":"",
			"price":10,
			"title":"VIP"
		},
		"collections":[],
    },
	"TEMPLATE":{
		"fields":{},
		"collections":[],
	},
	"users":{
		"fields":{
			"email":"Enter Email",
			"fullname":"",
			"userRole":"Enter UserRole",
			"dateofbirth":"",
			"gender":"",
			"iscomplete":"0",
			"job":"",
			"nationality":"",
			"telephone":"",
		},
		"collections":[],
	}
}
module.exports = collectionMeta;
