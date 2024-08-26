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
const router = express_1.default.Router();
router.get("/:id", user_controllers_1.UserControllers.getSingleUser);
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.UserValidationSchema.CreateUserValidationSchema), user_controllers_1.UserControllers.createCustomer);
router.patch("/createAdmin", (0, validateRequest_1.default)(user_validation_1.UserValidationSchema.CreateAdminSchema), user_controllers_1.UserControllers.createAdmin);
router.delete("/:id", user_controllers_1.UserControllers.deleteSingleUser);
exports.UserRoutes = router;
