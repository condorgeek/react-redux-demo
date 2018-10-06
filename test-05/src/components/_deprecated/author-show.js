import React, {Component} from 'react';

export default class AuthorShow extends Component {

    render() {
        const {id, author} = this.props.match.params;

        return (
            <div>
                <h3>AuthorShow</h3>
                <p>Id: {id}</p>
                <p>Author: {author}</p>
            </div>
        );
    }
}