import tippy from 'tippy.js'

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {asyncFetchChatEntries, ROOT_STATIC_URL} from "../../actions/index";

import ActiveChat from "./active-chat";

class ActiveFriend extends Component {

    constructor(props) {
        super(props);
        this.handleActiveChat = this.handleActiveChat.bind(this);
        this.localstate = this.localstate.bind(this)({isOpen: false, isLoaded: false, count: 0});
    }

    localstate(data) {
        let state = data;
        return {
            set(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            get() {
                return state;
            }
        }
    }

    renderAvatar(avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    handleActiveChat(state) {
        const {authname, chat} = this.props;
        const localstate = this.localstate.set(state);

        if (localstate.isOpen && !localstate.isLoaded) {
            this.props.asyncFetchChatEntries(authname, chat.id, () => {
                this.localstate.set({isLoaded: true})
            });
        } else {
            this.forceUpdate();
        }
    }

    render() {
        const {authname, user, state, chatEntries, chat} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const fullname = `${user.firstname} ${user.lastname}`;
        const templateId = `#user-tooltip-${user.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));
        const isBlocked = state === 'BLOCKED';
        chat && this.localstate.set({count: chat.delivered});

        console.log('ACTIVE', chat, chatEntries);

        return (
            <div className='active-contact d-inline'>
                <Link to={homespace}>
                    <div className="state-thumb"
                         ref={(elem) => {
                             if (elem === null) return;
                             const initialText = document.querySelector(templateId).textContent;
                             const tooltip = tippy(elem, {
                                 html: templateId, interactive: false, theme: 'avatar',
                                 placement: 'left',
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
                    ><img className={isBlocked ? "blocked-img" : "thumb"} src={avatar}/>
                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">
                                <path
                                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                            </svg>
                        </span>}
                        {!this.localstate.get().isOpen && this.localstate.get().count > 0 && <span className="counter-thumb">
                            <div className="badge badge-light d-inline">{this.localstate.get().count}</div>
                        </span>}

                    </div>
                    {fullname}
                </Link>

                {chat && !isBlocked &&
                <ActiveChat chatEntries={chatEntries} user={user} chat={chat} callback={this.handleActiveChat}/>}

                <div id={`user-tooltip-${user.id}`} className="d-none">Loading...</div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {chatEntries: state.chatEntries}
}

export default connect(mapStateToProps, {asyncFetchChatEntries})(ActiveFriend);