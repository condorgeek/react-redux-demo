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
import {showTooltip} from "../../actions/tippy-config";
import LikeNavigation from "./like-navigation";

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

    isFullview(text) {
        const regex = /<div.*[class|className]\s*=.*fullview.*?>/ig;
        return this.props.fullview ? true : regex.test(text);
    }

    breakText(text, num) {
        return text.split(" ").splice(0, num).join(" ");
    }

    render() {
        const {authorization, post, allowComments} = this.props;
        const {text = '', created, state, fullview, id} = post;
        const shared = state === 'SHARED' ? 'shared' : 'posted';
        const isOverflow = !this.isFullview(text) && text.length > 640;
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

            {allowComments && <div className="content-created" >
                {/*{isAuthorized && <StarRating post={this.props.post} authorization={authorization}/>}*/}
                <span className="ml-2">{shared} {moment(created).fromNow()}</span></div>}
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
        const allowComments = authorization.isAuthorized || (configuration && configuration.public.comments === true);

        return (
            <div className='post-content'>
                <ContentText post={post} allowComments={allowComments} authorization={authorization}/>
                <LikeNavigation authname={authorization.user.username} post={post} username={username}
                                postId={post.id} spacename={spacename}
                                authorization={authorization}
                                configuration={configuration}/>
            </div>
        );
    }
}