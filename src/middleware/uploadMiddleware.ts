import type { NextFunction, Request, Response } from "express";
import multer from "multer";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new Error("Only JPEG, PNG, and WebP images are allowed"));
      return;
    }

    callback(null, true);
  },
}).array("images", 5);

const multerErrorMessages: Partial<Record<multer.ErrorCode, string>> = {
  LIMIT_FILE_SIZE: "Each image must be 5MB or smaller",
  LIMIT_FILE_COUNT: "You can upload up to 5 images",
  LIMIT_UNEXPECTED_FILE: "You can upload up to 5 images",
};

export const uploadProductImages = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  upload(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error instanceof multer.MulterError
        ? (multerErrorMessages[error.code] ?? error.message)
        : error instanceof Error
          ? error.message
          : "Invalid image upload";

    res.status(400).json({
      success: false,
      message,
    });
  });
};
