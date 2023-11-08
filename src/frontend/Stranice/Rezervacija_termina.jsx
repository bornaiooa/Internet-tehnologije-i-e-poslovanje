import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Axios from 'axios';
import './dizajn.css';
import { UserContext } from "../../App";
import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Uvozimo ikonice za Facebook i Instagram
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // stilovi za kalendar

export const Rezervacija_termina = () => {
    //  const [ime, setIme] = useState('');
    //  const [prezime, setPrezime] = useState('');
    const [kontakt, setKontakt] = useState('');
    const [datumRezervacije, setDatumRezervacije] = useState('');
    const [vrijemeRezervacije, setVrijemeRezervacije] = useState('');
    const [teren, setTeren] = useState('');
    const location = useLocation();
    const { idKorisnika } = useContext(UserContext); // Dohvati idKorisnika iz konteksta

    const facebookUrl = 'https://www.facebook.com/futsalarenarez';
    const instagramUrl = 'https://www.instagram.com/futsal_arena_rezervacije/';
    const [errorMessage, setErrorMessage] = useState('');

    const [zauzetiTermini, setZauzetiTermini] = useState([]);

    useEffect(() => {
        // Dohvati zauzete termine
        Axios.get('http://localhost:3001/dohvatiZauzeteTermine')
            .then(response => {
                setZauzetiTermini(response.data.map(termin => new Date(termin))); // Pretpostavljamo da server vraća datume
            })
            .catch(error => {
                console.error('Došlo je do greške pri dohvaćanju zauzetih termina', error);
            });
    }, []);

    // Funkcija koja će se pozvati kada se promijeni datum u kalendaru
    const onDateChange = (value, event) => {
        const dateWithoutTimezone = new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
        setDatumRezervacije(dateWithoutTimezone.toISOString().split('T')[0]);
        alert('Upišite ostale podatke!');
    };


    // Klasa za stiliziranje zauzetih datuma
    const tileClassName = ({ date, view }) => {
        // Dodaj stil samo za prikaz mjeseca
        if (view === 'month') {
            // Provjeri je li datum u nizu zauzetih termina
            if (zauzetiTermini.some(termin => termin.toISOString().split('T')[0] === date.toISOString().split('T')[0])) {
                return 'zauzet-termin';
            }
        }
    };


    const unesiTermin = (e) => {
        e.preventDefault();

        // Provjeri da li su sva polja popunjena
        if (datumRezervacije && vrijemeRezervacije && teren && idKorisnika) {
            // Najprije provjeri postoji li rezervacija za odabrani datum
            Axios.get('http://localhost:3001/provjeriRezervaciju', {
                params: {
                    datumRezervacije: datumRezervacije
                }
            })
                .then((response) => {
                    // Ako postoji rezervacija, odgovor će to reći
                    if (response.data.isReserved) {
                        alert('Odabrani termin je već zauzet!');
                    } else {
                        // Ako nema rezervacije, nastavi s unosom
                        Axios.post('http://localhost:3001/rezervacijaTermina', {
                            kontakt: kontakt,
                            datumRezervacije: datumRezervacije,
                            vrijemeRezervacije: vrijemeRezervacije,
                            teren: teren,
                            idKorisnika: idKorisnika,
                        })
                            .then((response) => {
                                alert('Vaša rezervacija je uspješno unesena.');
                                setKontakt('');
                                setDatumRezervacije('');
                                setVrijemeRezervacije('');
                                setTeren('');
                                dohvatiZauzeteTermine();
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setErrorMessage('Sva polja moraju biti popunjena!');
        }
    };

    const dohvatiZauzeteTermine = () => {
        Axios.get('http://localhost:3001/dohvatiZauzeteTermine')
            .then(response => {
                setZauzetiTermini(response.data.map(termin => new Date(termin)));
            })
            .catch(error => {
                console.error('Došlo je do greške pri dohvaćanju zauzetih termina', error);
            });
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

                    <Link
                        to="/prikazRezervacija"
                        className={location.pathname === '/izracunPotrosnje' ? 'active' : ''}
                    >
                        Prikaz prošlih rezervacija
                    </Link>

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
            <div className="rezervacije-form-container">
                <h2 className="header">Rezerviraj svoj termin!</h2>


                <Calendar className="kalendar"
                    onChange={onDateChange}
                    value={datumRezervacije ? new Date(datumRezervacije) : new Date()}
                    tileClassName={tileClassName}
                /><br />

                <form className="rezervacije-form" onSubmit={unesiTermin}>


                    <label htmlFor="kontakt">Unesite kontakt podatke (mail ili mobitel)</label>
                    <input
                        value={kontakt}
                        onChange={(e) => setKontakt(e.target.value)}
                        type="kontakt"
                        id="kontakt"
                        name="kontakt"
                    />

                    <label htmlFor="datumRezervacije">Odaberite datum rezervacije</label>
                    <input
                        value={datumRezervacije}
                        onChange={(e) => setDatumRezervacije(e.target.value)}
                        type="date"
                        id="datumRezervacije"
                        name="datumRezervacije"
                    />

                    <label htmlFor="vrijeme rezervacije">Unesite vrijeme rezervacije</label>
                    <input
                        value={vrijemeRezervacije}
                        name="vrijemeRezervacije"
                        onChange={(e) => setVrijemeRezervacije(e.target.value)}
                        id="vrijemeRezervacije"
                    />

                    <label htmlFor="teren">Odaberite vrstu terena</label>
                    <select
                        value={teren}
                        onChange={(e) => setTeren(e.target.value)}
                        id="teren"
                        name="teren"
                    >
                        <option value="">Odaberite teren</option>
                        <option value="1">Unutarnji</option>
                        <option value="2">Vanjski</option>
                    </select>

                    {errorMessage && <h1 style={{ color: 'red', fontSize: '15px', textAlign: 'center', marginTop: '20px' }}>{errorMessage}</h1>}

                    <button className="gumb" type="submit">
                        Rezerviraj
                    </button>
                </form>
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


export default Rezervacija_termina;
