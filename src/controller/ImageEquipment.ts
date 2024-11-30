// ImageConstruction.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const imagesDirectory = '/usr/imagesEquipment';

class ImageEquipment {
    async findImages(req: Request, res: Response) {
        try {
            // Checks if the directory exists
            if (!fs.existsSync(imagesDirectory)) {
                return res.status(404).json({ message: 'Image directory not found' });
            }

            // List all files in the images directory
            const files = fs.readdirSync(imagesDirectory);

            // Builds image file names (with full path)
            const imagePaths = files.map(file => path.join(imagesDirectory, file));

            // Sets the content type to JPEG image (or other image type)
            res.setHeader('Content-Type', 'image/jpeg');

            // Returns the full names of image files
            return res.status(200).json(imagePaths);
        } catch (error) {
            console.error('Error when searching for images:', error);
            return res.status(500).json({ error: 'Error when searching for images' });
        }
    };

    async findEquipmentImagesByName(req: Request, res: Response) {
        try {
            const { name } = req.params;

            if (!fs.existsSync(imagesDirectory)) {
                return res.status(404).json({ message: 'Image directory not found' });
            }

            const imagePath = path.join(imagesDirectory, name);

            res.setHeader('Content-Type', 'application/json');

            return res.status(200).json({ imagePath });
        } catch (error) {
            console.error('Error when searching for images:', error);
            return res.status(500).json({ error: 'Error when searching for images' });
        }
    };

}

export default ImageEquipment;
