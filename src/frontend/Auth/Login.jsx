import React, { useState, useContext } from "react"; // Uvoz useContext kuke
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from "../../App";
import "../Stranice/dizajn.css";

export const Login = (props) => {
  const { handleLogin } = useContext(UserContext); // Dobivanje handleLogin funkcije iz konteksta
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [loginStatus, setLoginStatus] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = (e) => {
    e.preventDefault();
    axios.post("https://futsal-arena.vercel.app:3001/prijava", {
      username: username,
      password: pass,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        const idKorisnika = response.data[0].ID_korisnika; // Dobivanje ID-a korisnika iz odgovora
        handleLogin(idKorisnika); // Poziv handleLogin funkcije iz konteksta
        navigate('/rezervacijaTermina');
      }
    })
  }

  const handleRegistracija = () => {
    navigate('/registracija'); // Navigacija na "/registracija" rutu
  }

  return (
    <div className="auth-form-container">
      <h2>Prijava</h2>
      <form className="login-form" onSubmit={login}>
        <label htmlFor="username">Unesite korisničko ime</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Praćenje promjena unosa korisničkog imena
          type="username"
          id="username"
          name="username" />

        <label htmlFor="password">Unesite lozinku</label>
        <div className="password-container">
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)} // Praćenje promjena unosa lozinke
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
          />
          <div
            className={`eye-icon ${showPassword ? "visible" : ""}`}
            onClick={togglePasswordVisibility} // Omogućavanje klikanja na ikonu za prikazivanje/skrivanje lozinke
          >
            <FontAwesomeIcon icon={faEye} />
          </div>
        </div>

        <button className="gumb" type="submit" onClick={login}>Prijavi se</button>
        <h1 style={{ color: 'red', fontSize: '15px', textAlign: 'center', marginTop: '20px' }}>{loginStatus}</h1>
      </form>
      <button className="link-btn" onClick={handleRegistracija}>Ukoliko nemate račun, registrirajte se.</button>
    </div>
  )
}