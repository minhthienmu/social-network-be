import Notification from "../model/notification";
import User from "../model/user";

const getAllNotification = async (_: any, arg: any) => {
    const { userId, last } = arg;

    try {
        const user = await User.findById(userId);
        const notificationObj = await Notification.findById(user.notification);
        const notification = notificationObj.notification.slice(Number(last) - 5, last);
        const res = notification.map((item: any) => {
            return {
                id: item.id,
                fromUserId: item.fromUserId,
                toUserId: item.toUserId,
                fromUserFullName: item.fromUserFullName,
                postId: item.postId,
                type: item.type,
            }
        })
        return res;
    } catch (error) {
        console.log(error);
    }
}

export { getAllNotification };