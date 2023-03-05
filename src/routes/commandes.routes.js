import { Router } from "express";
import { pool } from "../database.js";
import { test,getCustomerOrders} from "../controllers/commandes.controller.js";
const router = Router();


router.get("/customers/:customerId/:apiKey", async (req, res) => {
  const { apiKey, customerId } = req.query;

  try {
     // Vérification de l'accès via la clé API
     const key = await pool.query("SELECT api_key FROM users WHERE api_key = '" + apiKey + "' UNION SELECT key FROM webshopkey WHERE key = '" + apiKey + "'");
     if (key.rowCount === 0) {
      return res.status(401).json({ message: "Accès refusé. Clé API invalide." });
    }

    // Utiliser la fonction getOrders pour récupérer la liste des commandes du client
    const orders = await getCustomerOrders(customerId);
    // Renvoyer la liste des commandes
    res.status(200).send(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des commandes.");
  }
});





export default router;