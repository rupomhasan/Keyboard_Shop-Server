/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendImageToCloudinary } from "../../../utils/sendImageToCloudinary";

export const uploadUserPhoto = async (name: string, file: any): Promise<string> => {
  const { secure_url } = await sendImageToCloudinary(name, file.path);
  return secure_url;
};