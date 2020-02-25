/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [star-rating.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 08.03.19, 16:18
 */
import toastr from "toastr";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {asyncUpdatePostRanking} from "../../actions";

class StarRating extends Component {

    constructor(props) {
        super(props);
        this.state = {ranking: props.post.ranking + ''}
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ranking: nextProps.post.ranking + ''})
    }

    updateRanking(ranking) {
        const {authorization, post} = this.props;
        this.props.asyncUpdatePostRanking(authorization.user.username, post.id, ranking, post => {
            toastr.info(`Updated post ranking ${post.ranking} successfully`);
        });
    }

    onChange = event => {
        this.updateRanking(event.target.value);
        this.setState({ranking: event.target.value});
    };

    onClick = event => {
        if(this.state.ranking==='1') {
            setTimeout(() => {
                    document.activeElement.blur();
            }, 500);
            this.updateRanking('0');
            this.setState({ranking: '0'});
        }
    };

    render() {
        const {post} = this.props;
        const {ranking} = this.state;

        return <form>
            <fieldset className="starability-basic">
                <input type="radio" id={`rate0-${post.id}`} name="ranking" onChange={this.onChange}
                       checked={ranking==='0'}
                       value="0"/>

                <input type="radio" id={`rate1-${post.id}`} name="ranking"  onChange={this.onChange}
                       onClick={this.onClick}
                       checked={ranking==='1'}
                       value="1"/>
                <label htmlFor={`rate1-${post.id}`} title="Terrible">1 star</label>

                <input type="radio" id={`rate2-${post.id}`} name="ranking" onChange={this.onChange}
                       checked={ranking==='2'}
                       value="2"/>
                <label htmlFor={`rate2-${post.id}`} title="Not good">2 stars</label>

                <input type="radio" id={`rate3-${post.id}`} name="ranking" onChange={this.onChange}
                       checked={ranking==='3'}
                       value="3"/>
                <label htmlFor={`rate3-${post.id}`} title="Average">3 stars</label>

                <input type="radio" id={`rate4-${post.id}`} name="ranking" onChange={this.onChange}
                       checked={ranking==='4'}
                       value="4"/>
                <label htmlFor={`rate4-${post.id}`} title="Very good">4 stars</label>

                <input type="radio" id={`rate5-${post.id}`} name="ranking" onChange={this.onChange}
                       checked={ranking==='5'}
                       value="5"/>
                <label htmlFor={`rate5-${post.id}`} title="Amazing">5 stars</label>
            </fieldset>
        </form>
    }
}

export default connect(null, {asyncUpdatePostRanking})(StarRating);