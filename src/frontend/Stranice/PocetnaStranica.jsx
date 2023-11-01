import React from 'react';
import { useNavigate } from 'react-router-dom';
import "C:/Users/User/rezervacija_termina/src/frontend/Stranice/dizajn.css";


export const Pocetna = (props) => {
    const navigate = useNavigate();

    const handlePrijava = () => {
        navigate('/prijava');
    }

    const handleRegistracija = () => {
        navigate('/registracija');
    }

    return (
        <div>
            <h1>FUTSAL ARENA</h1>
            <h3>Prijavi se i rezerviraj svoj termin!</h3>

            <button className="gumb" onClick={handlePrijava}>PRIJAVA</button>
            <br />
            <button className="gumb" onClick={handleRegistracija}>REGISTRACIJA</button>
        </div>
    );
}