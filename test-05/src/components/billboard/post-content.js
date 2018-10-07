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
 * Last modified: 05.10.18 20:25
 */

import $ from 'jquery';
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import moment from 'moment';

import React, {Component} from 'react';
import PostNavigation from '../emoji/post-navigation';

export default class PostContent extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        const toggler = '#' + this.props.id;

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
        const {authorization, username, content, id, likes, created} = this.props;
        const partial = content.length > 200 ? this.toggler(content, id) : content;

        return (
            <div className='post-content'>
                {partial.length > 0 && <div className="content-text" ref={(elem) => {
                    if(elem === null) return;
                    elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
                }}>
                    {content}
                    <span className="content-created">{moment(created).fromNow()}</span></div>}

                <PostNavigation authorization={authorization} username={username} id={id} likes={likes}/>
            </div>
        );
    }
}