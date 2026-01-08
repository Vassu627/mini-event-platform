const Event = require("../models/Event");
const Rsvp = require("../models/Rsvp");

exports.createEvent = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    console.log("REQ USER:", req.user);

    const { title, description, date, location, capacity } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      capacity: Number(capacity),
      image: req.file ? req.file.path : null,
      createdBy: req.user.userId,
    });

    console.log("EVENT SAVED:", event);

    return res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().lean();
    const userId = req.user?.userId;

    let rsvpEventIds = [];

    if (userId) {
      const userRsvps = await Rsvp.find({ user: userId });
      rsvpEventIds = userRsvps.map((r) => r.event.toString());
    }

    const formattedEvents = events.map((event) => ({
      ...event,
      isRSVPed: userId ? rsvpEventIds.includes(event._id.toString()) : false,
      isCreator:
        userId && event.createdBy
          ? event.createdBy.toString() === userId
          : false,
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
