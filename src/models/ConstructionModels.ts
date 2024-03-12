import { UUID } from "crypto";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const fs = require("fs");

var knex = require('../database/connection');

const uploadDirectory = '/usr/imagesConstruction';

// Verify if directory already exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

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
                    'construction_image_name_file_path',
                    'construction_image_path'
                ])
                .table('construction');

            result.forEach((construction: any) => {
                construction.construction_image_name_file_path = construction.construction_image_name_file_path.split(',');
                construction.construction_image_path = construction.construction_image_path.split(',');
            });

            return result;
        } catch (erro) {
            console.log(erro);
            return [];
        };
    };

    async findConstructionByID(construction_id: UUID) {
        try {
            var result = await knex.select(['id', 'construction_type', 'construction_status', 'mark_type', 'construction_name', ' construction_desc', 'date_init', 'date_prev', 'latitude', 'longitude', 'construction_image_name_file_path', 'construction_image_path'])
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
            var result = await knex.select(['id', 'construction_type', 'construction_status', 'mark_type', 'construction_name', ' construction_desc', 'date_init', 'date_prev', 'latitude', 'longitude', 'construction_image_name_file_path', 'construction_image_path'])
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
        const imageFileNames = [];

        for (const image of images) {
            const { originalname, filename } = image;
            const imagePath = path.join(uploadDirectory, filename);

            const imageNewName = originalname;

            imageInfos.push({ name: imageNewName, path: imagePath});
            imagePaths.push(imagePath);
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
            construction_image_path: imagePaths.map((path) => path.replace(/\\/g, '').replace(/"/g, '')),
        });
    };

    async UpdateConstructionInfos(constructionData: any, images: any[]) {
        if (!constructionData) {
            return { status: false, err: 'Dados da construção não fornecidos.' };
        };
    
        const { id, construction_status, construction_name, construction_desc, latitude, longitude } = constructionData;
    
        const imageNewName: string[] = [];
        let imageNameFilePath: string[] = [];
        let imagesPaths: string[] = [];
    
        if (typeof constructionData.imageNameFilePath === 'string') {
            imageNameFilePath = JSON.parse(constructionData.imageNameFilePath).filter((name: string) => name !== null);
            imagesPaths = imageNameFilePath.map(name => `${uploadDirectory}/${name}`);
        } else if (Array.isArray(constructionData.imageNameFilePath)) {
            imageNameFilePath = constructionData.imageNameFilePath.filter((name: string) => name !== null);
            imagesPaths = imageNameFilePath.map(name => `${uploadDirectory}/${name}`);
        };
    
        if (images && images.length > 0) {
            for (const image of images) {
    
                if (!imageNameFilePath.includes(image.filename)) {
                    imageNameFilePath.push(image.filename);
                    imagesPaths.push(`${uploadDirectory}/${image.filename}`);
                }
            }
        };
    
        // Copying original image names to final image name array
        imageNewName.push(...imageNameFilePath);
    
        if (!id || !construction_status || !construction_name || !construction_desc || !latitude || !longitude) {
            return { status: false, err: 'Todos os campos devem estar preenchidos.' };
        };
    
        const editConstruction: {
            construction_status?: string;
            construction_name?: string;
            construction_desc?: string;
            latitude?: string;
            longitude?: string;
            construction_image_name_file_path?: string;
            construction_image_path?: string;
        } = {
            construction_status,
            construction_name,
            construction_desc,
            latitude,
            longitude,
            construction_image_name_file_path: imageNewName.join(", "),
            construction_image_path: imagesPaths.join(", "),
        };
    
        if (images && images.length > 0) {
            const imageFileNames = images.map(image => image.filename);
            console.log("Nomes dos arquivos das novas imagens: ", imageFileNames);
        };
    
        try {
            await knex('construction').update(editConstruction).where({ id });
            return { status: true };
        } catch (err: any) {
            return { status: false, err: err.message || 'Erro ao atualizar a construção.' };
        };
    };
};

module.exports = new ConstructionModels();