import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productsServices } from "./products.service";


const getAllProducts = catchAsync(async (req, res) => {
  const result = await productsServices.getAllProductsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All products retrieved successfully",
    data: result
  })
})

const getSingleProduct = catchAsync(async (req, res) => {

  const result = await productsServices.getSingleProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result?.name} is retrieved successfully`,
    data: result
  })
})

const crateNewProducts = catchAsync(async (req, res) => {
  const result = await productsServices.createNewProductIntoDB(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Created successfully",
    data: result
  })
})

const updateProducts = catchAsync(async (req, res) => {
  const result = await productsServices.updateProductFromDB(req.params.id, req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result
  })
})

const deleteProduct = catchAsync(async (req, res) => {

  const result = await productsServices.deleteProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result?.name} is deleted successfully`,
    data: "This product is deleted"
  })
})

export const productsControllers = {
  crateNewProducts,
  updateProducts,
  deleteProduct,
  getAllProducts,
  getSingleProduct
} 