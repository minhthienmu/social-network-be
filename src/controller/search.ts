import Provider from "../model/provider";
import User from "../model/user";
import Post from "../model/post";
import Service from "../model/service";

const search = async (_: any, arg: any) => {
    const { keyword } = arg;

    try {
        const searchUserPromise = User.aggregate([
            {
                '$search': {
                  'index': 'user',
                  'text': {
                    'query': keyword,
                    'path': {
                      'wildcard': '*'
                    }
                  }
                }
              }
        ]);
        const searchProviderPromise = Provider.aggregate([
            {
                '$search': {
                  'index': 'provider',
                  'text': {
                    'query': keyword,
                    'path': {
                      'wildcard': '*'
                    }
                  }
                }
              }
        ]);
        const searchPostPromise = Post.aggregate([
            {
                '$search': {
                  'index': 'post',
                  'text': {
                    'query': keyword,
                    'path': {
                      'wildcard': '*'
                    }
                  }
                }
              }
        ]);
        const users = await searchUserPromise;
        const providers = await searchProviderPromise;
        const posts = await searchPostPromise;

        let res: any = {
            user: [],
            provider: [],
            post: [],
        }

        for (let user of users) {
          if (user.role === "2") {
            res.user.push({
              id: user._id,
              fullName: user.fullName,
              avatar: user.avatar,
            });
          }
        }
        for (let provider of providers) {
            res.provider.push({
                id: provider._id,
                name: provider.name,
                address: provider.address,
            });
        }
        for (let post of posts) {
            const userPromise = User.findById(post.userId);
            const providerPromise = Provider.findById(post.providerId);
            const servicePromise = Service.findById(post.serviceId);
            const user = await userPromise;
            const provider = await providerPromise;
            const service = await servicePromise;
            res.post.push({
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
            });
        }

        return res;
    } catch (error) {
        return error;
    }
}

export { search };