import { ObjectId } from "mongodb";
import Post from "../model/post";
import User from "../model/user";
import Provider from "../model/provider";
import Service from "../model/service";
import { updateRatingProviderService } from "./provider";
import { UpdateRatingType } from "../constanst/enum";
import Like from "../model/like";
import Comment from "../model/comment";
import Notification from "../model/notification";
import { pubsub } from './../../index';

const createPost = async (_: any, arg: any) => {
    const { request } = arg; 
    const { userId, providerId, serviceId, image, description, rate } = request;

    try {
        const newLike = new Like({
            userIds: [],
        });
        const newComment = new Comment({
            comments: [],
        });
        await newLike.save();
        await newComment.save();
        const newPost = new Post({
            userId: userId,
            providerId: providerId,
            serviceId: serviceId,
            image: image,
            description: description,
            rate: rate,
            numLikes: 0,
            numComments: 0,
            isDeleted: false,
            commentId: newComment._id,
            likeId: newLike._id,
        });
        updateRatingProviderService(providerId, serviceId, Number(rate), UpdateRatingType.Create);
        await newPost.save();

        return "success";
    } catch (err) {
        return err;
    }
}

const getAllPost = async (_: any, arg: any) => {
    const { request } = arg;
    const { last, currentUserId, providerId, userId } = request;
    try {
        const query: any = {};
        if (providerId) query["providerId"] = providerId;
        if (userId) query["userId"] = userId;
        const res = await Post.find(query).sort({"createdAt": -1}).skip(last).limit(20);
        const allPost: any = [];
        for (let post of res) {
            const userPromise = User.findById(post.userId);
            const providerPromise = Provider.findById(post.providerId);
            const servicePromise = Service.findById(post.serviceId);
            const likePromise = Like.findById(post.likeId);
            const user = await userPromise;
            const provider = await providerPromise;
            const service = await servicePromise;
            const like = await likePromise;
            const userLike = like.userIds ?? [];
            const isLikeByUser = !!userLike.find((user: any) => user.userId === currentUserId);
            allPost.push({
                id: post._id,
                userId: post.userId!,
                userFullName: user.fullName,
                providerId: post.providerId,
                providerName: provider.name,
                serviceId: post.serviceId,
                serviceName: service.name,
                image: post.image,
                date: post.createdAt.toISOString(),
                rate: post.rate,
                description: post.description,
                numLikes: post.numLikes,
                numComments: post.numComments,
                isLikeByUser: isLikeByUser,
            });
        }

        return allPost;
    } catch (err) {
        return err;
    }
}

const getPost = async (_: any, arg: any) => {
    const { id } = arg;
    try {
        const post = await Post.findById(id);
        const user = await User.findById(post.userId);
        const res = {
            id: post._id,
            userId: post.userId!,
            userFullName: user.fullName,
            image: post.image,
            date: post.createdAt.toISOString(),
            rate: post.rate,
            description: post.description,
            numLikes: post.numLikes,
            numComments: post.numComments,
            likes: post.likes,
            comments: post.comments.map((comment: any) => {
                return {
                    id: comment._id,
                    userId: comment.userId!,
                    userFullName: comment.userFullName,
                    description: comment.description,
                    createdAt: comment.createdAt.toISOString(),
                }
            }),
        };
        return res;
    } catch (err) {
        return err;
    }
}

const getCommentPost = async (_: any, arg: any) => {
    const { postId } = arg;

    try {
        const post = await Post.findById(postId);
        const comment = await Comment.findById(post.commentId);
        const res = comment.comments.map((item: any) => {
            return {
                id: item._id,
                userId: item.userId!,
                userFullName: item.userFullName,
                description: item.description,
                createdAt: item.createdAt.toISOString(),
            }
        });
        return res;
    } catch (error) {
        return error;
    }
}

const commentPost = async (_: any, arg: any) => {
    const { userId, postId, description } = arg.request; 

    try {
        const post = await Post.findById(postId);
        const commentPromise = Comment.findById(post.commentId);
        const userPromise = User.findById(userId);
        const comment = await commentPromise;
        const user = await userPromise;
        const newComment = {
            _id: new ObjectId(),
            description: description,
            userId: userId,
            userFullName: user.fullName,
            createdAt: new Date(),
        }
        const comments = comment.comments;
        comments.unshift(newComment);
        post.numComments = comments.length;
        post.save();
        comment.markModified("comments");
        comment.save();

        //SEND NOFICATION
        if (userId !== post.userId) {
            const toUser = await User.findById(post.userId);
            if (!toUser.notification) {
                const notification = new Notification({
                    notification: [],
                });
                await notification.save();
                toUser.notification = notification._id;
                toUser.markModified("notification");
                toUser.save();
            }
            const notificationObj = await Notification.findById(
                toUser.notification
            );
            const newNotification = {
                id: new ObjectId(),
                fromUserId: userId,
                toUserId: post.userId,
                fromUserFullName: user.fullName,
                postId: postId,
                type: "comment",
            };
            notificationObj.notification.unshift(newNotification);
            notificationObj.markModified("notification");
            notificationObj.save();

            pubsub.publish("NOTIFICATION", {
                notification: newNotification,
            });
        }
        

        return "success";
    } catch (err) {
        return err;
    }
}

const likePost = async (_: any, arg: any) => {
    const { userId, postId, like } = arg.request;

    try {
        const post = await Post.findById(postId);
        const likeObj = await Like.findById(post.likeId);
        let likeUsers = likeObj.userIds;
        if (like) {
            const user = await User.findById(userId);
            likeUsers.push({
                userId: userId,
                userFullName: user.fullName,
            });

            //SEND NOFICATION
            if (userId !== post.userId) {
                const toUser = await User.findById(post.userId);
                if (!toUser.notification) {
                    const notification = new Notification({
                        notification: [],
                    });
                    await notification.save()
                    toUser.notification = notification._id;
                    toUser.markModified("notification");
                    toUser.save();
                }
                const notificationObj = await Notification.findById(toUser.notification);
                const newNotification = {
                    id: new ObjectId(),
                    fromUserId: userId,
                    toUserId: post.userId,
                    fromUserFullName: user.fullName,
                    postId: postId,
                    type: "like",
                };
                notificationObj.notification.unshift(newNotification);
                notificationObj.markModified("notification");
                notificationObj.save();
    
                pubsub.publish("NOTIFICATION", {
                    notification: newNotification
                });
            }
        } else {
            likeUsers = likeUsers.filter((e: any) => e.userId !== userId);
            likeObj.userIds = likeUsers;
        }
        likeObj.markModified("userIds");
        likeObj.save();
        post.numLikes = likeUsers.length;
        post.save();

        return "success";
    } catch (err) {
       return err;
    }
};

export { createPost, getAllPost, getPost, likePost, commentPost, getCommentPost };