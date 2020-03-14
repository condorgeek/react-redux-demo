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

import React, {useEffect, Fragment} from 'react';
import {connect} from 'react-redux'
import {asyncFetchFriendsPending, asyncAcceptFriend, asyncIgnoreFriend, asyncCancelFriend} from "../../actions";
import ActiveFriend from "../../components/sidebar/forms/active-friend";
import {getAuthorizedUsername, isAuthorized} from "../../selectors";
import {FlatIcon, NavigationGroup, NavigationRow} from "../../components/navigation-buttons/nav-buttons";
import {UserLink} from "../../components/navigation-headlines/nav-headlines";


// const renderPending = (props) => {
//     const {pending, authname} = props;
//
//     if(!pending) return null;
//
//     return (pending.map(friend => {
//         const user = friend.friend;
//
//         return <li key={friend.id} className='d-sm-block sidebar-entry mb-2'>
//             <ActiveFriend authname={authname} user={user}/>
//
//             {friend.action === 'REQUESTING' && <span className="sidebar-waiting">
//                     <i className="fas fa-clock"/>
//                 </span>}
//
//             {friend.action === 'REQUESTED' && <div className="sidebar-navigation">
//                 <button title={`Confirm ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
//                         onClick={(event) => {
//                             event.preventDefault();
//                             props.asyncAcceptFriend(authname, user.username, (params) => {
//                                 toastr.info(`You have confirmed ${user.firstname} friendship.`);
//                             });
//                         }}
//                         ref={(elem)=> {
//                             if (elem === null) return;
//                             showTooltip(elem);
//                         }}><i className="fas fa-user-check"/>
//                 </button>
//
//                 <button title={`Ignore ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
//                         onClick={(event) => {
//                             event.preventDefault();
//                             props.asyncIgnoreFriend(authname, user.username, (params) => {
//                                 toastr.warning(`You have ignored ${user.firstname} friendship's request.`);
//                             });
//                         }}
//                         ref={(elem)=> {
//                             if (elem === null) return;
//                             showTooltip(elem);
//                         }}><i className="fas fa-user-minus"/>
//                 </button>
//             </div>}
//
//             {friend.action === 'REQUESTING' && <div className="sidebar-navigation">
//
//                 <button title={`Cancel request to ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
//                         onClick={(event) => {
//                             event.preventDefault();
//                             props.asyncCancelFriend(authname, user.username, (params) => {
//                                 toastr.warning(`You have cancelled your friendship's request to ${user.firstname}.`);
//                             });
//                         }}
//                         ref={(elem)=> {
//                             if (elem === null) return;
//                             showTooltip(elem);
//                         }}><i className="fas fa-user-minus"/>
//                 </button>
//             </div>}
//
//         </li>
//     }));
// };

const renderPending = (props) => {
    const {pending, authname} = props;


    if(!pending) return null;

    return (pending.map(friend => {
        const user = friend.friend;
        const homespace = `/${user.username}/home`;
        const fullname = `${user.firstname} ${user.lastname}`;

        return <NavigationRow key={friend.id} className='friends-generic-entry'>
            <NavigationGroup>
            {/*    <ActiveFriend authname={authname} user={user}/>*/}
            {/*    {friend.action === 'REQUESTING' && <span className="sidebar-waiting">*/}
            {/*        <i className="fas fa-clock"/>*/}
            {/*    </span>}*/}

            <UserLink grayscale
                      waiting={friend.action === 'REQUESTING' ? true : null}
                      to={homespace}
                      avatar={user.avatar}
                      text={fullname}/>

            </NavigationGroup>
            <NavigationGroup>

            {friend.action === 'REQUESTED' && <Fragment>

                <FlatIcon circle title={`Confirm ${user.firstname} as friend`}
                          className='fas fa-user-check' onClick={ (event) => {
                    event.preventDefault();
                    props.asyncAcceptFriend(authname, user.username, (params) => {
                        toastr.info(`You have confirmed ${user.firstname} friendship.`);
                    });
                }}/>

                <FlatIcon circle title={`Ignore ${user.firstname}`}
                          className='fas fa-user-minus' onClick={ (event) => {
                    event.preventDefault();
                    props.asyncIgnoreFriend(authname, user.username, (params) => {
                        toastr.warning(`You have ignored ${user.firstname} friendship's request.`);
                    });
                }}/>

            </Fragment>}

            {friend.action === 'REQUESTING' && <FlatIcon circle title={`Cancel request to ${user.firstname}`}
                          className='fas fa-user-minus' onClick={ (event) => {
                    event.preventDefault();
                    props.asyncCancelFriend(authname, user.username, (params) => {
                        toastr.warning(`You have cancelled your friendship's request to ${user.firstname}.`);
                    });
                }}/>}

            </NavigationGroup>

        </NavigationRow>
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