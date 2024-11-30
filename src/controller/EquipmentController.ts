import { Request, Response, NextFunction } from 'express';
import { Equipment } from '../domains/Equipments';

var EquipmentDB = require('../models/EquipmentModels');

class EquipmentController {
    async findAllEquipment(req: Request, res: Response) {
        var equipement: Equipment[] = await EquipmentDB.findAllEquipment();
        console.log(equipement);
        res.json(equipement);
    };

    async findEquipmentById(req: Request, res: Response) {
        var id = req.params.id;
        var equipment: Equipment[] = await EquipmentDB.findEquipmentByID(id);
        if (equipment == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(equipment);
        }
    };

    async findEquipmentByName(req: Request, res: Response) {
        var equipment_name = req.params.equipment_name;

        var equipement: Equipment[] = await EquipmentDB.findEquipmentByName(equipment_name);
        if (equipement == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(equipement);
        }
    };

    async findEquipmentByFilter(req: Request, res: Response) {
        try {
            var equipmentsFilter = req.params;
            let result;
            if (equipmentsFilter.status != 'todos') {
                result = await EquipmentDB.findEquipmentByFilter(equipmentsFilter.subcategory);
                res.status(200).json(result);
            }
        } catch (error) {
            console.error('Error find equipment by filters', error);
            res.status(500).json({ error: 'An error occurred while search equipment by filters' });
        }
    };

    async createEquipment(req: Request, res: Response) {
        try {
            const equipments = req.body;
            const images = req.files;

            if (!images) {
                return res.status(400).json({ message: 'No images uploaded' });
            }

            const existsEquipmentInCoordinate = await EquipmentDB.findEquipmentByCoordinates(equipments.latitude, equipments.longitude);

            if (existsEquipmentInCoordinate) {
                console.log('There is already equipment at that coordinate', existsEquipmentInCoordinate);
                res.status(406).json({ message: 'There is already equipment at that coordinate' });
                return;
            } else {
                await EquipmentDB.createEquipmentWithImages(equipments, images);
                res.status(201).json({ message: 'Equipment created successfully!' });
            }
        } catch (error) {
            console.error('Error creating equipment:', error);
            res.status(500).json({ error: 'An error occurred while creating equipment' });
        }
    };

    async UpdateEquipmentInfos(req: Request, res: Response) {
        try {
            const equipmentData = req.body;
            const images = req.files || [];

            if (!images) {
                return res.status(400).json({ message: 'No images uploaded' });
            }

            const result = await EquipmentDB.UpdateEquipmentInfos(equipmentData, images);

            if (result.status) {
                res.status(201).json({ message: 'Equipamento atualizado com sucesso!' });
            } else {
                res.status(400).json({ error: result.err || 'Erro ao atualizar equipamento.' });
            }
        } catch (error) {
            console.error('Erro ao atualizar equipamento:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    };
};

module.exports = new EquipmentController();