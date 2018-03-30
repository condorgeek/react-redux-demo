import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Holder from '../util/holder';

import {fetchPosts} from '../../actions/index';

class PostsIndex extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }


    renderPosts() {
        return (_.map(this.props.posts, post => {

                const title = post.title.toUpperCase();
                return (
                    <div className="card">
                        <Holder className="mr-3" height='120' width='160'/>
                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">
                                This is a wider card with supporting text below as a natural lead-in to additional
                                content. This content is a little bit longer.
                            </p>
                            <Link to={`/posts/${post.id}`}>
                                <div className='flat-menu' style={{marginLeft: '26px'}}>
                                    <i className="material-icons flat-icon">art_track</i>Details
                                </div>
                            </Link>
                        </div>
                        <div className="card-footer">
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </div>
                    </div>

                );
            })
        );
    }

    render() {
        return (
            <div className='container'>
                <div className='align-right'>
                    <Link className='' to='/posts/new'>
                        <div className='flat-menu'>
                            <i className="material-icons flat-icon">add_box</i>Add a Post
                        </div>
                    </Link>
                </div>

                <h3>Posts</h3>

                <div className='card-columns'> {this.renderPosts()}</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {posts: state.posts};
}

export default connect(mapStateToProps, {fetchPosts})(PostsIndex);