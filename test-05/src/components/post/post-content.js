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

import emojione from '../../../node_modules/emojione/lib/js/emojione';
import he from '../../../node_modules/he/he';
import moment from 'moment';

import React, {Component} from 'react';
import PostNavigation from './post-navigation';
import {showTooltip} from "../../actions/tippy-config";
import {LOGIN_STATUS_SUCCESS} from "../../actions";


class ContentText extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.tooltips = [];
    }

    componentWillUnmount() {
        this.tooltips.forEach(tooltip => {tooltip.destroy();}); this.tooltips = [];
    }

    componentDidMount() {
        this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    }

    componentDidUpdate() {
        this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    }

    getIcon() {
        return this.state.open ? <span><i className="far fa-minus-square"/> Less..</span>:
            <span><i className="far fa-plus-square"/> More..</span>;
    }

    getTitle() {
        return this.state.open ? 'Less content': 'More content'
    }

    asHtml(text) {
        return <div className="d-inline" dangerouslySetInnerHTML={{__html: he.decode(text)}}/>
    }

    breakText(text, num) {
        return text.split(" ").splice(0, num).join(" ");
    }

    render() {
        const {text = '', created, state, id} = this.props.post;
        const shared = state === 'SHARED' ? 'shared' : 'posted';
        const isOverflow = text.length > 640;
        const content = isOverflow && !this.state.open ? this.breakText(text, 80) : text;

        return <div className="content-text">
            <div className="d-inline" ref={(elem) => {
                if(elem === null) return;
                this.refElem = elem;
                elem.innerHTML = emojione.shortnameToImage(he.decode(elem.innerHTML));
            }}>{content}
            </div>

            {isOverflow && <button className="btn btn-more btn-sm" title={this.getTitle()}
                    onClick={event => {
                        event.preventDefault();
                        this.setState({open: !this.state.open});
                        setTimeout(() => {
                            if (document.activeElement !== document.body) document.activeElement.blur();
                        }, 500)
                    }} ref={elem => {
                        if (elem === null) return;
                        this.tooltips.push(showTooltip(elem));
                    }}>{this.getIcon()}</button>}

            <span className="content-created" >{shared} {moment(created).fromNow()}</span>
        </div>
    }

}

export default class PostContent extends Component {

    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    render() {
        const {authorization, username, post, spacename, configuration} = this.props;
        const isAuthorized = authorization.status === LOGIN_STATUS_SUCCESS;

        return (
            <div className='post-content'>
                <ContentText post={post}/>
                <PostNavigation authname={authorization.user.username} post={post} username={username}
                                postId={post.id} spacename={spacename} isAuthorized={isAuthorized}
                                configuration={configuration}/>
            </div>
        );
    }
}