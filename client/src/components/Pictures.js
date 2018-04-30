import React, { Component } from 'react'
import '../css/output.css'

class Pictures extends Component {
    render() {
        console.log(typeof this.props.pictures)
        let picOneLink = this.props.pictures[0] === undefined ? '' : this.props.pictures[0].PortraitLink
        let picTwoLink = this.props.pictures[1] === undefined ? '' : this.props.pictures[1].PortraitLink
        let picThreeLink = this.props.pictures[2] === undefined ? '' : this.props.pictures[2].PortraitLink
        let picFourLink = this.props.pictures[3] === undefined ? '' : this.props.pictures[3].PortraitLink
        let picFiveLink = this.props.pictures[4] === undefined ? '' : this.props.pictures[4].PortraitLink
        return (
            <div>
                { this.props.pictures.length !== 0 ?
                        (<div className="row">
                                <img src={picOneLink} />
                                <img src={picTwoLink} />
                                <img src={picThreeLink} />
                                <img src={picFourLink} />
                                <img src={picFiveLink} />
                         </div>) : (<div>Pictures for the location entered are not available or haven't been requested</div>)
                }
            </div>
        )
    }
}

export default Pictures

