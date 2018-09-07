import SockJS from '../../node_modules/sockjs-client/dist/sockjs';
import StompJS from '../../node_modules/@stomp/stompjs/lib/stomp';
import toastr from "../../node_modules/toastr/toastr";

const SEND_QUEUE = "/app/hello";
const SUBSCRIBE_TOPIC = "/user/topic/greetings";
const STOMP_SERVER = 'http://localhost:8080/stomp/websocket/test';

function stompClient(props) {
    let client = null;
    let isConnected = false;

    return {
        connect: (user) => {
            client = StompJS.Stomp.over(() => new SockJS(STOMP_SERVER));
            client.reconnect_delay = 10000;
            client.connect({}, function (frame) {
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
            if(isConnected) client.disconnect();
        },
        send: (message) => {
            if(isConnected) client.send(props.queue, {}, JSON.stringify(message));
        }
    }
}

export default stompClient({queue: SEND_QUEUE, topic: SUBSCRIBE_TOPIC});