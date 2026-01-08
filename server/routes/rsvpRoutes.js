const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { joinEvent, leaveEvent } = require("../controllers/rsvpController");

router.post("/:eventId/join", authMiddleware, joinEvent);
router.delete("/:eventId/leave", authMiddleware, leaveEvent);

module.exports = router;
