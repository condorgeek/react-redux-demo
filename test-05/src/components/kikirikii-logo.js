import anime from 'animejs';
import React, {Component} from 'react';

export default class KikirikiiLogo extends Component {

    size = {
        xsmall: {classname: "logo-animation-xsmall", viewbox: "30 34 160 50"},
        small: {classname: "logo-animation-small", viewbox: "30 34 160 50"},
        medium: {classname: "logo-animation-medium", viewbox: "40 34 160 50"},
        large: {classname: "logo-animation-large", viewbox: "30 34 160 50"},
    };

    componentDidMount() {
        const id = this.size[this.props.size].classname;

        anime({
            targets:`#${id} .lines path`,
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
        const classname = this.size[this.props.size].classname;
        const viewbox = this.size[this.props.size].viewbox;

        return (
            <div id={classname} className={classname}>
                <svg viewBox={viewbox} style={{backgroundColor: 'inherit'}}>
                    <g fill="#1B1D1E" fillRule="evenodd" stroke="#8a8a8a" strokeWidth="1.5" className="lines">
                        <path fill="red" strokeWidth="0"
                              d="m 40.170677,46.939752 h 28.348534 v 28.34854 H 40.170677 Z"/>
                        <g transform="rotate(-17.189777,-120.52435,123.54342)">
                            <path stroke="#2ad4ffff" fill="#2ad4ffff"
                                  d="m 59.671644,126.6274 q 0,-0.16536 0.08268,-0.49609 0.124023,-0.33073 0.206706,-1.69499 0.124023,-1.36426 0.165364,-3.26595 0.08268,-1.94303 0.124024,-4.21679 0.08268,-2.31511 0.124023,-4.7129 0.08268,-2.39778 0.165365,-4.67154 0.08268,-2.31511 0.248046,-4.2168 0.372071,-4.134116 0.992188,-4.919597 0.330729,-0.950847 2.232422,-0.950847 0,0 0.578776,0 0,1.570964 -0.372071,6.614584 -0.330729,5.04362 -0.37207,5.99447 2.687175,-1.36426 5.167643,-2.93523 2.52181,-1.6123 4.67155,-2.93522 2.19108,-1.36425 3.968749,-2.23242 1.77767,-0.9095 2.645834,-0.9095 1.44694,0 1.44694,1.11621 0,0.86816 -1.322917,1.94303 -1.322917,1.03353 -3.307291,2.19108 -1.984375,1.11621 -4.340821,2.27376 -2.315104,1.15756 -4.299479,2.27377 -1.984375,1.07487 -3.307291,2.02571 -1.322917,0.95085 -1.322917,1.65365 0.744141,0.45475 2.439128,1.24023 1.736328,0.74414 3.844726,1.73633 2.14974,0.95085 4.423503,2.06706 2.315104,1.07487 4.216796,2.19108 4.299479,2.43913 4.299479,4.05143 0,0.53744 -0.702799,0.74414 -0.289388,0.0827 -0.578776,0.0827 h -0.413412 q -1.984375,0 -3.720703,-0.95084 -1.736328,-0.95085 -3.720703,-2.27376 -1.943033,-1.32292 -4.423502,-2.72852 -2.480469,-1.44694 -5.994466,-2.39779 v 8.26823 q -0.08268,0.16537 -0.744141,0.37207 -0.950846,0.28939 -2.025716,0.28939 -1.074869,0 -1.074869,-0.62012 z" />
                        </g>
                        <path stroke="#ff7f00" fill="#ff7f00"
                              d="m 80.036869,56.001742 q 0.53743,7.73079 0.9095,17.90074 -0.24804,1.28157 -1.98437,1.28157 -0.45475,0 -0.95085,-0.16536 -0.45475,-0.20671 -0.57877,-0.53744 v -18.47951 z m -3.84473,-5.6224 q 0,-1.44694 1.69499,-1.44694 1.11621,0 1.81901,0.4961 0.12402,0.45475 0.12402,0.9095 0,0.41341 -0.33074,0.82683 -0.33072,0.41341 -0.99217,0.41341 -0.66146,0 -1.32292,-0.28939 -0.66146,-0.33073 -0.99219,-0.90951 z" />
                        <path stroke="#ffbf00" fill="#ffbf00"
                              d="m 86.858159,67.908002 0.2067,3.59669 q 0,3.30729 -1.57096,4.01009 -0.33073,0.12402 -0.78548,0.12402 -0.45476,0 -1.07488,-0.2067 l 0.0413,-15.46161 q 0,-3.34863 -0.4134,-6.69727 -0.37209,-3.38997 -0.37209,-6.7386 0,-1.32292 1.40561,-1.32292 h 0.33073 q 0.28939,0 0.37207,0.0413 0.62012,2.56315 0.82683,6.20117 0.45475,8.06153 0.82682,10.83138 0.7028,-0.37207 3.14193,-2.10839 2.43914,-1.73633 3.92741,-2.76986 1.48829,-1.07487 2.81119,-1.98438 3.100604,-2.02571 3.886071,-2.02571 0.66147,0 1.03354,0.78548 -2.067061,2.60449 -6.655931,5.78776 -1.86036,1.28158 -3.7207,2.56315 -1.81902,1.24024 -3.34864,2.60449 2.76986,0.74414 5.25033,1.57098 2.48046,0.78548 4.79558,1.44694 5.333011,1.57096 9.177761,1.77767 0,1.11621 -0.20672,1.44695 -0.37207,0.57877 -1.52962,0.66145 h -0.33072 q -2.52183,-0.70281 -6.697281,-1.57097 -8.22691,-1.69499 -11.32751,-2.56315 z" />
                        <path stroke="#ffff00" fill="#ffff00"
                              d="m 112.53105,56.001742 q 0.53743,7.73079 0.9095,17.90074 -0.24804,1.28157 -1.98437,1.28157 -0.45476,0 -0.95086,-0.16536 -0.45475,-0.20671 -0.57876,-0.53744 v -18.47951 z m -3.84473,-5.6224 q 0,-1.44694 1.69499,-1.44694 1.11622,0 1.819,0.4961 0.12404,0.45475 0.12404,0.9095 0,0.41341 -0.33074,0.82683 -0.33073,0.41341 -0.99219,0.41341 -0.66145,0 -1.32291,-0.28939 -0.66146,-0.33073 -0.99219,-0.90951 z" />
                        <path stroke="#00ff00" fill="#00ff00"
                              d="m 135.55806,60.342562 q -1.73633,-1.24023 -4.46486,-1.24023 -2.56314,0 -4.75422,0.95084 -4.13411,1.73633 -5.66374,4.46484 -0.66145,1.24024 -0.66145,2.64585 0,0.24805 0,1.4056 0,1.11621 0.41341,3.05925 0.41341,1.9017 0.41341,3.88607 -0.86817,0.0413 -1.40558,0.20671 -0.53746,0.16536 -0.90952,0.16536 -0.37207,0 -0.66145,-0.33073 -0.24805,-0.33073 -0.57878,-1.28157 -0.0413,-0.24805 -0.16537,-1.4056 -0.12403,-1.15756 -0.33072,-2.81121 -0.16537,-1.65365 -0.41343,-3.59668 -0.20669,-1.9844 -0.4134,-3.88608 -0.45475,-4.13411 -0.7028,-6.07715 0,-0.99218 1.44694,-0.99218 0.86817,0 1.36426,0.74414 0.49609,0.7028 0.78548,1.65364 0.28939,0.90951 0.37207,1.81901 0.12403,0.90951 0.20672,1.28158 5.45701,-4.87826 13.55986,-4.87826 0.90952,0 1.90171,0.0413 0.24803,-0.0413 0.6201,-0.0413 0.37209,0 0.74417,0.4961 0.45475,0.57877 0.45475,1.4056 0,2.06705 -1.15756,2.3151 z" />
                        <path stroke="#00ffff" fill="#00ffff"
                              d="m 142.37933,56.001742 q 0.53746,7.73079 0.90952,17.90074 -0.24805,1.28157 -1.98438,1.28157 -0.45475,0 -0.95084,-0.16536 -0.45475,-0.20671 -0.57877,-0.53744 v -18.47951 z m -3.8447,-5.6224 q 0,-1.44694 1.69497,-1.44694 1.11621,0 1.81901,0.4961 0.12402,0.45475 0.12402,0.9095 0,0.41341 -0.33072,0.82683 -0.33072,0.41341 -0.99218,0.41341 -0.66147,0 -1.32292,-0.28939 -0.66145,-0.33073 -0.99218,-0.90951 z" />
                        <path stroke="#0080ff" fill="#0080ff"
                              d="m 149.20063,67.908002 0.20671,3.59669 q 0,3.30729 -1.57097,4.01009 -0.33073,0.12402 -0.78548,0.12402 -0.45475,0 -1.07487,-0.2067 l 0.0413,-15.46161 q 0,-3.34863 -0.41341,-6.69727 -0.37207,-3.38997 -0.37207,-6.7386 0,-1.32292 1.40561,-1.32292 h 0.33073 q 0.28938,0 0.37206,0.0413 0.62012,2.56315 0.82682,6.20117 0.45477,8.06153 0.82684,10.83138 0.70279,-0.37207 3.14191,-2.10839 2.43914,-1.73633 3.92741,-2.76986 1.48828,-1.07487 2.8112,-1.98438 3.10059,-2.02571 3.88607,-2.02571 0.66146,0 1.03353,0.78548 -2.06705,2.60449 -6.65593,5.78776 -1.86035,1.28158 -3.7207,2.56315 -1.819,1.24024 -3.34863,2.60449 2.76986,0.74414 5.25033,1.57098 2.48046,0.78548 4.79556,1.44694 5.33301,1.57096 9.17774,1.77767 0,1.11621 -0.2067,1.44695 -0.37207,0.57877 -1.52963,0.66145 h -0.33072 q -2.52181,-0.70281 -6.69726,-1.57097 -8.22689,-1.69499 -11.32748,-2.56315 z" />
                        <path stroke="#0000ff" fill="#0000ff"
                              d="m 174.87349,56.001742 q 0.53744,7.73079 0.90951,17.90074 -0.24806,1.28157 -1.98438,1.28157 -0.45475,0 -0.95084,-0.16536 -0.45476,-0.20671 -0.57878,-0.53744 v -18.47951 z m -3.84472,-5.6224 q 0,-1.44694 1.69498,-1.44694 1.1162,0 1.819,0.4961 0.12404,0.45475 0.12404,0.9095 0,0.41341 -0.33074,0.82683 -0.33072,0.41341 -0.99219,0.41341 -0.66145,0 -1.32292,-0.28939 -0.66145,-0.33073 -0.99217,-0.90951 z" />
                        <path stroke="#8b00ff" fill="#8b00ff"
                              d="m 184.55965,56.661512 q -1.66761,7.56789 -4.18267,17.42898 -0.59988,1.15935 -2.26553,0.66901 -0.43625,-0.12842 -0.86544,-0.42714 -0.37787,-0.32673 -0.40345,-0.67902 l 5.21861,-17.72734 z m -2.10047,-6.47929 q 0.40862,-1.38805 2.03461,-0.90939 1.07077,0.31522 1.60487,0.9896 -0.009,0.47127 -0.13786,0.9075 -0.11679,0.39659 -0.55077,0.69978 -0.43401,0.30319 -1.06855,0.11639 -0.63453,-0.1868 -1.18735,-0.6512 -0.54114,-0.50406 -0.69495,-1.15268 z" />
                    </g>
                </svg>
            </div>
        )
    }
}