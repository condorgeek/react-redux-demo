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

import React, {useState, useEffect} from 'react';

import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {asyncSearchGlobal} from "../../actions/spaces";
import {getAuthorizedUsername} from "../../reducers/selectors";
import {getStaticImageUrl} from "../../actions/environment";
import DialogBox from "../dialog-box/dialog-box";

const UserDialogBox = (props) => {
    const {data} = props;

    return <DialogBox {...props}>
        <div className='standard-form-selection'>
            <div className='standard-form-selection-avatar'>
                <img src={getStaticImageUrl(data.avatar)}/>
            </div>
            {props.children}
        </div>
    </DialogBox>
};

const ManageSiteUsers = (props) => {
    const {users, username} = props;
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selection, setSelection] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        props.asyncSearchGlobal(username, search, 10, result => {
            console.log("SEARCH DONE", result);
        });
    };

    const handleBlock = (event, user) => {
        console.log('BLOCK', user);
    };

    const handleDelete = (event, user) => {
        console.log('DELETE', user);
    };

    const renderSearchResult = (users) => {
        return users.filter(entry => entry.type === 'USER').map(entry => {
            const avatar = getStaticImageUrl(entry.avatar);

            return <div key={entry.username} className='search-entry'>
                <Link className="search-link" to={entry.url}>
                    <img src={avatar}/> {entry.name} {entry.username}
                </Link>
                <div><span className='search-icon' onClick={() => {
                        setSelection(entry);
                        setIsOpen(true);
                          }}><i className="fas fa-ban"/></span>
                    <span className='search-icon' onClick={() => {
                        setSelection(entry);
                        setIsDeleteOpen(true);
                    }}><i className="fas fa-trash-alt"/></span>
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
        </form>

        {selection && <UserDialogBox isOpen={isOpen} setIsOpen={setIsOpen}
                                     callback={handleBlock} data={selection}
                                     title='Block User' action='Block User'>
            <div>You have selected <b>{selection.name}</b> for blocking. Are you sure of this operation ?
                <small>This user will continue to read postings and navigate the site but wont we able to do
                    any active contribution. You can unblock him at a later time if you wish.</small>
            </div>
        </UserDialogBox>}

        {selection && <UserDialogBox isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}
                                 callback={handleDelete} data={selection}
                                 title='Delete User' action='Delete User'>
                <div>You have selected <b>{selection.name}</b> for deletion. Are you sure of this operation ?
                    <small>This operation cannot be undone. The user will be permanently deleted from the system. </small>
                </div>
        </UserDialogBox>}

    </div>
};

const mapStateToProps = (state) => ({
    users: state.search,
    username: getAuthorizedUsername(state),
});

export default connect(mapStateToProps, {asyncSearchGlobal})(ManageSiteUsers);

