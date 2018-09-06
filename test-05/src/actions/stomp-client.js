import SockJS from '../../node_modules/sockjs-client/dist/sockjs';
import StompJS from '../../node_modules/@stomp/stompjs/lib/stomp';
import toastr from "../../node_modules/toastr/toastr";

const SEND_QUEUE = "/app/hello";
const SUBSCRIBE_TOPIC = "/topic/greetings";

function stompClient(props) {
    var client = null;
    var isConnected = false;

    return {
        connect: () => {
            client = StompJS.Stomp.over(() => new SockJS('http://localhost:8080/stomp/websocket/test'));
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

export default stompClient({queue: "/app/hello", topic:"/topic/greetings"});