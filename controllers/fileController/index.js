const { File, fileStatus } = require("../../database/mongoDb/models/File");
const { s3Upload, getSignedUrl } = require("../../libs/Aws/s3");
const { v4: uuidv4 } = require("uuid");
const { generateSixDigitCode } = require("./helper");

const fileUploadController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const file = req.file;
    const uuid = uuidv4();
    const dynamicKey = `${uuid}-${file.originalname}`;

    const s3respone = await s3Upload(dynamicKey, file);

    let generatedCode = generateSixDigitCode();

    const fileDetails = {
      fileName: file.originalname,
      fileS3Url: s3respone,
      status: fileStatus.show,
      otp: generatedCode,
      dynamicKey:uuid,
      createdBy: loggedInUser.id,
    };

    const fileDetailsSave = new File(fileDetails);
    await fileDetailsSave.save();
    res.status(200).json({
      message: "Appointment created successfully",
      otp: generatedCode,
    });
  } catch (error) {
    console.error("Error uploading file :", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the file" });
  }
};

const getAllFilesController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const totalRecords = await File.find({
      createdBy: loggedInUser.id,
      status: fileStatus.show,
    })
      .select("fileName _id createdAt   ")
      .lean()
      .exec();
    if (!totalRecords.length) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json({
      totalRecords,
    });
  } catch (err) {
    console.error({ err });
    res.status(500).json(err);
  }
};

const removeFileController = async (req, res) => {
  try {
    const { id } = req.params;
   
    const result = await File.findOneAndUpdate(
      { _id: id },
      {
        status: fileStatus.hide,
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!result) {
      throw new Error("No records found");
    }

    res.status(200).json({ message: "File Remove  succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error File Remove:", error);
  }
};

const downloadFileController =  async (req,res)=>{
  try {
    const fileDetail = req.body;
    const id = fileDetail.downloadFileData._id;
    const otp = fileDetail.code;

     if (!/^\d{6}$/.test(otp)) {
       return res.status(400).send("OTP must be 6 digits");
     }
    const fileRecord = await File.find({
      _id: id,
      otp: otp,
    })
      .select(" fileS3Url ")
      .lean()
      .exec();
const url = fileRecord[0].fileS3Url;


    if (!fileRecord) {
      throw new Error("No records found");
    }

    res.status(200).json({  url  });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error File Remove:", error);
  }
}
module.exports = {
  fileUploadController,
  getAllFilesController,
  removeFileController,
  downloadFileController,
};

