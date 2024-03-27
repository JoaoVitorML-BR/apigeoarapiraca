    // ImageConstruction.ts
    import { Request, Response } from 'express';
    import fs from 'fs';
    import path from 'path';

    const imagesDirectory = '/usr/imagesEquipment';

    class ImageEquipment {
        async findImages(req: Request, res: Response) {
            try {
                // Verifica se o diretório existe
                if (!fs.existsSync(imagesDirectory)) {
                    return res.status(404).json({ message: 'Diretório de imagens não encontrado' });
                }

                // Lista todos os arquivos no diretório de imagens
                const files = fs.readdirSync(imagesDirectory);

                // Constrói os nomes dos arquivos de imagem (com caminho completo)
                const imagePaths = files.map(file => path.join(imagesDirectory, file));

                // Define o tipo de conteúdo como imagem JPEG (ou outro tipo de imagem)
                res.setHeader('Content-Type', 'image/jpeg'); // Ou outro tipo de imagem

                // Retorna os nomes completos dos arquivos de imagem
                return res.status(200).json(imagePaths);
            } catch (error) {
                console.error('Erro ao buscar imagens:', error);
                return res.status(500).json({ error: 'Erro ao buscar imagens' });
            }
        };

        async findEquipmentImagesByName(req: Request, res: Response) {
            try {
                const { name } = req.params;
        
                if (!fs.existsSync(imagesDirectory)) {
                    return res.status(404).json({ message: 'Diretório de imagens não encontrado' });
                }
        
                const imagePath = path.join(imagesDirectory, name);
        
                res.setHeader('Content-Type', 'application/json'); 
        
                return res.status(200).json({ imagePath }); 
            } catch (error) {
                console.error('Erro ao buscar imagens:', error);
                return res.status(500).json({ error: 'Erro ao buscar imagens' });
            }
        };

    }

    export default ImageEquipment;
