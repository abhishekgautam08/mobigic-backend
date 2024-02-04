const { Router } = require("express");
const {
  fileUploadController,
  getAllFilesController,
  removeFileController,
  downloadFileController,
} = require("../../controllers/fileController");
const multer = require("multer");
const { authorizeUser } = require("../../middlewares/authorize");

const fileRouter = Router();
const upload = multer();

fileRouter
  .route("/")
  // Get All Files
  .get(authorizeUser, getAllFilesController)
  // Create movie
  .post(authorizeUser, upload.single("file"), fileUploadController);

fileRouter.route("/:id/remove").post( removeFileController);

fileRouter.route("/download").post(downloadFileController);

module.exports = fileRouter;
