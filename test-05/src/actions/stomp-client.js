import SockJS from '../../node_modules/sockjs-client/dist/sockjs';
import StompJS from '../../node_modules/@stomp/stompjs/lib/stomp';
import toastr from "../../node_modules/toastr/toastr";

const SEND_QUEUE = "/app/message";
const SUBSCRIBE_TOPIC = "/user/topic/event/generic";
const STOMP_SERVER = 'http://localhost:8080/stomp/websocket/test';

function stompClient(props) {
    let client = null;
    let state = 'DISCONNECTED';

    return {
        connect: (username, callback) => {

            if (state === 'CONNECTING') return;

            const bearer = JSON.parse(localStorage.getItem('bearer'));
            const headers = {
                'X-Authorization': bearer ? 'Bearer ' + bearer.token : null,
                login: username,
                passcode: 'password'
            };

            state = 'CONNECTING';
            client = StompJS.Stomp.over(() => new SockJS(STOMP_SERVER));
            client.reconnect_delay = 10000;
            client.connect(headers, (frame) => {
                client.subscribe(props.topic, (frame) => {
                    console.log('WEBSOCKET', frame);
                    callback(JSON.parse(frame.body));
                });
                state = 'CONNECTED';

            }, (error) => {
                state = 'DISCONNECTED';
                console.log(error);
                toastr.error(`WEBSOCKET error. ${error}`);
            });
        },
        disconnect: () => {
            if (state === 'CONNECTED') client.disconnect();
            state = 'DISCONNECTED';
        },
        send: (message) => {
            if (state === 'CONNECTED') client.send(props.queue, {}, JSON.stringify(message));
        },
        state: () => {return state}
    }
}

export default stompClient({queue: SEND_QUEUE, topic: SUBSCRIBE_TOPIC});