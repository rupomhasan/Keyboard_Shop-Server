import { v2 } from "cloudinary";
import config from "../config";
import fs from "fs"
import multer from "multer";

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  v2.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
  });

  // Upload an image
  const uploadResult = await v2.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      throw new Error(error.message);
    });

  fs.unlink(path, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return;
    }

    console.log(`File ${imageName} has been successfully removed.`);
  });
  return uploadResult;
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/src/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});


export const upload = multer({ storage: storage });

