const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    relationshipManagerName: {
      type: String,
      required: true,
    },
    relationshipManagerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pan: {
      type: String,
      required: true,
    },
    adharNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      default: [],
    },
    formStatus: {
      type: String,
      enum: ["draft", "submited", "accepted", "rejected"],
    },
    applicationRequest: {
      type: String,
      enum: ["draft", "pending", "accepted", "rejected"],
    },
    products: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const AccountApplication = mongoose.model("Application", applicationSchema);
module.exports = AccountApplication;
