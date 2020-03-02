import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component, createContext, useContext} from 'react';
import {FlatButton, FlatIcon, FlatLink, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {ImageBoxSmall} from "../sidebar/boxes/image-box-small";
import {UserBoxBig} from "../boxes/user-box-big";

export const HeadlineTitle = props => {
    const {className, title, icon, ...otherProps} = props;
    if (!title) return null;

    return <NavigationRow className='headline-border'>
        <NavigationGroup>
            <div className={`headline-title ${className && className}`}>
                <Icon className={icon}/>
                {title}
            </div>
        </NavigationGroup>
        <NavigationGroup {...otherProps}>
            <FlatIcon circle>
                <Icon className="fas fa-chevron-up headline-icon-rotate" onClick={(event) => {
                    event.target.classList.toggle('down');
                }}/>
            </FlatIcon>
        </NavigationGroup>
    </NavigationRow>
};


export const SidebarHeadline = (props) => {
    const {className, title, ...otherProps} = props;

    return <NavigationRow className='sidebar-border'>
        <NavigationGroup>
            <span className='sidebar-headline-title'>{title}</span>
        </NavigationGroup>
        <NavigationGroup {...otherProps}>
            {props.children}
        </NavigationGroup>
    </NavigationRow>
};

export const SidebarEntry = (props) => {
};


export const TogglerContext = createContext({});
export class NavigationToggler extends Component {

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    toggle = (event) => {
        event && event.preventDefault();
        this.togglerRef.classList.toggle('active-show');
    };

    hide = (event) => {
        event && event.preventDefault();
        this.togglerRef.classList.remove('active-show');
    };

    show = (event) => {
        event && event.preventDefault();
        this.togglerRef.classList.add('active-show');
    };

    render() {
        const {className, show, onRef, ...otherProps} = this.props;

        return <TogglerContext.Provider value={{toggle: this.toggle, hide: this.hide, show: this.show}}>
            <div className={`active-space-toggle ${className ? className :''} ${show ? 'active-show' : ''}`} {...otherProps}
                 ref={(ref) => this.togglerRef = ref}>
                {this.props.children}
            </div>
            </TogglerContext.Provider>
    }
}


// -------------------------------------------------------------------------------
// TODO FIX BUG: OverlayScrollbars is changing the width of the scroll element
// -------------------------------------------------------------------------------
export const NavigationScrollbar = (props) => {
    const {className, hidden, ...otherProps} = props;

    return <div className={`navigation-scrollbar ${className ? className : ''}`} {...otherProps} ref={(ref) => {{
        ref && setTimeout(() => {
            OverlayScrollbars(ref, {
                paddingAbsolute: true,
                scrollbars : {visibility: hidden ? "hidden" : "visible"},
            });
        }, 1000);
    }}}>
        {props.children}
    </div>
};


export const ImageLink = (props) => {
    const {className, to, image, text} = props;

    return <FlatLink
        className={`${className ? className : ''}`}
        to={to}>
            <ImageBoxSmall image={image}/>
            <span className='share-post-text'>{text}</span>
    </FlatLink>
};

export const UserLink = (props) => {
    const {className, to, avatar, text, ...otherProps} = props;

    return <FlatLink
        className={`${className ? className : ''}`}
        to={to}>
        <UserBoxBig avatar={avatar} {...otherProps}/>
        <span className='user-link-text'>{text}</span>
    </FlatLink>
};


export const AvatarLink = (props) => {
    const {className, to, avatar, text} = props;

    return <FlatLink
        className={`${className ? className : ''}`}
        to={to}>
        <img className='avatar-link-img' src={avatar}/>
        <span className='avatar-link-text'>{text}</span>
    </FlatLink>
};



