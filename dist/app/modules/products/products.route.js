"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const products_controllers_1 = require("./products.controllers");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const products_validation_1 = require("./products.validation");
const auth_1 = require("../../middlewares/auth");
const user_constant_1 = require("../user/utils/user.constant");
const router = express_1.default.Router();
router.get("/", products_controllers_1.productsControllers.getAllProducts);
router.get("/:id", products_controllers_1.productsControllers.getSingleProduct);
router.post("/", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(products_validation_1.ProductsValidations.createProductValidation), products_controllers_1.productsControllers.crateNewProducts);
router.patch("/:id", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(products_validation_1.ProductsValidations.updateProductValidation), products_controllers_1.productsControllers.updateProducts);
router.delete("/:id", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), products_controllers_1.productsControllers.deleteProduct);
exports.ProductsRoutes = router;
