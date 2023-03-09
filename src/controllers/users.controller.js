import { pool } from "../database.js";
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
import axios from 'axios';


//import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {promisify} from 'util';
import qrcode from 'qrcode';
import path from 'path';

function hashPassword(password) {
  const hash = crypto.pbkdf2Sync(password, 'mySecret', 10000, 64, 'sha512').toString('hex');
  return {
    hash: hash
  };
}




const readFileAsync = promisify(fs.readFile);

pool.connect;

function generateToken() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
}



export const getUsersFromCRM = async () => {
  try {
    // Utilisez l'URL de l'API pour récupérer tous les clients du CRM
    const response = await axios.get('https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers');
    const customers = response.data;
    // Renvoyer la liste des clients
    return customers;
  } catch (error) {
    console.error(error);
  }
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
    console.log(result.rows);
    // Vérification existence utilisateur 
    if (result.rowCount !== 1) {
      return res.status(200).json({ message: "Utilisateur inconnu" });
    }

    const storedPassword = result.rows[0].password;
    const hashedPassword = hashPassword(password).hash;

    if (storedPassword !== hashedPassword) {
      return res.status(200).json({ message: "Mot de passe incorrect" });
    }

    if (result.rows[0].is_api_key_validated == false || result.rows[0].is_api_key_validated == null) {
      return res.status(200).json({ message: "Vous devez valider votre clé API avant de vous connecter." });
    }

    if (result.rows[0].token_session === null || '') {
      const token = generateToken();

      // Génération du token de session
      await pool.query(`UPDATE users SET token_session = $1 WHERE email = $2`, [token, email]);

      return res.status(200).json({ message: token });
    }

    return res.status(200).json({ message: "OK" });

  } catch(error){
    // En cas d'erreur, envoyer une réponse JSON avec un statut 500 Internal Server Error
    return res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur" });
  }
}





//on valide l'inscription grace a la clé d'api => concerne les revendeurs
export const ValidateApiKey = async (req, res) => {
  try {
    const { key, email } = req.query;

    const results = await pool.query(`SELECT is_api_key_validated, api_key FROM users WHERE email = $1 AND api_key = $2`, [email, key]);

    const user = results.rows.find((row) => row.api_key === key);

    if (user) {
      const isApiKeyValidated = user.is_api_key_validated;
      if (isApiKeyValidated === null || isApiKeyValidated === false) {
        await pool.query(`UPDATE users SET is_api_key_validated = true WHERE email = $1 AND api_key = $2`, [email, key]);
      }

      const token = generateToken();
      await pool.query(`UPDATE users SET token_session = $1 WHERE email = $2`, [token, email]);

      return res.status(200).json({ message: token });
    } else {
      return res.status(400).json({ message: "La clé API n'est pas valide pour cet e-mail." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur." });
  }
};




export const register = async (req, res) => {
  try {
    const { email, password, profile } = req.query;

    // Check if user already exists
    const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: "Un compte avec cet email existe déjà." });
    }

    let api_key;
    if (profile == "revendeur") {
      api_key = generateToken();
    } else {
      const result = await pool.query(`SELECT key FROM webshopkey`);
      api_key = result.rowCount > 0 ? result.rows[0].key : null;
    }

    const { hash: hashedPassword } = hashPassword(password);

    // Insert the user into the database
    await pool.query(`INSERT INTO users (email,password,api_key,is_api_key_validated) VALUES ($1,$2,$3,$4)`, [email, hashedPassword, api_key, 0]);

    // Generate the QR code buffer
    const qrCodeBuffer = await qrcode.toBuffer(`${api_key}`, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      quality: 0.92,
      scale: 4
    });

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'arabiantiger30@gmail.com',
        pass: 'asjxumvusloungry'
      }
    });


   // Create the e-mail message
    const mailOptions = {
      from: 'arabiantiger30@gmail.com',
      to: email,
      subject: 'QR Code',
      html: `
        <p>Bonjour,</p>
        <p>Nous vous remercions de votre inscription à PayTonKawa. Pour finaliser votre inscription, vous devez scanner le code QR ci-joint. Ce code contient une clé API qui vous sera utile pour utiliser les services de PayTonKawa.</p>
        <p>Le processus de numérisation est simple. Vous pouvez utiliser l'appareil photo de votre téléphone pour numériser le code QR. Une fois que vous l'avez numérisé, vous aurez accès à votre clé API.</p>
        <p>Si vous rencontrez des difficultés pour scanner le code, n'hésitez pas à contacter notre équipe d'assistance à l'adresse support@paytonkawa.com. Nous serons heureux de vous aider.</p>
        <p>Cordialement,<br>L'équipe PayTonKawa</p>
        `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeBuffer
        }
      ]
    };



    // Send the e-mail message
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Création du compte réussie." });
  } catch (error) {
    console.log(error);
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

export default getUsers;


