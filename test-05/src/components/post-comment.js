// Emoji documentation:
// https://github.com/emojione/emojione/blob/master/INSTALLATION.md
// https://www.webpagefx.com/tools/emoji-cheat-sheet/
// https://www.emojicopy.com/

import $ from 'jquery';
import emojione from '../../node_modules/emojione/lib/js/emojione';
// import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchComments} from '../actions';
import EmojiPanel from './emoji-panel';

window.jQuery = $;

class Emoji extends Component {

    componentDidMount() {
        const comments = document.getElementsByClassName(`emoji-comment-item${this.props.idx}`);
        [...comments].forEach(elem => {
            elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
        });
    }

    render() {
        return (<div ref='emoji' className={`emoji-comment-item${this.props.idx} emoji-comment-item`}>
            {this.props.comment}
        </div>);
    }

}

class PostComment extends Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        this.props.fetchComments(this.props.id);
        const textarea = `textarea${this.props.id}`;

        // OverlayScrollbars(document.getElementById(textarea), {});
    }

    renderComments(id, comments) {

        if (comments == null || comments === undefined) {
            return <div>Loading..</div>
        }

        if (comments.length > 0) {
            return comments.map((entry, idx) => {

                if (entry === undefined) return (<li className='comment-item'>Loading..</li>);
                const username =`${entry.user.firstname} ${entry.user.lastname}`;

                return (<li className='comment-item'>
                    <div className='header'>
                        <Link to={`/author/${entry.user}/00`}><img className='user-thumb' src={entry.user.thumbnail}/>
                            {username}
                        </Link>
                        <span className='when'>{entry.when}</span>
                    </div>
                    <div className='body'>
                        <Emoji idx={`${id}-${idx}`} comment={entry.text}/>
                    </div>
                </li>)
            });
        }
    }

    render() {

        if (this.props.comments == null || this.props.comments === undefined) {
            return <div>Loading..</div>
        }

        return (
            <div className='post-comment'>

                <a data-toggle="collapse" href={`#comment${this.props.id}`}
                   aria-expanded="false" aria-controls={this.props.id}>
                    {this.props.comments.length} Comments
                    <i className="fa fa-commenting-o" aria-hidden="true"/>
                </a>

                <div className="collapse" id={`comment${this.props.id}`}>
                    <ul className='list-group'>
                        {this.renderComments(this.props.id, this.props.comments)}
                        <div className='new-comment'>
                            <i className="fa fa-smile-o ir-2" aria-hidden="true" onClick={(event) => {
                                event.preventDefault();
                                $(`#emojipanel${this.props.id}`).collapse('toggle');
                            }}/>
                            <i className="fa fa-commenting-o" aria-hidden="true"/>
                            <textarea id={`textarea${this.props.id}`} placeholder="You.."/>

                            <div className="collapse" id={`emojipanel${this.props.id}`}>
                                <EmojiPanel id={this.props.id}/>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {comments: state.comments[ownProps.id]}
}

export default connect(mapStateToProps, {fetchComments})(PostComment);