import React, {Component, createContext, useContext} from 'react';
import {FlatButton, FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
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

    return <NavigationRow className='sidebar-border'>
        <NavigationGroup>
            <span className='sidebar-headline-title'>{title}</span>
        </NavigationGroup>
        <NavigationGroup {...otherProps}>
            {props.children}
        </NavigationGroup>
    </NavigationRow>
};


const TogglerContext = createContext({});
export class SidebarToggler extends Component {

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

    render() {
        const {className, ...otherProps} = this.props;

        return <TogglerContext.Provider value={{toggle: this.toggle}}>
            <div className={`active-space-toggle ${className && className}`} {...otherProps}
                 ref={(ref) => this.togglerRef = ref}>
                {this.props.children}
            </div>
            </TogglerContext.Provider>
    }
}

// ---------------------------------------------------------------------------------------------------
// on Submit implicitely triggers the obSubmit event on the parent form
// onCancel expects to toggle ie close some toggle component ie. a SidebarToggler
// ---------------------------------------------------------------------------------------------------
export const NavigationCancelSubmit = (props) => {
    const {className, onCancel, onSubmit, submitText='Save', ...otherProps} = props;
    const {toggle} = useContext(TogglerContext);

    return <NavigationRow className={`navigation-cancel-submit ${className && className}`}>
        <NavigationGroup/>
        <NavigationGroup>
            <FlatButton btn small title='Cancel' className='btn-light mr-2' onClick={onCancel ? onCancel : toggle}>
                <i className="fas fa-times mr-1"/>Cancel
            </FlatButton>

            <FlatButton btn small type="submit" title='Save' className='btn-outline-primary'>
                <i className="fas fa-save mr-1"/>{submitText}
            </FlatButton>
        </NavigationGroup>
    </NavigationRow>
};

