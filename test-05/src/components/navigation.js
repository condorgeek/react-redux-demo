import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthorLink from "./author-link";
import {GOCKEL, userthumb} from "../static";

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
                <div className='navbar-user'>
                    <AuthorLink img={userthumb()}
                                name={this.state.user.name}
                                to={`/author/${this.state.user.id}/00`}/>
                </div>
            );
        }
        return <div className='warning-text'>Not logged in</div>;
    }

    login(event) {
        event.preventDefault();
        this.setState({logged: true, user: {name: 'Amaru London', id: 'amarulondon'}});
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
                        <img src={GOCKEL}alt=""/>
                        <span className="text">Kikiriki</span>
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                            aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" onClick={() => {
                    console.log('CLICKED!!')
                }}/>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className='nav-link' to='/posts/new'>Add a Post</Link>
                            </li>
                        </ul>

                        {this.currentUser()}

                        <div className="btn-group mr-sm-2" role="group">
                            <button id="btnGroupDrop1" type="button"
                                    className="btn btn-sm btn-outline-light dropdown-toggle"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user-o" aria-hidden="true"/>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
                                <a className="dropdown-item" href="#">Register</a>
                                <a className="dropdown-item" href="#">Configure</a>
                                <div className="dropdown-divider"/>
                                <a className="dropdown-item" onClick={this.login.bind(this)}>Login</a>
                                <a className="dropdown-item" onClick={this.logout.bind(this)}>Logout</a>
                            </div>
                        </div>

                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control-sm mr-sm-2 w-280" type="search" placeholder="Search"/>
                            <button className="btn btn-sm btn-outline-light" type="submit">
                                <i className="fa fa-search" aria-hidden="true"/></button>
                        </form>

                    </div>
                </nav>
            </div>
        );
    }
}