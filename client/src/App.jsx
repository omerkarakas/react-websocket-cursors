// import "./App.css";
import { useState } from "react";
import { Login } from "./components/Login";
import { Home } from "./Home";

function App() {
  const [username, setUsername] = useState("");

  if (username) return <Home username={username} />;

  return <Login onSubmit={setUsername} />;
}

export default App;
