import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from '../../App.js';
import './dizajn.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Uvozimo ikonice za Facebook i Instagram

export const Prikaz_rezervacija = () => {
  const [rezervacija, setRezervacija] = useState([]);
  const [nemaRezervacija, setNemaRezervacija] = useState(false); // Dodan state za provjeru prazne tablice
  const location = useLocation();
  const { idKorisnika } = useContext(UserContext); // Dohvati ID prijavljenog korisnika
  const facebookUrl = 'https://www.facebook.com/futsalarenarez';
  const instagramUrl = 'https://www.instagram.com/futsal_arena_rezervacije/';


  const dohvatiRezervacije = () => {
    axios
      .get("http://localhost:3001/prikazRezervacija", {
       params: { idKorisnika: idKorisnika },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRezervacija(response.data);
          setNemaRezervacija(response.data.length === 0); // Provjera prazne tablice
        } else {
          console.error(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const formatirajDatum = (datum) => {
    const opcije = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(datum).toLocaleDateString(undefined, opcije);
  };

  return (
    <div>
      <nav className="navigation-bar">
        <div className="nav-left">
        
                    <Link
                        to="/rezervacijaTermina"
                        className={location.pathname === '/rezervacijaTermina' ? 'active' : ''}
                    >
                        Rezerviraj termin
                    </Link>

                    { <Link
                        to="/prikazRezervacija"
                        className={location.pathname === '/prikazRezervacija' ? 'active' : ''}
                    >
                        Prikaz prošlih rezervacija
                    </Link> }
                    <Link
                        to="/informacijeRacuna"
                        className={location.pathname === '/informacijeRacuna' ? 'active' : ''}
                    >
                        Informacije o računu
                    </Link>
                </div>
                <div className="nav-right">
                    <Link to="/">Odjava</Link>
                </div>
      </nav>

      <div className="pregled-rezervacije-container">
        <h2 className="header">PREGLED PRIJAŠNJIH REZERVACIJA</h2>
        {nemaRezervacija ? (
          <p>Nemate nijednu unesenu rezervaciju.</p> // Alert ako nema putovanja
        ) : (
          <table className="rezervacije-table">
            <thead>
              <tr>
                <th>Datum rezervacije</th>
                <th>Vrijeme rezervacije</th>
                <th>Teren</th>
              </tr>
            </thead>
            <tbody>
              {rezervacija.map((rezervacija) => (
                <tr key={rezervacija.ID_rezervacije}>
                  <td>{formatirajDatum(rezervacija.Datum_rezervacije)}</td>
                  <td>{rezervacija.Vrijeme_rezervacije}</td>
                  <td>
                    {rezervacija.Teren = "1" ? "Unutarnji" : rezervacija.Teren = "2" ? "Vanjski" : ""}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="gumb" onClick={dohvatiRezervacije}>
          Dohvati prošle rezervacije
        </button>
      </div>

      <div className="social-links-container">
          
          <div className="social-links">
            
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} />
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} />
            </a>
          </div>
        </div>


    </div>
  );
};
