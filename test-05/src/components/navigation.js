import $ from 'jquery';

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthorLink from "./author-link";
import {GOCKEL} from "../static";
import UserLogin from "./user-login";

class AuthorActivity extends Component {

    componentDidMount() {
        // get user activity
    }

    render() {
        return (
            <div className='user-activity'>
                <div className='user-nav'>
                    <span className='badge badge-pill badge-light'>12</span>
                    <i className="fa fa-commenting-o" aria-hidden="true"/>
                </div>
            </div>
        );
    }
}

export default class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false, user: null};
    }

    componentDidMount(props) {
    }

    currentUser() {
        if (this.state.logged) {
            return (
                <UserLogin img={this.state.user.thumb}
                           name={this.state.user.name}
                           to={`/author/${this.state.user.id}/00`}/>
            );
        }
        return <div className='warning-text'>Not logged in</div>;
    }

    login(event) {
        event.preventDefault();
        this.setState({
            logged: true,
            user: {name: 'Amaru London', id: 'amarulondon', thumb: '/static/users/amaru-pic.png'}
        });
    }

    logout(event) {
        event.preventDefault();
        this.setState({logged: false, user: null});
    }

    render() {
        return (
            <div className='top-navbar'>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <Link className="navbar-brand" to='/'>
                        <img src={GOCKEL} alt=""/>
                        <span className="text">Kikirikii</span>
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="offcanvas"
                            aria-controls="navbarTogglerDemo02" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" onClick={() => {
                            $('.offcanvas-collapse').toggleClass('open');
                        }}
                        />
                    </button>

                    <div className="navbar-collapse offcanvas-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto">
                            {/*<li className="nav-item">*/}
                            {/*<Link className='nav-link' to='/posts/new'>Add a Post</Link>*/}
                            {/*</li>*/}
                        </ul>

                        {/*<AuthorActivity id={this.state.user}/>*/}

                        <div className="btn-group mr-sm-2" role="group">
                            {this.currentUser()}
                            <button id="btnGroupDrop1" type="button"
                                    className="dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user" aria-hidden="true"/>
                            </button>

                            <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                <a className="dropdown-item" href="#">Register</a>
                                <a className="dropdown-item" href="#">Configure</a>
                                <div className="dropdown-divider"/>
                                <a className="dropdown-item" onClick={this.login.bind(this)}>Login</a>
                                <a className="dropdown-item" onClick={this.logout.bind(this)}>Logout</a>
                            </div>
                        </div>

                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control-sm mr-sm-2 w-280" type="search"
                                   placeholder="Search a space"/>
                            <button className="btn btn-sm" type="submit">
                                <i className="fa fa-search" aria-hidden="true"/></button>
                        </form>

                    </div>
                </nav>
            </div>
        );
    }
}