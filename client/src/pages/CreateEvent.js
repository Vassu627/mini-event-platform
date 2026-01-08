import { useState } from "react";
import API from "../api";

function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  });

  const [image, setImage] = useState(null);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    formData.append("capacity", form.capacity);

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event created");
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <br />
      <input
        name="description"
        placeholder="Add Descripition"
        onChange={handleChange}
      />
      <br />
      <input
        type="date"
        name="date"
        value={form.date}
        placeholder="date"
        onChange={handleChange}
      />
      <br />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <br />
      <input
        type="number"
        name="capacity"
        value={form.capacity}
        onChange={handleChange}
        min="1"
      />

      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <br />
      <button type="submit">Create Event</button>
    </form>
  );
}

export default CreateEvent;
