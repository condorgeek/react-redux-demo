import React, { Component } from 'react';

export default class PostComment extends Component {

    render() {
        return(
            <div className='post-comment'>
                <a data-toggle="collapse" href={`#comment${this.props.id}`}
                   aria-expanded="false" aria-controls={this.props.id}>[3 Comments]</a>

                <div className="collapse" id={`comment${this.props.id}`}>
                    <ul><li>Comment 1</li><li>Comment 2</li><li>Comment 3</li></ul>
                </div>
            </div>
        );
    }
}
