import React, {Component} from 'react';

export default class Sidebar extends Component {

    render() {
        return(
            <div className='sidebar'>
                <h3>Sidebar</h3>
                <ul><li>User 1</li><li>User 2</li></ul>
            </div>
        );
    }
}