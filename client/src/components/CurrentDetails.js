import React, { Component } from 'react'
import '../css/output.css'

class CurrentDetails extends Component {
    render(){
        return(
            <div>
                <h4>Current Details</h4>
                <div className="grid-container">
                    <div className="grid-item">
                        <h6> Wind : <em>{this.props.data.currently.windSpeed} mi/hr</em></h6>
                    </div>
                    <div className="grid-item">
                        <h6> Humidity : <em>{this.props.data.currently.humidity * 100} %</em></h6>
                    </div>
                    <div className="grid-item">
                        <h6> Dew Pt : <em>{this.props.data.currently.dewPoint}</em></h6>
                    </div>
                    <div className="grid-item">
                        <h6> Visibility : <em>{this.props.data.currently.visibility}</em></h6>
                    </div>
                    <div className="grid-item">
                        <h6> Pressure : <em>{this.props.data.currently.pressure} hpb</em></h6>
                    </div>
                    <div className="grid-item">
                        <h6> Temp : <em>{this.props.data.currently.temperature} C</em></h6>
                    </div>
                </div>
            </div>
        )
    }
}

export default CurrentDetails