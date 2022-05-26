import Follow from "../model/follow";
import User from "../model/user";
import Notification from "../model/notification";
import { pubsub } from './../../index';
import user from "../model/user";
import { ObjectId } from "mongodb";

const follow = async (_: any, arg: any) => {
    const { followerId, followingId } = arg;
    
    try {
        const followerPromise = User.findById(followerId);
        const followingPromise = User.findById(followingId);
        const follower = await followerPromise;
        const following = await followingPromise;

        const followerObjPromise = Follow.findById(follower.follow);
        const followingObjPromise = Follow.findById(following.follow);
        const followerObj = await followerObjPromise;
        const followingObj = await followingObjPromise;

        //Handle follower => update following arr
        followerObj.following.push(followingId);
        followerObj.markModified("following");
        followerObj.save();

        //Handle following => update follower arr
        followingObj.follower.push(followerId);
        followingObj.markModified("follower");
        followingObj.save();

        //SEND NOFICATION
        if (!following.notification) {
            const notification = new Notification({
                notification: [],
            });
            await notification.save()
            following.notification = notification._id;
            following.markModified("notification");
            following.save();
        }
        const notificationObj = await Notification.findById(following.notification);
        const newNotification = {
            id: new ObjectId(),
            fromUserId: followerId,
            toUserId: followingId,
            fromUserFullName: follower.fullName,
            postId: "",
            type: "follow",
        };
        notificationObj.notification.unshift(newNotification);
        notificationObj.markModified("notification");
        notificationObj.save();

        pubsub.publish("NOTIFICATION", {
            notification: newNotification
        });
        
        return "success";
    } catch (error) {
        return error;
    }
}

const unfollow = async (_: any, arg: any) => {
    const { unfollowerId, followingId } = arg;
    
    try {
        const unfollowerPromise = User.findById(unfollowerId);
        const followingPromise = User.findById(followingId);
        const unfollower = await unfollowerPromise;
        const following = await followingPromise;

        const unfollowerObjPromise = Follow.findById(unfollower.follow);
        const followingObjPromise = Follow.findById(following.follow);
        const unfollowerObj = await unfollowerObjPromise;
        const followingObj = await followingObjPromise;

        //Handle follower => update following arr
        unfollowerObj.following = unfollowerObj.following.filter((id: string) => id !== followingId);
        unfollowerObj.markModified("following");
        unfollowerObj.save();

        //Handle following => update follower arr
        followingObj.follower = followingObj.follower.filter((id: string) => id !== unfollowerId);
        followingObj.markModified("follower");
        followingObj.save();

        return "success";
    } catch (error) {
        return error;
    }
}

const getFollower = async (_: any, arg: any) => {
    const { userId, last } = arg;

    try {
        const user = await User.findById(userId);
        const follow = await Follow.findById(user.follow);
        const follower = follow.follower.slice(last - 20, last);
        const promiseAll = [];
        for (let user of follower) {
            const promiseUser = User.findById(user);
            promiseAll.push(promiseUser);
        }
        const res = [];
        for (let promise of promiseAll) {
            const user = await promise;
            res.push({
                id: user._id,
                fullName: user.fullName,
                avatar: user.avatar,
            });
        }
       
        return res;
    } catch (error) {
        return error;
    }
}

const getFollowing = async (_: any, arg: any) => {
    const { userId, last } = arg;

    try {
        const user = await User.findById(userId);
        const follow = await Follow.findById(user.follow);
        const following = follow.following.slice(last - 20, last);
        const promiseAll = [];
        for (let user of following) {
            const promiseUser = User.findById(user);
            promiseAll.push(promiseUser);
        }
        const res = [];
        for (let promise of promiseAll) {
            const user = await promise;
            res.push({
                id: user._id,
                fullName: user.fullName,
                avatar: user.avatar,
            });
        }
        
        return res;
    } catch (error) {
        return error;
    }
}

const isFollowing = async (_: any, arg: any) => {
    const { followerId, followingId } = arg;

    try {
        const follower = await User.findById(followerId);
        const follow = await Follow.findById(follower.follow);
        if (follow.following.includes(followingId)) {
            return "true";
        }
        
        return "false";
    } catch (error) {
        return error;
    }
}

export { follow, unfollow, getFollower, getFollowing, isFollowing};