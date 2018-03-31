import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconLink from '../components/util/icon-link';
import AuthorLink from '../components/author-link';
import {randompic, userthumb} from "../static/index";
import HeartToggler from '../components/heart-toggler';

import {fetchPosts} from '../actions/index';

class PostsIndex extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }

    renderPosts() {
        const names = ['Jack London', 'Thomas Right', 'Lena Deutsch', 'Barbara Stevens'];

        return (_.map(this.props.posts, post => {

                const title = post.title.toUpperCase();
                const picture = randompic();
                const mins = Math.floor((Math.random()*59)+1);
                const name = names[Math.floor((Math.random()*4)+1)-1];

                return (
                    <div className="card">
                        <div className='card-placeholder'>
                            <a title={picture} href={`/posts/${post.id}`}>
                                <img className="card-img" src={picture}/>
                            </a>
                        </div>
                        <div className="card-body">

                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">
                                This is a wider card with supporting text below as a natural lead-in to additional
                                content. This content is a little bit longer.
                            </p>
                            <div className='icon-link'>
                                <IconLink to={`/posts/${post.id}`} icon='fa-id-card-o'>
                                    <span className='text'>Details</span>
                                </IconLink>
                                <span className='align-right'><HeartToggler/></span>
                            </div>
                        </div>

                        <div className="card-footer">
                            <div className='user-thumb-wrapper'>
                                <AuthorLink img={userthumb()}
                                            name={name}
                                            to={`/author/${name}/${post.id}`}/>
                                <span className='text'>{mins} min ago</span>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    }

    render() {
        return (
            <div className=''>
                <div className='align-right'>
                    <IconLink to='/posts/new' icon='fa-plus-square'>Add a Post</IconLink>
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