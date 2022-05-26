import { pubsub } from './../../index';
const sendMessage = (_: any, arg: any) => {
    pubsub.publish("SEND_MESSAGE", {
        sendMessage: "Hello World",
    })
}

export { sendMessage };