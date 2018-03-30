import React from 'react';
import {Link} from 'react-router-dom';

export default (props) => {
    const className = `flat-icon fa ${props.icon}`;
    return (
        <Link className='display-inline' to={props.to}>
            <div className='flat-menu'>
                <i className={className}/>{props.children}
            </div>
        </Link>
    )
}

export function IconClick(props) {
    const className = `flat-icon fa ${props.icon}`;

    return (
        <div className='display-inline'>
            <a href='#' onClick={props.onClick}>
                <div className='flat-menu'>
                    <i className={className}/>{props.children}
                </div>
            </a>
        </div>
    )

}