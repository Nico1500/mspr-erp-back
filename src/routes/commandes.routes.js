import { Router } from "express";
import { test,getCustomerOrders} from "../controllers/commandes.controller";
const router = Router();
const axios = require('axios');


router.get("/customers/:customerId", async (req, res) => {
    const customerId = req.params.customerId;
    try {
      // Utiliser la fonction getOrders pour récupérer la liste des commandes du client
      const orders = await getCustomerOrders(customerId);
      // Renvoyer la liste des commandes
      res.status(200).send(orders);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des commandes");
    }
});





export default router;