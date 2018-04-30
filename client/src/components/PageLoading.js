import React, { Component } from 'react'
import '../css/output.css'
import './App.css'
const style1 = { display: 'inline-block', transform: 'rotate(127deg)' }

class PageLoading extends Component {
    render() {
        return (
            <div className="container text-center jumbotron" id="currentDetailsWrapper">
                <div className="" id="currentDetails">
                    <h1>Page is Currently Loading So Please Be Patient</h1>
                    <h3>Fetching Weather Data From the Server....</h3>
                    <h3>Application may take time to load due to Networking issues</h3>
                    <h3>If application doesn't load, hit the refresh button</h3>
                    <h3>Thankyou for your patience</h3>
                </div>
            </div>
        )
    }
}

export default PageLoading