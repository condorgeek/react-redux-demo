import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Holder from 'src/components/util/holder';

import {fetchPosts} from '../../actions/index';

class PostsIndex extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }

    renderPosts() {
        return (_.map(this.props.posts, post => {
                return (
                    <Link to={`/posts/${post.id}`}>
                        <Holder className="mr-3"/>
                        <div className="media-body">
                            key={post.id}>{post.title}
                        </div>
                    </Link>
                );
            })
        );
    }


    // <li className="list-group-item" key={post.id}>{post.title}</li>
//     <div class="media">
//   <img class="mr-3" src="..." alt="Generic placeholder image">
//   <div class="media-body">
//     <h5 class="mt-0">Media heading</h5>
//     Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
//   </div>
// </div>

// <div className='media'>
//                     <ul className="list-group"> {this.renderPosts()} </ul>

    render() {
        return (
            <div className='container'>
                <div className='align-right'>
                    <Link className='btn btn-primary' to='/posts/new'>Add a Post</Link>
                </div>

                <h3>Posts</h3>
                <div className='media'> {this.renderPosts()}</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {posts: state.posts};
}

export default connect(mapStateToProps, {fetchPosts})(PostsIndex);