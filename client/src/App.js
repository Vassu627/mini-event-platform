import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";

function App() {
  const [page, setPage] = useState("events");
  console.log("ENV CHECK:", process.env.REACT_APP_API_URL);

  return (
    <div className="container">
      <h1>Mini Event Platform</h1>

      <nav>
        <button onClick={() => setPage("events")}>Events</button>
        <button onClick={() => setPage("create")}>Create</button>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
      </nav>

      {page === "events" && <Events />}
      {page === "create" && <CreateEvent />}
      {page === "login" && <Login />}
      {page === "register" && <Register />}
    </div>
  );
}

export default App;
