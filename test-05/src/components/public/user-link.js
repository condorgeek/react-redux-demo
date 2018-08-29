import tippy from 'tippy.js'

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';
import {ROOT_STATIC_URL} from "../../actions";

import '../../../node_modules/tippy.js/dist/tippy.css';


export default class UserLink extends Component {

    constructor(props) {
        super(props);
    }

    renderAvatar (avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    render() {
        const {user, id} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar =  `${ROOT_STATIC_URL}/${user.avatar}`;
        const fullname = `${user.firstname} ${user.lastname}`;
        const templateId = `#user-tooltip-${id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));

        return (
            <div className='user-link'>
                <Link to={homespace}>
                    <div className="d-inline"
                         ref={(elem) => {
                             if (elem === null) return;
                             const initialText = document.querySelector(templateId).textContent;
                             const tooltip = tippy(elem, {
                                 html: templateId, interactive: false, theme: 'avatar',
                                 animation: 'shift-toward', arrow: true,
                                 onShow() {
                                     const content = this.querySelector('.tippy-content');
                                     if (tooltip.loading || content.innerHTML !== initialText) return;
                                     tooltip.loading = true;
                                     content.innerHTML = html;
                                     tooltip.loading = false;
                                 },
                                 onHidden() {
                                     const content = this.querySelector('.tippy-content');
                                     content.innerHTML = initialText;
                                 }
                             });
                         }}
                    ><img className="thumb" src={avatar}/>{fullname}</div>
                </Link>
                <div id={`user-tooltip-${id}`} className="d-none">Loading...</div>

            </div>
        );
    }
}