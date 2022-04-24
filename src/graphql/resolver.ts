import { Request } from 'express';
import { getUser, login, register } from "../controller/user";
import { createPost, getAllPost, getPost, commentPost, likePost } from "../controller/post";

const resolvers = {
    Query: {
        user: getUser,
        allPost: getAllPost,
        post: getPost,
    },
    Mutation: {
        register: register,
        login: login,
        createPost: createPost,
        comment: commentPost,
        like: likePost,
    }
}

export default [resolvers];
