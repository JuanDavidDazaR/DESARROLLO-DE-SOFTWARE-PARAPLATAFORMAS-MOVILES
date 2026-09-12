export default Login;
import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (email === "user@mail.com" && password === "123") {
      localStorage.setItem("logged", "true");
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-form">
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && (
        <p style={{ color: "red" }}>Usuario o contraseña incorrectos</p>
      )}
    </div>
  );
}
