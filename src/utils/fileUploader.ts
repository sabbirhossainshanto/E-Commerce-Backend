import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { IFile } from "../app/interfaces/file";

// Configuration
cloudinary.config({
  cloud_name: "daar91zv4",
  api_key: "573799455418682",
  api_secret: "gzo1SMIvFxeau3-bPvE-RQDxVQQ",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: IFile): Promise<UploadApiResponse> => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.originalname,
    })
    .catch((error) => {
      fs.unlinkSync(file.path);
      return error;
    });
  fs.unlinkSync(file.path);
  return uploadResult;
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
