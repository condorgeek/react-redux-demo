import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';
import anime from 'animejs';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Redirect, Route, Switch} from 'react-router-dom';
import './index.css';

import Navigation from './components/navigation';
import PublicSpace from './public-space';
import HomeSpace from './home-space';
import LoginForm, {PrivateRoute} from './components/login/login-form';
import CreateAccountForm from './components/create-account/create-account-form';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import promiseMiddleware from 'redux-promise';
import reducers from './reducers';
import {LogoSimple} from "./components/logo/logo";

const createStoreWithMiddleware = applyMiddleware(thunk, promiseMiddleware)(createStore);


export const IndexRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        return localStorage.getItem('bearer')
            ? (<Component {...props} />)
            : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)
    }}/>
);

class WelcomeLogo extends Component {

    componentDidMount() {
        anime({
            targets: '#logo-animation .lines path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: function (el, i) {
                return i * 250
            },
            direction: 'alternate',
            loop: true
        });

    }

    render() {
        return (
            <div id="logo-animation" className="logo-animation">
                <svg viewBox="-90 115 400 50" style={{backgroundColor: 'inherit'}}>
                    <g fill="#1B1D1E" fillRule="evenodd" stroke="#8a8a8a" strokeWidth="2.5" className="lines"
                       transform="translate(23.498125,-86.518752)">
                        <path
                            d="m 17.00862,249.81722 q -0.04642,-0.15872 -0.0599,-0.49936 0.0262,-0.35225 -0.277378,-1.68487 -0.263902,-1.34422 -0.758017,-3.18106 -0.46604,-1.88813 -1.064591,-4.0821 -0.570479,-2.24523 -1.203845,-4.55822 -0.593685,-2.32459 -1.15256,-4.53016 -0.570478,-2.24523 -0.945552,-4.11689 -0.80331,-4.07235 -0.428604,-5.00032 0.05054,-1.00546 1.875776,-1.53925 0,0 0.555508,-0.16246 0.440962,1.50781 1.499562,6.45311 1.098282,4.93368 1.325498,5.85789 2.196207,-2.06367 4.135989,-4.26773 1.967864,-2.25534 3.659843,-4.1285 1.720052,-1.92443 3.182569,-3.25667 1.450908,-1.37192 2.284166,-1.61562 1.388768,-0.40614 1.702083,0.66519 0.24369,0.83328 -0.724326,2.23626 -0.979629,1.36331 -2.559314,3.03133 -1.59128,1.62834 -3.528071,3.40079 -1.897114,1.76085 -3.4884,3.38919 -1.602886,1.58866 -2.60572,2.87262 -1.002835,1.28396 -0.805562,1.9585 0.841868,0.2276 2.689191,0.50573 1.875397,0.22685 4.177534,0.58733 2.330214,0.30921 4.825875,0.74231 2.523746,0.38182 4.662297,0.91936 4.811274,1.13423 5.263841,2.68172 0.150853,0.51582 -0.465669,0.91149 -0.254545,0.16061 -0.532299,0.24184 l -0.39679,0.11604 q -1.904594,0.557 -3.838013,0.13181 -1.933421,-0.42525 -4.209349,-1.13799 -2.236256,-0.72433 -5.011547,-1.37716 -2.786902,-0.69248 -6.426518,-0.61879 l 2.320843,7.93583 q -0.03299,0.18191 -0.609785,0.56599 -0.831392,0.54466 -1.863047,0.84637 -1.031658,0.3017 -1.205721,-0.29349 z"
                            stroke="#ff0000"/>
                        <path
                            d="m 44.393667,230.80456 q 0.53743,7.73079 0.9095,17.90072 -0.24804,1.28157 -1.98437,1.28157 -0.45475,0 -0.95085,-0.16536 -0.45475,-0.20671 -0.57877,-0.53744 v -18.47949 z m -3.84473,-5.6224 q 0,-1.44694 1.69499,-1.44694 1.11621,0 1.81901,0.4961 0.12402,0.45475 0.12402,0.9095 0,0.41341 -0.33073,0.82683 -0.33073,0.41341 -0.99218,0.41341 -0.66146,0 -1.32292,-0.28939 -0.66146,-0.33073 -0.99219,-0.90951 z"
                            stroke="#ff7f00"/>
                        <path
                            d="m 51.214957,242.71081 0.2067,3.59668 q 0,3.30729 -1.57096,4.01009 -0.33073,0.12402 -0.78548,0.12402 -0.45476,0 -1.07487,-0.2067 l 0.0413,-15.46159 q 0,-3.34863 -0.41341,-6.69727 -0.37208,-3.38997 -0.37208,-6.7386 0,-1.32292 1.4056,-1.32292 h 0.33073 q 0.28939,0 0.37207,0.0413 0.62012,2.56315 0.82683,6.20117 0.45475,8.06153 0.82682,10.83138 0.7028,-0.37207 3.14193,-2.10839 2.43912,-1.73633 3.9274,-2.76986 1.48829,-1.07487 2.8112,-1.98438 3.10059,-2.02571 3.88607,-2.02571 0.66146,0 1.03353,0.78548 -2.06706,2.60449 -6.65593,5.78776 -1.86035,1.28158 -3.7207,2.56315 -1.81901,1.24024 -3.34863,2.60449 2.76985,0.74414 5.25032,1.57097 2.48047,0.78548 4.79558,1.44694 5.333,1.57096 9.17773,1.77767 0,1.11621 -0.20671,1.44694 -0.37207,0.57877 -1.52962,0.66145 h -0.33073 q -2.52181,-0.7028 -6.69726,-1.57096 -8.22689,-1.69499 -11.32748,-2.56315 z"
                            stroke="#ffbf00"/>
                        <path
                            d="m 76.887807,230.80456 q 0.53743,7.73079 0.9095,17.90072 -0.24804,1.28157 -1.98437,1.28157 -0.45476,0 -0.95085,-0.16536 -0.45475,-0.20671 -0.57877,-0.53744 v -18.47949 z m -3.84473,-5.6224 q 0,-1.44694 1.69499,-1.44694 1.11621,0 1.81901,0.4961 0.12402,0.45475 0.12402,0.9095 0,0.41341 -0.33073,0.82683 -0.33073,0.41341 -0.99219,0.41341 -0.66145,0 -1.32291,-0.28939 -0.66146,-0.33073 -0.99219,-0.90951 z"
                            stroke="#ffff00"/>
                        <path
                            d="m 99.914827,235.14538 q -1.73633,-1.24023 -4.46485,-1.24023 -2.56315,0 -4.75423,0.95084 -4.13411,1.73633 -5.66374,4.46485 -0.66146,1.24023 -0.66146,2.64583 0,0.24805 0,1.4056 0,1.11621 0.41342,3.05924 0.41341,1.9017 0.41341,3.88607 -0.86817,0.0413 -1.4056,0.20671 -0.53744,0.16536 -0.90951,0.16536 -0.37207,0 -0.66145,-0.33073 -0.24805,-0.33073 -0.57878,-1.28157 -0.0413,-0.24805 -0.16537,-1.4056 -0.12402,-1.15756 -0.33072,-2.8112 -0.16537,-1.65365 -0.41342,-3.59668 -0.2067,-1.98438 -0.41341,-3.88607 -0.45475,-4.13411 -0.7028,-6.07715 0,-0.99218 1.44694,-0.99218 0.86817,0 1.36426,0.74414 0.49609,0.7028 0.78548,1.65364 0.28939,0.90951 0.37207,1.81901 0.12403,0.90951 0.20671,1.28158 5.45703,-4.87826 13.55989,-4.87826 0.90951,0 1.9017,0.0413 0.24804,-0.0413 0.62011,-0.0413 0.372073,0 0.744153,0.4961 0.45475,0.57877 0.45475,1.4056 0,2.06705 -1.157553,2.3151 z"
                            stroke="#00ff00"/>
                        <path
                            d="m 106.73611,230.80456 q 0.53744,7.73079 0.90951,17.90072 -0.24805,1.28157 -1.98438,1.28157 -0.45475,0 -0.95084,-0.16536 -0.45476,-0.20671 -0.57878,-0.53744 v -18.47949 z m -3.84472,-5.6224 q 0,-1.44694 1.69498,-1.44694 1.11621,0 1.81901,0.4961 0.12403,0.45475 0.12403,0.9095 0,0.41341 -0.33073,0.82683 -0.33073,0.41341 -0.99219,0.41341 -0.66146,0 -1.32292,-0.28939 -0.66145,-0.33073 -0.99218,-0.90951 z"
                            stroke="#00ffff"/>
                        <path
                            d="m 113.5574,242.71081 0.20671,3.59668 q 0,3.30729 -1.57097,4.01009 -0.33073,0.12402 -0.78548,0.12402 -0.45475,0 -1.07487,-0.2067 l 0.0413,-15.46159 q 0,-3.34863 -0.41341,-6.69727 -0.37207,-3.38997 -0.37207,-6.7386 0,-1.32292 1.4056,-1.32292 h 0.33073 q 0.28939,0 0.37207,0.0413 0.62012,2.56315 0.82682,6.20117 0.45476,8.06153 0.82683,10.83138 0.7028,-0.37207 3.14192,-2.10839 2.43913,-1.73633 3.92741,-2.76986 1.48828,-1.07487 2.8112,-1.98438 3.10059,-2.02571 3.88607,-2.02571 0.66146,0 1.03353,0.78548 -2.06706,2.60449 -6.65593,5.78776 -1.86035,1.28158 -3.7207,2.56315 -1.81901,1.24024 -3.34863,2.60449 2.76985,0.74414 5.25032,1.57097 2.48047,0.78548 4.79557,1.44694 5.33301,1.57096 9.17774,1.77767 0,1.11621 -0.20671,1.44694 -0.37207,0.57877 -1.52962,0.66145 h -0.33073 q -2.52181,-0.7028 -6.69726,-1.57096 -8.22689,-1.69499 -11.32748,-2.56315 z"
                            stroke="#0080ff"/>
                        <path
                            d="m 139.23025,230.80456 q 0.53744,7.73079 0.90951,17.90072 -0.24805,1.28157 -1.98438,1.28157 -0.45475,0 -0.95084,-0.16536 -0.45476,-0.20671 -0.57878,-0.53744 v -18.47949 z m -3.84472,-5.6224 q 0,-1.44694 1.69498,-1.44694 1.11621,0 1.81901,0.4961 0.12403,0.45475 0.12403,0.9095 0,0.41341 -0.33073,0.82683 -0.33073,0.41341 -0.99219,0.41341 -0.66146,0 -1.32292,-0.28939 -0.66145,-0.33073 -0.99218,-0.90951 z"
                            stroke="#0000ff"
                        />
                        <path
                            d="m 148.91642,231.46433 q -1.66761,7.5679 -4.18267,17.42896 -0.59988,1.15935 -2.26553,0.66901 -0.43625,-0.12842 -0.86544,-0.42714 -0.37787,-0.32673 -0.40345,-0.67902 l 5.21861,-17.72732 z m -2.10047,-6.47929 q 0.40862,-1.38805 2.03461,-0.90939 1.07077,0.31522 1.60487,0.9896 -0.009,0.47127 -0.13786,0.9075 -0.11679,0.39659 -0.55077,0.69978 -0.43401,0.30319 -1.06855,0.11639 -0.63453,-0.1868 -1.18735,-0.6512 -0.54114,-0.50406 -0.69495,-1.15268 z"
                            stroke="#8b00ff"/>
                    </g>
                </svg>
            </div>
        )
    }
}

class WelcomeLogoBoxed extends Component {

    componentDidMount() {
        anime({
            targets: '#logo-animation .lines path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: function (el, i) {
                return i * 250
            },
            direction: 'alternate',
            loop: false
        });

    }

    render() {
        return (
            <div id="logo-animation" className="logo-animation">
                <svg viewBox="-90 30 400 50" style={{backgroundColor: 'inherit'}}>
                    <g fill="#1B1D1E" fillRule="evenodd" stroke="#8a8a8a" strokeWidth="1.5" className="lines">
                        <path fill="none" stroke="#ff0000bb" strokeWidth="0"
                            d="m 40.170677,46.939752 h 28.348534 v 28.34854 H 40.170677 Z"/>
                        <g transform="rotate(-17.189777,-120.52435,123.54342)">
                            <path stroke="#2ad4ff"
                                d="m 59.671644,126.6274 q 0,-0.16536 0.08268,-0.49609 0.124023,-0.33073 0.206706,-1.69499 0.124023,-1.36426 0.165364,-3.26595 0.08268,-1.94303 0.124024,-4.21679 0.08268,-2.31511 0.124023,-4.7129 0.08268,-2.39778 0.165365,-4.67154 0.08268,-2.31511 0.248046,-4.2168 0.372071,-4.134116 0.992188,-4.919597 0.330729,-0.950847 2.232422,-0.950847 0,0 0.578776,0 0,1.570964 -0.372071,6.614584 -0.330729,5.04362 -0.37207,5.99447 2.687175,-1.36426 5.167643,-2.93523 2.52181,-1.6123 4.67155,-2.93522 2.19108,-1.36425 3.968749,-2.23242 1.77767,-0.9095 2.645834,-0.9095 1.44694,0 1.44694,1.11621 0,0.86816 -1.322917,1.94303 -1.322917,1.03353 -3.307291,2.19108 -1.984375,1.11621 -4.340821,2.27376 -2.315104,1.15756 -4.299479,2.27377 -1.984375,1.07487 -3.307291,2.02571 -1.322917,0.95085 -1.322917,1.65365 0.744141,0.45475 2.439128,1.24023 1.736328,0.74414 3.844726,1.73633 2.14974,0.95085 4.423503,2.06706 2.315104,1.07487 4.216796,2.19108 4.299479,2.43913 4.299479,4.05143 0,0.53744 -0.702799,0.74414 -0.289388,0.0827 -0.578776,0.0827 h -0.413412 q -1.984375,0 -3.720703,-0.95084 -1.736328,-0.95085 -3.720703,-2.27376 -1.943033,-1.32292 -4.423502,-2.72852 -2.480469,-1.44694 -5.994466,-2.39779 v 8.26823 q -0.08268,0.16537 -0.744141,0.37207 -0.950846,0.28939 -2.025716,0.28939 -1.074869,0 -1.074869,-0.62012 z" />
                        </g>
                        <path stroke="#ff7f00"
                            d="m 80.036869,56.001742 q 0.53743,7.73079 0.9095,17.90074 -0.24804,1.28157 -1.98437,1.28157 -0.45475,0 -0.95085,-0.16536 -0.45475,-0.20671 -0.57877,-0.53744 v -18.47951 z m -3.84473,-5.6224 q 0,-1.44694 1.69499,-1.44694 1.11621,0 1.81901,0.4961 0.12402,0.45475 0.12402,0.9095 0,0.41341 -0.33074,0.82683 -0.33072,0.41341 -0.99217,0.41341 -0.66146,0 -1.32292,-0.28939 -0.66146,-0.33073 -0.99219,-0.90951 z" />
                        <path stroke="#ffbf00"
                            d="m 86.858159,67.908002 0.2067,3.59669 q 0,3.30729 -1.57096,4.01009 -0.33073,0.12402 -0.78548,0.12402 -0.45476,0 -1.07488,-0.2067 l 0.0413,-15.46161 q 0,-3.34863 -0.4134,-6.69727 -0.37209,-3.38997 -0.37209,-6.7386 0,-1.32292 1.40561,-1.32292 h 0.33073 q 0.28939,0 0.37207,0.0413 0.62012,2.56315 0.82683,6.20117 0.45475,8.06153 0.82682,10.83138 0.7028,-0.37207 3.14193,-2.10839 2.43914,-1.73633 3.92741,-2.76986 1.48829,-1.07487 2.81119,-1.98438 3.100604,-2.02571 3.886071,-2.02571 0.66147,0 1.03354,0.78548 -2.067061,2.60449 -6.655931,5.78776 -1.86036,1.28158 -3.7207,2.56315 -1.81902,1.24024 -3.34864,2.60449 2.76986,0.74414 5.25033,1.57098 2.48046,0.78548 4.79558,1.44694 5.333011,1.57096 9.177761,1.77767 0,1.11621 -0.20672,1.44695 -0.37207,0.57877 -1.52962,0.66145 h -0.33072 q -2.52183,-0.70281 -6.697281,-1.57097 -8.22691,-1.69499 -11.32751,-2.56315 z" />
                        <path stroke="#ffff00bb"
                            d="m 112.53105,56.001742 q 0.53743,7.73079 0.9095,17.90074 -0.24804,1.28157 -1.98437,1.28157 -0.45476,0 -0.95086,-0.16536 -0.45475,-0.20671 -0.57876,-0.53744 v -18.47951 z m -3.84473,-5.6224 q 0,-1.44694 1.69499,-1.44694 1.11622,0 1.819,0.4961 0.12404,0.45475 0.12404,0.9095 0,0.41341 -0.33074,0.82683 -0.33073,0.41341 -0.99219,0.41341 -0.66145,0 -1.32291,-0.28939 -0.66146,-0.33073 -0.99219,-0.90951 z" />
                        <path stroke="#00ff00bb"
                            d="m 135.55806,60.342562 q -1.73633,-1.24023 -4.46486,-1.24023 -2.56314,0 -4.75422,0.95084 -4.13411,1.73633 -5.66374,4.46484 -0.66145,1.24024 -0.66145,2.64585 0,0.24805 0,1.4056 0,1.11621 0.41341,3.05925 0.41341,1.9017 0.41341,3.88607 -0.86817,0.0413 -1.40558,0.20671 -0.53746,0.16536 -0.90952,0.16536 -0.37207,0 -0.66145,-0.33073 -0.24805,-0.33073 -0.57878,-1.28157 -0.0413,-0.24805 -0.16537,-1.4056 -0.12403,-1.15756 -0.33072,-2.81121 -0.16537,-1.65365 -0.41343,-3.59668 -0.20669,-1.9844 -0.4134,-3.88608 -0.45475,-4.13411 -0.7028,-6.07715 0,-0.99218 1.44694,-0.99218 0.86817,0 1.36426,0.74414 0.49609,0.7028 0.78548,1.65364 0.28939,0.90951 0.37207,1.81901 0.12403,0.90951 0.20672,1.28158 5.45701,-4.87826 13.55986,-4.87826 0.90952,0 1.90171,0.0413 0.24803,-0.0413 0.6201,-0.0413 0.37209,0 0.74417,0.4961 0.45475,0.57877 0.45475,1.4056 0,2.06705 -1.15756,2.3151 z" />
                        <path stroke="#00ffffbb"
                            d="m 142.37933,56.001742 q 0.53746,7.73079 0.90952,17.90074 -0.24805,1.28157 -1.98438,1.28157 -0.45475,0 -0.95084,-0.16536 -0.45475,-0.20671 -0.57877,-0.53744 v -18.47951 z m -3.8447,-5.6224 q 0,-1.44694 1.69497,-1.44694 1.11621,0 1.81901,0.4961 0.12402,0.45475 0.12402,0.9095 0,0.41341 -0.33072,0.82683 -0.33072,0.41341 -0.99218,0.41341 -0.66147,0 -1.32292,-0.28939 -0.66145,-0.33073 -0.99218,-0.90951 z" />
                        <path stroke="#0080ffbb"
                            d="m 149.20063,67.908002 0.20671,3.59669 q 0,3.30729 -1.57097,4.01009 -0.33073,0.12402 -0.78548,0.12402 -0.45475,0 -1.07487,-0.2067 l 0.0413,-15.46161 q 0,-3.34863 -0.41341,-6.69727 -0.37207,-3.38997 -0.37207,-6.7386 0,-1.32292 1.40561,-1.32292 h 0.33073 q 0.28938,0 0.37206,0.0413 0.62012,2.56315 0.82682,6.20117 0.45477,8.06153 0.82684,10.83138 0.70279,-0.37207 3.14191,-2.10839 2.43914,-1.73633 3.92741,-2.76986 1.48828,-1.07487 2.8112,-1.98438 3.10059,-2.02571 3.88607,-2.02571 0.66146,0 1.03353,0.78548 -2.06705,2.60449 -6.65593,5.78776 -1.86035,1.28158 -3.7207,2.56315 -1.819,1.24024 -3.34863,2.60449 2.76986,0.74414 5.25033,1.57098 2.48046,0.78548 4.79556,1.44694 5.33301,1.57096 9.17774,1.77767 0,1.11621 -0.2067,1.44695 -0.37207,0.57877 -1.52963,0.66145 h -0.33072 q -2.52181,-0.70281 -6.69726,-1.57097 -8.22689,-1.69499 -11.32748,-2.56315 z" />
                        <path stroke="#0000ffbb"
                            d="m 174.87349,56.001742 q 0.53744,7.73079 0.90951,17.90074 -0.24806,1.28157 -1.98438,1.28157 -0.45475,0 -0.95084,-0.16536 -0.45476,-0.20671 -0.57878,-0.53744 v -18.47951 z m -3.84472,-5.6224 q 0,-1.44694 1.69498,-1.44694 1.1162,0 1.819,0.4961 0.12404,0.45475 0.12404,0.9095 0,0.41341 -0.33074,0.82683 -0.33072,0.41341 -0.99219,0.41341 -0.66145,0 -1.32292,-0.28939 -0.66145,-0.33073 -0.99217,-0.90951 z" />
                        <path stroke="#8b00ffbb"
                            d="m 184.55965,56.661512 q -1.66761,7.56789 -4.18267,17.42898 -0.59988,1.15935 -2.26553,0.66901 -0.43625,-0.12842 -0.86544,-0.42714 -0.37787,-0.32673 -0.40345,-0.67902 l 5.21861,-17.72734 z m -2.10047,-6.47929 q 0.40862,-1.38805 2.03461,-0.90939 1.07077,0.31522 1.60487,0.9896 -0.009,0.47127 -0.13786,0.9075 -0.11679,0.39659 -0.55077,0.69978 -0.43401,0.30319 -1.06855,0.11639 -0.63453,-0.1868 -1.18735,-0.6512 -0.54114,-0.50406 -0.69495,-1.15268 z" />
                    </g>
                </svg>
            </div>
        )
    }
}


class Welcome extends Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    componentDidMount() {
        setTimeout(() => {
            document.getElementById('video-id').play()
                .then(() => console.log('Playing'))
                .catch((error) => console.log(error));
        }, 1000);
    }

    render() {
        return (
            <div className='welcome-page'>
                <div className="welcome-header">

                    <WelcomeLogoBoxed/>

                    <div className="welcome-video">
                        <video id="video-id" loop="loop" muted="muted" autoPlay="autoplay">
                            <source src="http://localhost:9000/kikirikii-rooster-moana.mp4" type="video/mp4"/>
                        </video>
                    </div>

                    <div className="title">
                        <p>Non tracking Social Media</p>
                    </div>

                </div>
                <div className="content">
                    <div className="button-content">
                        <Link to={"/create/account"} class="btn ">Get startet</Link>
                        <Link to="/login" class="btn ">Login</Link>
                    </div>
                    <div className="text-content">
                        <p>The alternative social plattform for free people.</p></div>
                </div>

                <div className="form-footer">
                    <p className="text-muted"> &copy; 2018 &nbsp;<LogoSimple/> is the free, open social media platform.
                        All rights reserved. Read about our <Link to="/terms"> Terms of Use</Link> and <Link
                            to='/privacy-policy'>Privacy
                            Policy</Link>.</p>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div className='violett-sheme'>
                <Navigation/>

                <div className='container-fluid'>
                    <Switch>
                        {/*<Route path="/posts/new" component={PostsNew}/>*/}
                        {/*<Route path="/posts/:id" component={PostsShow}/>*/}
                        {/*<Route path={"/author/:author/:id"} component={AuthorShow}/>*/}
                        <Route path={"/login"} component={LoginForm}/>
                        <Route path={"/create/account"} component={CreateAccountForm}/>
                        <PrivateRoute path="/:username/home" component={HomeSpace}/>
                        <PrivateRoute path="/:username/public" component={PublicSpace}/>
                        <PrivateRoute path="/:username" strict component={PublicSpace}/>
                        <Route path="/" component={Welcome}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'), () => {
        OverlayScrollbars(document.querySelectorAll('body'), {});
    });
