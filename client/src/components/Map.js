
import React, { Component } from 'react'

class Map extends Component {
    render() {
        return (
            <div id="map-container">
                <h4 styles={{color:'black'}}>Weather Map</h4>
                <iframe title="map" id="embedded-map" width="100%" height="100%" src={`//maps.darksky.net/@radar,${this.props.currentLocation.latitude},${this.props.currentLocation.longitude}?marker=${this.props.currentLocation.latitude},${this.props.currentLocation.longitude}&amp;linkto=maps`}></iframe>
            </div>
        )
    }
}

export default Map