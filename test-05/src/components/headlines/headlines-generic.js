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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace} from "../../actions/spaces";
import {ROOT_STATIC_URL} from "../../actions";
import tippy from "../util/tippy.all.patched";

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
                    <div key={idx} className="card">
                        <img title={fullname} className="card-img-top" src={avatar}
                             onClick={event => console.log('MEMBER_CLICK')}
                             ref={(elem) => {
                                 if (elem === null) return;
                                 tippy(elem, {arrow: true, theme: "standard"});
                             }}/>
                    </div>
                </Link>)
        });
    }

    render() {
        const {authorization, space, spacedata, spaceId, members} = this.props;

        if (this.state.location.pathname !== this.props.location.pathname) {
            this.setState({location: this.props.location});
            this.props.asyncFetchMembers(authorization.user.username, spaceId);
        }

        console.log('SPACEDATA', spaceId, members, spacedata);

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
                    <div className="headline-navigation">
                        {spacedata && !spacedata.isMember && <button title="Join space" type="button" className="btn btn-darkblue btn-sm"
                                onClick={(event) => {
                                    event.preventDefault();
                                    // this.props.asyncUnblockFriend(authname, user.username, (params) => {
                                    //     toastr.info(`You have unblocked ${user.firstname}.`);
                                    // });

                                    this.props.asyncJoinSpace(authorization.user.username, spaceId);


                                }}
                                ref={(elem) => {
                                    if (elem === null) return;
                                    tippy(elem, {arrow: true, theme: "standard"});
                                }}><i className="fas fa-user-plus"/>
                        </button>}

                        {spacedata && spacedata.isMember && <button title="Leave space" type="button" className="btn btn-darkblue btn-sm"
                                onClick={(event) => {
                                    event.preventDefault();

                                    this.props.asyncLeaveSpace(authorization.user.username, spaceId, spacedata.member.id);

                                    // this.props.asyncBlockFriend(authname, user.username, (params) => {
                                    //     toastr.info(`You have blocked ${user.firstname}.`);
                                    //
                                    // });
                                }}
                                ref={(elem) => {
                                    if (elem === null) return;
                                    tippy(elem, {arrow: true, theme: "standard"});
                                }}><i className="fas fa-user-minus"/>
                        </button>}
                    </div>
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
    return {authorization: state.authorization, members: state.members,
        spacedata: state.spacedata ? state.spacedata.payload : null};
}

export default connect(mapStateToProps, {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace})(HeadlinesGeneric);