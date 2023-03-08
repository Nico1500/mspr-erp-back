import { Router } from "express";
import { getUsers, test,login,register,getUsersFromCRM,ValidateApiKey } from "../controllers/users.controller.js";
const router = Router();

//router.post("/", createUser);
router.get("/all", getUsers);
router.get("/", test);
router.get("/login", login);
router.post("/register", register);
router.post("/ValidateApiKey", ValidateApiKey);

// Route pour récupérer la liste de tous les clients du CRM²
router.get("/usersFromCrm", async (req, res) => {
    try {
      // Utiliser la fonction getAllCustomers pour récupérer la liste de tous les clients du CRM
      const customers = await getUsersFromCRM();
      // Renvoyer la liste des clients
      res.status(200).send(customers);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des clients");
    }
});



export default router;