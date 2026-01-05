const express = require("express");
const multer = require("multer");
const proposalController = require("../controllers/proposalController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/train", upload.single("file"), proposalController.trainModel);
router.get("/history", proposalController.getHistory);
router.delete("/history/:id", proposalController.deleteHistory);
router.post("/generate-proposal", proposalController.generateProposal);

module.exports = router;
