/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [comment-entry.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.10.18 13:17
 */

import emojione from '../../../node_modules/emojione/lib/js/emojione';
import moment from 'moment';

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {isAuthorized} from "../../selectors";

class CommentText extends Component {

    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;
        emojione.ascii = true;
    }

    render() {
        const {comment} = this.props;

        return <div className="comment-text">
                <div className='comment-entry-text' ref={(elem) => {
                    if (elem != null) {
                        elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
                    }
                }}>{comment.text}
                    <span className="comment-created">{moment(comment.created).fromNow()}</span>
                </div>
            </div>
    }
}

const mapStateToProps = (state) => ({
    isAuthorized: isAuthorized(state),
});

export default withRouter(connect(mapStateToProps, {})(CommentText));