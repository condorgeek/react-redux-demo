/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [update-account.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.01.20, 09:01
 */

import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {asyncSearchGlobal} from "../../actions/spaces";
import {getAuthorizedUsername} from "../../reducers/selectors";
import {getStaticImageUrl} from "../../actions/environment";

const ManageSiteUsers = (props) => {
    const {users, username} = props;
    const [search, setSearch] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        props.asyncSearchGlobal(username, search, 10, result => {
            console.log("SEARCH DONE", result);
        });
    };

    const renderSearchResult = (users) => {
        return users.filter(entry => entry.type === 'USER').map(entry => {
            const avatar = getStaticImageUrl(entry.avatar);
            return <div className='search-entry'>
                <Link className="search-link" to={entry.url}>
                    <img src={avatar}/> {entry.name} {entry.username}
                </Link>
                <div>
                    <span className='search-icon'><i className="fas fa-ban"/></span>
                    <span className='search-icon'><i className="fas fa-trash-alt"/></span>
                </div>
            </div>
        });
    };

    return <div className='standard-form-container'>
        <form className='standard-form' onSubmit={handleSubmit}>
            <h2>Manage Users</h2>
            <label className='form-label'>Find a user</label>
            <input className='form-text-input'
                      value={search}
                      placeholder='Search'
                      type='search'
                      name='search'
                      onChange={(e) => setSearch(e.target.value)}/>
            <div className='form-comment'>Enter name, last name or username</div>

            <div className="standard-search-container">
                {users && renderSearchResult(users)}
                {!users || !users.length && <div className='empty-search'>No users selected yet</div>}
            </div>

            {/*<div className='form-button-group'>*/}
            {/*    <button className='btn btn-primary form-submit-btn' type='submit'>Block User</button>*/}
            {/*    <button className='btn btn-primary form-submit-btn' type='submit'>Delete User</button>*/}
            {/*</div>*/}
        </form>

        {/*<div className="standard-search-container">*/}
        {/*    {users && renderSearchResult(users)}*/}
        {/*</div>*/}

    </div>
};

const mapStateToProps = (state) => ({
    users: state.search,
    username: getAuthorizedUsername(state),
});

export default connect(mapStateToProps, {asyncSearchGlobal})(ManageSiteUsers);

