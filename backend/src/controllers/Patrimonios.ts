import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Patrimonio from '../models/Patrimonio';
import patrimonioView from '../views/patrimonios_view';

export default {
    async show(request: Request, response: Response) {
        const { id } = request.params;
        
        const patrimoniosRepository = getRepository(Patrimonio);

        const patrimonio = await patrimoniosRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return response.json(patrimonioView.render(patrimonio));
    },

    async index(request: Request, response: Response) {
        const patrimoniosRepository = getRepository(Patrimonio);

        const patrimonios = await patrimoniosRepository.find({
            relations: ['images']
        });

        return response.json(patrimonioView.renderMany(patrimonios));
    },

    async create(request: Request, response: Response) {
        const {
            type,
            name,
            address,
            latitude,
            longitude,
            notes
        } = request.body;
    
        const patrimoniosRepository = getRepository(Patrimonio);
        
        // LOCAL
        //const requestImages = request.files as Express.Multer.File[];

        //S3
        const requestImages = request.files as Express.MulterS3.File[];

        const images = requestImages.map(image => {
            //LOCAL
            //return { path: image.filename }

            //S3
            return { path: image.key }
        });
        
        const patrimonio = patrimoniosRepository.create({
            type,
            name,
            address,
            latitude,
            longitude,
            notes,
            images,
        });
    
        await patrimoniosRepository.save(patrimonio);
    
        return response.status(201).json(patrimonio);
    }
}