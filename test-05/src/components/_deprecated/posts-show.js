/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [posts-show.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.09.18 21:01
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconLink, { IconClick }from '../util/icon-link';

import Holder from '../util/holder';
import {LOREM_IPSUM} from './lorem-ipsum';
import {fetchPost, deletePost} from "../../actions/index";

import './components.css';

class PostsShow extends Component {

    componentDidMount() {
        const {id} = this.props.match.params;

        this.props.fetchPost(id, () => {
            console.log('Post fetched successfully..')
        });
    }

    deletePost(){
        const {id } = this.props.match.params;
        this.props.deletePost(id, () => {
            this.props.history.push('/');
        });
    }

    render() {
        const {post} = this.props;

        if (post == null) {
            return <div>Loading.. </div>
        }
        return (
            <div className=''>
                <div className='float-right'>
                    <IconClick icon='fa-trash'
                               onClick={this.deletePost.bind(this)}>
                        DeletePost
                    </IconClick>
                    <IconLink to='/' icon='fa-bars'>Back To Index</IconLink>
                </div>

                <h3>Details</h3>
                <div className='card bg-light'>
                    <div className="card-header">
                        <h4>{post.title.toUpperCase()}</h4>
                    </div>
                    <div className="card-body">
                        <Holder className='float-left' height='200' width='240' theme='sky' text='image'/>
                        <div className='card bg-light block'>
                            <div className='card-body '>
                                <p className='card-title'><h4>{post.title}</h4></p>
                                <p className='card-text'>Categories: {post.categories}</p>
                                <p className='card-text'>Content: {post.content}</p>
                                <p>{LOREM_IPSUM}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

function mapStateToProps({posts}, ownProps) {
    return {post: posts[ownProps.match.params.id]};
}

export default connect(mapStateToProps, {fetchPost, deletePost})(PostsShow);