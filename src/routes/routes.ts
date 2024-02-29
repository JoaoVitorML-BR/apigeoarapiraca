const express2 = require("express");
const ConstructionController = require('../controller/ConstructionController');
import ImageConstruction from '../controller/ImageConstruction';
const router = express2.Router();

import multer from "multer";

const uploadDirectory = '/home/joaovt/Documents/imagesConstruction/';
const upload = multer({ dest: uploadDirectory });


const imageConstruction = new ImageConstruction();

router.get('/images', imageConstruction.findImages);

router.post("/construction", upload.array('images', 5), ConstructionController.createConstruction);

router.get("/construction", ConstructionController.findAllConstruction);
router.get("/construction/:id", ConstructionController.findConstructionById);
router.get("/construction/name/:name", ConstructionController.findConstructionByName);

router.use("/images", express2.static("/home/joaovt/Documents/imagesConstruction/"));

module.exports = router;
