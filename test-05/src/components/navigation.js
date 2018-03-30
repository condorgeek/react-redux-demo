import React from 'react';
import {Link} from 'react-router-dom';
import {GOOSE} from '../static/index';

export default (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">
                <img src={GOOSE} height="42" className="d-inline-block" alt=""/>
                <span style={{marginLeft:'8px'}}>Goose</span>
            </a>

            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" onClick={() => {
                    console.log('CLICKED!!')
                }}/>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <Link className='nav-link' to='/'>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to='/posts/new'>Add a Post</Link>

                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#">Disabled</a>
                    </li>
                </ul>
                <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search"/>
                    <button className="btn btn-outline-light" type="submit">
                        <i className="fa fa-search" aria-hidden="true"/></button>
                </form>

                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button"
                            className="btn btn-outline-light dropdown-toggle"
                            style={{marginLeft: '7px'}}
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fa fa-user-o" aria-hidden="true"/>
                    </button>
                    <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <a className="dropdown-item" href="#">Dropdown link</a>
                        <a className="dropdown-item" href="#">Dropdown link</a>
                    </div>
                </div>



            </div>
        </nav>
    );
}