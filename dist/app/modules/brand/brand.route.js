"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const brand_validation_1 = require("./brand.validation");
const brand_controller_1 = require("./brand.controller");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const auth_1 = require("../../middlewares/auth");
const user_constant_1 = require("../user/utils/user.constant");
const router = (0, express_1.Router)();
router.get("/", brand_controller_1.brandControllers.AllBrands);
router.get("/:id", brand_controller_1.brandControllers.getSingleBrand);
router.post("/", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(brand_validation_1.brandValidation.createBrandSchema), brand_controller_1.brandControllers.createBrand);
router.delete("/:id", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), brand_controller_1.brandControllers.deleteBrand);
exports.brandRoutes = router;
