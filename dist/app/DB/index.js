"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../modules/user/user.model");
const admin = {
    name: "Rupom",
    email: "rupom.hasan607299@gmail.com",
    password: "admin123",
    role: "Admin",
    isDeleted: false
};
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isAdminExist = yield user_model_1.User.findOne({ role: "Admin", email: admin.email });
    if (!isAdminExist) {
        yield user_model_1.User.create(admin);
    }
});
exports.default = seedAdmin;
