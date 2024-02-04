const mongoose = require("mongoose");
const { User } = require("./User");


const Schema = mongoose.Schema;

const fileStatus = {
  show: "show",
  hide: "hide",
 
};

const fileSchema = new Schema(
  {
    fileName: {
      type: String,
    },
    fileS3Url: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(fileStatus),
      default: fileStatus.show,
    },
    otp: {
      type: Number,
    },
    dynamicKey: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.String,
      ref: User,
      refPath: "_id",
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = {
  File,
  fileStatus,
};
