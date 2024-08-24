import { User } from "../modules/user/user.model"

const admin = {
  name: "Rupom",
  email: "rupom.hasan607299@gmail.com",
  password: "admin123",
  role: "Admin",
  isDeleted: false
}


const seedAdmin = async () => {
  const isAdminExist = await User.findOne({ role: "Admin", email: admin.email });
  if (!isAdminExist) {
    await User.create(admin)
  }
}
export default seedAdmin