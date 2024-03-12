import ImageConstruction from '../controller/ImageConstruction';
import multer from "multer";

const express2 = require("express");
const ConstructionController = require('../controller/ConstructionController');
const router = express2.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/usr/imagesConstruction');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

const imageConstruction = new ImageConstruction();

router.use("/construction/images", express2.static("/usr/imagesConstruction"));
router.use("/construction/images/name/", express2.static("/usr/imagesConstruction"));

router.get('/construction/images', imageConstruction.findImages);
router.get('/construction/images/name/:name', imageConstruction.findConstructionImagesByName);

router.post("/construction", upload.array('images', 5), ConstructionController.createConstruction);

router.get("/construction", ConstructionController.findAllConstruction);
router.get("/construction/:id", ConstructionController.findConstructionById);
router.get("/construction/name/:name", ConstructionController.findConstructionByName);

router.put('/construction-update-info/:id', upload.array('images', 5), ConstructionController.UpdateConstructionInfos);

module.exports = router;