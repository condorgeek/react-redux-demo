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

import toastr from "../../../node_modules/toastr/toastr";
import React, {useState} from 'react';

import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {asyncSearchGlobal, STATE_BLOCKED} from "../../actions/spaces";
import {getAuthorizedUsername} from "../../selectors";
import {getStaticImageUrl} from "../../actions/environment";
import MessageBox from "../dialog-box/message-box";
import {asyncBlockUser, asyncDeleteUser, asyncActivateUser} from "../../actions/superuser";


const ManageSiteUsers = (props) => {
    const {users, username} = props;
    const [search, setSearch] = useState("");
    const [isBlockOpen, setIsBlockOpen] = useState(false);
    const [isUnblockOpen, setIsUnblockOpen] = useState(false);
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
        props.asyncBlockUser(user.username, (user) => {
            toastr.info(`User ${user.username} has been blocked successfully.`);
        });
    };

    const handleUnblock = (event, user) => {
        props.asyncActivateUser(user.username, (user) => {
            toastr.info(`User ${user.username} has been unblocked successfully.`);
        });
    };

    const handleDelete = (event, user) => {
        props.asyncDeleteUser(user.username, (user) => {
            toastr.info(`User ${user.username} has been deleted successfully.`);
        });
    };

    const renderSearchResult = (users) => {
        return users.filter(entry => entry.type === 'USER').map(entry => {
            const avatar = getStaticImageUrl(entry.avatar);
            const isBlocked = entry.state === STATE_BLOCKED;
            const blockHandler = isBlocked ? setIsUnblockOpen : setIsBlockOpen;

            return <div key={entry.username} className='search-entry'>
                <Link className="search-link" to={entry.url}>
                    {isBlocked && <span className='user-blocked'><i className="fas fa-ban"/></span>}
                    <img src={avatar}/> {entry.name} {entry.username}
                </Link>
                <div><span className='search-icon' onClick={() => {
                        setSelection(entry);
                        blockHandler(true);
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

        {selection && <MessageBox isOpen={isBlockOpen} setIsOpen={setIsBlockOpen}
                                     callback={handleBlock} image={selection.avatar}
                                     title='Block User' action='Block User'>
            <div>You have selected <b>{selection.name}</b> for blocking. Are you sure of this operation ?
                <small>This user will continue to read postings and navigate the site but wont we able to do
                    any active contribution. You can unblock him at a later time if you wish.</small>
            </div>
        </MessageBox>}

        {selection && <MessageBox isOpen={isUnblockOpen} setIsOpen={setIsUnblockOpen}
                                  callback={handleUnblock} image={selection.avatar}
                                  title='Unblock User' action='Unblock User'>
            <div>You have selected <b>{selection.name}</b> for unblocking. Are you sure of this operation ?
                <small>This user will be able to read postings, navigate the site and do
                    active contributions.</small>
            </div>
        </MessageBox>}

        {selection && <MessageBox isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}
                                 callback={handleDelete} image={selection.avatar}
                                 title='Delete User' action='Delete User'>
                <div>You have selected <b>{selection.name}</b> for deletion. Are you sure of this operation ?
                    <small>This operation cannot be undone. The user will be permanently deleted from the system. </small>
                </div>
        </MessageBox>}

    </div>
};

const mapStateToProps = (state) => ({
    users: state.search,
    username: getAuthorizedUsername(state),
});

export default connect(mapStateToProps,
    {asyncSearchGlobal, asyncDeleteUser, asyncBlockUser, asyncActivateUser})(ManageSiteUsers);

