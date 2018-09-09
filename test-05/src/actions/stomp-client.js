import SockJS from '../../node_modules/sockjs-client/dist/sockjs';
import StompJS from '../../node_modules/@stomp/stompjs/lib/stomp';
import toastr from "../../node_modules/toastr/toastr";

const SEND_QUEUE = "/app/message";
const SUBSCRIBE_TOPIC = "/user/topic/event/generic";
const STOMP_SERVER = 'http://localhost:8080/stomp/websocket/test';

function stompClient(props) {
    let client = null;
    let isConnected = false;

    return {
        connect: (username) => {
            const bearer = JSON.parse(localStorage.getItem('bearer'));
            const headers = {
                'X-Authorization': bearer ? 'Bearer ' + bearer.token : null,
                login: username,
                passcode: 'password'
            };

            client = StompJS.Stomp.over(() => new SockJS(STOMP_SERVER));
            client.reconnect_delay = 10000;
            client.connect(headers, function (frame) {
                console.log('CONNECT ' + frame);
                client.subscribe(props.topic, function (frame) {
                    console.log('WEBSOCKET', frame);
                    const json = JSON.parse(frame.body);
                    toastr.warning(JSON.stringify(json));
                });
                isConnected = true;
            });
        },
        disconnect: () => {
            if (isConnected) client.disconnect();
        },
        send: (message) => {
            if (isConnected) client.send(props.queue, {}, JSON.stringify(message));
        }
    }
}

export default stompClient({queue: SEND_QUEUE, topic: SUBSCRIBE_TOPIC});