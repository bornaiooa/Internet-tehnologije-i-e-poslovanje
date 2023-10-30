import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Pocetna } from "./frontend/Stranice/PocetnaStranica";
import { Login } from "./frontend/Auth/Login";
import { Registracija } from "./frontend/Auth/Registracija";
import { Rezervacija_termina } from "./frontend/Stranice/Rezervacija_termina";
import { Prikaz_rezervacija } from "./frontend/Stranice/Prikaz_rezervacija";
import { Informacije_o_racunu } from "./frontend/Stranice/Informacije_o_racunu";
import './frontend/Stranice/dizajn.css';

export const UserContext = React.createContext(); // Kreiranje konteksta

function App() {
  const [idKorisnika, setIdKorisnika] = useState(null); // Dodavanje idKorisnika kao stanje

  const handleLogin = (id) => {
    setIdKorisnika(id); // Pohrana ID-a korisnika
  };

  const handleLogout = () => {
    setIdKorisnika(null); // Postavljanje ID-a korisnika na null prilikom odjave
  };

  return (
    <div className="App">
      <UserContext.Provider value={{ idKorisnika, handleLogin, handleLogout }}>
        <Router>
          <Routes>
            <Route path="/" element={<Pocetna />} />
            <Route path="/prijava" element={<Login handleLogin={handleLogin} />} /> {/* Proslijedite handleLogin kao prop */}
            <Route path="/registracija" element={<Registracija />} />
            <Route path="/rezervacijaTermina" element={<Rezervacija_termina />} /> 
            <Route path="/prikazRezervacija" element={<Prikaz_rezervacija />} />
            <Route path="/InformacijeRacuna" element={<Informacije_o_racunu />} /> {/* Proslijedite idKorisnika kao prop */}
            
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;

