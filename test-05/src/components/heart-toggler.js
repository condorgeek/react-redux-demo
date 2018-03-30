import React, {Component} from 'react';


export default class HeartToggler extends Component {

    constructor(props) {
        super(props);
        this.state = {status: false, total: Math.floor((Math.random() * 1000) + 1)};
    }

    onHeartClick(event) {
        event.preventDefault();
        const update = !this.state.status;
        this.setState({
                status: update,
                total: update ? this.state.total + 1 : this.state.total - 1
            }
        );
    }

    render() {
        const classname = this.state.status ? 'fa-heart' : 'fa-heart-o';
        return (
            <div className='heart-toggler'>
                <a href="" onClick={this.onHeartClick.bind(this)}>
                    <i className={`fa ${classname}`} aria-hidden="true"/>
                </a>
                <span className='text'> {this.state.total}</span>
            </div>
        );
    }
}