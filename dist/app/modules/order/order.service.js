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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const products_model_1 = require("../products/products.model");
const totalPrice_1 = require("./utils/totalPrice");
const order_model_1 = require("./order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const sendMail_1 = require("../../utils/sendMail");
const mongodb_1 = require("mongodb");
const getAllOrderFormDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({});
    return result;
});
const getMyOrderFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const myOrder = yield order_model_1.Order.find({ email: user.email, isDeleted: false });
    return myOrder;
});
const createNewOrderIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email: user.email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User is not found ");
    }
    // Fetch the existing products from the database
    const isProductExist = yield products_model_1.Products.find({
        _id: { $in: items.map(item => item.productId) }
    });
    // Validate each item against the available products
    for (let i = 0; i < items.length; i++) {
        let productFound = false;
        for (let r = 0; r < isProductExist.length; r++) {
            const isExist = items[i].productId.toString() === isProductExist[r]._id.toString();
            if (isExist) {
                productFound = true;
                const product = isProductExist[r]; // Reference to the found product
                // Ensure the product has availableQuantity
                if (product.availableQuantity === undefined) {
                    throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `Available quantity is missing for product '${product.name}'.`);
                }
                // Check if the product is out of stock
                if (product.availableQuantity === 0) {
                    throw new AppError_1.AppError(http_status_1.default.CONFLICT, `The product '${product.name}' is currently out of stock.`);
                }
                // Check if the requested quantity exceeds available stock
                if (product.availableQuantity < items[i].quantity) {
                    throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Insufficient quantity for '${product.name}'. Available: ${product.availableQuantity}, Requested: ${items[i].quantity}.`);
                }
                // Calculate the price and total for the item
                items[i].price = product.price;
                items[i].total = Math.round(product.price * items[i].quantity);
                break; // Exit inner loop when the product is found and processed
            }
        }
        // If the product was not found in isProductExist
        if (!productFound) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `Product with ID ${items[i].productId} not found.`);
        }
    }
    const total = (0, totalPrice_1.totalPrice)(items, isProductExist);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Update the product quantities in the database
        for (const item of items) {
            yield products_model_1.Products.findOneAndUpdate({ _id: item.productId }, { $inc: { availableQuantity: -item.quantity } }, { new: true, session });
        }
        const tran_id = new mongodb_1.ObjectId().toString();
        payload.subTotal = total;
        payload.deliveryCharge = 120;
        payload.totalPrice = total + 120;
        // payload.orderStatus = "pending";
        payload.email = user.email;
        payload.tranId = tran_id;
        const order = yield order_model_1.Order.create([payload], { session });
        yield user_model_1.User.findOneAndUpdate({ email: user.email }, {
            $push: { order: order[0]._id }
        }, {
            session
        });
        (0, sendMail_1.sendMail)(isUserExist, order[0]);
        yield session.commitTransaction();
        yield session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
});
const canceledMyOrderFormDB = (user, _id) => __awaiter(void 0, void 0, void 0, function* () {
    const myOrder = yield order_model_1.Order.findById(_id);
    if ((myOrder === null || myOrder === void 0 ? void 0 : myOrder.email) !== user.email) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Your not authorized to cancel this order");
    }
    if ((myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderStatus) !== "pending") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Your cann't change this order status ${myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderStatus} to canceled`);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(_id, { orderStatus: "canceled" });
    return result;
});
const updateOrderStatusFormDB = (_id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const myOrder = yield order_model_1.Order.findById(_id);
    if (!myOrder) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order id does not exist");
    }
    if (myOrder.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order is deleted");
    }
    if (myOrder.orderStatus === "canceled") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "You cannot change the status of a canceled order");
    }
    if (myOrder.orderStatus === status) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `this order is already ${status}`);
    }
    if (myOrder.orderStatus === "delivered" && (status === "shipped" || status === "pending" || status === "canceled")) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `You cannot change directly from ${myOrder.orderStatus} to ${status}`);
    }
    if (myOrder.orderStatus === "shipped" && status === "pending") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `You cannot change directly from ${myOrder.orderStatus} to ${status}`);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(_id, { orderStatus: status }, { new: true });
    const user = yield user_model_1.User.findOne({ email: myOrder.email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User not found");
    }
    if ((result === null || result === void 0 ? void 0 : result.orderStatus) === status) {
        try {
            (0, sendMail_1.sendMail)(user, result);
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    return result;
});
const deleteOrderByIdFormDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(_id);
    if (!order) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order id is not exist");
    }
    if (order.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This order is deleted");
    }
    if (order.orderStatus !== "canceled") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `You can not delete  ${order.orderStatus} status  `);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(_id, {
        isDeleted: true
    }, { new: true });
    return result === null || result === void 0 ? void 0 : result.isDeleted;
});
const getOrderbyIdFormDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findOne({ _id: id, isDeleted: false });
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "this product is not available");
    }
    return result;
});
exports.orderService = {
    getOrderbyIdFormDB,
    getAllOrderFormDB,
    getMyOrderFromDB,
    createNewOrderIntoDB,
    canceledMyOrderFormDB,
    updateOrderStatusFormDB,
    deleteOrderByIdFormDB
};
