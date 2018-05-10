import React, { Component } from 'react'
import axios from 'axios'
import ReactSkycons from './ReactSkycons'
import './App.css'
import '../css/output.css'
import io from 'socket.io-client'
import CurrentDetails from './CurrentDetails'
import IntroContent from './IntroContent'
import GraphGeneratorMenu from './GraphGeneratorMenu'
import AddressCoordinates from './AddressCoordinates'
import ComprehensiveSummary from './ComprehensiveSummary'
import Graph from './Graph'
import Pictures from './Pictures'
import Map from './Map'
import BingSpeech from './BingSpeech'

const googleAPIKey = 'AIzaSyB-Os0hdpx9nA0liw0hwf7uDg8zMVJF6QM'
const appDescription = `Weatherport provides the weather report of almost any place on earth.
                        Areas that are guaranteed to be covered include all the major cities 
                        throughout the world.This application uses real- time API data available
                        on the web to provide a comprehensive report of the current weather of the
                        selected destination and has many interactive features that the user can fiddle
                        with to get a comprehensive overview of the weather.It also lets you view weather 
                        forecasts upto a week into the future. `

//var bingClientRecognition = new BingSpeech.RecognitionClient("b40cc906fc224ba58d9d39d0b0b31083");
//var bingClientTTS = new BingSpeech.TTSClient("b40cc906fc224ba58d9d39d0b0b31083");
//bingClientTTS.multipleXHR = false

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';
const speechSynthesis = window.speechSynthesis;


class Weather extends Component{
  constructor(){
    super()
    this.state = {
      currentLocation : {},
      currentAddress: '',
      data : {},
      isLoading: true,
      icon: '',
      pictures : [],
      graphParameter : '',
      forecastRange : '',
      recognitionStarted: false,
      graphData : [],
      finalData : [],
      graphDataGenerated : false,
      currentAddressReportRequested : false,
      spokenText : '',
      numberOfTimesChatButtonClicked : 0,
      scriptDialog : ''
    }
  }

  componentDidUpdate(){
    //this.state.recognitionStarted ? bingClientRecognition.startMicAndContinuousRecognition() : bingClientRecognition.endMicAndContinuousRecognition()
  }

  beginChat = () => {
    let flag = this.state.recognitionStarted
    let counter = this.state.numberOfTimesChatButtonClicked;
    this.setState({
      recognitionStarted : !flag,
      numberOfTimesChatButtonClicked : ++counter
    })
  }
  
  updateGraphParameter = (event) => {
    this.setState({
      graphParameter : event.target.value
    })
     
  }
  updateForecastRange = (event) => {
    this.setState({
      forecastRange : event.target.value
    })
  }
  generateGraphData = () => {
    if((this.state.graphParameter !== 'parameter' && this.state.graphParameter !== '') && (this.state.forecastRange !== 'range' && this.state.forecastRange !== '')){
      axios.post('http://localhost:8080/generategraphdata', {graphParameter: this.state.graphParameter,forecastRange: this.state.forecastRange,data: this.state.data
      })
           .then((response) => {this.setState({graphData: [{ color: 'white', name: response.data['0'].name, points: response.data['0'].values }],graphDataGenerated: true})})
    }
    else
      alert('Select both entries from above first : PARAMETER to map and FORECAST RANGE')                                         
  }

  getPictures = () => {
    axios.post('http://localhost:8080/getPictures')
         .then((response)=>{this.setState({pictures: JSON.parse(response.data)['0'].Photos})})
         .catch((error)=>{alert('errorPictures',error)})
  }
  updateCurrentAddress = (event) => {
    this.setState({currentAddress : event.target.value, pictures:[]})
  }
  
  convertAddressToLocation = () => {
    axios.post(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.currentAddress}&key=${googleAPIKey}`)
         .then((response)=>{
           this.setState({
             currentLocation :  {
               latitude: response.data.results[0].geometry.location.lat,
               longitude: response.data.results[0].geometry.location.lng
             }
           })
           axios.post('http://localhost:8080/currentposition', {
             latitude: response.data.results[0].geometry.location.lat,
             longitude: response.data.results[0].geometry.location.lng
           })
                .then((response) => { console.log(response); this.setState({ data: JSON.parse(response.data), isLoading: false }) })
                .catch((error) => {alert('Error while fetching response data from server',error)})})
  }
  render() {
    const socket = io('http://localhost:8080/')
    let counter = 0;
    if(this.state.recognitionStarted){
      recognition.addEventListener('result', e => {
        var transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        
        if (e.results[0].isFinal) {
          this.setState({
            scriptDialog: transcript
          })
          socket.emit("chat message", transcript)
        }
      })
      socket.on('chat message', (text) => {
        var message = new SpeechSynthesisUtterance();
        message.text = text;
        speechSynthesis.speak(message);
        message.onend = function (event) {
          recognition.addEventListener('end', recognition.start);
          recognition.start();
        }
      })
      
      // console.log("Voice Recognition Turned On")
      // bingClientRecognition.onFinalResponseReceived = (response) => {
      //   console.log(response);
      //   socket.emit("chat message", response)
      //   console.log('chat message emitted')
      //   bingClientRecognition.endMicAndContinuousRecognition()
      //   if(counter === 0){
      //     socket.on('chat message', (text) => {
      //       console.log(counter)
      //       if (counter === 0) {
      //         counter++
      //         console.log(text)
      //         console.log(bingClientTTS)
      //         bingClientTTS.synthesize(text, {}, () => {
      //           bingClientRecognition.startMicAndContinuousRecognition()
      //           console.log('synthesis complete')
      //         })      
      //       }
      //     })
      //   }
      //   counter = 0
      // }   
    }
    return (
      <div id="main-container">
          <IntroContent generateReportForCurrentAddress={this.generateReportForCurrentAddress} updateCurrentAddress={this.updateCurrentAddress} convertAddressToLocation={this.convertAddressToLocation} getPictures={this.getPictures} beginChat={this.beginChat}/>
          {this.state.currentAddressReportRequested ? (<div className="m-auto">Fetching the report for Current Address. This might take a while. If results do not load then press the button again.</div>) : (<div>You have not yet requested weather report for your current location.</div>)}
          {this.state.recognitionStarted ? ( <div>
                                                <p>Voice Recognition Currently Activtated. Speak with the AI Bot</p>
                                                <img className="blink-image" width="200" height="200" src="../../images/voice-recognition.png" alt="voice-recognition-icon"/>
                                             </div>
                                          ) : (<div>Voice Recognition Currently Deactivated</div>)}
          <p>Dialog : {this.state.scriptDialog}</p>
          {(!this.state.isLoading && this.state.currentAddressReportRequested) || !this.state.isLoading ? 
              (
                <div className="container">
                  <CurrentDetails data={this.state.data}/>
                  <AddressCoordinates currentAddress={this.state.currentAddress} longitude={this.state.currentLocation.latitude} latitude={this.state.currentLocation.longitude}/>
                  <ReactSkycons icon={this.state.data.currently.icon.toUpperCase().replace(/-/g, "_")} autoplay={true}/>
                  <ComprehensiveSummary data={this.state.data}/>
                  <Map currentLocation={this.state.currentLocation}/>
                  <GraphGeneratorMenu updateGraphParameter={this.updateGraphParameter} updateForecastRange={this.updateForecastRange} generateGraphData={this.generateGraphData}/>
                  <Graph graphDataGenerated={this.state.graphDataGenerated} graphData={this.state.graphData} graphParameter={this.state.graphParameter} forecastRange={this.state.forecastRange}/>
                  <Pictures pictures={this.state.pictures}/>
                </div>
                ) : 
                (<div id="app-description">{appDescription}</div>)
          }
      </div>
    )
  }
}
      
export default Weather;