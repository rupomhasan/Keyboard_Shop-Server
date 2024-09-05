"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controllers_1 = require("./user.controllers");
const user_validation_1 = require("./user.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const auth_1 = require("../../middlewares/auth");
const user_constant_1 = require("./utils/user.constant");
const router = express_1.default.Router();
router.get("/myProfile", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin, user_constant_1.USER_ROLE.Customer), user_controllers_1.UserControllers.myProfile);
router.get("/:id", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), user_controllers_1.UserControllers.getSingleUser);
router.post("/signup", sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidationSchema.CreateUserValidationSchema), user_controllers_1.UserControllers.createCustomer);
router.patch("/createAdmin", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidationSchema.CreateAdminSchema), user_controllers_1.UserControllers.createAdmin);
router.delete("/:id", (0, auth_1.auth)(user_constant_1.USER_ROLE.Admin), user_controllers_1.UserControllers.deleteSingleUser);
exports.UserRoutes = router;
