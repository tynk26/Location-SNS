import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/health")
      .then((res) => {
        console.log("[FRONTEND] API Response:", res.data);
        setMessage(res.data.status);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Location SNS MVP</h1>
      <p>Backend Status: {message}</p>
    </div>
  );
}

export default App;
