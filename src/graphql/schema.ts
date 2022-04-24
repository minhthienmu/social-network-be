import { gql } from "apollo-server-express";

const schema = gql`
    input RegisterRequest {
        username: String!
        password: String!
        fullName: String!
    } 

    type LoginResponse {
        token: String!
        user: User
    }

    type User {
        id: ID!
        username: String!
        fullName: String!
    }

    input CreatePostRequest {
        userId: ID!
        image: String!
        description: String!
    }

    input CommentRequest {
        userId: ID!
        postId: ID!
        description: String!
    }

    type Likes {
        userId: ID!
        userFullName: String!
    }

    type Comment {
        id: ID!
        userId: ID!
        userFullName: String!
        description: String!
        createdAt: String!
    }

    type Post {
        id: ID!
        userId: ID!
        userFullName: String!
        image: String
        date: String!
        tag: String
        description: String
        numLikes: Int
        likes: [Likes]
        numComments: Int
        comments: [Comment]
    }

    type Query {
        user(id: ID!): User
        allPost: [Post]
        post(id: ID!): Post
    }

    type Mutation {
        login(username: String!, password: String!): LoginResponse
        register(request: RegisterRequest): String
        createPost(request: CreatePostRequest): String
        comment(request: CommentRequest): String
    }
`;

export default schema;