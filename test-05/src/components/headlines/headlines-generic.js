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

import {randompic} from "../../static/index";
import MediaGallery from './media-gallery';
import {asyncFetchMembers} from "../../actions/spaces";
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

    createPics() {
        return Array(20).fill(0).map((idx) => {
            return randompic();
        })
    }

    // renderPics() {
    //     const {images} = this.state;
    //
    //     return images.map((image, idx) => {
    //         return (<div key={idx} className="card">
    //             <img className="card-img-top" src={image}
    //                  onClick={() => this.refs.imagegallery.renderLightbox(idx)}/>
    //         </div>)
    //     })
    // }

    // renderMembers(members) {
    //     return members.map(member => {
    //         return <li>{member.user.username}</li>
    //     });
    // }

    renderMembers(members) {
        return members.map((member, idx) => {
            const avatar = `${ROOT_STATIC_URL}/${member.user.avatar}`;

            return (<div key={idx} className="card">
                <img className="card-img-top" src={avatar}
                     onClick={event => console.log('MEMBER_CLICK')}/>
            </div>)
        });
    }

    render() {
        const {authorization, space, spaceId, members} = this.props;

        if(this.state.location.pathname !== this.props.location.pathname) {
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
                    <h5>Members</h5>
                    <span onClick={event => console.log('MENU_CLICK')}>
                        <i className="fa fa-th-large" aria-hidden="true"/>Picture Gallery</span>
                </div>
                <div id='pictures-container-id' className='members-container'>
                    <div className='card-columns'>
                        {members && this.renderMembers(members)}
                    </div>
                </div>

                {/*<MediaGallery media={this.state.images} ref='imagegallery'/>*/}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, members: state.members};
}

export default connect(mapStateToProps, {asyncFetchMembers})(HeadlinesGeneric);