/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [members.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 28.02.20, 15:02
 */

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import moment from 'moment';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {asyncFetchMembersPage} from '../../actions/spaces';
import {localMemberProfile} from "../../actions";
import {getAuthorizedUsername, getGenericData, isAuthorized, isOwner, isSuperUser} from "../../selectors";
import {showForceVisibleImages, showVisibleImages} from "../../actions/image-handler";
import {FlatIcon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {UserLink} from "../navigation-headlines/nav-headlines";
import RemoveMemberDialog from "./dialogs/remove-member-dialog";

class Members extends Component {
    localstate = {next: 0, first: 0, last: 0, when: null};

    componentDidMount() {
        const {authname, spaceId} = this.props;

        this.props.asyncFetchMembersPage(authname, spaceId, 0, 50, page => {
            this.localstate = {next: page.number + 1, first: page.first, last: page.last, when: moment()};
        });
    }

    onScrollStop = (event) => {
        const {authname, spaceId} = this.props;
        const {next, last, first, when} = this.localstate;

        const elem = event.target;
        showForceVisibleImages(elem);

        /* fetch next page of members */
        if(!last && (elem.scrollTop + elem.clientHeight + 100 >= elem.scrollHeight)) {
            this.props.asyncFetchMembersPage(authname, spaceId, next, 50, page => {
                this.localstate.setState({next: page.number + 1, first: page.first, last: page.last, when: moment()});
            });
        }
    };

    renderMembers = (members) => {
        const {isSuperUser, isOwner, authname, genericdata, isAuthorized} = this.props;
        const isRemoveAllowed = isAuthorized && (isSuperUser || isOwner);

        return members.map(member => {
            const homespace = `/${member.user.username}/home`;
            const fullname = `${member.user.firstname} ${member.user.lastname}`;
            const isSelf = authname === member.user.username;

            return <NavigationRow className='members-generic-entry'>
                    <NavigationGroup>
                        <UserLink grayscale to={homespace} avatar={member.user.avatar} text={fullname}/>
                    </NavigationGroup>
                    <NavigationGroup>
                        {isRemoveAllowed && !isSelf &&
                            <RemoveMemberDialog authname={authname}
                                                member={member}
                                                space={genericdata.space}/>
                        }
                        <FlatIcon circle title={`${member.user.firstname} infos`}
                                  className='fas fa-bookmark' onClick={(event) => {
                            this.props.localMemberProfile(member);
                        }}/>
                    </NavigationGroup>
                </NavigationRow>
        });
    };


    render() {
        const {members} = this.props;

        return <div className='members-generic-container'
                    onScroll={event => {
                        showVisibleImages(event.target);}}
                    ref={elem => {
                        elem && setTimeout(() => {
                            OverlayScrollbars(elem, {
                                scrollbars: {visibility: "hidden"},
                                callbacks: {onScrollStop: this.onScrollStop}});
                            showVisibleImages(elem);
                        }, 1000);
                    }}>
            <div>
                {this.renderMembers(members)}
            </div>
        </div>
    }
}

const mapStateToProps = (state) => ({
    isAuthorized: isAuthorized(state),
    authname: getAuthorizedUsername(state),
    isSuperUser: isSuperUser(state),
    isOwner: isOwner(state),
    genericdata: getGenericData(state),
    members: state.members,
});

export default connect(mapStateToProps, {asyncFetchMembersPage, localMemberProfile})(Members)