import { UpdateRatingType } from './../constanst/enum';
import Service from "../model/service";
import Provider from "../model/provider";

const createProvider = async (_: any, arg: any) => {
    const { request } = arg; 

    try {
        const serviceRate = [
            {
                serviceId: request.serviceId,
                sumRating: 0,
                totalRating: 0,
            }
        ]
        const newProvider = new Provider({
            name: request.name,
            address: request.address,
            serviceRate: serviceRate,
            isVerified: false,
            isDeleted: false
        });
        await newProvider.save();

        return "success";
    } catch (err) {
        return err;
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
        return error;
    }
}

const getProviderInfo = async (_: any, arg: any) => {
    const { id } = arg;

    try {
        const res = await Provider.findById(id);
        const lst = [];
        for (let serviceRate of res.serviceRate) {
            const service = await Service.findById(serviceRate.serviceId);
            lst.push({
                serviceId: serviceRate.serviceId,
                serviceName: service.name,
                sumRating: serviceRate.sumRating,
                totalRating: serviceRate.totalRating,
            })
        }
        const provider = {
            id: res._id,
            name: res.name,
            address: res.address,
            serviceRate: lst,
        }
        return provider;
    } catch (error) {
        return error;
    }
}

const updateRatingProviderService = async (providerId: string, serviceId: string, rate: number, updateRatingType: UpdateRatingType, oldRate?: number) => {
    try {
        const provider = await Provider.findById(providerId);
        const serviceRate = provider.serviceRate.find((service: any) => service.serviceId === serviceId);
        if (!!serviceRate) {
            switch (updateRatingType) {
                case UpdateRatingType.Create:
                    serviceRate.totalRating++;
                    serviceRate.sumRating += rate;
                    break;
                case UpdateRatingType.Update:
                    serviceRate.sumRating = serviceRate.sumRating + rate - (oldRate ?? 0);
                    break;
                case UpdateRatingType.Delete:
                    serviceRate.totalRating--;
                    serviceRate.sumRating -= rate;
                    break;
            }
        } else {
            provider.serviceRate.push({
                serviceId: serviceId,
                sumRating: rate,
                totalRating: 1,
            });
        }
        provider.markModified("serviceRate");
        provider.save();
    } catch (error) {
        return error;
    }
}

export { createProvider, getAllProvider, getProviderInfo, updateRatingProviderService };