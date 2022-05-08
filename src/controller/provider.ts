import provider from "../model/provider";
import Provider from "../model/provider";
import User from "../model/user";

const createProvider = async (_: any, arg: any) => {
    const { request } = arg; 

    try {
        const newProvider = new Provider({
            name: request.name,
            address: request.address,
            isVerified: false,
            isDeleted: false
        });
        await newProvider.save();
        return "success";
    } catch (err) {
        //TODO: handle error
    }
} 

const getAllProvider = async (_: any, arg: any) => {
    const { last } = arg;

    try {
        const res = await Provider.find({}).skip(last);
        const allProvider: any = [];
        for (let provider of res) {
            allProvider.push({
                id: provider._id,
                name: provider.name,
                address: provider.address,
            });
        }
        return allProvider;
    } catch (error) {
        //TODO: handle error
    }
}

const getProviderInfo = async (_: any, arg: any) => {
    const { id } = arg;

    try {
        const res = await Provider.findById(id);
        const provider = {
            id: res._id,
            name: res.name,
            address: res.address,
        }
        return provider;
    } catch (error) {
        //TODO: handle error
    }
}

const isUserOrProvider = async (_: any, arg: any) => {
    const { id } = arg;

    try {
        const existUser = await User.findById(id);
        if (existUser) return "1";
        const existProvider = await Provider.findById(id);
        if (existProvider) return "2";
        return "0";
    } catch (error) {
        //TODO: handle error
    }
}

export { createProvider, getAllProvider, getProviderInfo, isUserOrProvider };