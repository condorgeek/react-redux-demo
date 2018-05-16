import React, {Component} from 'react';
import {randompic} from "../static";

export default class Headlines extends Component {

    renderPics() {
        console.log('pics');
        return Array(20).fill(0).map((idx) => {
            console.log(idx);
            return (<div className="card">
                <img className="card-img-top" src={randompic()}/>
            </div>)
        })
    }

    render() {
        return (
            <div className='headlines-container'>
                <div className='card-columns'>
                    {this.renderPics()}
                </div>
            </div>
        );
    }
}