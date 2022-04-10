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

    type Likes {
        userFullName: String!
    }

    type Comment {
        id: ID!
        userFullName: String!
        description: String!
    }

    type Post {
        id: ID!
        userId: ID!
        userFullName: String!
        image: String
        date: String!
        tag: String
        description: String
        likes: [Likes]
        comments: [Comment]
    }

    type Query {
        user(id: ID!): User
        allPost: [Post]
    }

    type Mutation {
        login(username: String!, password: String!): LoginResponse
        register(request: RegisterRequest): String
        createPost(request: CreatePostRequest): String
    }
`;

export default schema;