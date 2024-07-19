import { UUID } from "crypto";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { Equipment } from "../domains/Equipments";

const fs = require("fs");

var knex = require('../database/connection');

const uploadDirectory = '/usr/imagesEquipment';

// Verify if directory already exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

//Delete folder
if (fs.existsSync('/usr/imagesConstruction')) {
    fs.rm('/usr/imagesConstruction', { recursive: true });
    console.log('Folder deleted successfullyo.');
} else {
    console.log('The directory does not exist, there was no need to delete it.');
}

class EquipmentModels {
    async findAllEquipment() {
        try {
            var result = await knex
                .select([
                    'id',
                    'equipment_status',
                    'mark_type',
                    'equipment_name',
                    'equipment_desc',
                    'equipment_category',
                    'equipment_sub_category',
                    'date_init',
                    'date_prev',
                    'latitude',
                    'longitude',
                    'equipment_image_name_file_path',
                    'equipment_image_path'
                ])
                .table('equipment');

            result.forEach((equipment: any) => {
                equipment.equipment_image_name_file_path = equipment.equipment_image_name_file_path.split(',');
                equipment.equipment_image_path = equipment.equipment_image_path.split(',');
            });
            console.log('')
            return result;
        } catch (erro) {
            console.log(erro);
            return [];
        };
    };

    async findEquipmentByFilter(equipment_sub_category: Equipment) {
        try {
            var result = await knex.select(['id', 'equipment_status', 'mark_type', 'equipment_name', ' equipment_desc', 'equipment_category', 'equipment_sub_category', 'date_init', 'date_prev', 'latitude', 'longitude', 'equipment_image_name_file_path', 'equipment_image_path'])
                .where({ equipment_sub_category: equipment_sub_category }).table('equipment');

            result.forEach((equipment: any) => {
                equipment.equipment_image_name_file_path = equipment.equipment_image_name_file_path.split(',');
                equipment.equipment_image_path = equipment.equipment_image_path.split(',');
            });

            return result;
        } catch (erro) {
            console.log(erro);
            return [];
        };
    }

    async findEquipmentByID(equipment_id: UUID) {
        try {
            var result = await knex.select(['id', 'equipment_status', 'mark_type', 'equipment_name', ' equipment_desc', 'date_init', 'date_prev', 'latitude', 'longitude', 'equipment_image_name_file_path', 'equipment_image_path'])
                .where({ id: equipment_id }).table('equipment');

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

    async findEquipmentByName(equipment_name: string) {
        try {
            var result = await knex.select(['id', 'equipment_status', 'mark_type', 'equipment_name', ' equipment_desc', 'date_init', 'date_prev', 'latitude', 'longitude', 'equipment_image_name_file_path', 'equipment_image_path'])
                .where({ equipment_name: equipment_name }).table('equipment');

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return [];
        };
    };

    async findEquipmentByCoordinates(latitude: number, longitude: number) {
        try {
            var result = await knex.select(['id', 'equipment_name', 'latitude', 'longitude'])
                .where({ latitude: latitude, longitude: longitude }).table('equipment');

            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    async createEquipmentWithImages(equipmentData: Equipment, images: any) {
        const imageInfos = [];
        const imagePaths = [];
        const imageFileNames = [];

        for (const image of images) {
            const { originalname, filename } = image;
            const imagePath = path.join(uploadDirectory, filename);

            const cleanedSpaceName = originalname.trim();
            const removeCaracteresName = cleanedSpaceName.replace(/\s/g, '').replace(/\\/g, '').replace(/"/g, '');

            imageInfos.push({ name: removeCaracteresName.trim(), path: imagePath.trim() });
            imagePaths.push(imagePath.trim());
            imageFileNames.push(filename.trim());
        };

        await knex('equipment').insert({
            id: uuidv4(),
            equipment_status: equipmentData.equipment_status,
            mark_type: equipmentData.mark_type,
            equipment_name: equipmentData.equipment_name,
            equipment_desc: equipmentData.equipment_desc,
            equipment_category: equipmentData.equipment_category,
            equipment_sub_category: equipmentData.equipment_sub_category,
            date_init: equipmentData.date_init,
            date_prev: equipmentData.date_prev,
            latitude: equipmentData.latitude,
            longitude: equipmentData.longitude,
            equipment_image_name_file_path: imageFileNames,
            equipment_image_path: imagePaths,
        });
    }

    async UpdateEquipmentInfos(equipmentData: any, images: any[]) {
        if (!equipmentData) {
            return { status: false, err: 'Dados da construção não fornecidos.' };
        }

        const { id, equipment_status, equipment_name, equipment_desc, latitude, longitude } = equipmentData;

        const imageNewName: string[] = [];
        let imageNameFilePath: string[] = [];
        let imagesPaths: string[] = [];

        if (typeof equipmentData.originalImageNames === 'string') {
            imageNameFilePath = JSON.parse(equipmentData.originalImageNames).filter((name: string) => name !== null);
            imagesPaths = imageNameFilePath.map(name => `${uploadDirectory}/${name}`);
        } else if (Array.isArray(equipmentData.originalImageNames)) {
            imageNameFilePath = equipmentData.originalImageNames.filter((name: string) => name !== null);
            imagesPaths = imageNameFilePath.map(name => `${uploadDirectory}/${name}`);
        }

        if (images && images.length > 0) {
            for (const image of images) {
                if (!imageNameFilePath.includes(image.filename)) {
                    imageNameFilePath.push(image.filename);
                    imagesPaths.push(`${uploadDirectory}/${image.filename}`);
                }
            }
        }

        // Copying original image names to final image name array
        imageNewName.push(...imageNameFilePath);

        if (!id || !equipment_status || !equipment_name || !equipment_desc || !latitude || !longitude) {
            return { status: false, err: 'Todos os campos devem estar preenchidos.' };
        }

        const editEquipment: {
            equipment_status?: string;
            equipment_name?: string;
            equipment_desc?: string;
            latitude?: string;
            longitude?: string;
            equipment_image_name_file_path?: string;
            equipment_image_path?: string;
        } = {
            equipment_status,
            equipment_name,
            equipment_desc,
            latitude,
            longitude,
            equipment_image_name_file_path: imageNewName.join(",").trim(),
            equipment_image_path: imagesPaths.join(","),
        };

        try {
            await knex('equipment').update(editEquipment).where({ id });
            return { status: true };
        } catch (err: any) {
            return { status: false, err: err.message || 'Erro ao atualizar a construção.' };
        }
    }

};

module.exports = new EquipmentModels();