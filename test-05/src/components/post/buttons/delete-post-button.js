/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [delete-post-button.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.02.20, 12:40
 */
import toastr from "../../../../node_modules/toastr/toastr";

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Tippy from "../../tippy/Tippy";

import {asyncDeletePost} from "../../../actions";
import {localDeleteMedia} from "../../../actions/spaces";

class DeletePostButton extends Component {

    constructor(props) {
        super(props);
        this.tooltips = [];
    }

    componentWillUnmount() {
        this.tooltips.forEach(t => {
            t.destroy();
        });
        this.tooltips = [];
    }

    /** this works as advertised - event bubbling fine ! :-) */
    renderFragment(authname, postId) {
        const data = {authname: authname, postId: postId};

        return <Fragment>
            <div className="generic-tooltip-entry">
                Are you sure to delete this post ?
                <div className="generic-tooltip-buttons">

                    <button className="btn btn-tooltip btn-sm" onClick={event => {
                        event.stopPropagation();
                        this.tippy.hide();
                    }}>Cancel
                    </button>

                    <button className="btn btn-tooltip btn-sm" onClick={event => {
                        event.stopPropagation();

                        this.props.asyncDeletePost(authname, postId, post => {
                            this.props.localDeleteMedia(post.media || []);
                            toastr.info(`You have deleted a post from ${post.user.firstname}`);
                        });
                        this.tippy.hide();
                    }}>Delete
                    </button>
                </div>
            </div>
        </Fragment>
    }

    render() {
        const {authname, postId} = this.props;
        /** this works as advertised - event bubbling fine ! :-) */
        return <Tippy content={this.renderFragment(authname, postId)}
                      interactive={true} arrow={false} arrowType='round'
                      onCreate={instance => {
                          this.tippy = instance;
                          this.tooltips.push(instance);
                      }}>
            <button type="button" className="btn btn-darkblue btn-sm navigation-icon">
                <i className="fas fa-trash-alt"/>
            </button>
        </Tippy>
    }
}

export default withRouter(connect(null, {asyncDeletePost, localDeleteMedia})(DeletePostButton));

