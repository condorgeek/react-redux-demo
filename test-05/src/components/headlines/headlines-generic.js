/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [headlines-generic.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.10.18 15:48
 */

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import toastr from "../../../node_modules/toastr/toastr";
import tippy from "../util/tippy.all.patched";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace, updateSpaceData, updateCreateSpace, updateDeleteSpace} from "../../actions/spaces";
import {ROOT_STATIC_URL} from "../../actions";

export class HeadlinesGeneric extends Component {

    constructor(props) {
        super(props);
        this.state = {location: props.location};
    }

    componentDidMount() {
        const {authorization, spaceId} = this.props;
        OverlayScrollbars(document.getElementById('pictures-container-id'), {});
        this.props.asyncFetchMembers(authorization.user.username, spaceId);
    }

    renderMembers(members) {
        return members.map((member, idx) => {
            const homespace = `/${member.user.username}/home`;
            const avatar = `${ROOT_STATIC_URL}/${member.user.avatar}`;
            const fullname = `${member.user.firstname} ${member.user.lastname}`;

            return (
                <Link to={homespace}>
                    <div key={idx} className="card headline-member">
                        <img title={fullname} className="card-img-top" src={avatar}
                             onClick={event => console.log('MEMBER_CLICK')}
                             ref={(elem) => {
                                 if (elem === null) return;
                                 tippy(elem, {arrow: true, theme: "standard"});
                             }}/>
                        {/*{member.role === 'OWNER' && <span className="member-owner"><i className="fas fa-crown"/></span>}*/}
                        {member.role === 'OWNER' && <span className="member-triangle"/>}
                    </div>
                </Link>)
        });
    }

    renderMembersNavigation(authorization, spacedata, spaceId) {

        const isOwner = spacedata && (spacedata.space.user.username === authorization.user.username);
        const isMember = spacedata && spacedata.isMember;

        return <div className="headline-navigation">
            {!isOwner && !isMember && <button title="Join space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncJoinSpace(authorization.user.username, spaceId, (member) => {
                            spacedata.isMember = true;
                            spacedata.members = spacedata.members + 1;
                            spacedata.member = member;
                            this.props.updateSpaceData(spacedata);
                            this.props.updateCreateSpace(spacedata.space);
                            toastr.info(`You have joined ${spacedata.space.name}`);
                        });
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        tippy(elem, {arrow: true, theme: "standard"});
                    }}><i className="fas fa-user-plus"/>
            </button>}

            {!isOwner && isMember && <button title="Leave space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncLeaveSpace(authorization.user.username, spaceId, spacedata.member.id,
                            (member) => {
                                spacedata.isMember = false;
                                spacedata.members = spacedata.members - 1;
                                spacedata.member = null;
                                this.props.updateSpaceData(spacedata);
                                this.props.updateDeleteSpace(spacedata.space);
                                toastr.info(`You have left ${spacedata.space.name}`);
                            });
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        tippy(elem, {arrow: true, theme: "standard"});
                    }}><i className="fas fa-user-minus"/>
            </button>}
        </div>
    }

    render() {
        const {authorization, space, spacedata, spaceId, members} = this.props;

        if (this.state.location.pathname !== this.props.location.pathname) {
            this.setState({location: this.props.location});
            this.props.asyncFetchMembers(authorization.user.username, spaceId);
        }

        return (
            <div className='headlines-container'>

                <div className='headline'>
                    <h5>About this Space</h5>
                    {/*<ul>*/}
                    {/*{members && this.renderMembers(members)}*/}
                    {/*</ul>*/}
                </div>

                <div className='headline'>
                    <h5>Members ({members ? members.length : 0})</h5>
                    {spacedata && this.renderMembersNavigation(authorization, spacedata, spaceId)}
                </div>

                <div id='pictures-container-id' className='members-container'>
                    <div className='card-columns'>
                        {members && this.renderMembers(members)}
                    </div>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authorization: state.authorization, members: state.members,
        spacedata: state.spacedata ? state.spacedata.payload : null
    };
}

export default connect(mapStateToProps, {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace,
    updateSpaceData, updateCreateSpace, updateDeleteSpace})(HeadlinesGeneric);