import { TProducts } from "../../products/products.interface";
import { TItems } from "../utils.types";

export const totalPrice = (items: TItems[], products: TProducts[]) => {
  const total = items.reduce((sum, item) => {
    const product = products.find(product => product._id.toString() === item.productId.toString());
    if (product) {
      return sum + (product.price * item.quantity);
    }
    return sum;
  }, 0);

  return Math.floor(total);
};
