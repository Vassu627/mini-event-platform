# Mini Event Platform (MERN Stack)

A full-stack web application that allows users to create, view, and RSVP to events.  
Built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

---

## Features

### User Authentication

- User registration and login
- JWT-based authentication
- Protected routes

### Event Management

- Create events with:
  - Title
  - Description
  - Date & Time
  - Location
  - Capacity
  - Image upload
- View all upcoming events
- Edit and delete events (only by creator)

### RSVP System (Critical Business Logic)

- Users can **join** and **leave** events
- **Capacity enforcement** (no overbooking)
- **Concurrency-safe RSVP handling** using atomic database updates
- **No duplicate RSVPs** (one RSVP per user per event)

### UI/UX

- Responsive React UI
- Event cards with images
- Conditional buttons (Join / Leave / Edit / Delete)

---

## RSVP Capacity & Concurrency Handling (Technical Explanation)

To prevent overbooking when multiple users try to RSVP simultaneously:

- The backend uses MongoDB’s **atomic `findOneAndUpdate`** operation with `$expr`
- RSVP is only allowed if:
- The update increments `attendeesCount` in a **single atomic query**
- A **unique compound index** on `(user, event)` prevents duplicate RSVPs

This ensures:

- No race conditions
- No overbooking
- Data integrity even under concurrent requests

---

## Tech Stack

- **Frontend:** React.js, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas / Local)
- **Authentication:** JWT
- **File Upload:** Multer

---

## Running Locally

### Backend Setup

```bash
cd server
npm install
```
