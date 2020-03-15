/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [tooltip-badge.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 25.02.20, 15:12
 */

import React, {useRef, useEffect} from 'react';
import Tippy from "../tippy/Tippy";
import {getStaticImageUrl} from "../../actions/environment";
import {AvatarLink} from "../navigation-headlines/nav-headlines";

const TooltipBadge = (props) => {
    const {reaction, likes} = props;
    const tooltip = useRef(null);

    /* componentWillUnmount */
    useEffect(() => {
       return () => {
           tooltip.current && tooltip.current.destroy();
       }
    }, []);

    const renderTooltipEntries = (reaction, likes) => {
        const entries = likes.map(like => {
            const avatar = getStaticImageUrl(like.user.avatar);
            return <AvatarLink key={like.id} className='mb-1' to={`/${like.user.username}/home`}
                               avatar={avatar}
                               text={`${like.user.firstname} ${like.user.lastname}`}/>
        });

        return <div className='like-tooltip'>
            <div className="like-tooltip-title">{reaction} {likes.length}</div>
            <ul className='like-tooltip-list'>
                {entries}
            </ul>
        </div>

    };

    if (likes.length === 0) return null;

    return <Tippy content={renderTooltipEntries(reaction, likes)}
                  interactive={true} arrow={false} arrowType='round'
                  onCreate={instance => {
                      tooltip.current = instance;
                  }}>
        <div className='like-entry-static like-entry-badge'>
            {likes.length}
        </div>

    </Tippy>
};

export default TooltipBadge;