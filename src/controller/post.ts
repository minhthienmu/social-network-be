import { ObjectId } from "mongodb";
import Post from "../model/post";
import User from "../model/user";

const createPost = async (_: any, arg: any) => {
    const { request } = arg; 

    try {
        const newPost = new Post({
            userId: request.userId,
            image: request.image,
            description: request.description,
            tag: "",
            numLikes: 0,
            likes: [],
            numComments: 0,
            comments: [],
            isDeleted: false,
        });
        await newPost.save();
    } catch (err) {
        //TODO: handle error
    }
}

const getAllPost = async () => {
    try {
        const res = await Post.find({}).sort({"createdAt": -1});
        const allPost: any = [];
        for (let post of res) {
            const user = await User.findById(post.userId);
            allPost.push({
                id: post._id,
                userId: post.userId!,
                userFullName: user.fullName,
                image: post.image,
                date: post.createdAt.toISOString(),
                tag: post.tag,
                description: post.description,
                numLikes: post.numLikes,
                numComments: post.numComments,
                likes: post.likes.map((like: any) => {
                    return {
                        userId: like.userId!,
                        userFullName: like.userFullName,
                    }
                }),
                comments: post.comments.map((comment: any) => {
                    return {
                        id: comment._id,
                        userId: comment.userId!,
                        userFullName: comment.userFullName,
                        description: comment.description,
                        createdAt: comment.createdAt.toISOString(),
                    }
                }),
            });
        }
        return allPost;
    } catch (err) {
        //TODO: handle error
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
            tag: post.tag,
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
        //TODO: handle error
    }
}

const commentPost = async (_: any, arg: any) => {
    const { userId, postId, description } = arg.request; 

    try {
        const post = await Post.findById(postId);
        const comments = post.comments;
        const user = await User.findById(userId);
        const newComment = {
            _id: new ObjectId(),
            description: description,
            userId: userId,
            userFullName: user.fullName,
            createdAt: new Date(),
        }
        comments.unshift(newComment);
        post.numComments = comments.length;
        post.save();

        return "success";
    } catch (err) {
        //TODO: handle error
    }
}

const likePost = async (_: any, arg: any) => {
    const { userId, postId, like } = arg.request;

    try {
        const post = await Post.findById(postId);
        let likes = post.likes;
        if (like) {
            const user = await User.findById(userId);
            likes.push({
                userId: userId,
                userFullName: user.fullName,
            });
        } else {
            likes = likes.filter((e: any) => e.userId !== userId);
            post.likes = likes;
        }
        post.numLikes = likes.length;
        post.save();

        return "success";
    } catch (err) {
        //TODO: handle error
    }
};

export { createPost, getAllPost, getPost, likePost, commentPost };