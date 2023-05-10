const express = require("express");
const router = express.Router();
const applicationController = require("../controller/applicationController");
router.get("/test", applicationController.test);
router.post("/draft", applicationController.createDraftApplication);
router.post("/submit", applicationController.submitApplication);
router.get("/fetchDraft/:id", applicationController.fetchDraftApplication);
router.get(
  "/fetchSubmited/:id",
  applicationController.fetchSubmitedApplication
);
router.get(
  "/fetchApplication",
  applicationController.fetchForOprationalManager
);
router.put("/accept", applicationController.acceptApplication);
router.put("/reject", applicationController.rejectApplication);
module.exports = router;
