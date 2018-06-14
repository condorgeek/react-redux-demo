import $ from 'jquery';

import React, {Component} from 'react';
import {GOCKEL} from "../static";
import UserLogin from "./user-login";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false, user: null};
    }

    componentDidMount(props) {
    }

    currentUser(authorization) {
        if (authorization.status=== 'success') {
            return (
                <UserLogin img='/static/users/amaru-pic.jpg'
                           name={authorization.user.username}
                           to={`/${authorization.user.username}/home`}/>
            );
        }
        return <div className='warning-text'>Not logged in</div>;
    }

    logout(event) {
        event.preventDefault();
        this.setState({logged: false, user: null});
    }

    render() {
        const {authorization} = this.props;

        return (
            <div className='top-navbar'>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <Link className="navbar-brand" to='/'>
                        <img src={GOCKEL} alt=""/>
                        <span className="text">Kikirikii</span>
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="offcanvas"
                            aria-controls="navbarTogglerId" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" onClick={() => {
                            $('.offcanvas-collapse').toggleClass('open');
                        }}
                        />
                    </button>

                    <div className="navbar-collapse offcanvas-collapse" id="navbarTogglerId">
                        <ul className="navbar-nav mr-auto">
                            {/*<li className="nav-item">*/}
                            {/*<Link className='nav-link' to='/posts/new'>Add a Post</Link>*/}
                            {/*</li>*/}
                        </ul>

                        <div className="btn-group mr-sm-4" role="group">

                            {authorization && this.currentUser(authorization)}

                            <button id="loginGroupId" type="button"
                                    className="dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user" aria-hidden="true"/>
                            </button>

                            <div className="dropdown-menu" aria-labelledby="loginGroupId">
                                <a className="dropdown-item" href="#">Register</a>
                                <a className="dropdown-item" href="#">Configure</a>
                                <div className="dropdown-divider"/>
                                {/*<a className="dropdown-item" onClick={this.login.bind(this)}>Login</a>*/}
                                <Link className="dropdown-item" to="/login">Login</Link>
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

function mapStateToProps(state) {
    return {authorization: state.authorization};
}

export default connect(mapStateToProps, {})(Navigation);