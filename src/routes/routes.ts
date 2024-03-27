import ImageEquipment from '../controller/ImageEquipment';
import multer from "multer";

const express2 = require("express");
const EquipmentController = require('../controller/EquipmentController');
const router = express2.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/usr/imagesEquipment');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

const imageEquipment = new ImageEquipment();

// Images router
router.use("/equipment/images", express2.static("/usr/imagesEquipment"));
router.use("/equipment/images/name/", express2.static("/usr/imagesEquipment"));

router.get('/equipment/images', imageEquipment.findImages);
router.get('/equipment/images/name/:name', imageEquipment.findEquipmentImagesByName);

router.post("/equipment", upload.array('images', 5), EquipmentController.createEquipment);

// Equipment routers
router.get("/equipment", EquipmentController.findAllEquipment);
router.get("/equipment/:id", EquipmentController.findEquipmentById);
router.get("/equipment/name/:name", EquipmentController.findEquipmentByName);
router.get("/equipment/filter/:subcategory", EquipmentController.findEquipmentByFilter);

router.put('/equipment-update-info/:id', upload.array('images', 5), EquipmentController.UpdateEquipmentInfos);

module.exports = router;