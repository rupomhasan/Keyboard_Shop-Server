/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { Brand } from "../brand/brand.model";
import { TProducts } from "./products.interface";
import { Products } from "./products.model"
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import slugify from "slugify";

const getAllProductsFromDB = async (payload: Record<string, unknown>) => {
  // getProducts by search fields
  let searchTerm = "";
  if (payload?.searchTerm) {
    searchTerm = payload.searchTerm as string;
  }
  const searchAbleFields = ["description", "slug", "size", "name",]

  const SearchProducts = Products.find({
    $or: searchAbleFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" }
    }))
  })


  // search by brand 

  let brandIds: string[] = [];
  let BrandIdFilters;

  if (payload?.brandIds) {
    brandIds = payload.brandIds as string[];
  }
  if (brandIds.length > 0) {
    // BrandIdFilters = SearchProducts.find({
    //   $or: brandIds.map((id) => ({
    //     brand: id
    //   }))
    // })

    BrandIdFilters = SearchProducts.find({
      brand: { $in: brandIds }
    })

  }
  else {
    BrandIdFilters = SearchProducts
  }



  // Price filtering
  let minPrice: number = 0;
  let maxPrice: number = 100000;
  if (payload?.min) {
    minPrice = payload.min as number
  }

  if (payload.max) {
    maxPrice = payload.max as number
  }

  const PriceFilter = BrandIdFilters.find({
    price: { $gte: minPrice, $lte: maxPrice }
  })


  // Pagination 

  let skip: number = 0;
  let limit: number = 10;
  let page: number = 1

  if (payload?.limit) {
    limit = Number(payload.limit)
  }

  if (payload?.page) {
    page = Number(payload?.page)
    skip = Number(page - 1) * limit
  }


  // Sorting 


  let sortBy: string = "_cratedAt";
  if ((payload?.sortBy)) {
    sortBy = payload.sortBy as string
  }



  // field filtering 

  let filed = "";


  if (payload?.field) {
    filed = (payload?.field as string).split(",").join(" ");
  }



  const payloadObj = { ...payload };
  const excludedFields = ["searchTerm", "page", "limit", "sortBy", "filed", "minPrice", "maxPrice"];



  excludedFields.forEach((e) => delete payloadObj[e])




  const result = await PriceFilter.find({ isDeleted: false }, payloadObj).populate("brand").skip(skip).limit(limit).sort(sortBy).select(filed);
  return result;


}


const getSingleProductFromDB = async (_id: string) => {
  const result = await Products.findOne({ _id, isDeleted: false })

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product is not found")
  }
  return result
}


const createNewProductIntoDB = async (file: any, payload: TProducts) => {

  const { name, price, brand } = payload;

  const isBrandNameValid = await Brand.findById({ _id: brand })

  if (!isBrandNameValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand is not exist")
  }

  const isProductExist = await Products.findOne({ name, price, brand })

  if (isProductExist) {

    const updatedProductQuantity = payload.productsQuantity + isProductExist.productsQuantity;

    const updatedAvailableQuantity = isProductExist.availableQuantity + payload.productsQuantity;


    const updatedProduct = await Products.findByIdAndUpdate(isProductExist._id, {
      productsQuantity: updatedProductQuantity,
      availableQuantity: updatedAvailableQuantity
    }, { new: true })

    return updatedProduct
  }
  if (file) {
    const { secure_url } = await sendImageToCloudinary(payload.name, file?.path);
    payload.image = secure_url
  }

  payload.slug = slugify(`${payload.name}-${isBrandNameValid.brandName}`, { lower: true })


  payload.availableQuantity = payload.productsQuantity
  const result = await Products.create(payload)

  return result
}


const updateProductFromDB = async (_id: string, file: any, payload: Partial<TProducts>) => {

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

  if (file) {
    const { secure_url } = await sendImageToCloudinary(payload?.name as string, file?.path);
    payload.image = secure_url
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