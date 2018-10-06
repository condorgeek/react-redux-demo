import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class AuthorLink extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="author-link">
                <img className="thumb" src={this.props.img}/> <Link to={this.props.to}>{this.props.name}</Link>
            </div>
        );
    }
}