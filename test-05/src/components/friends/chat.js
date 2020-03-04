/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [chat.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.03.20, 16:18
 */

import React from 'react';
import {connect} from 'react-redux';
import {UserLink} from "../navigation-headlines/nav-headlines";
import {getAuthorizedUsername} from "../../selectors";

const Chat = (props) => {
    const {className, authname, friend} = props;
    if(!friend) return null;

    const homespace = `/${friend.username}/home`;

    return <div className={`chat-container box-white ${className ? className : ''}`}>
        <UserLink bigger className='box-light-gray'
                  to={homespace} avatar={friend.avatar} text={friend.fullname}/>

                  [Some cooler chat..]

    </div>
};

const mapStateToProps = (state) => ({
    authname: getAuthorizedUsername(state),
    friend: state.friend,
});

export default connect(mapStateToProps, {})(Chat);