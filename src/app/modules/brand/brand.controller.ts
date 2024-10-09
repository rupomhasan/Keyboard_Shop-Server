import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { brandServices } from "./brand.service";







const AllBrands = catchAsync(async (req, res) => {

  const result = await brandServices.getAllBrand();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "Brand is retrieved successfully",
    data: result
  })
})

const getSingleBrand = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await brandServices.getSingleBrand(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "Brand is created successfully",
    data: result
  })
})
const createBrand = catchAsync(async (req, res) => {


  const result = await brandServices.createBrand(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "Brand is created successfully",
    data: result
  })
})


const deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await brandServices.deleteBrand(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "Brand is created successfully",
    data: result
  })
})
export const brandControllers = {
  createBrand,
  deleteBrand,
  AllBrands,
  getSingleBrand
}