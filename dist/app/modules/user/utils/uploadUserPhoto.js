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
exports.uploadUserPhoto = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const sendImageToCloudinary_1 = require("../../../utils/sendImageToCloudinary");
const uploadUserPhoto = (name, file) => __awaiter(void 0, void 0, void 0, function* () {
    const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(name, file.path);
    return secure_url;
});
exports.uploadUserPhoto = uploadUserPhoto;
