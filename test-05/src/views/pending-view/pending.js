/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [pending.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 14.03.20, 16:39
 */

import toastr from "toastr";

import React, {useEffect} from 'react';
import {connect} from 'react-redux'
import {asyncFetchFriendsPending, asyncAcceptFriend, asyncIgnoreFriend, asyncCancelFriend} from "../../actions";
import ActiveFriend from "../../components/sidebar/forms/active-friend";
import {showTooltip} from "../../actions/tippy-config";
import {getAuthorizedUsername, isAuthorized} from "../../selectors";


const renderPending = (props) => {
    const {pending, authname} = props;

    if(!pending) return null;

    return (pending.map(friend => {
        const user = friend.friend;

        return <li key={friend.id} className='d-sm-block sidebar-entry mb-2'>
            <ActiveFriend authname={authname} user={user}/>

            {friend.action === 'REQUESTING' && <span className="sidebar-waiting">
                    <i className="fas fa-clock"/>
                </span>}

            {friend.action === 'REQUESTED' && <div className="sidebar-navigation">
                <button title={`Confirm ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                        onClick={(event) => {
                            event.preventDefault();
                            props.asyncAcceptFriend(authname, user.username, (params) => {
                                toastr.info(`You have confirmed ${user.firstname} friendship.`);
                            });
                        }}
                        ref={(elem)=> {
                            if (elem === null) return;
                            showTooltip(elem);
                        }}><i className="fas fa-user-check"/>
                </button>

                <button title={`Ignore ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                        onClick={(event) => {
                            event.preventDefault();
                            props.asyncIgnoreFriend(authname, user.username, (params) => {
                                toastr.warning(`You have ignored ${user.firstname} friendship's request.`);
                            });
                        }}
                        ref={(elem)=> {
                            if (elem === null) return;
                            showTooltip(elem);
                        }}><i className="fas fa-user-minus"/>
                </button>
            </div>}

            {friend.action === 'REQUESTING' && <div className="sidebar-navigation">

                <button title={`Cancel request to ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                        onClick={(event) => {
                            event.preventDefault();
                            props.asyncCancelFriend(authname, user.username, (params) => {
                                toastr.warning(`You have cancelled your friendship's request to ${user.firstname}.`);
                            });
                        }}
                        ref={(elem)=> {
                            if (elem === null) return;
                            showTooltip(elem);
                        }}><i className="fas fa-user-minus"/>
                </button>
            </div>}

        </li>
    }));
};

const Pending = (props) => {
    const {pending, authname, isAuthorized} = props;

    useEffect(() => {
        props.asyncFetchFriendsPending(authname);
    }, []);

    if(!isAuthorized) return null;

    return <div className='pending-container'>
        {renderPending(props)}
    </div>

};

const mapStateToProps = (state) => ({
    authname: getAuthorizedUsername(state),
    isAuthorized: isAuthorized(state),
    pending: state.pending,
});

export default connect(mapStateToProps, {
    asyncFetchFriendsPending,
    asyncAcceptFriend,
    asyncIgnoreFriend,
    asyncCancelFriend})(Pending)