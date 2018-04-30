import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Weather from './components/App';
import registerServiceWorker from './registerServiceWorker';
//var SDK = require('./SpeechToText-WebSockets-Javascript/distrib/Speech.Browser.Sdk.js');

ReactDOM.render(<Weather/>, document.getElementById('root'));
registerServiceWorker();
