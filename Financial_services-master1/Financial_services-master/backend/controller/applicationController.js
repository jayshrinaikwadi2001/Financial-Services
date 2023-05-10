const AccountApplication = require("../model/AcountApplication");
const User = require("../model/User");
const test = (req, res) => {
  return res.send("Controller is working");
};

const createDraftApplication = async (req, res) => {
  console.log("body", req.body);
  try {
    const application = new AccountApplication({
      relationshipManagerName: req.body.relationshipManagerName,
      relationshipManagerId: req.body.relationshipManagerId,
      customerName: req.body.customerName,
      address: req.body.address,
      pan: req.body.pan,
      adharNumber: req.body.adharNumber,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      dob: req.body.dob,
      products: req.body.products,
      formStatus: "draft",
      applicationRequest: "draft",
    });

    const savedApplication = await application.save();
    const realationShipManger = await User.findById(
      req.body.relationshipManagerId
    );
    console.log("saved app " + savedApplication._id);
    await realationShipManger.updateOne({
      $push: { applications: savedApplication._id },
    });

    res.status(200).json({
      savedApplication,
      realationShipManger,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const submitApplication = async (req, res) => {
  console.log("body", req.body);
  try {
    const application = new AccountApplication({
      relationshipManagerName: req.body.relationshipManagerName,
      relationshipManagerId: req.body.relationshipManagerId,
      customerName: req.body.customerName,
      address: req.body.address,
      pan: req.body.pan,
      adharNumber: req.body.adharNumber,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      dob: req.body.dob,
      products: req.body.products,
      formStatus: "submited",
      applicationRequest: "pending",
    });

    const savedApplication = await application.save();
    const realationShipManger = await User.findById(
      req.body.relationshipManagerId
    );

    await realationShipManger.updateOne({
      $push: { applications: savedApplication._id },
    });

    res.status(200).json({
      savedApplication,
      realationShipManger,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchDraftApplication = async (req, res) => {
  // console.log("atleast here I came");
  try {
    const relationshipMangerId = req.params.id;
    const relationshipManger = await User.findById(relationshipMangerId);
    if (!relationshipManger) {
      return res.status(404).json("Relation Manager Not Found");
    }

    const allApplications = await Promise.all(
      relationshipManger.applications.map((application) => {
        return AccountApplication.findById(application);
      })
    );

    console.log("fetchApplication " + allApplications);

    const draftedApplications = allApplications.filter((application) => {
      return application.formStatus === "draft";
    });

    return res.status(200).json(draftedApplications);
  } catch (error) {
    console.error("error in fetching draft application");
    return res.status(500).json("error in fetching draft application");
  }
};

const fetchSubmitedApplication = async (req, res) => {
  try {
    const relationshipMangerId = req.params.id;
    const relationshipManger = await User.findById(relationshipMangerId);
    if (!relationshipManger) {
      return res.status(404).json("Relation Manager Not Found");
    }

    const allApplications = await Promise.all(
      relationshipManger.applications.map((application) => {
        return AccountApplication.findById(application);
      })
    );

    const draftedApplications = allApplications.filter((application) => {
      return application.formStatus === "submited";
    });

    return res.status(200).json(draftedApplications);
  } catch (error) {
    console.error("error in fetching submited Application");
    return res.status(500).json("error in fetching submited application");
  }
};

const acceptApplication = async (req, res) => {
  try {
    let relationshipMangerId = req.body.relationshipMangerId;
    let applicationId = req.body.applicationId;

    const relationshipManager = await User.findById(relationshipMangerId);

    if (!relationshipManager) {
      return res.status(404).json("Data is not sufficient");
    }

    const updatedApplication = await AccountApplication.findByIdAndUpdate(
      applicationId,
      { formStatus: "submited", applicationRequest: "accepted" },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json("application not found");
    }
    return res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error in accepting request");
    return res.status(500).json("Error in accepting request");
  }
};

const rejectApplication = async (req, res) => {
  try {
    let relationshipMangerId = req.body.relationshipMangerId;
    let applicationId = req.body.applicationId;

    const relationshipManager = await User.findById(relationshipMangerId);

    if (!relationshipManager) {
      return res.status(404).json("Data is not sufficient");
    }

    const updatedApplication = await AccountApplication.findByIdAndUpdate(
      applicationId,
      { formStatus: "submited", applicationRequest: "rejected" },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json("application not found");
    }
    return res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error in accepting request");
    return res.status(500).json("Error in accepting request");
  }
};

const fetchForOprationalManager = async (req, res) => {
  try {
    const allApplication = await AccountApplication.find({
      applicationRequest: "pending",
    });
    return res.status(200).json(allApplication);
  } catch (err) {
    console.error("error in fetchin data");
    return res
      .status(500)
      .json("Error in fetching data for operational manager");
  }
};

module.exports = {
  test,
  createDraftApplication,
  submitApplication,
  fetchDraftApplication,
  fetchSubmitedApplication,
  acceptApplication,
  rejectApplication,
  fetchForOprationalManager,
};
