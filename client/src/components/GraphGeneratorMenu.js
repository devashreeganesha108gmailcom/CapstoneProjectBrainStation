import React, { Component } from 'react'
import '../css/output.css'

class GraphGeneratorMenu extends Component {
    render() {
        return (
            <div>
                <div>
                    <select onChange={this.props.updateGraphParameter}>
                        <option value="parameter">Select Parameter</option>
                        <option value="temperature">Temperature</option>
                        <option value="apparenttemperature">Feels Like Temperature</option>
                        <option value="cloudcover">Cloud Cover</option>
                        <option value="precipitation">Precipitation</option>
                        <option value="windspeed">Wind Speed</option>
                        <option value="windgust">Wind Gust</option>
                        <option value="dewpoint">Dew Point</option>
                        <option value="uvindex">UV Index</option>
                        <option value="mslpressure">MSL Pressure</option>
                        <option value="ozone">Ozone</option>
                    </select>
                </div>
                <div>
                    <select onChange={this.props.updateForecastRange}>
                        <option value="range">Select Forecast Range</option>
                        <option value="minutely">Minutely</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                    </select>
                </div> <br />
                <button className="btn btn-primary" onClick={this.props.generateGraphData}>Generate Graph</button>
            </div>
        )
    }
}

export default GraphGeneratorMenu






