/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [home-secondary-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 31.01.20, 13:10
 */

import React from 'react';

import {
    BiggerIcon,
    FlatButtonBounded,
    FlatIcon,
    FollowerIcon,
    Icon,
    NavigationGroup, NavigationRow
} from "../navigation-buttons/nav-buttons";
import {bindRawTooltip} from "../../actions/tippy-config";

export const HomeSecondaryNavigation = (props) => {
    const {homedata, isAuthorized, isOwner, isSuperUser} = props;

    return <NavigationRow className='mobile-headline-navigation box-system'>
      <NavigationGroup>
          <span className="mobile-headline-title">{homedata.space.user.fullname}</span>
      </NavigationGroup>

      {isAuthorized && <NavigationGroup>
          <FlatButtonBounded btn small title='Friends'
                             className='btn-outline-light mobile-headline-button'
                             onBound={(elem) => {
                                 if (elem === null || homedata.isOwner) return;
                                 const tooltip = bindRawTooltip(elem, this.renderFriendsTooltip(homedata),
                                     {callback: this.handleTooltipAction});
                                 this.localstate.pushTooltip(tooltip);
                             }}
                             onClick={(e) => console.log('FRIEND')}>
              <Icon className="fas fa-user-friends mr-1"/>
              <span className='mobile-headline-text'>
                                    {homedata.friends} Friends
                                </span>
          </FlatButtonBounded>

          <FlatButtonBounded btn small title='Followers'
                             className='btn-outline-light mobile-headline-button'
                             onBound={(elem) => {
                                 if (elem === null || homedata.isOwner) return;
                                 const tooltip = bindRawTooltip(elem, this.renderFollowersTooltip(homedata),
                                     {callback: this.handleTooltipAction});
                                 this.localstate.pushTooltip(tooltip);
                             }}
                             onClick={(e) => console.log('FOLLOWER')}>
              <FollowerIcon className='mr-2'/>
              <span className='mobile-headline-text'>
                                    {homedata.followers} Followers
                                </span>
          </FlatButtonBounded>

          {isAuthorized && (isOwner || isSuperUser) && <FlatIcon circle btn primary title='Upload cover image' className='mobile-headline-icon' onClick={(e) => {
              e.preventDefault();
              this.uploadModalRef.onOpen();
          }}>
              <BiggerIcon className="far fa-image clr-white" aria-hidden="true"/>
          </FlatIcon>}
      </NavigationGroup>}
  </NavigationRow>
};

