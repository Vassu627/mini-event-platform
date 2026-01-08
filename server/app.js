const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/test/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user.userId,
  });
});

const eventRoutes = require("./routes/eventRoutes");

app.use("/api/events", eventRoutes);
const rsvpRoutes = require("./routes/rsvpRoutes");
app.use("/api/rsvp", rsvpRoutes);

module.exports = app;
