
import React, { Component } from 'react'
import '../css/output.css'

class AddressCoordinates extends Component {
    render() {
        return (
            <div>
                <h1><em>{this.props.currentAddress}</em></h1>
                <h5>Current Location Coordinates</h5>
                <div className="grid-container-coordinate">
                    <h6 className="grid-item-coordinate"><em><span>Latitude : </span><span>{this.props.latitude}</span></em></h6>
                    <h6 className="grid-item-coordinate"><em><span>Longitude : </span><span>{this.props.longitude}</span></em></h6>
                </div>
            </div>
        )
    }
}

export default AddressCoordinates







