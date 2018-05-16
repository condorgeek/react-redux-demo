import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class UserLink extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const homespace = `${this.props.user.name}/home`;

        return (
            <div className='user-link'>
                <img className="thumb" src={this.props.user.thumbnail}/>
                <Link to={homespace}>
                    {`${this.props.user.firstname} ${this.props.user.lastname}`}
                </Link>

                <div className='right-align'>
                    <a href={"#"}><i className="fa fa-share" aria-hidden="true"></i>Follow</a>
                    <a href={"#"}><i className="fa fa-user" aria-hidden="true"></i>
                    Friend</a>
                    <span>{this.props.min} min</span>
                </div>
            </div>
        );
    }
}