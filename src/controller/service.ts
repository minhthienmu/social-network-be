import Service from "../model/service";

const createService = async (_: any, arg: any) => {
    const { request } = arg; 

    try {
        const newService = new Service({
            name: request.name,
            isDeleted: false
        });
        await newService.save();
    } catch (err) {
        //TODO: handle error
    }
}

const getAllService = async () => {
    try {
        const res = await Service.find({});
        const allService: any = [];
        for (let service of res) {
            allService.push({
                id: service._id,
                name: service.name,
            });
        }
        return allService;
    } catch (error) {
        //TODO: handle error
    }
}

export { createService, getAllService };