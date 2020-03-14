/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [member-profile.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 28.02.20, 19:17
 */

import toastr from "toastr";

import React, {useEffect, useRef, useContext} from 'react';
import {connect} from 'react-redux';
import {UserLink} from "../../components/navigation-headlines/nav-headlines";
import {asyncFetchUserData, asyncAddFriend} from "../../actions";
import {ConfigurationContext} from "../../components/configuration/configuration";
import UserInformation from "../../components/user-information/user-information";
import {DefaultButton} from "../../components/navigation-buttons/nav-buttons";
import {getAuthorizedUsername, isAuthorized} from "../../selectors";


const addFriend = (event, props) => {
    event.preventDefault();
    const {authname, member} = props;

    props.asyncAddFriend(authname, member.user.username, friend =>{
        toastr.warning(`You have requested a friendship to ${friend.friend.firstname}.`);
    });
};

const MemberProfile = (props) => {
    const {member, userdata, authname} = props;
    const {Lang} = useContext(ConfigurationContext);

    /* componentDidMount/ componentDidUpdate */
    useEffect(() => {
        if(member) {
            props.asyncFetchUserData(member.user.username, (userdata) => {
                console.log('Retrieved USERDATA', userdata);
            });
        }
    }, [member]);

    if(!member) return null;

    const homespace = `/${member.user.username}/home`;
    const fullname = `${member.user.firstname} ${member.user.lastname}`;

    return <div className='member-profile box-white'>
        <UserLink bigger className='box-light-gray'
                  to={homespace} avatar={member.user.avatar} text={fullname}/>

        <UserInformation className='member-profile-box'
                         description={member.space.description}
                         firstname={member.user.firstname}
                         userdata={userdata}/>

        {isAuthorized &&
        <DefaultButton block className='member-profile-button' onClick={(e) => {
            addFriend(e, props);
            }}>{Lang.button.addFriend}
        </DefaultButton>}

    </div>
};

const mapStateToProps = (state) => ({
    member: state.member,
    isAuthorized: isAuthorized(state),
    authname: getAuthorizedUsername(state),
    userdata: state.userdata ? state.userdata.userdata : null,
});

export default connect(mapStateToProps, {asyncFetchUserData, asyncAddFriend})(MemberProfile);