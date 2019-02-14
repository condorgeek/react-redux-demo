/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [stomp-client.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 24.09.18 14:02
 */

import SockJS from '../../node_modules/sockjs-client/dist/sockjs';
import StompJS from '../../node_modules/@stomp/stompjs/lib/stomp';
import toastr from "../../node_modules/toastr/toastr";
import {getBearer} from "./bearer-config";
import {ROOT_STOMP_SERVER} from "./index";

export const SEND_GENERIC_QUEUE = "/app/message";
export const CHAT_DELIVER_QUEUE = "/app/chat/deliver";
export const CHAT_CONSUME_QUEUE = "/app/chat/consume";

const SUBSCRIBE_EVENT_GENERIC = "/user/topic/event/generic";
const SUBSCRIBE_SIMPLE_CHAT = "/user/topic/chat/simple";

function stompClient() {
    let client = null;
    let state = 'DISCONNECTED';

    return {
        connect: (username, eventhandler, chathandler) => {
            if (state === 'CONNECTING') return;
            const bearer = getBearer();
            const headers = {
                'X-Authorization': bearer ? 'Bearer ' + bearer.token : null,
                login: username,
                passcode: null
            };

            state = 'CONNECTING';
            client = StompJS.Stomp.over(() => new SockJS(ROOT_STOMP_SERVER));
            client.reconnect_delay = 10000;
            client.connect(headers, (frame) => {
                eventhandler && client.subscribe(SUBSCRIBE_EVENT_GENERIC, (frame) => {
                    eventhandler(JSON.parse(frame.body));
                });
                chathandler && client.subscribe(SUBSCRIBE_SIMPLE_CHAT, (frame) => {
                    chathandler(JSON.parse(frame.body));
                });
                state = 'CONNECTED';

            }, (error) => {
                // TODO possible security issues - force logout ?
                state = 'DISCONNECTED';
                console.log(error);
                toastr.error(`WEBSOCKET error. ${error}`);
            });
        },
        subscribe: (topic, callback) => {
            state === 'CONNECTED' &&  client.subscribe(topic, (frame) => {
                callback(JSON.parse(frame.body));
            });
        },
        disconnect: () => {
            state === 'CONNECTED' && client.disconnect();
            state = 'DISCONNECTED';
        },
        send: (queue, message) => {
            state === 'CONNECTED' && client.send(queue, {}, JSON.stringify(message));
        },
        state: () => {return state}
    }
}

// init function before exporting
export default stompClient();