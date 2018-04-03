import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchComments} from '../actions';

class PostComment extends Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
    }

    componentDidMount() {
        this.props.fetchComments(this.props.id);
    }

    renderComments(comments) {
        if(comments == null || comments === undefined){
            return <div>Loading..</div>
        }

        if (comments.length > 0) {
            return comments.map(entry => {
                if(entry === undefined) return(<li className='comment-item'>Loading..</li>);

                return (<li className='comment-item'>
                    <div className='header'>
                        <a href=''><img src={entry.thumb}/>{entry.user}</a>
                        <span className='when'>{entry.when}</span>
                    </div>
                    <div className='body'>{entry.comment}</div>
                </li>)
            });
        }
    }

    render() {
        return (
            <div className='post-comment'>
                <a data-toggle="collapse" href={`#comment${this.props.id}`}
                   aria-expanded="false" aria-controls={this.props.id}>
                    {/*{`[${this.props.comments.length} Comments]`}*/}
                    {this.props.comments.length}
                    <i className="fa fa-commenting-o" aria-hidden="true"/>
                </a>

                <div className="collapse" id={`comment${this.props.id}`}>
                    <ul className='list-group'>
                        {this.renderComments(this.props.comments)}
                        <div className='you-comment'>
                            <i className="fa fa-commenting-o" aria-hidden="true"/>
                            <textarea placeholder="You.."></textarea>
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