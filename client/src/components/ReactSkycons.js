import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
const Skycons = require('skycons')(window)

class ReactSkycons extends React.Component {
    static propTypes = {
        color: PropTypes.string,
        autoplay: PropTypes.bool,
        icon: PropTypes.oneOf([
            'CLEAR_DAY',
            'CLEAR_NIGHT',
            'PARTLY_CLOUDY_DAY',
            'PARTLY_CLOUDY_NIGHT',
            'CLOUDY',
            'RAIN',
            'SLEET',
            'SNOW',
            'WIND',
            'FOG'
        ])

    };

    static defaultProps = {
        color: null,
        autoplay: true
    };

    constructor(props) {
        super(props)

        this.state = {
            skycons: new Skycons({ 'color': 'black' })
        }
    }

    componentDidMount() {
        const { skycons } = this.state
        console.log('icon',this.props.icon)
        skycons.add(ReactDOM.findDOMNode(this), Skycons[this.props.icon])

        if (this.props.autoplay) {
            skycons.play()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.state.skycons.set(ReactDOM.findDOMNode(this), Skycons[nextProps.icon])
    }

    componentWillUnmount() {
        const { skycons } = this.state
        skycons.pause()
        skycons.remove(ReactDOM.findDOMNode(this))
    }

    play() {
        this.state.skycons.play()
    }

    pause() {
        this.state.skycons.pause()
    }

    render() {
        const {
            color,
            autoplay,
            icon,
            ...restPops
    } = this.props
        const defaultStyle = {
            width: '50%',
            height: '30%',
            color: 'white'
        }
        return (
            <canvas style={defaultStyle} {...restPops} />
        )
    }
}
export default ReactSkycons;