/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [post-content.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.10.18 12:52
 */

import $ from 'jquery';
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import moment from 'moment';

import React, {Component} from 'react';
import PostNavigation from './post-navigation';
import {showTooltip} from "../../actions/tippy-config";


class ContentText extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false}
    }

    getIcon() {
        return this.state.open ? <i className="far fa-minus-square"/> : <i className="far fa-plus-square"/>;
    }

    getTitle() {
        return this.state.open ? 'Less content': 'More content'
    }

    render() {
        const {text = '', created, state} = this.props.post;
        const shared = state === 'SHARED' ? 'shared' : 'posted';
        const isOverflow = text.length > 640;
        const content = isOverflow && !this.state.open ? text.slice(0, 640) : text;

        return <div className="content-text">
            <div className="d-inline" ref={(elem) => {
                if(elem === null) return;
                elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
            }}>{content}</div>

            {isOverflow && <button className="btn btn-darkblue btn-sm" title={this.getTitle()}
                    onClick={event => {
                        event.preventDefault();
                        this.setState({open: !this.state.open})

                    }} ref={elem => {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}>{this.getIcon()}</button>}

            <span className="content-created" >{shared} {moment(created).fromNow()}</span>
        </div>
    }

}

export default class PostContent extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        const toggler = '#' + this.props.post.id;

        this.handleHidden = this.handleHidden.bind(this);
        this.handleOpen = this.handleOpen.bind(this);

        $(toggler).on('hidden.bs.collapse', this.handleHidden);
        $(toggler).on('shown.bs.collapse', this.handleOpen);
    }

    handleHidden() {
        this.setState({open: false});
    }

    handleOpen() {
        this.setState({open: true});
    }

    toggler(content, id) {
        return (
            <div className='post-toggler'>
                {content.slice(0, 640)}

                <span className="collapse" id={id}>
                    {content.slice(640)}
                </span>

                <a className="ml-1" data-toggle="collapse" href={`#${id}`}
                   aria-expanded="false" aria-controls={id}>
                    {this.state.open ? <i className="fa fa-minus-square-o" aria-hidden="true"/> :
                        <i className="fa fa-plus-square-o" aria-hidden="true"/>}
                </a>

            </div>
        );
    }

    render() {
        const {authorization, username, post} = this.props;

        return (
            <div className='post-content'>
                <ContentText post={post}/>
                <PostNavigation authname={authorization.user.username} username={username} postId={post.id}/>
            </div>
        );
    }
}