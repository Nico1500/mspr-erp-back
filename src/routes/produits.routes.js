import { Router } from "express";
import { test,getOrderProducts,getAllProducts,getProductById } from "../controllers/produits.controller";
const router = Router();
const axios = require('axios');

//router.post("/", createUser);
// Route pour récupérer la liste des produits d'une commande spécifique
router.get("/customers/:customerId/orders/:orderId", async (req, res) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;
    try {
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
router.get("/", async (req, res) => {
    try {
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
router.get("/:productId", async (req, res) => {
    const productId = req.params.productId;
    try {
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