import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { TBrand } from "./brand.interface";
import { Brand } from "./brand.model";


const getAllBrand = async () => {


  const result = await Brand.find({})
  return result

}



const getSingleBrand = async (_id: string) => {


  const isBrandExist = await Brand.findById(_id)

  if (!isBrandExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand is not found")
  }

  const result = await Brand.findById(_id)
  return result

}





const createBrand = async (payload: TBrand) => {

  const isBrandExist = await Brand.findOne({ brandName: payload.brandName })

  if (isBrandExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "This brand name is already exist")
  }

  const result = await Brand.create(payload)
  return result


}




const deleteBrand = async (_id: string) => {


  const isBrandExist = await Brand.findById(_id)

  if (!isBrandExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand is not found")
  }

  const result = await Brand.findByIdAndDelete(_id, {
    new: true
  })
  return result

}


export const brandServices = {
  createBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrand
} 