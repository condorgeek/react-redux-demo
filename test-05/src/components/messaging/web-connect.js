/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [webconnect.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 21.11.19, 10:48
 */

import stompClient from "../../actions/stomp-client";
import toastr from "toastr";

import {
    chatEventHandler,
    followerEventHandler,
    friendEventHandler,
    EVENT_CHAT_CONSUMED, EVENT_CHAT_CONSUMED_ACK, EVENT_CHAT_DELETED, EVENT_CHAT_DELETED_ACK,
    EVENT_CHAT_DELIVERED, EVENT_CHAT_DELIVERED_ACK,
    EVENT_FOLLOWER_ADDED,
    EVENT_FOLLOWER_BLOCKED, EVENT_FOLLOWER_DELETED, EVENT_FOLLOWER_UNBLOCKED,
    EVENT_FRIEND_ACCEPTED, EVENT_FRIEND_BLOCKED,
    EVENT_FRIEND_CANCELLED, EVENT_FRIEND_DELETED,
    EVENT_FRIEND_IGNORED,
    EVENT_FRIEND_REQUESTED, EVENT_FRIEND_UNBLOCKED,
} from "../../actions";
import {asyncFetchHomeData} from "../../actions/spaces";


export const webConnect = dispatch => (isAuthorized, authorization, location) => {

    if (isAuthorized && stompClient.state() !== 'CONNECTED' && stompClient.state() !== 'CONNECTING') {
        console.log('CONNECTING');
        stompClient.connect(authorization.user.username, (body) => {
            if (body.event === undefined) {
                console.log('UNKNOWN MESSAGE', body);
                toastr.info(JSON.stringify(body));
                return;
            }

            switch (body.event) {
                case EVENT_FRIEND_REQUESTED:
                case EVENT_FRIEND_ACCEPTED:
                case EVENT_FRIEND_IGNORED:
                case EVENT_FRIEND_CANCELLED:
                case EVENT_FRIEND_DELETED:
                case EVENT_FRIEND_BLOCKED:
                case EVENT_FRIEND_UNBLOCKED:

                    body.user = JSON.parse(body.user);
                    const friend = body.user.friend;

                    console.log('LOCATION', location);

                    /* TODO update billboard-cover - could directly update reducer without this extra call.. */
                    // if (this.props.location.pathname === `/${friend.username}/home`) {
                    if (location.pathname === `/${friend.username}/home`) {
                        dispatch(asyncFetchHomeData(friend.username, 'home'));
                    }
                    dispatch(friendEventHandler(body.event, body.user));
                    break;

                case EVENT_FOLLOWER_BLOCKED:
                case EVENT_FOLLOWER_UNBLOCKED:
                case EVENT_FOLLOWER_ADDED:
                case EVENT_FOLLOWER_DELETED:
                    body.follower = JSON.parse(body.follower);
                    dispatch(followerEventHandler(body.event, body.follower));
                    break;

                default:
            }
            console.log(body);
            body.message && toastr.info(body.message);

        }, (body) => {

            if (body.event === undefined) {
                console.log('UNKNOWN MESSAGE', body);
                toastr.info(JSON.stringify(body));
                return;
            }

            switch (body.event) {
                case EVENT_CHAT_DELIVERED:
                case EVENT_CHAT_DELIVERED_ACK:

                    console.log('***', body.event, body.data);

                    body.data = JSON.parse(body.data);
                    dispatch(chatEventHandler(body.event, body.data));
                    break;

                case EVENT_CHAT_CONSUMED:
                case EVENT_CHAT_CONSUMED_ACK:

                    body.data = JSON.parse(body.data);
                    dispatch(chatEventHandler(body.event, body.data));
                    break;

                case EVENT_CHAT_DELETED:
                case EVENT_CHAT_DELETED_ACK:
                    toastr.info(body.data);
                    break;

                default:
            }
            // console.log(body);
        });
    }
};