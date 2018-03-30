import React, { Component } from 'react';

const google = window.google;

class GoogleMap extends Component {

    componentDidMount() {
        new google.maps.Map(this.refs.map, {
            center: {lat: this.props.lat, lng: this.props.lng},
            zoom: 12
        });
    }

    render() {
        return <div ref='map' />
    }
}

export default GoogleMap;