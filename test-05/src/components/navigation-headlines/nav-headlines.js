import React, {Component} from 'react';
import {FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {GENERIC_SPACE} from "../../actions/spaces";

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

    return <NavigationRow>
        <NavigationGroup>
            <span className='sidebar-headline-title'>{title}</span>
        </NavigationGroup>
        <NavigationGroup {...otherProps}>
            {props.children}
        </NavigationGroup>
    </NavigationRow>
};

export class SidebarToggler extends Component {
    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    toggle = () => {
        this.togglerRef.classList.toggle('active-show');
    };

    render() {
        const {className, ...otherProps} = this.props;

        return <div className={`active-space-toggle ${className && className}`} {...otherProps}
                    ref={(ref) => this.togglerRef = ref}>
         {this.props.children}
     </div>
    }
}

