import { pubsub } from './../../index';
import ChatRoom from "../model/chatRoom";
import { ObjectId } from 'mongodb';
import User from '../model/user';

const sendMessage = async (_: any, arg: any) => {
    const { id, from, to, message } = arg.request;

    try {
        const chatRoom = await ChatRoom.findById(id);
        if (chatRoom) {
            const messages = chatRoom.messages;
            const newMessage = {
                id: new ObjectId(),
                from: from,
                to: to,
                message: message,
                date: new Date(),
            }
            messages.push(newMessage);
            chatRoom.markModified("messages");
            chatRoom.save();

            pubsub.publish("SEND_MESSAGE", {
                message: { ...newMessage, date: newMessage.date.toISOString(), chatRoomId: id }
            });
        } else {
            const newMessage = {
                id: new ObjectId(),
                from: from,
                to: to,
                message: message,
                date: new Date(),
            };
            const newChatRoom = new ChatRoom({
                userId1: from,
                userId2: to,
                messages: [newMessage],
            });
            await newChatRoom.save();
            pubsub.publish("SEND_MESSAGE", {
                message: { ...newMessage, date: newMessage.date.toISOString(), chatRoomId: newChatRoom._id }
            });
            return newChatRoom._id;
        }
    } catch (error) {
        return error;
    }
}

const getChatContact = async (_: any, arg: any) => {
    const { userId, last } = arg;

    try {
        const chatRooms = await ChatRoom.find().or([{ userId1: userId }, { userId2: userId }]).sort({ updatedAt: "desc" });
        const res = [];
        for (let chatRoom of chatRooms) {
            const thatUserId = chatRoom.userId1 === userId ? chatRoom.userId2 : chatRoom.userId1;
            const thatUserPromise = User.findById(thatUserId);
            res.push({
                id: chatRoom._id,
                avatar: (await thatUserPromise).avatar,
                userId: thatUserId,
                userFullName: (await thatUserPromise).fullName,
                lastMessage: chatRoom.messages[chatRoom.messages.length - 1].message,
                date: chatRoom.updatedAt.toISOString(),
            });
        }

        return res;
    } catch (error) {
        return error;
    }
}

const getMessages = async (_: any, arg: any) => {
    const { chatRoomId, last } = arg;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        const messages = chatRoom.messages.reverse();
        //const messages = chatRoom.messages.reverse().slice(last - 20, last);
        return messages.reverse().map((item: any) => {
            return {
                ...item,
                date: item.date.toISOString(),
            }
        });
    } catch (error) {
        return error;
    }
}

export { sendMessage, getChatContact, getMessages };