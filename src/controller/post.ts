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
            likes: [],
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
                likes: post.likes,
                comments: post.comments,
            })
        }
        return allPost;
    } catch (err) {
        //TODO: handle error
    }
}

export { createPost, getAllPost };