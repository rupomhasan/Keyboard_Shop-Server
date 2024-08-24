import { TUser } from "./user.interface"
import { User } from "./user.model"
const createCustomerIntoDB = async (data: TUser) => {
  const isUserExist = await User.findOne({ email: data.email });

  if (isUserExist) {
    if (isUserExist.isDeleted) {
      throw new Error("user is deleted");
    }

    throw new Error("user already exists");
  }
  data.isDeleted = false
  const result = await User.create(data);
  return result;
};

const createAdminIntoDB = async (data
  : Partial<TUser>) => {
  const isUserExist = await User.findOne({ email: data.email });
  let result;
  if (isUserExist) {
    if (isUserExist.role === "Admin") {
      throw new Error("this user is already admin")
    }
    result = await User.findOneAndUpdate({ email: isUserExist.email }, {
      role: "Admin"
    })
  }
  data.role = "Admin";
  data.isDeleted = false
  result = await User.create(data)
  return result;
};

const getUserByIdFromDB = async (_id: string) => {

  const result = await User.findById(_id);
  if (!result) {
    throw new Error("no user available with this account")
  }
  return result
}
const deleteUserByIdFromDB = async (_id: string) => {


  const isUserExist = await User.findById(_id);

  if (!isUserExist) {
    throw new Error("user is not found")
  }

  if (isUserExist.isDeleted) {
    throw new Error("this user is deleted")
  }


  const result = await User.findByIdAndUpdate(_id, { isDeleted: true });
  if (!result) {
    throw new Error("no user available with this account")
  }
  return result
}
export const UserService = {
  createCustomerIntoDB,
  createAdminIntoDB,
  getUserByIdFromDB,
  deleteUserByIdFromDB
} 