import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ROOT_STATIC_URL} from "../../actions";

export default class UserLink extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {user} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar =  `${ROOT_STATIC_URL}/${user.avatar}`;

        return (
            <div className='user-link'>
                <img className="thumb" src={avatar}/>
                <Link to={homespace}>
                    {`${user.firstname} ${user.lastname}`}
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