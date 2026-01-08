import { useEffect, useState } from "react";
import API from "../api";

function Events() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const joinEvent = async (id) => {
    try {
      await API.post(`/rsvp/${id}/join`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const leaveEvent = async (id) => {
    try {
      await API.delete(`/rsvp/${id}/leave`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Upcoming Events</h2>

      {events.map((event) => (
        <div className="event-card" key={event._id}>
          {event.image && (
            <img src={`http://localhost:5000/${event.image}`} alt="event" />
          )}

          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>
            <strong>Date:</strong> {new Date(event.date).toDateString()}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          <p>
            <strong>Capacity:</strong> {event.attendeesCount}/{event.capacity}
          </p>

          {/* RSVP SECTION */}
          {event.isRSVPed ? (
            <button onClick={() => leaveEvent(event._id)}>Leave Event</button>
          ) : event.attendeesCount < event.capacity ? (
            <button onClick={() => joinEvent(event._id)}>Join Event</button>
          ) : (
            <p>Event Full</p>
          )}

          {/* CREATOR CONTROLS */}
          {event.isCreator && (
            <div style={{ marginTop: "10px" }}>
              <button>Edit</button>
              <button onClick={() => deleteEvent(event._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Events;
