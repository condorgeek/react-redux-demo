import React, {Component} from 'react';
import {LOGO_FULL} from "../static";

export const LogoSimple = (props) => {
    return <div className='logo-simple'>
        <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
    </div>
};

export const LogoSimpleRainbow = (props) => {
    return <div className='logo-simple-rainbow'>
        <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
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
        <img src={LOGO_FULL}/>
        <div className='logo-rainbow'>
            <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
        </div>
        <div className='title'>{props.title}</div>
    </div>
};