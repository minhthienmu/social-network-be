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
        providerId: ID!
        serviceId: ID!
        image: String!
        description: String!
        rate: Float!
    }

    input LikeRequest {
        postId: ID!
        userId: ID!
        like: Boolean!
    }

    input CommentRequest {
        userId: ID!
        postId: ID!
        description: String!
    }

    input CreateProviderRequest {
        name: String!
        address: String!
    }

    input CreateServiceRequest {
        name: String!
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
        providerId: ID
        providerName: String
        serviceId: ID
        serviceName: String
        image: String
        date: String!
        description: String
        numLikes: Int
        likes: [Likes]
        numComments: Int
        comments: [Comment]
        rate: Float
    }

    type Provider {
        id: ID!
        name: String!
        address: String!
    }

    type Service {
        id: ID!
        name: String!
    }

    type ProviderInfo {
        id: ID!
        name: String!
        address: String!
    }

    type Query {
        user(id: ID!): User
        allPost(last: Int): [Post]
        post(id: ID!): Post
        allProvider(last: Int): [Provider]
        allService: [Service]
        isUserOrProvider(id: ID!): String
        providerInfo(id: ID!): ProviderInfo
    }

    type Mutation {
        login(username: String!, password: String!): LoginResponse
        register(request: RegisterRequest): String
        createPost(request: CreatePostRequest): String
        comment(request: CommentRequest): String
        like(request: LikeRequest): String
        createProvider(request: CreateProviderRequest): String
        createService(request: CreateServiceRequest): String
    }
`;

export default schema;