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

import React, {useEffect, useRef, useContext} from 'react';
import {connect} from 'react-redux';
import {UserLink} from "../navigation-headlines/nav-headlines";
import {asyncFetchUserData} from "../../actions";
import {ConfigurationContext} from "../configuration/configuration";
import UserInformation from "../user-information/user-information";

const MemberProfile = (props) => {
    const {member, userdata} = props;
    const mountedRef = useRef(false);
    const {Lang} = useContext(ConfigurationContext);

    /* componentDidMount */
    useEffect(() => {
        if(!mountedRef.current && member) {
            props.asyncFetchUserData(member.user.username, (userdata) => {
                mountedRef.current = true;
            });
        }
    }, [member]);

    if(!member) return null;

    const homespace = `/${member.user.username}/home`;
    const fullname = `${member.user.firstname} ${member.user.lastname}`;

    return <div className='member-profile'>
        <UserLink className='box-yellow'
                  to={homespace} avatar={member.user.avatar} text={fullname}/>

        <UserInformation description={member.space.description}
                         firstname={member.user.firstname}
                         userdata={userdata}/>
    </div>
};

const mapStateToProps = (state) => ({
    member: state.member,
    userdata: state.userdata ? state.userdata.userdata : null,
});

export default connect(mapStateToProps, {asyncFetchUserData})(MemberProfile);