const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8080
const fs = require('fs')
const readline = require('readline')
const apiKey = '832e44cec255f9ea18cbb0cfd27ce348'
let currentPosition = {}
let city
let date
const socketIo = require("socket.io");
const axios = require("axios");
const request = require("request");
const http = require('http');
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'google',
    httpAdapter: 'https', 
    apiKey: 'AIzaSyB-Os0hdpx9nA0liw0hwf7uDg8zMVJF6QM',
    formatter: null   
};
const geocoder = NodeGeocoder(options);
const apiai = require('apiai')('4e3b9add39e444d899a34d97191132fa');
app.set('port', port);
var server = http.createServer(app);
var io = require('socket.io').listen(server);
//const io = socketIo(server);
const getApiAndEmit = "TODO"
const accuweather = require('node-accuweather')()('tSjxuGorxISHcxOqEKG1j1TPaQWiYQuc');
const projectId = 'weatherbot-9c7c4'; 
const sessionId = 'quickstart-session';
const query = 'weather';
const languageCode = 'en-US';
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
const Storage = require('@google-cloud/storage');
const storage = Storage({
    keyFilename: './keyfile.json'
});
storage.getBuckets()
       .then((results) => {
            const buckets = results[0];
            buckets.forEach((bucket) => {
                console.log(bucket)
            });
       })
       .catch((err) => {
            console.error('ERROR:', err);
       });

//app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client/build')));

app.post('/currentposition', (req, res)=>{
    request(`https://api.darksky.net/forecast/${apiKey}/${req.body.latitude},${req.body.longitude}`, (error, response, body) => {
        res.json(body)
    })
})

app.post('/getPictures', (req,res)=>{
    accuweather.queryLocations(city).then((result) => {
        request(`http://dataservice.accuweather.com/currentconditions/v1/${result[0].Key}?apikey=tSjxuGorxISHcxOqEKG1j1TPaQWiYQuc&getPhotos=true`, (error, response, body) => {
            res.json(body)
        })
    })
    .catch((error)=>{
        console.log('errorpictures',error)
    });
})

app.post('/generategraphdata', (req, res) => {
    var lineData = [{
        name: "",
        values: []
    }]
    switch (req.body.graphParameter) {
        case "temperature":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available.`)
                break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['temperature']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['temperature']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                break
            }
        break    
        case "apparenttemperature":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available for ${req.body.graphParameter} and ${req.body.forecastRange}`)
                    break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['apparentTemeparature']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = (Number(element['apparentTemperatureMin']) + Number(element['apparentTemperatureMax']))/2
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "cloudcover":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available for ${req.body.graphParameter} and ${req.body.forecastRange}`)
                break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['cloudCover']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['cloudCover']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "precipitation":
            switch (req.body.forecastRange) {
                case "minutely":
                    req.body.data.minutely.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getMinutes();
                        let yData = element['precipIntensity']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['precipIntensity']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['precipIntensity']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "windspeed":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available`)
                break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['windSpeed']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['windSpeed']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "windgust":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available`)                    
                    break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['windGust']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['windGust']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "dewpoint":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available`)
                    break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['dewPoint']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['dewPoint']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "uvindex":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available`)
                    break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['uvIndex']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['temperature']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "mslpressure":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available`)                    
                    break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['pressure']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.daily.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['pressure']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
        break
        case "ozone":
            switch (req.body.forecastRange) {
                case "minutely":
                    res.json(`No such data available`)
                    break
                case "hourly":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                        let date = new Date(xData * 1000);
                        xData = date.getHours();
                        let yData = element['ozone']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = xData
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
                case "daily":
                    req.body.data.hourly.data.forEach(element => {
                        let xData = element['time']
                         let date = new Date(xData * 1000);
                        xData = date.getDate();
                        let yData = element['ozone']
                        lineData[0].name = req.body.graphParameter
                        let dataPoint = {}
                        dataPoint.x = formattedTime
                        dataPoint.y = yData
                        lineData[0].values.push(dataPoint)
                    })
                    break
            }
    }
    res.json(lineData)    
})

exports.helloHttp = function helloHttp(req, res) {
    response = "This is a sample response from your webhook!" 
    res.setHeader('Content-Type', 'application/json'); 
    res.send({
        "speech": response, "displayText": response
    });
};
exports.callWeatherApiChatBot = function callWeatherApiChatBot(req, res) {
    
    let city = req.body.result.parameters['geo-city']; 
    let date = '';
    if (req.body.result.parameters['date']) 
        date = req.body.result.parameters['date'];
    res.setHeader('Content-Type', 'application/json');
    
    geocoder.geocode(city, (err, data) => {
        res.setHeader('Content-Type', 'application/json');
        let path = `https://api.darksky.net/forecast/${apiKey}/${data[0].latitude},${data[0].longitude}`
        request(path, (error, response, body) => {
            let output = `The weather in ${city} is ${JSON.parse(body).currently.summary}`
            if (error)
                res.send(error)
            else
                res.send(JSON.stringify({
                    "speech": output, "displayText": output
                }));
        });
    });
}

io.on('connection', (socket) => {
    socket.on('chat message', (textMessage) => {
      let textFromClient = textMessage
      let request = {
          session: sessionPath,
          queryInput: {
              text: {
                  text: textMessage,
                  languageCode: languageCode,
              },
          },
      };
      sessionClient.detectIntent(request)
                   .then(responses => {
                        console.log('Detected intent');
                        const result = responses[0].queryResult;
                        console.log(`  Query: ${result.queryText}`);
                        console.log(`  Response: ${result.fulfillmentText}`);
                        socket.emit('chat message', result.fulfillmentText)
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                    });
  });
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

server.listen(port, () => { console.log(`Back End Server Running at Port ${port}`) })
