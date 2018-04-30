
import React, { Component } from 'react'
import '../css/output.css'

class IntroContent extends Component {
    render() {
        return (
                <div id="intro-content">
                    <div id="header">
                        <img id="icon" src="../../images/wi.png" alt="weather icon" />
                        <h1 id="heading"><strong id="W">W </strong><em id="eatherport">EATHERPORT</em></h1><br />
                        <h4 id="sub-heading">Global Weather Coverage</h4>
                        <h5><strong>Which city's weather would you like to know?</strong></h5><br />
                        <div><input id="entercity" type="text" className="text-center" placeholder="Enter City" onKeyUp={this.props.updateCurrentAddress} /></div><br />
                    </div>
                    <div id="main-button-container">
                        <div>
                            <button className="main-button m-1 btn btn-primary" type="submit" onClick={this.props.convertAddressToLocation}>Generate Report</button>
                            <button className="main-button m-1 btn btn-success" type="submit" onClick={this.props.getPictures}>Get Pictures</button>
                            <button className="main-button m-1 btn btn-warning" type="submit" onClick={this.props.beginChat}>Chat</button>
                        </div>
                    </div>
                </div>
               )
    }
}

export default IntroContent
