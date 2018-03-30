import React, {Component} from 'react';
import {connect} from 'react-redux';
import Chart  from '../components/chart';
import GoogleMap from '../components/google-map';

class WeatherList extends Component {

    renderCity(data) {
        const name = data.city.name;
        const temps = data.list.map(weather => weather.main.temp - 273.15);
        const humidities = data.list.map(weather => weather.main.humidity);
        const pressures= data.list.map(weather => weather.main.pressure);
        const lng = data.city.coord.lon;
        const lat = data.city.coord.lat;

        return <tr key={name}>
            <td><GoogleMap lng={lng} lat={lat}/></td>
            <td> <Chart data={temps} color="red" units="C"/></td>
            <td> <Chart data={pressures} color="green" units="hPa"/></td>
            <td> <Chart data={humidities} color="orange" units="%"/></td>
        </tr>
    }

    render() {
        return (
            <table className='table table-hover'>
                <thead>
                <tr><th>City</th>
                <th>Temperature (C)</th>
                <th>Pressure (hPa)</th>
                <th>Humidity (%)</th></tr>
                </thead>
                <tbody>
                {this.props.weather.map(this.renderCity)}
                </tbody>
            </table>
        );
    }
}

function mapStateToProps(state) {
    return { weather: state.weather };
}

export default connect(mapStateToProps) (WeatherList);
