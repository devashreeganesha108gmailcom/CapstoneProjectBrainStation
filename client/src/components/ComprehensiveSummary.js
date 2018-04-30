import React, { Component } from 'react'
import '../css/output.css'

class ComprehensiveSummary extends Component {
    render() {
        let alertMessage = (this.props.data.alerts !== undefined) ? (
            <div>
                <span><em>{this.props.data.alerts.title}</em> Warning alert for the following regions :</span>
                <div>
                    <ul className="alertitems">
                        {this.props.data.alerts['0'].regions.map(function (element) {
                            return (<li className="text-left">{element}</li>)
                        })}
                    </ul>
                </div>
                <p>{this.props.data.alerts.description}</p>
            </div>
        ) : (<p>Currently there is no condition for which to stay alert.</p>)

        let currently = this.props.data.currently === undefined ? '' : this.props.data.currently.summary.toLowerCase()
        let minutely = this.props.data.minutely === undefined ? '' : this.props.data.minutely.summary.toLowerCase()
        let daily = this.props.data.daily === undefined ? '' : this.props.data.daily.summary.toLowerCase()
        let hourly = this.props.data.hourly === undefined ? '' : this.props.data.hourly.summary.toLowerCase()
        let statement = `Currently weather is ${currently} and is going to be ${minutely} There will be ${daily}. ${hourly}`
        return (
            <div>
                <h4>The following is the weather report</h4>
                <p>{statement}</p>
                <p>{alertMessage}</p><br />
            </div>
        )
    }
}

export default ComprehensiveSummary