import React, { Component } from 'react'
import LineChart from 'react-linechart'
import '../css/output.css'

class Graph extends Component {
    render() {
        return (
            <div>
                {this.props.graphDataGenerated && this.props.graphData['0'].name !== undefined ?
                    (
                        <div>
                            <span> {this.props.graphParameter} VS {this.props.forecastRange}</span>
                            <LineChart id="line-chart" width={(window.innerWidth / 100) * 80} height="500" data={this.props.graphData} />
                        </div>
                    ) :
                    (
                        <div>
                            Graph will Load upon Request. If graph doesn't load then it either has not been requested or the data doesnt exits for that selection criteria.
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Graph


