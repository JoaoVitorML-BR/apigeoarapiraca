import { Request, Response, NextFunction } from 'express';

var ConstructionBD = require('../models/ConstructionModels');

const _ = require('lodash');

const fs = require('fs');

interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

interface Construction {
    construction_type: string,
    mark_type: string,
    construction_name: String,
    construction_desc: String,
    date_init: string | Date,
    date_prev: string | Date,
    image_construction: BinaryType,
    latitude: number,
    longitude: number
}

// Path to save images
const uploadDirectory = '/home/joaovt/Documents/imagesConstruction/';


// Verify if directory alred exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

class ConstructionController {
    async findAllConstruction(req: Request, res: Response) {
        var construction: Construction[] = await ConstructionBD.findAllConstruction();
        res.json(construction);
    };

    async findConstructionById(req: Request, res: Response) {
        var id = req.params.id;
        var construction: Construction[] = await ConstructionBD.findConstructionByID(id);
        if (construction == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(construction);
        }
    };

    async findConstructionByName(req: Request, res: Response) {
        var construction_name = req.params.construction_name;

        var construction: Construction[] = await ConstructionBD.findConstructionByName(construction_name);
        if (construction == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(construction);
        }
    };

    async createConstruction(req: Request, res: Response) {
        try {
            const constructionData = req.body;
            const images = req.files;

            if (!images) {
                return res.status(400).json({ message: 'No images uploaded' });
            }

            console.log(constructionData);

            await ConstructionBD.createConstructionWithImages(constructionData, images);

            res.status(201).json({ message: 'Construction created successfully!' });
        } catch (error) {
            console.error('Error creating construction:', error);
            res.status(500).json({ error: 'An error occurred while creating construction' });
        }
    };
};

module.exports = new ConstructionController();