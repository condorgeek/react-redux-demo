import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ROOT_STATIC_URL} from "../actions";


export default class NavigationUser extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const profile = `${ROOT_STATIC_URL}/${this.props.name}/profile/profile-pic.jpg`;

        return (
            <div className="user-login">
                <img className="thumb" src={profile}/>
                <span className='badge badge-pill badge-light'>12</span>

                <Link to={this.props.to}>{this.props.name}</Link>
            </div>
        );
    }
}