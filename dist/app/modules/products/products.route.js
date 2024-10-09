"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const products_controllers_1 = require("./products.controllers");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = require("../../middlewares/auth");
const user_constant_1 = require("../user/utils/user.constant");
const products_validation_1 = require("./products.validation");
const router = express_1.default.Router();
router.get("/", products_controllers_1.productsControllers.getAllProducts);
router.get("/:id", products_controllers_1.productsControllers.getSingleProduct);
router.post("/", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), (0, validateRequest_1.default)(products_validation_1.createProductValidation), products_controllers_1.productsControllers.crateNewProducts);
router.patch("/:id", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), (0, validateRequest_1.default)(products_validation_1.updateProductValidation), products_controllers_1.productsControllers.updateProducts);
router.delete("/:id", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), products_controllers_1.productsControllers.deleteProduct);
exports.ProductsRoutes = router;
