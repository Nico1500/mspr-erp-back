import { pool } from "../database.js";
import qrcode from 'qrcode';
import fs from 'fs/promises';
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

pool.connect;

function generateToken() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
}

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return res.json(result.rows);
  } catch (error) {
    console.log(
      "🚀 ~ file: users.controller.js ~ line 9 ~ getUsers ~ error",
      error
    );
  }
};

export const login = async(req, res) => {
  try{

    const { email, password } = req.query;
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    //verification existence utilisateur 
    if (result.rowCount !== 1) {
      return res.status(200).json({ message: "Utilisateur inconnu" });
    }
    //verification du mot de passe
    bcrypt.compare(password, result.rows[0].password, function(err, result) {
      if (result == true) {
        // Mot de passe valide

       //on doit generer le token pour la session de l'utilisateur :
        pool.query(`UPDATE users set token = $1 WHERE email = $2`, [email,generateToken()]);


        return res.status(200).json({ message: "Connexion reussie." });
      } else {
        return res.status(404).json({ message: "mot de passe incorrect." });
      }
    });

    return res.status(404).json({ message: "Utilisateur non trouvé" });
  } catch(error){
    // En cas d'erreur, envoyer une réponse JSON avec un statut 500 Internal Server Error
    return res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur" });
  }
}


//todo : ajouter la verification de la premiere connexion avec le qr code
//attend un mail en request
export const IsFirstLogin = async (req, res) => {
  try {
    const {email} = req.query;

    const result = pool.query(`SELECT is_api_key_validated from users  WHERE email = $1`, [email]);
    return result[0].is_api_key_validated == false ? res.status(200).json({ message: "false" }) : res.status(200).json({ message: "true" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, profile } = req.query;

    let api_key;
    if (profile == "revendeur") {
      api_key = generateToken();
    } else {
      api_key = "fwà)zg$*!f4r(fz:,w'&f&éù1à8=";
    }

    // Options for the QR code
    const options = {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      quality: 0.92,
      scale: 4
    };

    // Generate the QR code
    const data = `api_key=${api_key}`;
    const filename = `qrcode-${generateToken()}.png`;
    qrcode.toFile(filename, data, options);

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'arabiantiger30@gmail.com',
        pass: 'Lahonda27!'
      }
    });

    // Read the QR code file
    const qrCodeBuffer = await readFileAsync(filename);

    // Create the e-mail message
    const mailOptions = {
      from: 'zaki-mazog@outlook.fr',
      to: email,
      subject: 'QR Code',
      text: 'Voici votre QR code.',
      attachments: [
        {
          filename: filename,
          content: qrCodeBuffer
        }
      ]
    };

    // Send the e-mail message
    await transporter.sendMail(mailOptions);

    // Insert the user into the database
    await pool.query(`INSERT INTO users (email,password,api_key) VALUES ($1,$2,$3)`, [email, password, api_key]);

    return res.status(200).json({ message: "Création du compte réussie." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la création du compte" });
  }
};

export const test = async (req, res) => {
    try {
      return res.json("cc");
    } catch (error) {
      console.log(
        "🚀 ~ file: test ",
        error
      );
    }
};


