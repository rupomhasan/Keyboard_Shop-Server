"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalPrice = void 0;
const totalPrice = (items, products) => {
    const total = items.reduce((sum, item) => {
        const product = products.find(product => product._id.toString() === item.productId.toString());
        if (product) {
            return sum + (product.price * item.quantity);
        }
        return sum;
    }, 0);
    return Math.floor(total);
};
exports.totalPrice = totalPrice;
