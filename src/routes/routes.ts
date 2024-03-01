import ImageConstruction from '../controller/ImageConstruction';
import multer from "multer";

const express2 = require("express");
const ConstructionController = require('../controller/ConstructionController');
const router = express2.Router();

const uploadDirectory = '/home/joaovt/Documents/imagesConstruction/';
const upload = multer({ dest: uploadDirectory });

const imageConstruction = new ImageConstruction();

router.get('/images', imageConstruction.findImages);

router.post("/construction", upload.array('images', 5), ConstructionController.createConstruction);

router.get("/construction", ConstructionController.findAllConstruction);
router.get("/construction/:id", ConstructionController.findConstructionById);
router.get("/construction/name/:name", ConstructionController.findConstructionByName);

router.use("/images", express2.static("/home/joaovt/Documents/imagesConstruction/"));

router.patch('/contruction-update-info', ConstructionController.UpdateConstructionInfos);
router.patch('/construction-update-image/:id', upload.array('images', 5), ConstructionController.UpdateConstructionImages);

module.exports = router;