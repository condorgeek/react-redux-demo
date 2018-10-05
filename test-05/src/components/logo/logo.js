/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [logo.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 19.07.18 14:43
 */

import React, {Component} from 'react';
import {LOGO_FULL} from "../../static/index";
import KikirikiiLogo from "./kikirikii-logo";

export const LogoSimple = (props) => {
    return <div className='logo-simple'>
        <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
    </div>
};

export const LogoSimpleRainbow = (props) => {
    return <div className='logo-simple-rainbow'>
        {/*<span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>*/}
        <KikirikiiLogo size='xsmall'/>
    </div>
};

export const LogoWelcomeRainbow = (props) => {
    return <div className='logo'>
        <div className='logo-welcome-rainbow'>
            <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
        </div>
    </div>
};

export const LogoNavbarRainbow = (props) => {
    return <div className='logo-navbar-rainbow'>
        <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
    </div>
};

export const LogoRainbow = (props) => {
    return <div className='logo'>
        {/*<img src={LOGO_FULL}/>*/}
        {/*<div className='logo-rainbow'>*/}
            {/*<span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>*/}
        {/*</div>*/}
        {/*<KikirikiiLogo size='medium' animate loop={true}/>*/}
        <KikirikiiLogo size='medium'/>
        <div className='title'>{props.title}</div>
    </div>
};