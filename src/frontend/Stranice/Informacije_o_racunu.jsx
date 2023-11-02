import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from '../../App.js';
import { useNavigate } from 'react-router-dom';
import './dizajn.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Uvozimo ikonice za Facebook i Instagram

export const Informacije_o_racunu = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const { idKorisnika } = useContext(UserContext);

  const facebookUrl = 'https://www.facebook.com/futsalarenarez';
  const instagramUrl = 'https://www.instagram.com/futsal_arena_rezervacije/';

  useEffect(() => {
    if (idKorisnika) {
      axios
        .get("http://localhost:3001/racun", { params: { idKorisnika: idKorisnika } })
        .then((response) => {
          const { Ime_korisnika, Prezime_korisnika, Email_korisnika, Korisnicko_ime, Lozinka } = response.data;
          setEmail(Email_korisnika);
          setName(Ime_korisnika);
          setLastname(Prezime_korisnika);
          setUsername(Korisnicko_ime);
          setPassword(Lozinka);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [idKorisnika]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);

    axios.post("http://localhost:3001/azurirajRacun", {
      idKorisnika: idKorisnika,
      name: name,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
    })
      .then((response) => {
        console.log(response.data);
        alert("Vaše izmjene su uspješno spremljene!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value !== undefined ? value : name);
        break;
      case "lastname":
        setLastname(value !== undefined ? value : lastname);
        break;
      case "email":
        setEmail(value !== undefined ? value : email);
        break;
      case "username":
        setUsername(value !== undefined ? value : username);
        break;
      case "password":
        setPassword(value !== undefined ? value : password);
        break;
      default:
        break;
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Jeste li sigurni da želite izbrisati svoj račun?")) {
      // Prvo dohvatite rezervacije korisnika
      axios.get(`http://localhost:3001/prikazRezervacija?idKorisnika=${idKorisnika}`)
        .then((response) => {
          const rezervacije = response.data;
  
          // Zatim iterirajte kroz rezervacije i obrišite ih
          const promises = rezervacije.map((rezervacija) => {
            return axios.delete("http://localhost:3001/brisanjeRezervacije", {
              data: { idRezervacije: rezervacija.ID_rezervacije },
            });
          });
  
          // Nakon što su sve rezervacije obrisane, obrišite i račun korisnika
          Promise.all(promises)
            .then(() => {
              axios.delete("http://localhost:3001/brisanjeRacuna", {
                data: { idKorisnika: idKorisnika },
              })
                .then((response) => {
                  console.log(response.data);
                  alert("Vaš račun je uspješno obrisan!");
                  navigate('/');
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
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

      <div className="auth-form-container">
        <h2 className="header">PRIKAZ INFORMACIJA O RAČUNU</h2>
        <form className="register-form">
          <label htmlFor="name">Ime</label>
          <input
            name="name"
            value={name}
            readOnly={!isEditing}
            onChange={handleInputChange}
            id="name"
          />
          <label htmlFor="lastname">Prezime</label>
          <input
            name="lastname"
            value={lastname}
            readOnly={!isEditing}
            onChange={handleInputChange}
            id="lastname"
          />
          <label htmlFor="email">Email</label>
          <input
            name="email"
            value={email}
            readOnly={!isEditing}
            type="email"
            id="email"
            onChange={handleInputChange}
          />
          <label htmlFor="username">Korisničko ime</label>
          <input
            name="username"
            value={username}
            readOnly={!isEditing}
            type="text"
            id="username"
            onChange={handleInputChange}
          />
          <label htmlFor="password">Lozinka</label>
          <div className="password-container">
            <input
              name="password"
              value={password}
              readOnly={!isEditing}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              onChange={handleInputChange}

            />
            <div
              className={`eye-icon ${showPassword ? "visible" : ""}`}
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
        </form>
        {isEditing ? (
          <div>
            <button className="gumb" onClick={handleSaveClick}>
              Spremi informacije
            </button>
            <br />
            <button className="gumb" onClick={() => setIsEditing(false)}>
              Odustani od uređivanja
            </button>
          </div>
        ) : (
          <button className="gumb" onClick={handleEditClick}>
            Klikni za početak uređivanja informacija
          </button>
        )}

        <button className="gumb" onClick={handleDeleteAccount}>
          Izbriši račun
        </button>

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
    </div>
  );
};
