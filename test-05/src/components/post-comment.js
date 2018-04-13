import emojione from '../../node_modules/emojione/lib/js/emojione';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {fetchComments} from '../actions';

class PostComment extends Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
        emojione.imagePathPNG = '/static/emojione-assets/png/32/';
    }

    renderEmoji(text) {
        // var input = document.getElementById('inputText').value;
        // var output = emojione.shortnameToImage(input);
        // document.getElementById('outputText').innerHTML = output;

        const emoji = emojione.shortnameToImage(text);
        return (<div>{emoji}</div>);
    }

    componentDidMount() {
        this.props.fetchComments(this.props.id);
        const textarea = `#textarea${this.props.id}`;
        this.setState = {count: this.props.comments.length};
    }

    renderComments(comments) {

        if (comments == null || comments === undefined) {
            return <div>Loading..</div>
        }

        if (comments.length > 0) {
            return comments.map(entry => {
                if (entry === undefined) return (<li className='comment-item'>Loading..</li>);

                return (<li className='comment-item'>
                    <div className='header'>
                        <Link to={`/author/${entry.user}/00`}><img className='user-thumb' src={entry.thumb}/>
                            {entry.user}
                        </Link>
                        <span className='when'>{entry.when}</span>
                    </div>
                    <div className='body'>{this.renderEmoji(entry.comment)}</div>
                </li>)
            });
        }
    }

    render() {
        return (
            <div className='post-comment'>
                <a data-toggle="collapse" href={`#comment${this.props.id}`}
                   aria-expanded="false" aria-controls={this.props.id}>
                    {this.props.comments.length} Comments
                    <i className="fa fa-commenting-o" aria-hidden="true"/>
                </a>

                <div className="collapse" id={`comment${this.props.id}`}>
                    <ul className='list-group'>
                        {this.renderComments(this.props.comments)}
                        <div className='new-comment'>
                            <i className="fa fa-smile-o ir-2" aria-hidden="true"/>
                            <i className="fa fa-commenting-o" aria-hidden="true"/>
                            <textarea id={`textarea${this.props.id}`} placeholder="You.."/>
                        </div>
                    </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {comments: state.comments}
}

export default connect(mapStateToProps, {fetchComments})(PostComment);