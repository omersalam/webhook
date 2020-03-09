"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();
const https = require('https')

restService.use( bodyParser.urlencoded ({extended : false} ) ) ;
restService.use( bodyParser.json ( ) ) ;

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());

// restService.post ('/weather' ,  function  ( req ,  res )  {
//   // We extract the city parameter, which is within the request (webhook) of the agent
//   var  city  =  req.body.queryResult.parameters.City ;
//   var  codeCity  =  0 ;
//   var  urlCodigoCiudad  = 'http://api.openweathermap.org/data/2.5/weather?q= '+ city + '&units=imperial&appid=6628ad3fd90a97fb39ff9793c7569874' ;
//   console.log( 'Climate query for'  +  city ) ;

//   // JSON type variable to save the response to be sent to the agent
//   var  resClima  =  {
//     fulfillmentText : ''
//   } ;

//   // We make the query to find the city by name
//   request ( urlCodeCity ,  {  json : true  } ,  ( err ,  resp ,  body )  =>  {    
//     // If there is an error processing the city search request
//     if ( err ) { 
//       console . log ( 'Error searching city' ) ;
//       console . log ( err ) ;
//       resClima.fulfillmentText  =  'It was not possible to check your city at this time' ;
//     }
//     else { 
//       // The content of the response to our request is found in the body variable
//       // for more information about how the request module works
//       //https://www.npmjs.com/package/request


   
//       if ( body.length  ==  0 ) {
//         console.log ( 'City not found' ) ;
//         resClima.fulfillmentText  =  'Your city was not found, make sure you wrote it correctly' ;
//         res.json ( resClima ) ;
//       }
//       else {
//         // We extract the city id
//         //citycode  =  body[0].Key ;
//         // and assemble the url for the weather consultation
//         var  urlClimaCiudad  =  'http://api.openweathermap.org/data/2.5/weather?q= '+ city + '&units=imperial&appid=6628ad3fd90a97fb39ff9793c7569874' ;
        
//         // We carry out the consultation to look for the climate of the city by its id
//         request ( urlClimaCiudad ,  { json : true } ,  ( err2 ,  resp2 ,  body2 )  =>  {
//           // in case of error we indicate a problem
//           if ( err2 ) {
//             console. log ( 'Problem getting the weather' ) ;
//             resClima. fulfillmentText  =  'It was not possible to check the climate of your city at this time' ;
//           }

//           // We extract the information from the API, and assemble the response to be sent to the agent
//           // more details https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/%7BlocationKey%7D
//           resClima.fulfillmentText  =  'Right now its' + weather.main.temp;
//           resClima.fulfillmentText  +=  'degrees with' + weather.weather[0].description;          

//           res.json(resClima) ;
//         } ) ;
//       }
//     }
//   } ) ;
// } ) ;
//////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
restService.post('/webhook', function(req,res) {
  console.log('Recieve a post request');
  if(!req.body)  return res.sendStatus(400)
    res.setHeader('Content-Type', 'application/json');
  var city = req.body.queryResult.parameters.City;
  var w = getWeather(city);
  let response = " ";
  let responseObj = {
    "fulfillmentText": response,
    "fulfillmentMessages":[{"text": {"text": [w]}}]
    ,"source":""
  }
 //return res.JSON(JSON.stringify)({speech:w, displayText: w, source:"webhook-echo-sample"});
  return res.json(responseObj);
   
  })

  let request = require('request');

  // request(url, function (err, response, body) {
  //   if(err){
  //     console.log('error:', error);
  //   } else {
  //     let weather = JSON.parse(body)
  //     let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
  //     console.log(message);
  //   }
  // });



var result

function cb (err, _resposne, body){
  if(err){
    console.log('error');
  }
  var weather = JSON.parse(body)
  if(weather.message === 'city not found'){
    result = 'Unable to get weather' + weather.message;
  }
  else
  {
    result = 'Right now its' + weather.main.temp + 'degrees with' + weather.weather[0].description;
  }
}

function getWeather(city) {
  result = undefined;
  let apiKey = '6628ad3fd90a97fb39ff9793c7569874';
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  var req = request(url, cb);

  request(url, cb, function (err, response, body) {
    if(err){
      console.log('error:', error);
    } else {
      let weather = JSON.parse(body)
      let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
      result = 'Right now its' + weather.main.temp + 'degrees with' + weather.weather[0].description
      console.log(message);
    }
  });


  while(result == undefined){
    require('deasync').runLoopOnce();
  }
  return result;
}

///////////////////////////////////////////////






// const https = require('https')

// const data = JSON.stringify({
//   'methodName': 'stt', 
//   'payload': {'t': '75'}
// })

// const options = {
//   hostname: 'pacific-wildwood-80427.herokuapp.com',
//   port: 433,
//   path: 'hypernet-elaraby.azure-devices.net/twins/elaraby-wh-65l-629b/methods?api-version=2018-06-30',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization' : 'SharedAccessSignature sr=Hypernet-Elaraby.azure-devices.net&sig=gYbnD7TYnuYGaiHS2TNAJ3bHiJ6fbTPDYcqq1clMAGc%3D&se=1873684081&skn=iothubowner'
//   }
// }
// const req = https.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', d => {
//     process.stdout.write(d)
//   })
// })

// req.on('error', error => {
//   console.error(error)
// })

// req.write(data)
// req.end()

// restService.post("/hypernet-elaraby.azure-devices.net/twins/elaraby-wh-65l-629b/methods?api-version=2018-06-30", function(req, res) {
 
//   var speech =
//     req.body.queryResult &&
//     req.body.queryResult.parameters &&
//     req.body.queryResult.parameters.payload
//       ? req.body.queryResult.parameters.payload
//       : "getting";
  
//   var speechResponse = {
//     google: {
//       expectUserResponse: true,
//       richResponse: {
//         items: [
//           {
//             simpleResponse: {
//               textToSpeech: speech
//             }
//           }
//         ]
//       }
//     }
//   };
//   return res.json({
//     payload: speechResponse,
//     //data: speechResponse,
//     fulfillmentText: speech,
//     speech: speech,
//     displayText: speech,
//     source: "webhook-echo-sample"
//   });
// });

restService.post("/audio", function(req, res) {
  var speech = "";
  switch (req.body.result.parameters.AudioSample.toLowerCase()) {
    //Speech Synthesis Markup Language 
    case "music one":
      speech =
        '<speak><audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music two":
      speech =
        '<speak><audio clipBegin="1s" clipEnd="3s" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music three":
      speech =
        '<speak><audio repeatCount="2" soundLevel="-15db" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music four":
      speech =
        '<speak><audio speed="200%" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music five":
      speech =
        '<audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio>';
      break;
    case "delay":
      speech =
        '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
      break;
    //https://www.w3.org/TR/speech-synthesis/#S3.2.3
    case "cardinal":
      speech = '<speak><say-as interpret-as="cardinal">12345</say-as></speak>';
      break;
    case "ordinal":
      speech =
        '<speak>I stood <say-as interpret-as="ordinal">10</say-as> in the class exams.</speak>';
      break;
    case "characters":
      speech =
        '<speak>Hello is spelled as <say-as interpret-as="characters">Hello</say-as></speak>';
      break;
    case "fraction":
      speech =
        '<speak>Rather than saying 24+3/4, I should say <say-as interpret-as="fraction">24+3/4</say-as></speak>';
      break;
    case "bleep":
      speech =
        '<speak>I do not want to say <say-as interpret-as="bleep">F&%$#</say-as> word</speak>';
      break;
    case "unit":
      speech =
        '<speak>This road is <say-as interpret-as="unit">50 foot</say-as> wide</speak>';
      break;
    case "verbatim":
      speech =
        '<speak>You spell HELLO as <say-as interpret-as="verbatim">hello</say-as></speak>';
      break;
    case "date one":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="yyyymmdd" detail="1">2017-12-16</say-as></speak>';
      break;
    case "date two":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dm" detail="1">16-12</say-as></speak>';
      break;
    case "date three":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dmy" detail="1">16-12-2017</say-as></speak>';
      break;
    case "time":
      speech =
        '<speak>It is <say-as interpret-as="time" format="hms12">2:30pm</say-as> now</speak>';
      break;
    case "telephone one":
      speech =
        '<speak><say-as interpret-as="telephone" format="91">09012345678</say-as> </speak>';
      break;
    case "telephone two":
      speech =
        '<speak><say-as interpret-as="telephone" format="1">(781) 771-7777</say-as> </speak>';
      break;
    // https://www.w3.org/TR/2005/NOTE-ssml-sayas-20050526/#S3.3
    case "alternate":
      speech =
        '<speak>IPL stands for <sub alias="indian premier league">IPL</sub></speak>';
      break;
  }
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

restService.post("/video", function(req, res) {
  return res.json({
    speech:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    displayText:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    source: "webhook-echo-sample"
  });
});

restService.post("/slack-test", function(req, res) {
  var slack_message = {
    text: "Details of JIRA board for Browse and Commerce",
    attachments: [
      {
        title: "JIRA Board",
        title_link: "http://www.google.com",
        color: "#36a64f",

        fields: [
          {
            title: "Epic Count",
            value: "50",
            short: "false"
          },
          {
            title: "Story Count",
            value: "40",
            short: "false"
          }
        ],

        thumb_url:
          "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
      },
      {
        title: "Story status count",
        title_link: "http://www.google.com",
        color: "#f49e42",

        fields: [
          {
            title: "Not started",
            value: "50",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          }
        ]
      }
    ]
  };
  return res.json({
    speech: "speech",
    displayText: "speech",
    source: "webhook-echo-sample",
    data: {
      slack: slack_message
    }
  });
});

restService.listen(process.env.PORT || 3000, function() {
  console.log("Server up and listening");
});
