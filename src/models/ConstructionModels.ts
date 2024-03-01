import { UUID } from "crypto";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const fs = require("fs");

var knex = require('../database/connection');
const uploadDirectory = '/home/joaovt/Documents/imagesConstruction/';

// verify if directory exists else mkdri new folder
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
};

class ConstructionModels {
    async findAllConstruction() {
        try {
            var result = await knex
                .select([
                    'id',
                    'construction_type',
                    'construction_status',
                    'mark_type',
                    'construction_name',
                    ' construction_desc',
                    'date_init',
                    'date_prev',
                    'latitude',
                    'longitude',
                    'construction_image_name_origin',
                    'construction_image_name_file_path',
                    'construction_image_path'
                ])
                .table('construction');

            result.forEach((construction: any) => {
                construction.construction_image_name_origin = construction.construction_image_name_origin.split(',');
                construction.construction_image_name_file_path = construction.construction_image_name_file_path.split(',');
                construction.construction_image_path = construction.construction_image_path.split(',');
            });

            console.log(result);
            return result;
        } catch (erro) {
            console.log(erro);
            return [];
        };
    };

    async findConstructionByID(construction_id: UUID) {
        try {
            var result = await knex.select(['id', 'construction_type', 'construction_status', 'mark_type', 'construction_name', ' construction_desc', 'date_init', 'date_prev', 'latitude', 'longitude', 'construction_image_name_origin', 'construction_image_name_file_path', 'construction_image_path'])
                .where({ id: construction_id }).table('construction');

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (erro) {
            console.log(erro);
            return [];
        };
    };

    async findConstructionByName(construction_name: string) {
        try {
            var result = await knex.select(['id', 'construction_type', 'construction_status', 'mark_type', 'construction_name', ' construction_desc', 'date_init', 'date_prev', 'latitude', 'longitude', 'construction_image_name_origin', 'construction_image_name_file_path', 'construction_image_path'])
                .where({ construction_name: construction_name }).table('construction');

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (erro) {
            console.log(erro);
            return [];
        };
    };

    async createConstructionWithImages(constructionData: any, images: any) {
        const imageInfos = [];
        const imagePaths = [];
        const imageOriginalNames = [];
        const imageFileNames = [];

        for (const image of images) {
            const { originalname, filename } = image;
            const imagePath = path.join(uploadDirectory, filename);
            const imageExtension = path.extname(originalname);

            const imageNewName = originalname;

            console.log('image path: ', imagePath);
            console.log('image original name: ', originalname);
            console.log('extension: ', imageExtension);
            console.log('image new name: ', imageNewName);

            imageInfos.push({ name: imageNewName, path: imagePath, originalName: originalname });
            imagePaths.push(imagePath);
            imageOriginalNames.push(originalname);
            imageFileNames.push(filename);
        };

        await knex('construction').insert({
            id: uuidv4(),
            construction_type: constructionData.construction_type,
            construction_status: constructionData.construction_status,
            mark_type: constructionData.mark_type,
            construction_name: constructionData.construction_name,
            construction_desc: constructionData.construction_desc,
            date_init: constructionData.date_init,
            date_prev: constructionData.date_prev,
            latitude: constructionData.latitude,
            longitude: constructionData.longitude,
            construction_image_name_file_path: imageFileNames.map((name) => name.replace(/\\/g, '').replace(/"/g, '')),
            construction_image_name_origin: imageOriginalNames.map((name) => name.replace(/\\/g, '').replace(/"/g, '')),
            construction_image_path: imagePaths.map((path) => path.replace(/\\/g, '').replace(/"/g, '')),

        });
    };

    async UpdateConstructionInfos(constructionData: any) {

        if (constructionData != undefined) {
            const editConstruction: {
                construction_status?: string;
                construction_name?: string;
                construction_desc?: string;
            } = {};

            if (constructionData.construction_status == undefined || constructionData.construction_status == '' || constructionData.construction_status[0] == ' ' || constructionData.construction_name == undefined || constructionData.construction_name == '' || constructionData.construction_name[0] == ' ' || constructionData.construction_desc == undefined || constructionData.construction_desc == '' || constructionData.construction_desc[0] == ' ') {

                return { status: false, err: 'Todos os campos devem está preenchidos.' };

            };

            editConstruction.construction_status = constructionData.construction_status;
            editConstruction.construction_name = constructionData.construction_name;
            editConstruction.construction_desc = constructionData.construction_desc;

            console.log(editConstruction);
            try {
                await knex.update(editConstruction).where({ id: constructionData.id }).table('construction');
                return { status: true };
            } catch (err) {
                return { status: false, err: err };
            };
        };
    };

    async UpdateConstructionImages(constructionId: string, newImages: Express.Multer.File[]) {
        const trx = await knex.transaction();
        try {
            const oldImages = await knex('construction').select().where({ id: constructionId });

            const oldImageNames = oldImages.map((image: any) => image.image_name_file_path);
            const oldImageOriginalNames = oldImages.map((image: any) => image.image_name_origin);
            const oldImagePaths = oldImages.map((image: any) => image.image_path);

            const updatedImageNames = oldImageNames.concat(newImages.map(image => image.filename));
            const updatedImageOriginalNames = oldImageOriginalNames.concat(newImages.map(image => image.originalname));
            const updatedImagePaths = oldImagePaths.concat(newImages.map(image => path.join(uploadDirectory, image.filename)));

            await knex('construction')
                .where({ id: constructionId })
                .update({
                    image_name_file_path: updatedImageNames,
                    image_name_origin: updatedImageOriginalNames,
                    image_path: updatedImagePaths
                });

            await trx.commit();
            return { status: true };
        } catch (err) {
            await trx.rollback();
            return { status: false, err: err };
        };
    };
};

module.exports = new ConstructionModels();