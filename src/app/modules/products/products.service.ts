/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { Brand } from "../brand/brand.model";
import { TProducts } from "./products.interface";
import { Products } from "./products.model"
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import slugify from "slugify";
import { TBrand } from "../brand/brand.interface";

const getAllProductsFromDB = async (payload: Record<string, unknown>) => {

  let searchTerm = "";
  if (payload?.searchTerm) {
    searchTerm = payload.searchTerm as string;
  }

  const searchAbleFields = ["name", "description", "tags", "type", "category", "connectivity", "features.size", "features.Switch", "features.SwitchColor", "status"];

  const SearchProducts = Products.find({
    $or: searchAbleFields.map((field) => ({
      [field]: { $regex: searchTerm.split(",").join("|"), $options: "i" }
    }
    ))
  });


  let brandIds: string[] = [];
  if (payload?.brandIds) {

    const brandIdsString = payload.brandIds as string;
    brandIds = brandIdsString.includes(",")
      ? brandIdsString.split(",")
      : [brandIdsString];
  }




  let minPrice: number = 0;
  let maxPrice: number = 100000;
  if (payload?.min) {
    minPrice = payload.min as number;
  }
  if (payload?.max) {
    maxPrice = payload.max as number;
  }

  const PriceFilter = SearchProducts.find({
    price: { $gte: minPrice, $lte: maxPrice }
  });
  // Pagination
  let skip: number = 0;
  let limit: number = 10;
  let page: number = 1;

  if (payload?.limit) {
    limit = Number(payload.limit);
  }
  if (payload?.page) {
    page = Number(payload?.page);
    skip = Number(page - 1) * limit;
  }

  // Sorting
  let sortBy: number = 1; // 


  if (payload?.sortBy) {
    sortBy = Number(payload.sortBy) as number
  }

  // field filtering
  let field = "";

  if (payload?.field) {
    field = (payload?.field as string).split(",").join(" ");
  }

  const payloadObj = { ...payload };
  const excludedFields = ["searchTerm", "page", "limit", "sortBy", "field", "min", "max"];

  excludedFields.forEach((e) => delete payloadObj[e]);

  const result = await PriceFilter.find({ isDeleted: false }, payloadObj)
    .populate("brand")
    .skip(skip)
    .limit(limit)
    .sort({ price: sortBy as 1 | -1 })
    .select(field);


  if (brandIds.length > 0) {
    const matchedProducts = result.filter(product => {
      const brand = product?.brand;

      // Check if `brand` is an object and has an `_id` property (assuming TBrand has _id)
      if (brand && typeof brand === "object" && "_id" in brand) {
        return brandIds.some(id => (brand as TBrand)._id.toString() === id);
      }

      // If brand is an ObjectId (assuming it could be), compare it directly
      if (typeof brand === "string" || brand instanceof Object) {
        return brandIds.some(id => brand.toString() === id);
      }

      return false;
    });

    return matchedProducts;
  }



  return result;
};


const getSingleProductFromDB = async (_id: string) => {
  const result = await Products.findOne({ _id, isDeleted: false }).populate("brand")

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product is not found")
  }
  return result
}


const createNewProductIntoDB = async (file: any, payload: TProducts) => {
  const { name, price, brand, discount } = payload;

  const isBrandNameValid = await Brand.findById({ _id: brand });
  if (!isBrandNameValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand does not exist");
  }

  const isProductExist = await Products.findOne({ name, price, brand });

  if (discount && discount > 0) {
    const discountAmount = (price * discount) / 100;
    payload.specialPrice = Math.ceil(price - discountAmount);
  }

  if (isProductExist) {
    const updatedProductQuantity = payload.productsQuantity + isProductExist.productsQuantity;
    const updatedAvailableQuantity = (isProductExist.availableQuantity as number) + payload.productsQuantity;

    const updatedProduct = await Products.findByIdAndUpdate(isProductExist._id, {
      productsQuantity: updatedProductQuantity,
      availableQuantity: updatedAvailableQuantity,

    }, { new: true });

    return updatedProduct;
  }

  if (file) {
    const { secure_url } = await sendImageToCloudinary(payload.name, file?.path);
    payload.image = secure_url;
  }

  payload.slug = slugify(`${payload.name}-${isBrandNameValid.brandName}`, { lower: true });

  payload.availableQuantity = payload.productsQuantity;

  const result = await Products.create(payload);

  return result;
};

const updateProductFromDB = async (_id: string, payload: Partial<TProducts>) => {

  const isProductExist = await Products.findById(_id)

  if (payload.brand) {
    const isBrandNameValid = await Brand.findById(payload.brand)


    if (!isBrandNameValid) {
      throw new AppError(httpStatus.NOT_FOUND, `This ${payload.brand} not available in DB`)
    }
  }

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, `this ${_id} is not found`)
  }



  const result = await Products.findByIdAndUpdate(_id, {
    $set: payload
  }, { new: true })

  return result
}


const deleteProductFromDB = async (_id: string) => {

  const isProductExist = await Products.findById(_id)

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, `${_id} is not found`)
  }
  if (isProductExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "this  product is already deleted")
  }
  const result = await Products.findByIdAndUpdate(_id, {
    isDeleted: true
  }, { new: true });
  return result;
}


export const productsServices = {
  getAllProductsFromDB,
  getSingleProductFromDB,
  createNewProductIntoDB,
  updateProductFromDB,
  deleteProductFromDB
}