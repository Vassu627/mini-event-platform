const Event = require("../models/Event");
const Rsvp = require("../models/Rsvp");

// JOIN EVENT
exports.joinEvent = async (req, res) => {
  const userId = req.user.userId;
  const eventId = req.params.eventId;

  try {
    // Check if already RSVPed
    const existing = await Rsvp.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).json({ message: "Already RSVPed" });
    }

    //  Atomically increment only if capacity allows
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ["$attendeesCount", "$capacity"] },
      },
      { $inc: { attendeesCount: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ message: "Event is full" });
    }

    //  Create RSVP
    await Rsvp.create({
      user: userId,
      event: eventId,
    });

    return res.status(201).json({ message: "RSVP successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// LEAVE EVENT
exports.leaveEvent = async (req, res) => {
  const userId = req.user.userId;
  const eventId = req.params.eventId;

  try {
    const deleted = await Rsvp.findOneAndDelete({
      user: userId,
      event: eventId,
    });

    if (!deleted) {
      return res.status(400).json({ message: "Not RSVPed" });
    }

    await Event.findByIdAndUpdate(eventId, {
      $inc: { attendeesCount: -1 },
    });

    return res.json({ message: "RSVP removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
