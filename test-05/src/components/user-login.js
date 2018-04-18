import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class UserLogin extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="user-login">
                <img className="thumb" src={this.props.img}/>
                <span className='badge badge-pill badge-light'>12</span>

                <Link to={this.props.to}>{this.props.name}</Link>
            </div>
        );
    }
}