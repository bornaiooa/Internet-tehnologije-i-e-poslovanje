const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const db = mysql.createConnection({
    host: 'student.veleri.hr', // Adresa MySQL poslužitelja
    user: 'bcrnkovic', // Korisničko ime  baze podataka
    password: '11', // Lozinka  baze podataka
    database: 'bcrnkovic', // Naziv baze podataka
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error('Greška pri povezivanju na bazu podataka: ' + err.stack);
        return;
    }
    console.log('Povezan na bazu podataka.');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/registracija", (req, res) => {
    const name = req.body.name;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // Dodavanje novog korisnika u tablicu Korisnik
    db.query(
        "INSERT INTO Korisnik (Ime_korisnika, Prezime_korisnika, Email_korisnika, Korisnicko_ime, Lozinka) VALUES (?, ?, ?, ?, ?)",
        [name, lastname, email, username, password],
        (err, result) => {
            if (err) {
                console.error(err);
                res.send({ message: "Greška pri unosu korisnika!" });
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/prijava", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Provjera korisnika u tablici Korisnik
    db.query("SELECT * FROM Korisnik WHERE Korisnicko_ime = ? AND Lozinka = ?", [username, password],
        (err, result) => {
            if (err) {
                console.error(err);
                res.send({ message: "Greška pri provjeri korisnika!" });
            } else {
                if (result.length > 0) {
                    res.send(result);
                } else {
                    res.send({ message: "Krivo korisničko ime ili lozinka!" });
                }
            }
        }
    );
});

// Funkcija za dohvaćanje informacija o računu korisnika
app.get("/racun", (req, res) => {
    const idKorisnika = req.query.idKorisnika; // ID korisnika koji je prijavljen

    // Dohvaćanje informacija o korisniku iz tablice Korisnik
    db.query("SELECT * FROM Korisnik WHERE ID_korisnika = ?", [idKorisnika], (err, result) => {
        if (err) {
            console.error(err);
            res.send({ message: "Greška pri dohvaćanju informacija o računu!" });
        } else {
            if (result.length > 0) {
                res.send(result[0]);
            } else {
                res.send({ message: "Korisnik ne postoji!" });
            }
        }
    });
});

// Funkcija za ažuriranje informacija o računu korisnika
app.post("/azurirajRacun", (req, res) => {
    const idKorisnika = req.body.idKorisnika; // ID korisnika koji je prijavljen
    const { name, lastname, email, username, password } = req.body;

    // Ažuriranje informacija o korisniku u tablici Korisnik
    db.query(
        "UPDATE Korisnik SET Ime_korisnika = ?, Prezime_korisnika = ?, Email_korisnika = ?, Korisnicko_ime = ?, Lozinka = ? WHERE ID_korisnika = ?",
        [name, lastname, email, username, password, idKorisnika],
        (err, result) => {
            if (err) {
                console.error(err);
                res.send({ message: "Greška pri ažuriranju informacija o računu!" });
            } else {
                res.send(result);
            }
        }
    );
});


app.delete("/brisanjeRacuna", (req, res) => {
    const idKorisnika = req.body.idKorisnika; // ID korisnika koji je prijavljen

    db.query(
        "DELETE FROM Korisnik WHERE ID_korisnika = ?",
        [idKorisnika],
        (err, result) => {
            if (err) {
                console.error(err);
                res.send({ message: err });
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/rezervacijaTermina", (req, res) => {
    // const ime = req.body.ime;
    // const prezime = req.body.prezime;
    const kontakt = req.body.kontakt;
    const datumRezervacije = req.body.datumRezervacije;
    const vrijemeRezervacije = req.body.vrijemeRezervacije;
    const teren = req.body.teren;
    const idKorisnika = req.body.idKorisnika;
    

    // Dodavanje nove rezervacije u tablicu Rezervacije
    db.query(
        "INSERT INTO Rezervacije (Kontakt, Datum_rezervacije, Vrijeme_rezervacije, Teren, ID_korisnika) VALUES ( ?, ?, ?, ?, ?)",
        [kontakt, datumRezervacije, vrijemeRezervacije, teren, idKorisnika],
        (err, result) => {
            if (err) {
                console.error(err);
                res.send({ message: "Greška pri unosu rezervacije!" });
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/prikazRezervacija", (req, res) => {
    const idKorisnika = req.query.idKorisnika;

    db.query(
        "SELECT * FROM Rezervacije WHERE ID_korisnika = ?", [idKorisnika], (err, result) => {
            if (err) {
                console.error(err);
                res.send({ message: "Greška pri dohvaćanju rezervacije" });
            } else {
                res.send(result);
            }
        }
    );
});



app.listen(3001, () => {
    console.log("Pokretanje backenda");
});