import { Router } from "express";
import { test,getOrderProducts,getAllProducts,getProductById } from "../controllers/produits.controller.js";
import { pool } from "../database.js";
const router = Router();

// Route pour récupérer la liste des produits d'une commande spécifique
router.get("/customers/:customerId/orders/:orderId/:apiKey", async (req, res) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;
    const apiKey = req.params.apiKey;

    try {
       // Vérification de l'accès via la clé API
       const key = await pool.query("SELECT api_key FROM users WHERE api_key = '" + apiKey + "' UNION SELECT key FROM webshopkey WHERE key = '" + apiKey + "'");
      if (key.rowCount === 0) {
        return res.status(401).json({ message: "Accès refusé. Clé API invalide." });
      }
      // Utiliser la fonction getOrderProducts pour récupérer la liste des produits pour la commande spécifique
      const products = await getOrderProducts(customerId, orderId);
      // Renvoyer la liste des produits
      res.status(200).send(products);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des produits");
    }
});


// Route pour récupérer la liste de tous les produits de l'ERP
router.get("/:apiKey", async (req, res) => {
    try {
      
      // Vérification de l'accès via la clé API
      const key = await pool.query("SELECT api_key FROM users WHERE api_key = '" + apiKey + "' UNION SELECT key FROM webshopkey WHERE key = '" + apiKey + "'");
      if (key.rowCount === 0) {
        return res.status(401).json({ message: "Accès refusé. Clé API invalide." });
      }

      // Utiliser la fonction getAllProducts pour récupérer la liste de tous les produits de l'ERP
      const products = await getAllProducts();
      // Renvoyer la liste des produits
      res.status(200).send(products);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des produits");
    }
});


// Route pour récupérer les détails d'un produit spécifique
router.get("/:productId/:apiKey", async (req, res) => {
    const productId = req.params.productId;
    const apiKey = req.params.apiKey;
    try {
       // Vérification de l'accès via la clé API
       const key = await pool.query("SELECT api_key FROM users WHERE api_key = '" + apiKey + "' UNION SELECT key FROM webshopkey WHERE key = '" + apiKey + "'");
      if (key.rowCount === 0) {
        return res.status(401).json({ message: "Accès refusé. Clé API invalide." });
      }
     

      // Utiliser la fonction getProductById pour récupérer les détails d'un produit spécifique
      const product = await getProductById(productId);
      // Renvoyer les détails du produit spécifique
      res.status(200).send(product);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des détails du produit");
    }
});

export default router;